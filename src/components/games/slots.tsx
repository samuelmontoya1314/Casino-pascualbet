'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Star, Cherry, Gem, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    // This creates the blur effect by rapidly changing symbols
    const [displaySymbol, setDisplaySymbol] = useState(symbol);

    useEffect(() => {
        if (isSpinning) {
            const interval = setInterval(() => {
                setDisplaySymbol(getRandomSymbol());
            }, 100);
            return () => clearInterval(interval);
        } else {
            // When not spinning, show the final symbol
            setDisplaySymbol(symbol);
        }
    }, [isSpinning, symbol]);

    return (
        <div className={cn("w-28 h-28 bg-background rounded-lg flex items-center justify-center shadow-inner overflow-hidden transition-all duration-300", !isSpinning && 'reel-stop-blur')}>
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
  const [betAmount] = useState(10); // Fixed bet amount
  const [winningLine, setWinningLine] = useState<boolean[]>([false, false, false]);

  const spinReels = useCallback(() => {
    if (balance < betAmount) {
      setMessage("No tienes suficiente saldo para jugar.");
      return;
    }
    setMessage('');
    setWinningLine([false, false, false]);
    setSpinning(true);
    onBalanceChange(-betAmount);

    const spinPromises = reels.map((_, index) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getRandomSymbol());
            }, 1000 + index * 500);
        });
    });

    Promise.all(spinPromises).then(finalReels => {
        setReels(finalReels as typeof symbols);
        setSpinning(false);
        
        const isJackpot = finalReels[0].value === finalReels[1].value && finalReels[1].value === finalReels[2].value;
        const isTwoInLine = finalReels[0].value === finalReels[1].value;

        if (isJackpot) {
            const winnings = betAmount * (finalReels[0] as typeof symbols[0]).multiplier;
            setMessage(`¡Jackpot! ¡Ganaste $${winnings}!`);
            onBalanceChange(winnings);
            setWinningLine([true, true, true]);
        } else if (isTwoInLine) {
            const winSymbol = finalReels[0] as typeof symbols[0];
            const winnings = betAmount * (winSymbol.multiplier / 2);
            setMessage(`¡Dos en línea! ¡Ganaste $${winnings}!`);
            onBalanceChange(winnings);
            setWinningLine([true, true, false]);
        } else {
            setMessage('Sin suerte esta vez. ¡Intenta de nuevo!');
        }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, betAmount, onBalanceChange]);


  return (
    <Card className="w-full bg-card/70 border-primary/20 shadow-2xl shadow-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Tragamonedas</CardTitle>
        <CardDescription>¡Alinea tres símbolos para ganar el premio gordo!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8 min-h-[450px]">
        <div className="flex gap-6 p-6 bg-secondary rounded-xl border-4 border-border">
          {reels.map((symbol, index) => (
            <div key={index} className={cn(winningLine[index] && !spinning && 'animate-win-pulse rounded-lg')}>
                 <Reel symbol={symbol} isSpinning={spinning} />
            </div>
          ))}
        </div>

        {message && (
          <Alert className={cn('transition-opacity duration-300 min-h-[60px]', message.includes('Ganaste') ? 'border-primary/50 text-primary' : message ? 'border-destructive text-destructive' : 'border-transparent')}>
            <AlertTitle className="font-bold text-lg">{message}</AlertTitle>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-2">
            <Button size="lg" onClick={spinReels} disabled={spinning || balance < betAmount} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-16 py-8 text-2xl transform transition-transform hover:scale-105 active:scale-95">
              {spinning ? 'Girando...' : 'GIRAR'}
            </Button>
            <p className="text-muted-foreground">Costo: ${betAmount}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotsGame;