import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PascualBetLogo } from '@/components/pascualbet-logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <PascualBetLogo className="w-64 h-auto mb-4" />
      </div>

      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="uppercase">Entrar</TabsTrigger>
          <TabsTrigger value="register" className="uppercase">Registrarse</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-2xl uppercase">¡Bienvenido!</CardTitle>
              <CardDescription>Ingresa para empezar a jugar.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
           <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-2xl uppercase">Crear Cuenta</CardTitle>
              <CardDescription>¡Bono de bienvenida al registrarte!</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <p className="text-center text-xs text-muted-foreground mt-4">
        Pista: Usa `admin` / `password_admin_hashed`
      </p>
    </main>
  );
}
