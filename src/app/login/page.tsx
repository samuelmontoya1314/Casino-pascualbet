import { LoginForm } from '@/components/auth/login-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Diamond } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Diamond className="h-8 w-8" />
          </div>
          <CardTitle className="text-4xl font-bold font-headline text-primary">Casino Royale</CardTitle>
          <CardDescription>Enter your credentials to join the high rollers</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
       <p className="text-center text-sm text-muted-foreground mt-4">
        Hint: Use `admin` / `password_admin_hashed` or `user123` / `password_user_hashed`.
      </p>
    </main>
  );
}
