'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const numbers = [
  { num: 0, color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => {
    const num = i + 1;
    const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num);
    return { num, color: isRed ? 'red' : 'black' };
  }),
];

type BetType = 'number' | 'color' | 'parity';
type BetValue = number | 'red' | 'black' | 'even' | 'odd';

interface Bet {
    type: BetType;
    value: BetValue;
    amount: number;
}

export default function Roulette({ balance, setBalance }: { balance: number, setBalance: (balance: number) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const { toast } = useToast();

  const handlePlaceBet = (type: BetType, value: BetValue) => {
    if (betAmount > balance) {
        toast({ title: 'Invalid Bet', description: 'Your bet cannot exceed your balance.', variant: 'destructive' });
        return;
    }
    if(betAmount <= 0) {
        toast({ title: 'Invalid Bet', description: 'Bet amount must be greater than 0.', variant: 'destructive' });
        return;
    }
    setBalance(balance - betAmount);
    setBets(prev => [...prev, { type, value, amount: betAmount }]);
  };

  const handleSpin = () => {
    if (spinning || bets.length === 0) {
      if (bets.length === 0) {
        toast({ title: 'No Bets Placed', description: 'You must place at least one bet to spin.', variant: 'destructive' });
      }
      return;
    }

    setSpinning(true);
    setResult(null);

    const spinDuration = 3000;
    const finalResult = Math.floor(Math.random() * numbers.length);
    let currentNumber = 0;
    const interval = setInterval(() => {
        setResult(numbers[currentNumber].num);
        currentNumber = (currentNumber + 1) % numbers.length;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setResult(finalResult);
      setSpinning(false);
    }, spinDuration);
  };
  
  useEffect(() => {
    if (result === null || spinning) return;
    
    let winnings = 0;
    const winningNumber = numbers[result];

    bets.forEach(bet => {
        let isWin = false;
        let payout = 0;
        if(bet.type === 'number' && bet.value === winningNumber.num) {
            isWin = true;
            payout = 35;
        }
        if(bet.type === 'color' && bet.value === winningNumber.color) {
            isWin = true;
            payout = 1;
        }
        if(bet.type === 'parity') {
            if(winningNumber.num !== 0) {
                if(bet.value === 'even' && winningNumber.num % 2 === 0) isWin = true;
                if(bet.value === 'odd' && winningNumber.num % 2 !== 0) isWin = true;
                payout = 1;
            }
        }
        
        if (isWin) {
            winnings += bet.amount * payout + bet.amount;
        }
    });

    if (winnings > 0) {
        setBalance(balance + winnings);
        toast({ title: 'You Win!', description: `You won $${winnings.toFixed(0)}!` });
    } else {
        toast({ title: 'You Lose', description: 'Better luck next time!', variant: 'destructive'});
    }

    setBets([]);

  }, [result, spinning]);

  const BetButton = ({ type, value, display, className = '' }: { type: BetType, value: BetValue, display: string | number, className?: string }) => (
    <Button
        variant="outline"
        className={cn("h-12 w-12 text-lg font-bold", className)}
        onClick={() => handlePlaceBet(type, value)}
        disabled={spinning}
    >
        {display}
    </Button>
  );

  return (
    <Card className="w-full max-w-4xl bg-card/50 border-primary/30 shadow-2xl">
      <CardHeader className="items-center">
        <CardTitle className="text-center text-4xl font-headline text-primary tracking-wider">Roulette</CardTitle>
        <div className="mt-4 h-20 w-20 rounded-full border-4 border-primary flex items-center justify-center bg-background shadow-lg">
            <span className={cn("text-5xl font-bold", 
                result !== null && numbers[result].color === 'red' && 'text-red-500',
                result !== null && numbers[result].color === 'black' && 'text-gray-400',
                result !== null && numbers[result].color === 'green' && 'text-green-500',
                spinning && 'animate-spin'
            )}>
              {result !== null ? numbers[result].num : '?'}
            </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
            <span className="font-bold">Bet Amount:</span>
            <Input type="number" value={betAmount} onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)} className="w-24" />
        </div>

        <p className="text-sm text-muted-foreground">Click on numbers, colors or parities to place bets.</p>
        
        <div className="space-y-4 w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-2 p-2">
                    {numbers.map(({num, color}) => (
                        <Button 
                            key={num} 
                            onClick={() => handlePlaceBet('number', num)}
                            disabled={spinning}
                            className={cn('h-14 w-14 rounded-full text-lg font-bold text-white shadow-md border-2',
                                color === 'red' && 'bg-red-700 border-red-500 hover:bg-red-600',
                                color === 'black' && 'bg-gray-800 border-gray-600 hover:bg-gray-700',
                                color === 'green' && 'bg-green-700 border-green-500 hover:bg-green-600',
                            )}
                        >
                            {num}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="flex justify-center gap-4">
                <BetButton type="color" value="red" display="Red" className="bg-red-700 border-red-500 hover:bg-red-600 text-white w-24"/>
                <BetButton type="color" value="black" display="Black" className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-white w-24"/>
                <BetButton type="parity" value="even" display="Even" className="bg-blue-700 border-blue-500 hover:bg-blue-600 text-white w-24"/>
                <BetButton type="parity" value="odd" display="Odd" className="bg-purple-700 border-purple-500 hover:bg-purple-600 text-white w-24"/>
            </div>
        </div>

        <div className='min-h-[50px]'>
            {bets.length > 0 && (
                <div className='flex flex-wrap gap-2 justify-center'>
                    <span className="font-bold">Your Bets:</span>
                    {bets.map((bet, i) => (
                        <Badge key={i} variant="secondary" className="text-md capitalize">
                            ${bet.amount} on {bet.value}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
        
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button onClick={handleSpin} disabled={spinning || bets.length === 0} size="lg" className="w-full max-w-xs text-xl font-bold h-16 bg-primary text-primary-foreground">
          {spinning ? 'Spinning...' : 'SPIN'}
        </Button>
      </CardFooter>
    </Card>
  );
}
