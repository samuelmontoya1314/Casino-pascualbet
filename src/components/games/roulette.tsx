'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
  const [finalAngle, setFinalAngle] = useState(0);

  const placeBet = (type: BetType, value?: number) => {
    if (spinning) return;
    if (betAmount > balance - totalBet) {
      setMessage("No tienes saldo suficiente para esta apuesta.");
      return;
    }
    const newBet: Bet = { type, value, amount: betAmount };
    setBets([...bets, newBet]);
    setMessage('');
  };

  const totalBet = bets.reduce((acc, b) => acc + b.amount, 0);

  const spinWheel = () => {
    if (bets.length === 0) {
      setMessage("¡Haz una apuesta antes de girar!");
      return;
    }

    onBalanceChange(-totalBet);
    setSpinning(true);
    setMessage('');
    setResult(null);

    const winningIndex = Math.floor(Math.random() * numbers.length);
    const winningNumber = numbers[winningIndex];
    const anglePerSegment = 360 / 37;
    const winningAngle = 360 * 6 - (anglePerSegment * winningIndex); // 6 full spins + final position
    setFinalAngle(winningAngle);
    
    setTimeout(() => {
      setResult(winningNumber);
      setSpinning(false);

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
        setMessage(`El número es ${winningNumber.num}. ¡Ganaste $${winnings - totalBet}!`);
      } else {
        setMessage(`El número es ${winningNumber.num}. Perdiste $${totalBet}.`);
      }

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
        <CardTitle className="text-3xl font-bold text-primary">Ruleta</CardTitle>
        <CardDescription>¡Haz tus apuestas y gira la ruleta!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="relative w-96 h-96 rounded-full border-8 border-yellow-600 bg-gray-800 flex items-center justify-center shadow-2xl overflow-hidden">
            <div 
              className={`absolute w-full h-full transition-transform duration-[4000ms] ease-out`}
              style={{
                  transform: spinning ? `rotate(${finalAngle}deg)`: (result ? `rotate(${finalAngle % 360}deg)` : 'none'),
              }}
            >
                {numbers.map(({num, color}, index) => (
                    <div key={num} className="absolute w-full h-full" style={{transform: `rotate(${(360 / 37) * index}deg)`}}>
                        <div className={`absolute top-0 left-1/2 -ml-4 w-8 h-1/2 pt-2 text-center font-bold text-white ${getNumberColorClass(color)}`} style={{transformOrigin: 'bottom center'}}>
                            {num}
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute top-[-10px] left-1/2 -ml-3 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white z-20"></div>
            <div className="absolute w-12 h-12 rounded-full bg-gray-900 border-4 border-yellow-700 z-10" />

            {result && !spinning && (
                <div className="absolute flex items-center justify-center w-24 h-24 rounded-full bg-background/80 z-20 animate-in zoom-in-50 duration-500">
                    <span className={`text-4xl font-bold ${result.color === 'red' ? 'text-red-500' : result.color === 'black' ? 'text-white' : 'text-green-500'}`}>
                        {result.num}
                    </span>
                </div>
            )}
        </div>
        
        {message && (
          <Alert className={cn('transition-opacity duration-300', message.includes('Ganaste') ? 'border-accent text-accent' : 'border-destructive text-destructive')}>
            <AlertTitle className="font-bold text-lg">{message}</AlertTitle>
          </Alert>
        )}

        <div className="w-full max-w-2xl">
            <div className="text-center mb-4">
                <Badge variant="secondary" className="text-lg">Apuesta Total: ${totalBet}</Badge>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              <Button onClick={() => placeBet('low')} className="bg-gray-700 hover:bg-gray-600">1-18</Button>
              <Button onClick={() => placeBet('even')} className="bg-gray-700 hover:bg-gray-600">Par</Button>
              <Button onClick={() => placeBet('red')} className="bg-red-600 hover:bg-red-500">Rojo</Button>
              <Button onClick={() => placeBet('black')} className="bg-gray-800 hover:bg-gray-700">Negro</Button>
              <Button onClick={() => placeBet('odd')} className="bg-gray-700 hover:bg-gray-600">Impar</Button>
              <Button onClick={() => placeBet('high')} className="bg-gray-700 hover:bg-gray-600">19-36</Button>
            </div>
            <div className="grid grid-cols-12 gap-1">
                {numbers.slice(1).map(({ num, color }) => (
                    <Button key={num} onClick={() => placeBet('straight', num)} variant="outline" className={`h-12 w-full p-0 text-xs ${getNumberColorClass(color)}`}>
                        {num}
                    </Button>
                ))}
                 <Button key={0} onClick={() => placeBet('straight', 0)} variant="outline" className={`h-12 w-full p-0 text-xs ${getNumberColorClass('green')} col-span-12 mt-1`}>
                    0
                </Button>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <span className="font-bold">Monto:</span>
                <Input type="number" value={betAmount} onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))} className="w-24" />
            </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg" onClick={spinWheel} disabled={spinning || bets.length === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            {spinning ? 'Girando...' : 'Girar'}
          </Button>
          <Button size="lg" onClick={clearBets} variant="secondary" disabled={spinning}>Limpiar Apuestas</Button>
        </div>
        
      </CardContent>
    </Card>
  );
};

export default RouletteGame;
