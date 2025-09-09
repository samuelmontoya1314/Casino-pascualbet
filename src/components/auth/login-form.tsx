'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleLogin } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LogIn } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useI18n();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? t('login.loggingIn') : <> <LogIn className="mr-2 h-4 w-4" /> {t('login.logIn')} </>}
        </Button>
    );
}

export function LoginForm() {
    const [state, formAction] = useActionState(handleLogin, undefined);
    const t = useI18n();

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="userId">{t('login.userId')}</Label>
                <Input id="userId" name="userId" placeholder="ej. admin" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            
            {state?.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t('login.loginFailed')}</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            <SubmitButton />
        </form>
    );
}
