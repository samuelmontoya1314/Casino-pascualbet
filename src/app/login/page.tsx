import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PascualBetLogo } from '@/components/pascualbet-logo';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-8">
            <PascualBetLogo className="w-48 h-auto mb-4" />
            <h1 className="text-2xl font-bold">Crear una cuenta</h1>
            <p className="text-muted-foreground">Únete a la acción en segundos.</p>
        </div>

        <Card className="bg-card rounded-lg shadow-lg border-0">
           <CardContent className="p-6">
             <RegisterForm />
           </CardContent>
        </Card>
        
        <div className="text-center mt-6">
            <p className="text-muted-foreground">¿Ya tienes una cuenta? <a href="#" className="font-semibold text-primary hover:underline">Iniciar sesión</a></p>
        </div>
      </div>
    </main>
  );
}
