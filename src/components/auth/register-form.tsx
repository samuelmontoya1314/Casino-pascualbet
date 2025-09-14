
'use client';
import { useActionState, useState, useEffect } from 'react';
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
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { countries } from '@/lib/countries';
import { ScrollArea } from '../ui/scroll-area';

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
    
    // State to hold form values
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [date, setDate] = useState<Date | undefined>();
    const [nationality, setNationality] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');

    useEffect(() => {
        if (state?.error) {
            // Keep form data on error
        }
    }, [state]);

    return (
        <form action={formAction} className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="userId">ID de Usuario</Label>
                <Input 
                    id="userId" 
                    name="userId" 
                    placeholder="Crea un ID de usuario" 
                    required 
                    className="h-12 bg-input"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="Crea una contraseña segura" 
                    required 
                    className="h-12 bg-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input 
                    id="fullName" 
                    name="fullName" 
                    required 
                    className="h-12 bg-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                 <Label htmlFor="birthDate">Fecha de nacimiento</Label>
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
                        {date ? format(date, "PPP", { locale: es }) : <span>DD/MM/YYYY</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        locale={es}
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        captionLayout="dropdown-buttons"
                        fromYear={new Date().getFullYear() - 100}
                        toYear={new Date().getFullYear()}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidad</Label>
                <Select name="nationality" required value={nationality} onValueChange={setNationality}>
                    <SelectTrigger className="w-full h-12 bg-input">
                        <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent>
                        <ScrollArea className="h-72">
                            {countries.map(country => (
                                <SelectItem key={country.code} value={country.name}>
                                    {country.name}
                                </SelectItem>
                            ))}
                        </ScrollArea>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="documentNumber">Documento de identidad</Label>
                <Input 
                    id="documentNumber" 
                    name="documentNumber" 
                    required 
                    className="h-12 bg-input"
                    value={documentNumber}
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        const numericValue = target.value.replace(/[^0-9]/g, '');
                        setDocumentNumber(numericValue);
                    }}
                />
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
