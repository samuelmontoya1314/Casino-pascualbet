
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
import { format, differenceInYears } from 'date-fns';
import { es } from 'date-fns/locale';
import { Checkbox } from '../ui/checkbox';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel } from '../ui/alert-dialog';
import { ScrollArea } from '../ui/scroll-area';

function SubmitButton({ termsAccepted }: { termsAccepted: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button 
            type="submit" 
            className="w-full h-12 text-base font-bold uppercase" 
            disabled={pending || !termsAccepted}
        >
            {pending ? 'Registrando...' : 'Crear Cuenta'}
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
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [ageError, setAgeError] = useState<string | null>(null);
    

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            const age = differenceInYears(new Date(), selectedDate);
            if (age < 18) {
                setAgeError("Solo se permiten usuarios mayores de 18 años.");
            } else {
                setAgeError(null);
            }
        } else {
            setAgeError(null);
        }
    };

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
                    placeholder="Elige un ID de usuario"
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
                <Label htmlFor="fullName">Nombre Completo</Label>
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
                            !date && "text-muted-foreground",
                            ageError && "border-destructive text-destructive"
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
                        onSelect={handleDateSelect}
                        captionLayout="dropdown-buttons"
                        fromYear={new Date().getFullYear() - 100}
                        toYear={new Date().getFullYear()}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {ageError && <p className="text-sm text-destructive">{ageError}</p>}
            </div>
             <div className="items-center flex space-x-2">
                <Checkbox id="terms" name="terms" onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                       Acepto los términos y condiciones
                    </label>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto text-sm">Leer términos</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Términos y Condiciones de PascualBet</AlertDialogTitle>
                         <div className="text-sm text-muted-foreground">
                            <ScrollArea className="h-72 w-full rounded-md border p-4 mt-4">
                               <ol className="list-decimal list-inside space-y-2 text-xs text-left">
                                    <li>Al registrarse, su nombre, persona y religión pasan a ser propiedad exclusiva de PascualBet.</li>
                                    <li>En caso de fallecimiento con saldo negativo, su alma será subastada en el mercado espiritual de PascualBet.</li>
                                    <li>Si posee una mascota y mantiene saldo negativo, dicha mascota será automáticamente reclamada como parte de nuestro inventario.</li>
                                    <li>Todo jugador que gane más de tres partidas seguidas deberá enviar una pizza tamaño familiar a las oficinas centrales de PascualBet.</li>
                                    <li>Si pierde más de cinco partidas consecutivas, acepta voluntariamente convertirse en el animador oficial de nuestras máquinas tragamonedas.</li>
                                    <li>PascualBet se reserva el derecho de cambiar su apodo en la plataforma por uno ridículo si consideramos que el actual es aburrido.</li>
                                    <li>En caso de empate en cualquier juego, se decidirá mediante un torneo interno de piedra, papel o tijera entre los desarrolladores.</li>
                                    <li>Si intenta hacer trampa, automáticamente será inscrito en el curso obligatorio 'Cómo perder con dignidad 101'.</li>
                                    <li>Cada clic que realice en la plataforma será interpretado como una ovación a nuestro logo.</li>
                                    <li>Al aceptar estos términos, usted autoriza que su sombra digital sea utilizada para fines decorativos en el casino virtual.</li>
                                    <li>En caso de saldo positivo sospechosamente alto, PascualBet enviará payasos virtuales a acosarlo hasta que pierda.</li>
                                    <li>Si no inicia sesión durante más de 7 días, un mariachi digital aparecerá en sus sueños para recordarle jugar.</li>
                                    <li>PascualBet tiene derecho a reemplazar su foto de perfil por la de un aguacate sonriente sin previo aviso.</li>
                                    <li>Cada vez que haga 'cash out', una paloma mensajera será liberada con un recibo invisible.</li>
                                    <li>Si intenta borrar su cuenta, automáticamente será contratado como asesor financiero del casino.</li>
                                    <li>En caso de llorar frente a la pantalla, PascualBet cobrará lágrimas como método de pago alternativo.</li>
                                    <li>Todo jugador que intente rezar antes de apostar verá cómo sus plegarias son redirigidas a nuestro servidor central.</li>
                                    <li>PascualBet se reserva el derecho de enviarle memes ofensivos cada vez que pierda.</li>
                                    <li>Si intenta ganar usando astrología, su signo zodiacal será baneado permanentemente.</li>
                                    <li>El saldo negativo recurrente obliga al jugador a escribir 100 veces: 'No debí apostar mi futuro'.</li>
                                    <li>Los lunes, todas las apuestas estarán sujetas a la Ley del Azar Injusto (probabilidades del 0.0001%).</li>
                                    <li>Si intenta compartir su cuenta, ambos jugadores serán fusionados en un solo avatar con doble deuda.</li>
                                    <li>Todo usuario debe aceptar que las tragamonedas en realidad están controladas por un hámster con sueño.</li>
                                    <li>PascualBet puede en cualquier momento obligarlo a cantar el himno del casino antes de retirar fondos.</li>
                                    <li>Si cierra la pestaña del navegador sin despedirse, un gnomo digital le robará un calcetín.</li>
                                    <li>Las deudas en PascualBet pueden heredarse a tres generaciones futuras, incluyendo primos lejanos.</li>
                                    <li>En caso de discutir con el soporte técnico, su teclado entrará en modo 'autocorrector troll'.</li>
                                    <li>Si gana un jackpot, acepta enviar inmediatamente un selfie llorando de felicidad para publicidad.</li>
                                    <li>Cualquier queja será respondida con un chiste malo y un emoticono de payaso.</li>
                                    <li>PascualBet se reserva el derecho de cambiarle el idioma de la plataforma a latín medieval sin aviso.</li>
                                    <li>Si juega después de medianoche, un búho fantasma auditará sus apuestas.</li>
                                    <li>En caso de saldo cero, PascualBet le regalará un sobre vacío como premio de consolación.</li>
                                    <li>Todo jugador debe aceptar que los servidores del casino funcionan con magia negra certificada.</li>
                                    <li>Si intenta denunciar a PascualBet, su denuncia será enviada directamente a la papelera de reciclaje del universo.</li>
                                    <li>El simple acto de leer estos términos y condiciones ya genera una deuda emocional con nosotros.</li>
                                </ol>
                            </ScrollArea>
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>Cerrar</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            
            {state?.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Fallo de Registro</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            <SubmitButton termsAccepted={termsAccepted} />
        </form>
    );
}
