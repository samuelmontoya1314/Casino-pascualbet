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
import { LogOut, User as UserIcon, Wallet, Coins } from 'lucide-react';
import type { User } from '@/lib/users';
import { useState } from 'react';
import SlotsGame from '@/components/games/slots';
import BlackjackGame from '@/components/games/blackjack';
import RouletteGame from '@/components/games/roulette';
import PokerGame from '@/components/games/poker';
import { PascualBetIcon } from '@/components/pascualbet-icon';


export default function Dashboard({ user }: { user: User }) {
  const [balance, setBalance] = useState(user.balance);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBalanceChange = (amount: number) => {
    setBalance(prev => prev + amount);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <TooltipProvider>
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/50 bg-background/95 px-4 sm:px-6">
            <div className="flex items-center gap-3">
                <PascualBetIcon className="w-12 h-auto" />
                 <p className="font-bold text-xl tracking-tighter">PascualBet</p>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2">
                    <Wallet className="h-6 w-6 text-primary"/>
                    <span className="text-xl font-bold text-foreground">{formatCurrency(balance)}</span>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={() => handleBalanceChange(100)} size="icon" variant="outline" className="bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                            <Coins className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Agregar 100 COP</p>
                    </TooltipContent>
                </Tooltip>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">Rol: {user.role}</p>
                </div>
                <Dialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="overflow-hidden rounded-full h-12 w-12">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary/20 text-primary font-bold">
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
                        <DropdownMenuSeparator />
                        <form action={handleLogout}>
                          <DropdownMenuItem asChild>
                              <button type="submit" className="w-full text-left flex items-center">
                                  <LogOut className="mr-2 h-4 w-4" />
                                  Cerrar Sesión
                              </button>
                          </DropdownMenuItem>
                        </form>
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
                        <span className="text-right font-semibold">Nombre:</span>
                        <span className="col-span-3">{user.name}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right font-semibold">ID de Usuario:</span>
                        <span className="col-span-3">{user.id}</span>
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
                            <Button onClick={() => handleBalanceChange(100)} size="sm" variant="outline" className="bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                                <Coins className="mr-2 h-4 w-4" /> Agregar 100 COP
                            </Button>
                          </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
            </div>
        </header>
        </TooltipProvider>
        <main className="flex-1 p-4 sm:px-6 flex flex-col items-center justify-start">
            <Tabs defaultValue="slots" className="w-full max-w-7xl mt-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="slots">Tragamonedas</TabsTrigger>
                    <TabsTrigger value="blackjack">Blackjack</TabsTrigger>
                    <TabsTrigger value="roulette">Ruleta</TabsTrigger>
                    <TabsTrigger value="poker">Póker</TabsTrigger>
                </TabsList>
                <TabsContent value="slots">
                    <SlotsGame balance={balance} onBalanceChange={handleBalanceChange} />
                </TabsContent>
                <TabsContent value="blackjack">
                    <BlackjackGame balance={balance} onBalanceChange={handleBalanceChange} />
                </TabsContent>
                <TabsContent value="roulette">
                    <RouletteGame balance={balance} onBalanceChange={handleBalanceChange} />
                </TabsContent>
                <TabsContent value="poker">
                    <PokerGame balance={balance} onBalanceChange={handleBalanceChange} />
                </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}
