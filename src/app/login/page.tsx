import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PascualBetLogo } from '@/components/pascualbet-logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <PascualBetLogo className="w-48 h-auto mb-4" />
        <p className="text-muted-foreground mt-2 font-semibold tracking-wider uppercase">Your Winning Destination</p>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">¡Bienvenido de Nuevo!</CardTitle>
              <CardDescription>Ingresa tus credenciales para empezar a jugar.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
           <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Crear una Cuenta</CardTitle>
              <CardDescription>¡Regístrate para obtener tu bono de bienvenida!</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Pista: Usa `admin` / `password_admin_hashed` o `user123` / `password_user_hashed` para iniciar sesión.
      </p>
    </main>
  );
}
