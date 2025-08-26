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
    if (balance < betAmount || spinning) {
        setMessage("Saldo insuficiente o ya girando.");
        return;
    }
    
    setSpinning(true);
    onBalanceChange(-betAmount);
    setMessage('');
    setWinningLine([false, false, false]);

    // Create promises for each reel to resolve with a final symbol
    const spinPromises = Array(3).fill(null).map((_, index) => {
        return new Promise<typeof symbols[0]>(resolve => {
            setTimeout(() => {
                resolve(getRandomSymbol());
            }, 1000 + index * 300); // Stagger the stops
        });
    });

    Promise.all(spinPromises).then(finalReels => {
        setReels(finalReels);
        setSpinning(false);

        const isJackpot = finalReels[0].value === finalReels[1].value && finalReels[1].value === finalReels[2].value;
        const isTwoInLine = finalReels[0].value === finalReels[1].value;

        if (isJackpot) {
            const winnings = betAmount * finalReels[0].multiplier;
            setMessage(`¡Jackpot! ¡Ganas $${winnings}!`);
            onBalanceChange(winnings);
            setWinningLine([true, true, true]);
        } else if (isTwoInLine) {
            const winnings = betAmount * finalReels[0].multiplier * 0.5; // 2-in-a-row pays half
            setMessage(`¡Dos en línea! ¡Ganas $${winnings}!`);
            onBalanceChange(winnings);
            setWinningLine([true, true, false]);
        } else {
            setMessage('¡Suerte la próxima vez!');
        }
    });
  }, [balance, betAmount, onBalanceChange, spinning]);


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
          <Alert variant={message.includes('Ganas') ? 'default' : 'destructive'} className={cn('transition-opacity duration-300 min-h-[60px]', message.includes('Ganas') ? 'pixel-border pixel-border-primary text-primary' : message ? 'border-destructive text-destructive' : 'border-transparent')}>
            <AlertTitle className="font-bold text-lg uppercase">{message}</AlertTitle>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-2">
            <Button size="lg" onClick={spinReels} disabled={spinning || balance < betAmount} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-16 py-8 text-2xl transform transition-transform hover:scale-105 active:scale-95 uppercase">
              {spinning ? 'Girando...' : 'Girar'}
            </Button>
            <p className="text-muted-foreground uppercase">Costo: ${betAmount}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotsGame;
