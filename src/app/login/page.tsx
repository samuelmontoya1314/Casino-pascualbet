import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Diamond } from 'lucide-react';

const PascualBetLogo = () => (
    <Diamond className="text-primary-foreground" size={32} />
)

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4 inline-block shadow-lg">
            <PascualBetLogo />
        </div>
        <h1 className="text-5xl font-bold text-primary" style={{fontFamily: "'Poppins', sans-serif"}}>PascualBet</h1>
        <p className="text-muted-foreground mt-2">Tu Destino de Juego y Suerte</p>
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
