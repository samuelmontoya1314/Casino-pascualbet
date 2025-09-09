
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import type { User } from '@/lib/users';
import { updateUser } from '@/actions/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertCircle } from 'lucide-react';
import { DialogFooter, DialogClose } from '../ui/dialog';

interface EditProfileFormProps {
    user: User;
    onUpdate: (user: User) => void;
    onCancel: () => void;
}

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
    );
}


export function EditProfileForm({ user, onUpdate, onCancel }: EditProfileFormProps) {
    const [state, formAction] = useActionState(updateUser, { error: null, success: false, data: null });

    useEffect(() => {
        if (state.success && state.data) {
            onUpdate(state.data as User);
        }
    }, [state, onUpdate]);

    return (
        <form action={formAction} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Primer Nombre</Label>
                    <Input id="firstName" name="firstName" defaultValue={user.firstName} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="secondName">Segundo Nombre</Label>
                    <Input id="secondName" name="secondName" defaultValue={user.secondName} />
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstLastName">Primer Apellido</Label>
                    <Input id="firstLastName" name="firstLastName" defaultValue={user.firstLastName} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="secondLastName">Segundo Apellido</Label>
                    <Input id="secondLastName" name="secondLastName" defaultValue={user.secondLastName} />
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <Input id="birthDate" name="birthDate" type="date" defaultValue={user.birthDate} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nationality">Nacionalidad</Label>
                    <Input id="nationality" name="nationality" defaultValue={user.nationality} />
                </div>
            </div>
            <div className="space-y-2">
                <Label>ID de Usuario</Label>
                <Input defaultValue={user.id} disabled />
            </div>
            <div className="space-y-2">
                <Label>Número de Documento</Label>
                <Input defaultValue={user.documentNumber} disabled />
            </div>
            {state?.error && (
                <div className="flex items-center gap-2 text-destructive text-sm p-2 rounded-md border border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <span>{state.error}</span>
                </div>
            )}
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                </DialogClose>
                <SaveButton />
            </DialogFooter>
        </form>
    );
}

