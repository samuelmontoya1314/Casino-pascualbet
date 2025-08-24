'use client';
import { handleLogout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, Gamepad2, Wallet } from 'lucide-react';
import type { User } from '@/lib/users';
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
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/95 px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Gamepad2 className="h-8 w-8 text-primary"/>
                <h1 className="text-3xl font-bold text-primary">Casino Online</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <div className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2">
                    <Wallet className="h-6 w-6 text-primary"/>
                    <span className="text-xl font-bold">{formatCurrency(balance)}</span>
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
        <main className="flex-1 p-4 sm:px-6 flex flex-col items-center justify-center">
           <div className="text-center">
             <h2 className="text-4xl font-bold">Welcome to the Casino!</h2>
             <p className="text-muted-foreground mt-2">Select a game to start playing.</p>
           </div>
        </main>
    </div>
  );
}
