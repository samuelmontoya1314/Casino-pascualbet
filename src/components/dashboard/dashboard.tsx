'use client';
import { handleLogout } from '@/actions/auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Shield, User as UserIcon } from 'lucide-react';
import ThreatDetectionForm from './threat-detection-form';
import type { User } from '@/lib/users';

export default function Dashboard({ user }: { user: User }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary"/>
                <h1 className="text-xl font-bold font-headline">SecureAccess Dashboard</h1>
            </div>
            <div className="ml-auto flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role} Role</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="overflow-hidden rounded-full h-10 w-10">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary text-primary-foreground">
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
        <main className="flex-1 p-4 sm:px-6">
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-6">
                {user.role === 'admin' && (
                    <div className="bg-primary/10 border-l-4 border-primary text-primary p-4 rounded-md shadow-sm">
                        <h3 className="font-bold text-primary">Admin Access Enabled</h3>
                        <p className="text-sm text-primary/80">You are logged in as an administrator and have elevated privileges.</p>
                    </div>
                )}
                <ThreatDetectionForm userRole={user.role} />
            </div>
        </main>
    </div>
  );
}
