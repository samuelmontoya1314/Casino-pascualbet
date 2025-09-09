
'use client';
import { handleLogout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { LogOut, User as UserIcon, Wallet, Coins, HelpCircle } from 'lucide-react';
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


export default function Dashboard({ user }: { user: User }) {
  const [balance, setBalance] = useState(user.balance);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('slots');
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBalanceChange = (amount: number) => {
    startTransition(async () => {
        const currentBalance = balance;
        setBalance(prev => prev + amount); // Optimistic update
        const result = await updateBalance(amount);
        if (result && result.error) {
            setBalance(currentBalance); // Revert on error
            toast({
                title: "Error de Sincronización",
                description: result.error,
                variant: "destructive"
            });
        } else if (result && result.success) {
            // Update with the definitive balance from server
            setBalance(result.newBalance!);
        }
    });
  }
  
  const ActiveGame = useMemo(() => {
    switch (activeTab) {
      case 'slots':
        return <SlotsGame balance={balance} onBalanceChange={handleBalanceChange} />;
      case 'blackjack':
        return <BlackjackGame balance={balance} onBalanceChange={handleBalanceChange} />;
      case 'roulette':
        return <RouletteGame balance={balance} onBalanceChange={handleBalanceChange} />;
      case 'poker':
        return <PokerGame balance={balance} onBalanceChange={handleBalanceChange} />;
      case 'plinko':
        return <PlinkoGame balance={balance} onBalanceChange={handleBalanceChange} />;
      default:
        return null;
    }
  }, [activeTab, balance]);

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
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={() => handleBalanceChange(100)} size="icon" variant="outline" className="bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" disabled={isPending}>
                            <Coins className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Agregar 100</p>
                    </TooltipContent>
                </Tooltip>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">Rol: {user.role}</p>
                </div>
                <AlertDialog>
                  <Dialog>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="overflow-hidden rounded-none h-12 w-12 border">
                              <Avatar className="h-12 w-12 rounded-none">
                                  <AvatarFallback className="bg-primary/20 text-primary font-bold rounded-none">
                                      {user.name.split(' ').map(n => n[0]).join('')}
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
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="text-right font-semibold">Nombre Completo:</span>
                          <span className="col-span-3">{user.name}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="text-right font-semibold">ID de Usuario:</span>
                          <span className="col-span-3">{user.id}</span>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                          <span className="text-right font-semibold">Nacionalidad:</span>
                          <span className="col-span-3">{user.nationality}</span>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                          <span className="text-right font-semibold">Fecha de Nacimiento:</span>
                          <span className="col-span-3">{user.birthDate}</span>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                          <span className="text-right font-semibold">No. Documento:</span>
                          <span className="col-span-3">{user.documentNumber}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="text-right font-semibold">Rol:</span>
                          <span className="col-span-3 capitalize">{user.role}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="text-right font-semibold">Saldo:</span>
                          <span className="col-span-3">{formatCurrency(balance)}</span>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right font-semibold">Fondos:</span>
                            <div className="col-span-3">
                              <Button onClick={() => handleBalanceChange(100)} size="sm" variant="outline" className="bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground" disabled={isPending}>
                                  <Coins className="mr-2 h-4 w-4" /> Agregar 100
                              </Button>
                            </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <AlertDialogContent>
                    <AlertDialogHeader className="text-center">
                      <AlertDialogTitle className="text-center">¿Seguro que quieres abandonar la partida?</AlertDialogTitle>
                      <AlertDialogDescription className="text-center">
                         ¡Estás a punto de encontrar los diamantes! Un último giro podría ser el ganador.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-center items-center my-4">
                        <Image
                            src="https://i.imgflip.com/392xtk.jpg"
                            alt="A punto de encontrar diamantes"
                            width={300}
                            height={225}
                            data-ai-hint="miner quitting diamonds"
                            className="rounded-md"
                        />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, seguiré jugando</AlertDialogCancel>
                      <form action={handleLogout} className="w-full sm:w-auto">
                        <AlertDialogAction type="submit" className="w-full">
                           Sí, abandonar
                        </AlertDialogAction>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </header>
        </TooltipProvider>
        <main className="flex-1 p-4 sm:px-6 flex flex-col items-center justify-start">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full max-w-7xl mt-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="slots">Tragamonedas</TabsTrigger>
                    <TabsTrigger value="blackjack">Blackjack</TabsTrigger>
                    <TabsTrigger value="roulette">Ruleta</TabsTrigger>
                    <TabsTrigger value="poker">Póker</TabsTrigger>
                    <TabsTrigger value="plinko">Plinko</TabsTrigger>
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
