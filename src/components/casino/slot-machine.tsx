'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Diamond, Heart, Club, Spade } from 'lucide-react';

const symbols = [
  { icon: <Diamond className="h-16 w-16 text-red-500" />, name: 'diamond' },
  { icon: <Heart className="h-16 w-16 text-red-500" />, name: 'heart' },
  { icon: <Club className="h-16 w-16 text-gray-400" />, name: 'club' },
  { icon: <Spade className="h-16 w-16 text-gray-400" />, name: 'spade' },
  { icon: <span className="text-5xl font-bold text-yellow-500">7</span>, name: 'seven' },
  { icon: <span className="text-5xl font-bold text-yellow-400">BAR</span>, name: 'bar' },
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

export default function SlotMachine() {
  const [reels, setReels] = useState([symbols[0], symbols[1], symbols[2]]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (!spinning) {
      const [r1, r2, r3] = reels;
      if (r1.name === r2.name && r2.name === r3.name) {
        setResult(`Jackpot! You won with three ${r1.name}s!`);
      } else {
        setResult('');
      }
    }
  }, [spinning, reels]);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult('');
    let spinCount = 0;
    const interval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      spinCount++;
      if (spinCount > 15) {
        clearInterval(interval);
        setSpinning(false);
        setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      }
    }, 100);
  };

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
          disabled={spinning}
          size="lg"
          className="w-full max-w-xs text-xl font-bold h-16 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          {spinning ? 'Spinning...' : 'SPIN TO WIN'}
        </Button>
        <p className="text-xs text-muted-foreground">Match three symbols to win the jackpot!</p>
      </CardFooter>
    </Card>
  );
}
