'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Star, Cherry, Gem, Bell } from 'lucide-react';

const symbols = [
    { icon: <Cherry className="w-16 h-16 text-red-500" />, value: 'cherry', multiplier: 2 },
    { icon: <Bell className="w-16 h-16 text-yellow-500" />, value: 'bell', multiplier: 5 },
    { icon: <Star className="w-16 h-16 text-accent" />, value: 'star', multiplier: 10 },
    { icon: <Gem className="w-16 h-16 text-purple-500" />, value: 'gem', multiplier: 20 },
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

interface SlotsGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const SlotsGame: React.FC<SlotsGameProps> = ({ balance, onBalanceChange }) => {
  const [reels, setReels] = useState(Array(3).fill(symbols[0]));
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('');
  const [betAmount] = useState(10); // Fixed bet amount

  const spinReels = useCallback(() => {
    if (balance < betAmount) {
      setMessage("You don't have enough to play.");
      return;
    }
    
    setSpinning(true);
    onBalanceChange(-betAmount);
    setMessage('');

    const spinInterval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      setReels(finalReels);
      setSpinning(false);

      if (finalReels[0].value === finalReels[1].value && finalReels[1].value === finalReels[2].value) {
        const winnings = betAmount * finalReels[0].multiplier;
        setMessage(`Jackpot! You won $${winnings}!`);
        onBalanceChange(winnings);
      } else if (finalReels[0].value === finalReels[1].value || finalReels[1].value === finalReels[2].value) {
        const winSymbol = finalReels[0].value === finalReels[1].value ? finalReels[0] : finalReels[1];
        const winnings = betAmount * (winSymbol.multiplier / 2);
        setMessage(`Two in a row! You won $${winnings}!`);
        onBalanceChange(winnings);
      } else {
        setMessage('No luck this time. Try again!');
      }

    }, 2000);
  }, [balance, betAmount, onBalanceChange]);

  return (
    <Card className="w-full bg-card/70 border-primary shadow-2xl shadow-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Slot Machine</CardTitle>
        <CardDescription>Match three symbols to win the jackpot!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="flex gap-6 p-6 bg-secondary rounded-xl border-4 border-border">
          {reels.map((symbol, index) => (
            <div key={index} className="w-28 h-28 bg-background rounded-lg flex items-center justify-center shadow-inner">
              {symbol.icon}
            </div>
          ))}
        </div>

        {message && (
          <Alert className={message.includes('won') ? 'border-accent text-accent' : 'border-destructive'}>
            <AlertTitle className="font-bold text-lg">{message}</AlertTitle>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-2">
            <Button size="lg" onClick={spinReels} disabled={spinning || balance < betAmount} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-16 py-8 text-2xl">
              {spinning ? 'Spinning...' : 'SPIN'}
            </Button>
            <p className="text-muted-foreground">Cost: ${betAmount}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotsGame;
