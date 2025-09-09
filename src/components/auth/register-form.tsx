
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleRegister } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full h-12 text-base font-bold uppercase" disabled={pending}>
            {pending ? "Registrando..." : "Crear Cuenta"}
        </Button>
    );
}

export function RegisterForm() {
    const [state, formAction] = useActionState(handleRegister, undefined);

    return (
        <form action={formAction} className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="userId">ID de Usuario</Label>
                <Input id="userId" name="userId" placeholder="Crea un ID de usuario" required className="h-12 bg-input" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" placeholder="Crea una contraseña segura" required className="h-12 bg-input"/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" name="name" placeholder="Tu nombre completo" required className="h-12 bg-input" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Número de Teléfono</Label>
                <Input id="phone" name="phone" placeholder="Tu número de teléfono" type="tel" required className="h-12 bg-input" />
            </div>
            
            {state?.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Fallo de Registro</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            <SubmitButton />
        </form>
    );
}
