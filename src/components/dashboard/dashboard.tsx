
'use client';
import { handleLogout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User as UserIcon, Wallet, Coins, HelpCircle, ShieldCheck } from 'lucide-react';
import type { User } from '@/lib/users';
import { useState, useTransition, useMemo } from 'react';
import { PascualBetIcon } from '@/components/pascualbet-icon';
import Link from 'next/link';
import { updateBalance } from '@/actions/user';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import { Skeleton } from '../ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { EditProfileForm } from './edit-profile-form';
import { WalletDialog } from './wallet-dialog';
import { Dialog } from '@radix-ui/react-dialog';


const LoadingComponent = () => (
    <div className="p-8 flex items-center justify-center">
        <Skeleton className="w-full h-96" />
    </div>
);

const SlotsGame = dynamic(() => import('@/components/games/slots'), { loading: () => <LoadingComponent /> });
const BlackjackGame = dynamic(() => import('@/components/games/blackjack'), { loading: () => <LoadingComponent /> });
const RouletteGame = dynamic(() => import('@/components/games/roulette'), { loading: () => <LoadingComponent /> });
const PokerGame = dynamic(() => import('@/components/games/poker'), { loading: () => <LoadingComponent /> });
const PlinkoGame = dynamic(() => import('@/components/games/plinko'), { loading: () => <LoadingComponent /> });
const AdminTab = dynamic(() => import('@/components/dashboard/admin/admin-tab'), { loading: () => <LoadingComponent /> });


export default function Dashboard({ user }: { user: User }) {
  const [sessionUser, setSessionUser] = useState(user);
  const [balance, setBalance] = useState(user.balance);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('slots');
  const [profileOpen, setProfileOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleBalanceChange = (amount: number, type: 'deposit' | 'withdraw' | 'bet' | 'win' | 'refund') => {
    startTransition(async () => {
        const currentBalance = balance;
        setBalance(prev => prev + amount); // Optimistic update
        const result = await updateBalance(amount);
        if (result && result.error) {
            setBalance(currentBalance); // Revert on error
            toast({
                title: 'Error de Sincronización',
                description: result.error,
                variant: "destructive"
            });
        } else if (result && result.success) {
            // Update with the definitive balance from server
            setBalance(result.newBalance!);
            if (type === 'deposit') {
                 toast({
                    title: "Depósito Exitoso",
                    description: `Has añadido ${formatCurrency(amount)} a tu cuenta.`,
                });
            } else if (type === 'withdraw') {
                 toast({
                    title: "Retiro Exitoso",
                    description: `Has retirado ${formatCurrency(Math.abs(amount))} de tu cuenta.`,
                });
            }
        }
    });
  }

  const handleProfileUpdate = (updatedUser: User) => {
    setSessionUser(updatedUser);
    toast({
        title: "Perfil Actualizado",
        description: "Tus datos se han guardado correctamente.",
    });
    setProfileOpen(false);
  }
  
  const ActiveGame = useMemo(() => {
    const gameProps = { balance, onBalanceChange: handleBalanceChange };
    switch (activeTab) {
      case 'slots':
        return <SlotsGame {...gameProps} />;
      case 'blackjack':
        return <BlackjackGame {...gameProps} />;
      case 'roulette':
        return <RouletteGame {...gameProps} />;
      case 'poker':
        return <PokerGame {...gameProps} />;
      case 'plinko':
        return <PlinkoGame {...gameProps} />;
      case 'admin':
        return sessionUser.role === 'admin' ? <AdminTab /> : null;
      default:
        return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sessionUser.role]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <TooltipProvider>
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/95 px-4 sm:px-6">
            <div className="flex items-center gap-3">
                <PascualBetIcon className="w-12 h-12" />
                 <p className="font-bold text-xl tracking-tighter uppercase">PascualBet</p>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-none bg-secondary px-4 py-2 border">
                    <Wallet className="h-6 w-6 text-primary"/>
                    <span className="text-xl font-bold text-foreground">{formatCurrency(balance)}</span>
                </div>
                <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
                  <Tooltip>
                      <TooltipTrigger asChild>
                           <DialogTrigger asChild>
                              <Button size="icon" variant="outline" className="bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" disabled={isPending}>
                                  <Coins className="h-5 w-5" />
                              </Button>
                           </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>Billetera</p>
                      </TooltipContent>
                  </Tooltip>
                  <WalletDialog 
                    balance={balance} 
                    onBalanceChange={handleBalanceChange}
                    onClose={() => setWalletOpen(false)}
                  />
                </Dialog>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{sessionUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">Rol: {sessionUser.role}</p>
                </div>
                <AlertDialog>
                  <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="overflow-hidden rounded-none h-12 w-12 border">
                              <Avatar className="h-12 w-12 rounded-none">
                                  <AvatarFallback className="bg-primary/20 text-primary font-bold rounded-none">
                                      {sessionUser.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                              </Avatar>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                                <UserIcon className="mr-2 h-4 w-4"/>
                                Perfil
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <Link href="/manual">
                             <DropdownMenuItem>
                                  <HelpCircle className="mr-2 h-4 w-4"/>
                                  Ayuda
                             </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar Sesión</span>
                              </DropdownMenuItem>
                          </AlertDialogTrigger>
                      </DropdownMenuContent>
                  </DropdownMenu>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Perfil de Usuario</DialogTitle>
                            <DialogDescription>
                                Esta es la información de tu cuenta.
                            </DialogDescription>
                        </DialogHeader>
                        <EditProfileForm user={sessionUser} onUpdate={handleProfileUpdate} onCancel={() => setProfileOpen(false)} />
                    </DialogContent>
                  </Dialog>
                  <AlertDialogContent>
                    <AlertDialogHeader className="text-center">
                      <AlertDialogTitle>¿Seguro que quieres abandonar la partida?</AlertDialogTitle>
                      <AlertDialogDescription>
                         ¡Estás a punto de encontrar los diamantes! Un último giro podría ser el ganador.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-center my-4">
                        <Image
                            src="https://i.imgflip.com/392xtk.jpg"
                            alt="A punto de encontrar diamantes"
                            width={300}
                            height={225}
                            data-ai-hint="miner quitting diamonds"
                            className="rounded-md w-full object-contain"
                        />
                    </div>
                    <AlertDialogFooter>
                      <form action={handleLogout} className="w-full flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto mt-0">No, seguiré jugando</AlertDialogCancel>
                        <Button type="submit" className="w-full sm:w-auto">
                           Sí, abandonar
                        </Button>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </header>
        </TooltipProvider>
        <main className="flex-1 p-4 sm:px-6 flex flex-col items-center justify-start">
             <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl mt-6">
                <TabsList className={`grid w-full ${sessionUser.role === 'admin' ? 'grid-cols-6' : 'grid-cols-5'}`}>
                    <TabsTrigger value="slots">Tragamonedas</TabsTrigger>
                    <TabsTrigger value="blackjack">Blackjack</TabsTrigger>
                    <TabsTrigger value="roulette">Ruleta</TabsTrigger>
                    <TabsTrigger value="poker">Póker</TabsTrigger>
                    <TabsTrigger value="plinko">Plinko</TabsTrigger>
                    {sessionUser.role === 'admin' && (
                        <TabsTrigger value="admin" className="flex items-center gap-2">
                           <ShieldCheck className="h-4 w-4" /> Admin
                        </TabsTrigger>
                    )}
                </TabsList>
                <TabsContent value={activeTab} forceMount>
                   <div className="min-h-[600px]">{ActiveGame}</div>
                </TabsContent>
            </Tabs>
        </main>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/manual">
                <Button size="icon" variant="outline" className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-primary/20 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground animate-pulse">
                    <HelpCircle className="h-6 w-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left">
                <p>Manual de Usuario</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    </div>
  );
}

    

    

    

    