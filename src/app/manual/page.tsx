import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, BookUser, CircleDollarSign, Gamepad2, LogIn, UserCircle } from "lucide-react"
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function ManualPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-4xl pixel-border">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary uppercase flex items-center justify-center gap-4">
            <BookUser className="w-8 h-8" />
            Manual de Usuario de PascualBet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl uppercase">
                <div className="flex items-center gap-3">
                  <LogIn className="w-5 h-5 text-accent"/>
                  <span>Primeros Pasos: Acceso y Registro</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 px-2 text-base">
                <div>
                  <h3 className="font-bold text-primary uppercase">Registro de Nueva Cuenta</h3>
                  <p>1. En la pantalla de inicio, selecciona la pestaña **"REGISTRARSE"**.</p>
                  <p>2. Completa el formulario con tu nombre, un ID de usuario único y una contraseña segura.</p>
                  <p>3. ¡Al registrarte, recibirás un **bono de bienvenida de 1.000 COP** para que empieces a jugar!</p>
                </div>
                <div>
                  <h3 className="font-bold text-primary uppercase">Iniciar Sesión</h3>
                  <p>1. Si ya tienes una cuenta, ve a la pestaña **"ENTRAR"**.</p>
                  <p>2. Introduce tu ID de usuario y contraseña.</p>
                  <p>3. Serás transportado al panel principal del casino.</p>
                   <p className="text-xs text-muted-foreground mt-2">Pista: Puedes usar `admin` / `password_admin_hashed` para probar.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl uppercase">
                 <div className="flex items-center gap-3">
                  <BarChart className="w-5 h-5 text-accent"/>
                  <span>El Panel de Control (Dashboard)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 px-2 text-base">
                <p>Una vez dentro, te encontrarás en el corazón del casino. Aquí tienes todo lo que necesitas para gestionar tu experiencia.</p>
                 <div>
                  <h3 className="font-bold text-primary uppercase">Barra Superior</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>**Logo y Nombre:** A la izquierda, nuestro icónico logo `PascualBet`.</li>
                    <li>**Billetera (Wallet):** A la derecha, verás tu saldo actual. ¡Vigílalo de cerca!</li>
                    <li>**Recargar Saldo:** Haz clic en el ícono de monedas para añadir instantáneamente 100 COP a tu cuenta.</li>
                    <li>**Menú de Usuario:** Haz clic en el cuadrado con tus iniciales para abrir tu menú personal.</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl uppercase">
                 <div className="flex items-center gap-3">
                  <UserCircle className="w-5 h-5 text-accent"/>
                  <span>Gestión del Perfil</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 px-2 text-base">
                <p>Desde el menú de usuario (al que accedes haciendo clic en tus iniciales) puedes:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>**Ver tu Perfil:** Revisa tu nombre, ID de usuario, rol y saldo actual.</li>
                    <li>**Cerrar Sesión:** Termina tu sesión de juego de forma segura.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-xl uppercase">
                 <div className="flex items-center gap-3">
                  <Gamepad2 className="w-5 h-5 text-accent"/>
                  <span>Guía de Juegos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 px-2 text-base">
                
                <div>
                  <h3 className="font-bold text-primary uppercase">Tragamonedas (Slots)</h3>
                  <p>**Objetivo:** ¡Alinear los símbolos para ganar!</p>
                  <p>1. La apuesta es fija: **10 COP por giro**.</p>
                  <p>2. Presiona el gran botón **"GIRAR"** para poner los carretes en movimiento.</p>
                  <p>3. Gana premios por alinear dos o tres símbolos idénticos en la línea central.</p>
                </div>

                <div>
                  <h3 className="font-bold text-primary uppercase">Blackjack</h3>
                  <p>**Objetivo:** Consigue una mano cuyo valor se acerque a 21 más que la del crupier, ¡sin pasarte!</p>
                  <p>1. **Ajusta tu Apuesta:** Usa los botones `+` y `-`.</p>
                  <p>2. Haz clic en **"REPARTIR"** para iniciar la ronda.</p>
                  <p>3. Decide si quieres **"PEDIR"** (otra carta) o **"PLANTARSE"** (quedarte con tu mano).</p>
                </div>

                 <div>
                  <h3 className="font-bold text-primary uppercase">Ruleta (Roulette)</h3>
                  <p>**Objetivo:** Adivina en qué número o sección caerá la bola.</p>
                  <p>1. **Define el Monto:** Usa el campo de entrada para el valor de cada ficha.</p>
                  <p>2. **Haz tus Apuestas:** Haz clic en los números o en las zonas (Rojo/Negro, Par/Impar, etc.).</p>
                  <p>3. Presiona **"GIRAR"** para lanzar la bola.</p>
                </div>

                 <div>
                  <h3 className="font-bold text-primary uppercase">Póker (Texas Hold'em)</h3>
                   <p>**Objetivo:** Conseguir la mejor mano de póker de 5 cartas combinando tus 2 cartas con las 5 de la mesa.</p>
                  <p>1. **Apuesta Inicial (Ante):** Define tu apuesta inicial para la ronda.</p>
                  <p>2. **Decide tu Jugada:** Tras ver tus cartas, puedes **Apostar** (igualar el ante), **Pasar** (continuar sin apostar más) o **No Ir** (retirarte).</p>
                  <p>3. **Cartas Comunitarias:** Se revelan el Flop (3), Turn (1) y River (1).</p>
                  <p>4. **Showdown:** Al final, se comparan las manos y el jugador con la mejor combinación gana el bote.</p>
                </div>
                
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="text-center mt-8">
            <Link href="/" passHref>
                <Button variant="outline" className="uppercase">Volver al Juego</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
