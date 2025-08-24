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
    { icon: <Star className="w-16 h-16 text-accent" />, value: 'star', multiplier: 10, key: 'star' },
    { icon: <Gem className="w-16 h-16 text-purple-500" />, value: 'gem', multiplier: 20, key: 'gem' },
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

interface SlotsGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const Reel = ({ symbol, isSpinning }: { symbol: typeof symbols[0], isSpinning: boolean }) => {
    return (
        <div className={cn("w-28 h-28 bg-background rounded-lg flex items-center justify-center shadow-inner overflow-hidden transition-all duration-300", isSpinning ? 'reel-spinning-blur' : '')}>
            <div className={cn("transition-transform duration-100 ease-linear", isSpinning ? 'animate-[spin-reel_0.1s_linear_infinite]' : '')}>
                {isSpinning ? getRandomSymbol().icon : symbol.icon}
            </div>
        </div>
    );
};

const SlotsGame: React.FC<SlotsGameProps> = ({ balance, onBalanceChange }) => {
  const [reels, setReels] = useState(Array(3).fill(symbols[0]));
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('');
  const [betAmount] = useState(10); // Fixed bet amount
  const [winningLine, setWinningLine] = useState<boolean[]>([false, false, false]);

  const spinReels = useCallback(() => {
    if (balance < betAmount) {
      setMessage("No tienes suficiente saldo para jugar.");
      return;
    }
    
    setSpinning(true);
    onBalanceChange(-betAmount);
    setMessage('');
    setWinningLine([false, false, false]);

    const spinInterval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setReels(finalReels);
      setSpinning(false);
      
      const isJackpot = finalReels[0].value === finalReels[1].value && finalReels[1].value === finalReels[2].value;
      const isTwoInLine = finalReels[0].value === finalReels[1].value || finalReels[1].value === finalReels[2].value;

      if (isJackpot) {
        const winnings = betAmount * finalReels[0].multiplier;
        setMessage(`¡Jackpot! ¡Ganaste $${winnings}!`);
        onBalanceChange(winnings);
        setWinningLine([true, true, true]);
      } else if (isTwoInLine) {
        const winSymbol = finalReels[0].value === finalReels[1].value ? finalReels[0] : finalReels[1];
        const winnings = betAmount * (winSymbol.multiplier / 2);
        setMessage(`¡Dos en línea! ¡Ganaste $${winnings}!`);
        onBalanceChange(winnings);
        if (finalReels[0].value === finalReels[1].value) {
            setWinningLine([true, true, false]);
        } else {
            setWinningLine([false, true, true]);
        }
      } else {
        setMessage('Sin suerte esta vez. ¡Intenta de nuevo!');
      }

    }, 2000);
  }, [balance, betAmount, onBalanceChange]);

  return (
    <Card className="w-full bg-card/70 border-primary shadow-2xl shadow-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Tragamonedas</CardTitle>
        <CardDescription>¡Alinea tres símbolos para ganar el premio gordo!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="flex gap-6 p-6 bg-secondary rounded-xl border-4 border-border">
          {reels.map((symbol, index) => (
            <div key={index} className={cn(winningLine[index] && 'animate-win-pulse rounded-lg')}>
                 <Reel symbol={symbol} isSpinning={spinning} />
            </div>
          ))}
        </div>

        {message && (
          <Alert className={cn('transition-opacity duration-300', message.includes('Ganaste') ? 'border-accent text-accent' : 'border-destructive')}>
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
