'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleLogin } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogIn } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Iniciando Sesión..." : <> <LogIn className="mr-2 h-4 w-4" /> Entrar </>}
        </Button>
    );
}

export function LoginForm() {
    const [state, formAction] = useActionState(handleLogin, undefined);

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="userId">ID de Usuario</Label>
                <Input id="userId" name="userId" placeholder="ej. admin" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            
            {state?.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Fallo de Inicio de Sesión</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            <SubmitButton />
        </form>
    );
}
