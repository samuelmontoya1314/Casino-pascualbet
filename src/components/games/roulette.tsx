'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

const numbers = [
  { num: 0, color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => ({
    num: i + 1,
    color: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(i + 1) ? 'red' : 'black',
  })),
];

type BetType = 'straight' | 'red' | 'black' | 'even' | 'odd' | 'low' | 'high';
type Bet = { type: BetType, value?: number, amount: number };

interface RouletteGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const RouletteGame: React.FC<RouletteGameProps> = ({ balance, onBalanceChange }) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ num: number; color: string } | null>(null);
  const [message, setMessage] = useState('');

  const placeBet = (type: BetType, value?: number) => {
    if (betAmount > balance - totalBet) {
      setMessage("Not enough balance for this bet.");
      return;
    }
    const newBet: Bet = { type, value, amount: betAmount };
    setBets([...bets, newBet]);
    setMessage('');
  };

  const totalBet = bets.reduce((acc, b) => acc + b.amount, 0);

  const spinWheel = () => {
    if (bets.length === 0) {
      setMessage("Place a bet before spinning!");
      return;
    }

    onBalanceChange(-totalBet);
    setSpinning(true);
    setMessage('');
    setResult(null);

    setTimeout(() => {
      const winningNumber = numbers[Math.floor(Math.random() * numbers.length)];
      setResult(winningNumber);

      let winnings = 0;
      bets.forEach(bet => {
        if (bet.type === 'straight' && bet.value === winningNumber.num) {
          winnings += bet.amount * 35;
        } else if (bet.type === 'red' && winningNumber.color === 'red') {
          winnings += bet.amount * 2;
        } else if (bet.type === 'black' && winningNumber.color === 'black') {
          winnings += bet.amount * 2;
        } else if (bet.type === 'even' && winningNumber.num !== 0 && winningNumber.num % 2 === 0) {
          winnings += bet.amount * 2;
        } else if (bet.type === 'odd' && winningNumber.num % 2 !== 0) {
          winnings += bet.amount * 2;
        } else if (bet.type === 'low' && winningNumber.num >= 1 && winningNumber.num <= 18) {
          winnings += bet.amount * 2;
        } else if (bet.type === 'high' && winningNumber.num >= 19 && winningNumber.num <= 36) {
          winnings += bet.amount * 2;
        }
      });
      
      if (winnings > 0) {
        onBalanceChange(winnings);
        setMessage(`The number is ${winningNumber.num}. You won $${winnings - totalBet}!`);
      } else {
        setMessage(`The number is ${winningNumber.num}. You lost $${totalBet}.`);
      }

      setSpinning(false);
    }, 4000); // 4 second spin
  };

  const clearBets = () => {
    setBets([]);
    setMessage('');
    setResult(null);
  };
  
  const getNumberColorClass = (color: string) => {
    if (color === 'red') return 'bg-red-600 hover:bg-red-500';
    if (color === 'black') return 'bg-gray-800 hover:bg-gray-700';
    return 'bg-green-600 hover:bg-green-500';
  }

  return (
    <Card className="w-full bg-card/70 border-primary shadow-2xl shadow-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Roulette</CardTitle>
        <CardDescription>Place your bets and spin the wheel!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="relative w-96 h-96 rounded-full border-8 border-yellow-600 bg-gray-800 flex items-center justify-center shadow-2xl">
            <div className={`absolute w-full h-full transition-transform duration-[4000ms] ease-out ${spinning ? 'rotate-[1440deg]' : ''}`}>
                {numbers.map(({num, color}, index) => (
                    <div key={num} className="absolute w-full h-full" style={{transform: `rotate(${(360 / 37) * index}deg)`}}>
                        <div className={`absolute top-0 left-1/2 -ml-4 w-8 h-1/2 pt-2 text-center font-bold text-white ${getNumberColorClass(color)}`} style={{transformOrigin: 'bottom center'}}>
                            {num}
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute w-4 h-4 rounded-full bg-white z-10" />
            <div 
              className="absolute top-0 left-1/2 -ml-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-16 border-t-white transform -translate-y-4"
              style={{
                  borderTopWidth: '16px',
                  transition: 'transform 0.3s',
                  transform: result && !spinning ? `translateY(-170px) rotate(${ (360/37) * numbers.findIndex(n => n.num === result.num) }deg)` : 'translateY(-4px)'
              }}
            />

            {result && !spinning && (
                <div className="absolute flex items-center justify-center w-24 h-24 rounded-full bg-background/80">
                    <span className={`text-4xl font-bold ${result.color === 'red' ? 'text-red-500' : result.color === 'black' ? 'text-white' : 'text-green-500'}`}>
                        {result.num}
                    </span>
                </div>
            )}
        </div>
        
        {message && (
          <Alert className={message.includes('won') ? 'border-accent text-accent' : 'border-destructive text-destructive'}>
            <AlertTitle className="font-bold text-lg">{message}</AlertTitle>
          </Alert>
        )}

        <div className="w-full max-w-2xl">
            <div className="text-center mb-4">
                <Badge variant="secondary" className="text-lg">Total Bet: ${totalBet}</Badge>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              <Button onClick={() => placeBet('low')} className="bg-gray-700 hover:bg-gray-600">1-18</Button>
              <Button onClick={() => placeBet('even')} className="bg-gray-700 hover:bg-gray-600">Even</Button>
              <Button onClick={() => placeBet('red')} className="bg-red-600 hover:bg-red-500">Red</Button>
              <Button onClick={() => placeBet('black')} className="bg-gray-800 hover:bg-gray-700">Black</Button>
              <Button onClick={() => placeBet('odd')} className="bg-gray-700 hover:bg-gray-600">Odd</Button>
              <Button onClick={() => placeBet('high')} className="bg-gray-700 hover:bg-gray-600">19-36</Button>
            </div>
            <div className="grid grid-cols-12 gap-1">
                {numbers.map(({ num, color }) => (
                    <Button key={num} onClick={() => placeBet('straight', num)} variant="outline" className={`h-12 w-full p-0 text-xs ${getNumberColorClass(color)}`}>
                        {num}
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
                <span className="font-bold">Amount:</span>
                <Input type="number" value={betAmount} onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))} className="w-24" />
            </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg" onClick={spinWheel} disabled={spinning || bets.length === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            {spinning ? 'Spinning...' : 'Spin'}
          </Button>
          <Button size="lg" onClick={clearBets} variant="secondary" disabled={spinning}>Clear Bets</Button>
        </div>
        
      </CardContent>
    </Card>
  );
};

export default RouletteGame;
