
'use client';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleLogin } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full h-12 text-base font-bold uppercase" disabled={pending}>
            {pending ? "Iniciando Sesión..." : "Entrar"}
        </Button>
    );
}

export function LoginForm() {
    const [state, formAction] = useActionState(handleLogin, undefined);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleInput = (setter: (value: string) => void) => (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const sanitizedValue = target.value.replace(/[^a-zA-Z0-9]/g, '');
        setter(sanitizedValue);
    };

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="userId">ID de Usuario</Label>
                <Input 
                    id="userId" 
                    name="userId" 
                    placeholder="Introduce tu ID de usuario" 
                    required 
                    className="h-12 bg-input" 
                    maxLength={24}
                    value={userId}
                    onInput={handleInput(setUserId)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="Introduce tu contraseña" 
                    required 
                    className="h-12 bg-input" 
                    maxLength={24} 
                    value={password}
                    onInput={handleInput(setPassword)}
                />
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
