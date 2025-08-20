'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Diamond, Heart, Club, Spade } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const symbols = [
  { icon: <Diamond className="h-16 w-16 text-red-500" />, name: 'diamond', value: 50 },
  { icon: <Heart className="h-16 w-16 text-red-500" />, name: 'heart', value: 40 },
  { icon: <Club className="h-16 w-16 text-gray-400" />, name: 'club', value: 30 },
  { icon: <Spade className="h-16 w-16 text-gray-400" />, name: 'spade', value: 30 },
  { icon: <span className="text-5xl font-bold text-yellow-500">7</span>, name: 'seven', value: 100 },
  { icon: <span className="text-5xl font-bold text-yellow-400">BAR</span>, name: 'bar', value: 20 },
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const SPIN_COST = 5;

export default function SlotMachine({ balance, setBalance }: { balance: number, setBalance: (balance: number) => void }) {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const handleSpin = () => {
    if (spinning || balance < SPIN_COST) {
      if(balance < SPIN_COST) {
        toast({ title: 'Not enough balance', description: 'You do not have enough money to spin.', variant: 'destructive' });
      }
      return;
    }

    setSpinning(true);
    setResult('');
    setBalance(balance - SPIN_COST);

    let spinCount = 0;
    const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    const interval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      spinCount++;
      if (spinCount > 15) {
        clearInterval(interval);
        setReels(finalReels);
        setSpinning(false);
      }
    }, 100);
  };
  
  useEffect(() => {
    if (!spinning) {
      const [r1, r2, r3] = reels;
      if (r1.name === r2.name && r2.name === r3.name) {
        const winAmount = r1.value * SPIN_COST;
        setResult(`Jackpot! You won $${winAmount} with three ${r1.name}s!`);
        setBalance(balance + winAmount);
        toast({ title: 'Jackpot!', description: `You won ${winAmount}!` });
      } else {
        setResult('');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning]);


  return (
    <Card className="w-full max-w-lg bg-card/50 border-primary/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-4xl font-headline text-primary tracking-wider">
          Slot Machine
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="flex justify-center gap-4 sm:gap-8 p-6 bg-secondary/30 rounded-lg border-2 border-primary/50 shadow-inner">
          {reels.map((symbol, index) => (
            <div
              key={index}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-background/50 rounded-md flex items-center justify-center shadow-lg"
            >
              {symbol.icon}
            </div>
          ))}
        </div>
        {result && (
          <p className="text-center text-lg font-bold text-primary animate-pulse">{result}</p>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button
          onClick={handleSpin}
          disabled={spinning || balance < SPIN_COST}
          size="lg"
          className="w-full max-w-xs text-xl font-bold h-16 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          {spinning ? 'Spinning...' : `SPIN FOR $${SPIN_COST}`}
        </Button>
        <p className="text-xs text-muted-foreground">Match three symbols to win the jackpot!</p>
      </CardFooter>
    </Card>
  );
}
