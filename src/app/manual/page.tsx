'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, BookUser, CircleDollarSign, Gamepad2, LogIn, UserCircle, Wallet, Coins, UserPlus } from "lucide-react"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


export default function ManualPage() {
  const router = useRouter();

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
              <AccordionContent className="space-y-6 px-2 text-base">
                <div className="space-y-2">
                  <h3 className="font-bold text-primary uppercase">Registro de Nueva Cuenta</h3>
                  <div>1. En la pantalla de inicio, selecciona la pestaña <Badge variant="secondary" className="uppercase">Registrarse</Badge>.</div>
                  <p>2. Completa el formulario con tu nombre, un ID de usuario único y una contraseña.</p>
                  <div className="flex justify-center p-4">
                     <div className="space-y-4 w-64 p-4 rounded-md bg-secondary/30">
                        <Input disabled placeholder="Nombre Completo" />
                        <Input disabled placeholder="ID de Usuario" />
                        <Input disabled type="password" placeholder="Contraseña" />
                        <Button disabled className="w-full uppercase"><UserPlus className="mr-2"/>Registrarse</Button>
                     </div>
                  </div>
                  <p>3. ¡Al registrarte, recibirás un **bono de bienvenida de 1.000 COP** para que empieces a jugar!</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-primary uppercase">Iniciar Sesión</h3>
                  <div>1. Si ya tienes una cuenta, ve a la pestaña <Badge className="uppercase">Entrar</Badge>.</div>
                  <p>2. Introduce tu ID de usuario y contraseña.</p>
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
                 <div className="space-y-3">
                  <h3 className="font-bold text-primary uppercase">Barra Superior</h3>
                   <div className="p-4 bg-secondary/30 rounded-md flex items-center justify-between">
                        <span className="font-bold uppercase text-sm">PascualBet</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-sm bg-secondary px-3 py-1 border text-sm">
                                <Wallet className="h-5 w-5 text-primary"/>
                                <span>$1,000</span>
                            </div>
                            <Button size="icon" variant="outline" className="h-8 w-8">
                                <Coins className="h-4 w-4" />
                            </Button>
                             <Avatar className="h-8 w-8 rounded-none">
                                <AvatarFallback className="bg-primary/20 text-primary font-bold rounded-none text-xs">
                                    AU
                                </AvatarFallback>
                            </Avatar>
                        </div>
                   </div>
                  <ul className="list-disc list-inside space-y-2">
                    <li>**Logo y Nombre:** A la izquierda, nuestro icónico logo `PascualBet`.</li>
                    <li>**Billetera (Wallet):** A la derecha, verás tu saldo actual.</li>
                    <li>**Recargar Saldo:** El botón <Coins className="w-4 h-4 inline-block mx-1"/> te añade instantáneamente 100 COP a tu cuenta.</li>
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
                  <p>2. Presiona el gran botón <Button size="sm" disabled className="uppercase text-xs h-6 px-2">Girar</Button> para poner los carretes en movimiento.</p>
                  <p>3. Gana premios por alinear dos o tres símbolos idénticos en la línea central.</p>
                </div>

                <div>
                  <h3 className="font-bold text-primary uppercase">Blackjack</h3>
                  <p>**Objetivo:** Consigue una mano cuyo valor se acerque a 21 más que la del crupier, ¡sin pasarte!</p>
                  <p>1. **Ajusta tu Apuesta:** Usa los botones <Button size="sm" disabled variant="outline" className="h-6 w-6 p-0 text-xs">-</Button> y <Button size="sm" disabled variant="outline" className="h-6 w-6 p-0 text-xs">+</Button>.</p>
                  <p>2. Haz clic en <Button size="sm" disabled className="uppercase text-xs h-6 px-2">Repartir</Button> para iniciar la ronda.</p>
                  <p>3. Decide si quieres <Button size="sm" disabled variant="secondary" className="uppercase text-xs h-6 px-2">Pedir</Button> o <Button size="sm" disabled variant="outline" className="uppercase text-xs h-6 px-2">Plantarse</Button>.</p>
                </div>

                 <div>
                  <h3 className="font-bold uppercase text-primary">Ruleta (Roulette)</h3>
                  <p>**Objetivo:** Adivina en qué número o sección caerá la bola.</p>
                  <p>1. **Define el Monto:** Usa el campo de entrada <Input disabled value={10} className="w-12 h-6 inline-block mx-1" /> para el valor de cada ficha.</p>
                  <p>2. **Haz tus Apuestas:** Haz clic en los números o en las zonas (Rojo/Negro, Par/Impar, etc.).</p>
                  <p>3. Presiona <Button size="sm" disabled className="uppercase text-xs h-6 px-2">Girar</Button> para lanzar la bola.</p>
                </div>

                 <div>
                  <h3 className="font-bold text-primary uppercase">Póker (Texas Hold'em)</h3>
                   <p>**Objetivo:** Conseguir la mejor mano de póker de 5 cartas combinando tus 2 cartas con las 5 de la mesa.</p>
                  <p>1. **Apuesta Inicial (Ante):** Define tu apuesta inicial para la ronda.</p>
                  <p>2. **Decide tu Jugada:** Tras ver tus cartas, puedes <Button size="sm" disabled className="h-6 px-2 text-xs uppercase bg-green-600">Apostar</Button>, <Button size="sm" disabled variant="outline" className="h-6 px-2 text-xs uppercase">Pasar</Button> o <Button size="sm" disabled className="h-6 px-2 text-xs uppercase bg-red-600">No Ir</Button>.</p>
                  <p>3. **Cartas Comunitarias:** Se revelan el Flop (3), Turn (1) y River (1).</p>
                  <p>4. **Showdown:** Al final, se comparan las manos y el jugador con la mejor combinación gana el bote.</p>
                </div>
                
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="text-center mt-8">
            <Button onClick={() => router.back()} variant="outline" className="uppercase">Volver al Juego</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
