'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { BookOpen } from 'lucide-react';

const numbers = [
  { num: 0, color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => ({
    num: i + 1,
    color: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(i + 1) ? 'red' : 'black',
  })),
];

const wheelOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const orderedNumbers = wheelOrder.map(num => numbers.find(n => n.num === num)!);

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
    const totalBet = bets.reduce((acc, b) => acc + b.amount, 0);
    if (betAmount > balance - totalBet) {
      setMessage("No tienes saldo suficiente para esta apuesta.");
      return;
    }
    const newBet: Bet = { type, value, amount: betAmount };
    setBets([...bets, newBet]);
    setMessage('');
  };

  const totalBet = bets.reduce((acc, b) => acc + b.amount, 0);

  const spinWheel = useCallback(() => {
    if (spinning || bets.length === 0) return;
    if (totalBet > balance) {
        setMessage('Saldo insuficiente para esta apuesta.');
        return;
    }

    setResult(null);
    setMessage('');
    onBalanceChange(-totalBet);
    setSpinning(true);

    setTimeout(() => {
        const winningNumber = numbers[Math.floor(Math.random() * numbers.length)];
        const winningIndex = orderedNumbers.findIndex(n => n.num === winningNumber.num);

        const baseRotations = 360 * 5;
        const anglePerSegment = 360 / orderedNumbers.length;
        const winningAngle = baseRotations - (winningIndex * anglePerSegment) + (anglePerSegment/2);

        setFinalAngle(winningAngle);
        
        setTimeout(() => {
          let winnings = 0;
          bets.forEach(bet => {
            const { num, color } = winningNumber;
            if (bet.type === 'straight' && bet.value === num) {
              winnings += bet.amount * 35;
            } else if (bet.type === 'red' && color === 'red') {
              winnings += bet.amount * 2;
            } else if (bet.type === 'black' && color === 'black') {
              winnings += bet.amount * 2;
            } else if (bet.type === 'even' && num !== 0 && num % 2 === 0) {
              winnings += bet.amount * 2;
            } else if (bet.type === 'odd' && num % 2 !== 0) {
              winnings += bet.amount * 2;
            } else if (bet.type === 'low' && num >= 1 && num <= 18) {
              winnings += bet.amount * 2;
            } else if (bet.type === 'high' && num >= 19 && num <= 36) {
              winnings += bet.amount * 2;
            }
          });
          
          if (winnings > 0) {
            onBalanceChange(winnings);
            setMessage(`El número es ${winningNumber.num}. ¡Ganaste $${winnings}!`);
          } else {
            setMessage(`El número es ${winningNumber.num}. Suerte la próxima.`);
          }
          
          setResult(winningNumber);
          setSpinning(false);
          setBets([]);
        }, 4000); 
    }, 100);

  }, [spinning, bets, totalBet, balance, onBalanceChange]);
  
  const clearBets = () => {
    if(spinning) return;
    setBets([]);
    setMessage('');
    setResult(null);
  };
  
  const getNumberColorClass = (color: string) => {
    if (color === 'red') return 'bg-accent hover:bg-accent/80 text-white';
    if (color === 'black') return 'bg-gray-800 hover:bg-gray-700 text-white';
    return 'bg-green-600 hover:bg-green-500 text-white';
  }

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary uppercase">Ruleta</CardTitle>
        <CardDescription>¡Haz tus apuestas y gira!</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className={cn("relative w-96 h-96 rounded-full border-8 bg-secondary flex items-center justify-center shadow-inner overflow-hidden", spinning ? 'border-primary' : 'border-border')}>
            <div 
              className={cn(`absolute w-full h-full`)}
              style={{
                  transform: `rotate(${finalAngle}deg)`,
                  transition: spinning ? 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              }}
            >
                {orderedNumbers.map(({num, color}, index) => (
                    <div key={num} className="absolute w-full h-full" style={{transform: `rotate(${(360 / 37) * index}deg)`}}>
                        <div className={`absolute top-0 left-1/2 -ml-4 w-8 h-1/2 pt-2 text-center font-bold text-white ${color === 'red' ? 'bg-accent' : color === 'black' ? 'bg-gray-900' : 'bg-green-600' }`} style={{transformOrigin: 'bottom center'}}>
                            {num}
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute top-[-10px] left-1/2 -ml-3 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white z-20"></div>
            <div className="absolute w-12 h-12 rounded-full bg-secondary border-4 border-border z-10" />

            {result && !spinning && (
                <div className="absolute flex items-center justify-center w-24 h-24 rounded-full bg-background/80 z-20 animate-in zoom-in-50 duration-500">
                    <span className={`text-4xl font-bold ${result.color === 'red' ? 'text-accent' : result.color === 'black' ? 'text-foreground' : 'text-green-500'}`}>
                        {result.num}
                    </span>
                </div>
            )}
        </div>
        
        {message && (
          <Alert variant={message.includes('Ganaste') ? 'default' : 'destructive'} className={cn('transition-opacity duration-300 min-h-[60px]', message.includes('Ganaste') ? 'pixel-border pixel-border-primary text-primary' : message ? 'border-destructive text-destructive' : 'border-transparent')}>
            <AlertTitle className="font-bold text-lg uppercase text-center">{message}</AlertTitle>
          </Alert>
        )}

        <div className="w-full max-w-2xl">
            <div className="text-center mb-4">
                <Badge variant="secondary" className="text-lg">Apuesta Total: ${totalBet}</Badge>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              <Button onClick={() => placeBet('low')} className="bg-gray-700 hover:bg-gray-600 text-white uppercase">1-18</Button>
              <Button onClick={() => placeBet('even')} className="bg-gray-700 hover:bg-gray-600 text-white uppercase">Par</Button>
              <Button onClick={() => placeBet('red')} className="bg-accent hover:bg-accent/80 text-white uppercase">Rojo</Button>
              <Button onClick={() => placeBet('black')} className="bg-gray-800 hover:bg-gray-700 text-white uppercase">Negro</Button>
              <Button onClick={() => placeBet('odd')} className="bg-gray-700 hover:bg-gray-600 text-white uppercase">Impar</Button>
              <Button onClick={() => placeBet('high')} className="bg-gray-700 hover:bg-gray-600 text-white uppercase">19-36</Button>
            </div>
            <div className="grid grid-cols-12 gap-1">
                {numbers.slice(1).sort((a,b) => a.num - b.num).map(({ num, color }) => (
                    <Button key={num} onClick={() => placeBet('straight', num)} variant="outline" className={`h-12 w-full p-0 text-xs ${getNumberColorClass(color)}`}>
                        {num}
                    </Button>
                ))}
                 <Button key={0} onClick={() => placeBet('straight', 0)} variant="outline" className={`h-12 w-full p-0 text-xs ${getNumberColorClass('green')} col-span-12 mt-1`}>
                    0
                </Button>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <span className="font-bold uppercase">Monto:</span>
                <Input type="number" value={betAmount} onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 1))} className="w-24" />
            </div>
        </div>

        <div className="flex gap-4 min-h-[52px]">
          <Button size="lg" onClick={spinWheel} disabled={spinning || bets.length === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">
            {spinning ? 'Girando...' : 'Girar'}
          </Button>
          <Button size="lg" onClick={clearBets} variant="secondary" disabled={spinning} className="uppercase">Limpiar</Button>
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
                    <p><strong>Objetivo:</strong> Adivina en qué número, color o sección caerá la bola.</p>
                    <p><strong>Reglas:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Establece el monto de tu ficha.</li>
                        <li>Haz clic en los números o zonas del tapete para hacer tus apuestas.</li>
                        <li>Puedes hacer varias apuestas en una misma ronda.</li>
                        <li>Pulsa "Girar" para que la bola comience a rodar.</li>
                        <li>Los premios varían según el tipo de apuesta (Número individual paga más, Rojo/Negro paga menos).</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        
      </CardContent>
    </Card>
  );
};

export default RouletteGame;
