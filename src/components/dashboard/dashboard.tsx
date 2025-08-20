'use client';
import { handleLogout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User as UserIcon, Diamond, Wallet } from 'lucide-react';
import type { User } from '@/lib/users';
import SlotMachine from '@/components/casino/slot-machine';
import Blackjack from '@/components/casino/blackjack';
import Roulette from '@/components/casino/roulette';
import { useState } from 'react';

export default function Dashboard({ user }: { user: User }) {
  const [balance, setBalance] = useState(user.balance);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-white/10 bg-transparent px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Diamond className="h-8 w-8 text-primary"/>
                <h1 className="text-3xl font-bold font-headline text-primary">Casino Royale</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-full bg-secondary/30 px-4 py-2 border border-primary/20">
                    <Wallet className="h-6 w-6 text-primary"/>
                    <span className="text-xl font-bold text-white">{formatCurrency(balance)}</span>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role} Role</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="overflow-hidden rounded-full h-12 w-12 border-2 border-primary">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
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
        <main className="flex-1 p-4 sm:px-6 flex flex-col items-center justify-center">
            <Tabs defaultValue="slots" className="w-full max-w-4xl">
              <TabsList className="grid w-full grid-cols-3 bg-secondary/20 mb-4 h-14">
                <TabsTrigger value="slots" className="text-lg h-10">Slot Machine</TabsTrigger>
                <TabsTrigger value="blackjack" className="text-lg h-10">Blackjack</TabsTrigger>
                <TabsTrigger value="roulette" className="text-lg h-10">Roulette</TabsTrigger>
              </TabsList>
              <TabsContent value="slots" className="flex justify-center">
                <SlotMachine balance={balance} setBalance={setBalance} />
              </TabsContent>
              <TabsContent value="blackjack" className="flex justify-center">
                 <Blackjack balance={balance} setBalance={setBalance} />
              </TabsContent>
              <TabsContent value="roulette" className="flex justify-center">
                 <Roulette balance={balance} setBalance={setBalance} />
              </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}
