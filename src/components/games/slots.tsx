'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Star, Cherry, Gem, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { BookOpen } from 'lucide-react';

const symbols = [
    { icon: <Cherry className="w-16 h-16 text-red-500" />, value: 'cherry', multiplier: 2, key: 'cherry' },
    { icon: <Bell className="w-16 h-16 text-yellow-500" />, value: 'bell', multiplier: 5, key: 'bell' },
    { icon: <Star className="w-16 h-16 text-blue-400" />, value: 'star', multiplier: 10, key: 'star' },
    { icon: <Gem className="w-16 h-16 text-purple-500" />, value: 'gem', multiplier: 20, key: 'gem' },
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

interface SlotsGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Reel = ({ symbol, isSpinning }: { symbol: typeof symbols[0], isSpinning: boolean }) => {
    const [displaySymbol, setDisplaySymbol] = useState(symbol);

    useEffect(() => {
        if (isSpinning) {
            const interval = setInterval(() => {
                setDisplaySymbol(getRandomSymbol());
            }, 50);
            return () => clearInterval(interval);
        } else {
            setDisplaySymbol(symbol);
        }
    }, [isSpinning, symbol]);

    return (
        <div className={cn("w-28 h-28 bg-background rounded-none flex items-center justify-center border-2 border-border overflow-hidden transition-all duration-300", !isSpinning && 'reel-stop-blur')}>
             <div className={cn(isSpinning && 'animate-spin-reel-blur')} key={displaySymbol.key}>
                {displaySymbol.icon}
            </div>
        </div>
    );
};


const SlotsGame: React.FC<SlotsGameProps> = ({ balance, onBalanceChange }) => {
  const [reels, setReels] = useState(() => [symbols[0], symbols[1], symbols[2]]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('');
  const [betAmount] = useState(10);
  const [winningLine, setWinningLine] = useState<boolean[]>([false, false, false]);

  const spinReels = useCallback(() => {
    if (spinning || balance < betAmount) {
        if (balance < betAmount) setMessage("Saldo insuficiente.");
        return;
    }

    setSpinning(true);
    onBalanceChange(-betAmount);
    setMessage('');
    setWinningLine([false, false, false]);

    let finalReels: typeof symbols[0][] = [];
    const spinPromises = reels.map((_, index) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newSymbol = getRandomSymbol();
                finalReels[index] = newSymbol;
                resolve(newSymbol);
            }, 1000 + index * 300);
        });
    });

    Promise.all(spinPromises).then(resolvedReels => {
        setReels(resolvedReels as typeof symbols[0][]);
        setSpinning(false);
        
        const isJackpot = resolvedReels[0].value === resolvedReels[1].value && resolvedReels[1].value === resolvedReels[2].value;
        const isTwoInLine = resolvedReels[0].value === resolvedReels[1].value;

        if (isJackpot) {
            const winnings = betAmount * resolvedReels[0].multiplier;
            setMessage(`¡Jackpot! ¡Ganas $${winnings}!`);
            onBalanceChange(winnings);
            setWinningLine([true, true, true]);
        } else if (isTwoInLine) {
            const winnings = betAmount * resolvedReels[0].multiplier * 0.5;
            setMessage(`¡Dos en línea! ¡Ganas $${winnings}!`);
            onBalanceChange(winnings);
            setWinningLine([true, true, false]);
        } else {
            setMessage('¡Suerte la próxima vez!');
        }
    });
}, [spinning, balance, betAmount, onBalanceChange, reels]);


  const playerWon = message.includes('Ganas');

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary uppercase">Tragamonedas</CardTitle>
        <CardDescription>¡Alinea símbolos para ganar!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8 min-h-[450px]">
        <div className="flex gap-6 p-6 bg-secondary rounded-none border-4 border-border">
          {reels.map((symbol, index) => (
            <div key={index} className={cn(winningLine[index] && !spinning && 'animate-win-pulse rounded-none')}>
                 <Reel symbol={symbol} isSpinning={spinning} />
            </div>
          ))}
        </div>

        {message && (
          <Alert variant={playerWon ? 'default' : 'destructive'} className={cn('transition-opacity duration-300 min-h-[60px]', playerWon ? 'pixel-border pixel-border-primary text-primary' : message ? 'border-destructive text-destructive' : 'border-transparent')}>
            <AlertTitle className="font-bold text-lg uppercase text-center">{message}</AlertTitle>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-2">
            <Button size="lg" onClick={spinReels} disabled={spinning || balance < betAmount} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-16 py-8 text-2xl transform transition-transform hover:scale-105 active:scale-95 uppercase">
              {spinning ? 'Girando...' : 'Girar'}
            </Button>
            <p className="text-muted-foreground uppercase">Costo: ${betAmount}</p>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="how-to-play">
                <AccordionTrigger className='text-sm uppercase'>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Cómo Jugar</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs space-y-2">
                    <p><strong>Objetivo:</strong> Alinear símbolos idénticos en la línea central para ganar.</p>
                    <p><strong>Reglas:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>La apuesta es fija de 10 COP por giro.</li>
                        <li>Pulsa "Girar" para que los carretes se muevan.</li>
                        <li>Alinear 3 símbolos iguales (Jackpot) da el mayor premio.</li>
                        <li>Alinear los primeros 2 símbolos da un premio menor.</li>
                        <li>Los premios se basan en el símbolo alineado.</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SlotsGame;
