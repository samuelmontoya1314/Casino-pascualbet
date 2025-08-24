'use client';
import { handleLogout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User as UserIcon, Wallet, Star } from 'lucide-react';
import type { User } from '@/lib/users';
import { useState } from 'react';
import SlotsGame from '@/components/games/slots';
import BlackjackGame from '@/components/games/blackjack';
import RouletteGame from '@/components/games/roulette';
import PokerGame from '@/components/games/poker';

const LuigiLogo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.59L7.41 14H10v-4H7v-2h5v6h1.59L17 17.59 15.59 19 12 15.41 8.41 19 7 17.59l3-3 1 1v2z" fill="hsl(var(--primary-foreground))"/>
      <path d="M11 15.59V17l-1-1-3 3L8.41 19 12 15.41 15.59 19 17 17.59 13.41 14H12v-4H9v-2h5v6h1.59L19 14.59V12h-2v1.59l-3.59-3.59L12 11.41V6h-2v5.59L6.41 8 5 9.41l3 3V10H6v4h1.41L11 17.59z" fill="hsl(var(--primary))"/>
    </svg>
)

export default function Dashboard({ user }: { user: User }) {
  const [balance, setBalance] = useState(user.balance);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBalanceChange = (amount: number) => {
    setBalance(prev => prev + amount);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/50 bg-background/95 px-4 sm:px-6">
            <div className="flex items-center gap-3">
                <LuigiLogo />
                <h1 className="text-3xl font-bold text-primary" style={{fontFamily: "'Poppins', sans-serif"}}>Luigi's Casino</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2">
                    <Wallet className="h-6 w-6 text-accent"/>
                    <span className="text-xl font-bold text-white">{formatCurrency(balance)}</span>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role} Role</p>
                </div>
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
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                            <UserIcon className="mr-2 h-4 w-4"/>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <form action={handleLogout} className="w-full">
                          <DropdownMenuItem asChild>
                              <button type="submit" className="w-full text-left">
                                  <LogOut className="mr-2 h-4 w-4" />
                                  Logout
                              </button>
                          </DropdownMenuItem>
                        </form>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 flex flex-col items-center justify-start">
            <Tabs defaultValue="slots" className="w-full max-w-7xl mt-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="slots">Slots</TabsTrigger>
                    <TabsTrigger value="blackjack">Blackjack</TabsTrigger>
                    <TabsTrigger value="roulette">Roulette</TabsTrigger>
                    <TabsTrigger value="poker">Poker</TabsTrigger>
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
