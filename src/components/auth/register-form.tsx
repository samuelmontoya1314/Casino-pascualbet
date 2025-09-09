'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleRegister } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, UserPlus } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

function SubmitButton() {
    const { pending } = useFormStatus();
    const t = useI18n();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? t('login.registering') : <> <UserPlus className="mr-2 h-4 w-4" /> {t('login.register')} </>}
        </Button>
    );
}

export function RegisterForm() {
    const [state, formAction] = useActionState(handleRegister, undefined);
    const t = useI18n();

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">{t('login.fullName')}</Label>
                <Input id="name" name="name" placeholder={t('login.fullNamePlaceholder')} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="userId">{t('login.userId')}</Label>
                <Input id="userId" name="userId" placeholder="ej. juanperez" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">{t('login.phoneNumber')}</Label>
                <Input id="phone" name="phone" placeholder="+57 300 123 4567" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            
            {state?.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t('login.registrationFailed')}</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            <SubmitButton />
        </form>
    );
}
