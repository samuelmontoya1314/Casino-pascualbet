
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleRegister } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';

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
    const [date, setDate] = useState<Date>()

    return (
        <form action={formAction} className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="userId">ID de Usuario</Label>
                <Input id="userId" name="userId" placeholder="Crea un ID de usuario" required className="h-12 bg-input" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" placeholder="Crea una contraseña segura" required className="h-12 bg-input"/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="firstName">Primer nombre (Cómo aparece en tu documento)</Label>
                <Input id="firstName" name="firstName" required className="h-12 bg-input" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="secondName">Segundo nombre (Cómo aparece en tu documento)</Label>
                <Input id="secondName" name="secondName" className="h-12 bg-input" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="firstLastName">Primer apellido (Cómo aparece en tu documento)</Label>
                <Input id="firstLastName" name="firstLastName" required className="h-12 bg-input" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="secondLastName">Segundo apellido (Cómo aparece en tu documento)</Label>
                <Input id="secondLastName" name="secondLastName" required className="h-12 bg-input" />
            </div>
            <div className="space-y-2">
                 <Label htmlFor="birthDate">Fecha de nacimiento (día/mes/año)</Label>
                 <Input id="birthDate" name="birthDate" type="hidden" value={date ? format(date, "yyyy-MM-dd") : ""} />
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full h-12 justify-start text-left font-normal bg-input",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy") : <span>DD/MM/YYYY</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidad</Label>
                <Input id="nationality" name="nationality" placeholder="Nacionalidad" required className="h-12 bg-input" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de tu cédula de ciudadanía o extranjería (No admitimos PPT)</Label>
                <Input id="documentNumber" name="documentNumber" required className="h-12 bg-input" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="documentIssuePlace">Lugar de expedición del documento</Label>
                <Input id="documentIssuePlace" name="documentIssuePlace" placeholder="Lugar de expedición del documento" required className="h-12 bg-input" />
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
