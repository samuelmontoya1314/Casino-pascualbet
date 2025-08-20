'use client';
import { handleLogout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, Diamond } from 'lucide-react';
import type { User } from '@/lib/users';
import SlotMachine from '@/components/casino/slot-machine';

export default function Dashboard({ user }: { user: User }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-white/10 bg-transparent px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Diamond className="h-8 w-8 text-primary"/>
                <h1 className="text-3xl font-bold font-headline text-primary">Casino Royale</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
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
        <main className="flex-1 p-4 sm:px-6 flex items-center justify-center">
            <SlotMachine />
        </main>
    </div>
  );
}
