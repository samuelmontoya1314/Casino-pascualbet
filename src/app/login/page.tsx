import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';

const LuigiLogo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.59L7.41 14H10v-4H7v-2h5v6h1.59L17 17.59 15.59 19 12 15.41 8.41 19 7 17.59l3-3 1 1v2z" fill="hsl(var(--primary-foreground))"/>
    <path d="M11 15.59V17l-1-1-3 3L8.41 19 12 15.41 15.59 19 17 17.59 13.41 14H12v-4H9v-2h5v6h1.59L19 14.59V12h-2v1.59l-3.59-3.59L12 11.41V6h-2v5.59L6.41 8 5 9.41l3 3V10H6v4h1.41L11 17.59z" fill="hsl(var(--primary))"/>
    <path d="M10.5 10.5h3v-3h-3v3zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14.59L7.41 9H10V5H7V3h5v7h1.59L17 12.59 15.59 14 12 10.41 8.41 14 7 12.59l3-3 1 1v-2z" fill="url(#grad)"/>
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity:1}} />
        <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity:1}} />
      </linearGradient>
    </defs>
  </svg>
)

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4 inline-block shadow-lg">
            <LuigiLogo />
        </div>
        <h1 className="text-5xl font-bold text-primary" style={{fontFamily: "'Poppins', sans-serif"}}>Casino de Luigi</h1>
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
