
'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface PlinkoGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

type Ball = {
  id: number;
  path: number[];
  finalMultiplier: number;
  winnings: number;
  color: string;
};

const riskMultipliers = {
  low: { 8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6], 16: [16, 9, 2, 1.4, 1.1, 1, 0.5, 1, 0.5, 1, 1.1, 1.4, 2, 9, 16] },
  medium: { 8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13], 16: [110, 15, 5, 3, 1.5, 0.5, 0.3, 0.2, 0.3, 0.5, 1.5, 3, 5, 15, 110] },
  high: { 8: [29, 4, 1.5, 0.3, 0, 0.3, 1.5, 4, 29], 16: [1000, 32, 10, 4, 2, 0.3, 0.2, 0.1, 0.2, 0.3, 2, 4, 10, 32, 1000] },
};

const getSafeMultipliers = (risk: 'low' | 'medium' | 'high', rows: number): number[] => {
  const base = rows <= 11 ? riskMultipliers[risk][8] : riskMultipliers[risk][16];
  const midPoint = Math.floor(base.length / 2);
  const halfRows = Math.floor(rows / 2);
  const start = midPoint - halfRows;
  const end = midPoint + halfRows + 1;
  return base.slice(start, end);
};

const PlinkoGame: React.FC<PlinkoGameProps> = ({ balance, onBalanceChange }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [rows, setRows] = useState(8);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [isDropping, setIsDropping] = useState(false);
  const [history, setHistory] = useState<{ multiplier: number; profit: number }[]>([]);

  const multipliers = useMemo(() => getSafeMultipliers(risk, rows), [risk, rows]);

  const handleDropBall = useCallback(() => {
    if (isDropping || balance < betAmount) return;

    setIsDropping(true);
    onBalanceChange(-betAmount);

    let path: number[] = [];
    let currentOffset = 0;
    for (let i = 0; i < rows; i++) {
      const direction = Math.random() < 0.5 ? -0.5 : 0.5;
      path.push(direction);
      currentOffset += direction;
    }

    const finalIndex = Math.round(currentOffset + Math.floor(rows / 2));
    const safeIndex = Math.max(0, Math.min(multipliers.length - 1, finalIndex));
    const multiplier = multipliers[safeIndex];
    const winnings = betAmount * multiplier;
    
    const newBall: Ball = {
      id: Date.now(),
      path,
      finalMultiplier: multiplier,
      winnings,
      color: multiplier > 1 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
    };

    setBalls(prev => [...prev, newBall]);

    setTimeout(() => {
      onBalanceChange(winnings);
      setHistory(prev => [{ multiplier, profit: winnings - betAmount }, ...prev.slice(0, 14)]);
      setIsDropping(false);
    }, (rows + 1) * 150 + 500); // Wait for animation to finish

  }, [isDropping, balance, betAmount, rows, onBalanceChange, multipliers]);

  useEffect(() => {
    if (balls.length > 5) {
      setTimeout(() => setBalls(prev => prev.slice(1)), 1000);
    }
  }, [balls]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBetAmount(isNaN(value) || value <= 0 ? 1 : value);
  };

  const getMultiplierColor = (multiplier: number, forHistory = false) => {
    if (multiplier >= 100) return 'bg-red-500/80 text-white';
    if (multiplier >= 10) return 'bg-orange-400/80 text-white';
    if (multiplier >= 2) return 'bg-yellow-400/80 text-black';
    if (multiplier > 1) return forHistory ? 'bg-primary/30 text-primary' : 'bg-primary/80 text-primary-foreground';
    if (multiplier === 1) return 'bg-blue-500/80 text-white';
    return 'bg-muted/80 text-muted-foreground';
  };

  const PEG_DIAMETER = 12;
  const PEG_MARGIN_X = 38;
  const PEG_MARGIN_Y = 32;

  const BallComponent = ({ ball }: { ball: Ball }) => {
    const xPath = ball.path.reduce((acc, dir) => [...acc, acc[acc.length - 1] + dir * PEG_MARGIN_X], [0]);
    const yPath = Array.from({ length: rows + 1 }, (_, i) => i * PEG_MARGIN_Y);

    return (
      <motion.div
        initial={{ x: 0, y: -20, opacity: 0 }}
        animate={{
          x: xPath.map(x => x),
          y: yPath,
          opacity: 1,
        }}
        transition={{
          duration: (rows + 1) * 0.15,
          ease: 'linear',
          x: { type: 'spring', stiffness: 200, damping: 20 }
        }}
        className="absolute z-10 w-4 h-4 rounded-full border-2 border-white/50"
        style={{
          top: 20,
          left: `calc(50% - 8px)`,
          background: ball.color,
          boxShadow: `0 0 10px ${ball.color}`,
        }}
      />
    );
  };

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border overflow-hidden">
      <CardContent className="flex flex-col-reverse md:flex-row p-0">
        <div className="w-full md:w-[280px] bg-secondary/30 p-4 space-y-4 border-r border-border flex flex-col">
          <div className='flex-grow space-y-4'>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Monto de Apuesta</label>
              <div className="flex gap-1 mt-1">
                 <Input type="number" value={betAmount} onChange={handleBetChange} className="bg-input h-12 text-lg font-bold flex-grow" disabled={isDropping} />
                 <Button onClick={() => setBetAmount(betAmount / 2)} variant="secondary" className="h-12" disabled={isDropping}>½</Button>
                 <Button onClick={() => setBetAmount(betAmount * 2)} variant="secondary" className="h-12" disabled={isDropping}>2x</Button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Riesgo</label>
              <ToggleGroup type="single" value={risk} onValueChange={(value: 'low' | 'medium' | 'high') => value && setRisk(value)} className="grid grid-cols-3 mt-1" disabled={isDropping}>
                <ToggleGroupItem value="low" className="h-12 text-base">Bajo</ToggleGroupItem>
                <ToggleGroupItem value="medium" className="h-12 text-base">Medio</ToggleGroupItem>
                <ToggleGroupItem value="high" className="h-12 text-base">Alto</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Filas</label>
              <ToggleGroup type="single" value={String(rows)} onValueChange={(value) => value && setRows(Number(value))} className="grid grid-cols-5 gap-1 mt-1" disabled={isDropping}>
                {[8, 10, 12, 14, 16].map(num => <ToggleGroupItem key={num} value={String(num)} className="h-10 w-full">{num}</ToggleGroupItem>)}
              </ToggleGroup>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleDropBall} disabled={isDropping || balance < betAmount} size="lg" className="w-full h-16 text-xl uppercase font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
              {isDropping ? 'Apostando...' : 'Apostar'}
            </Button>
             <div className="flex gap-2 overflow-x-auto pb-2">
                {history.map((item, i) => (
                    <Badge key={i} className={cn("text-xs font-bold whitespace-nowrap", getMultiplierColor(item.multiplier, true))}>
                        {item.multiplier}x
                    </Badge>
                ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-between p-4 min-h-[500px] md:min-h-[600px] bg-background/50 relative overflow-hidden">
            <div className="absolute w-full h-full" style={{
                background: 'radial-gradient(ellipse at top, hsl(var(--primary) / 0.1), transparent 60%)'
            }}></div>
            <div className="flex-grow w-full flex items-center justify-center">
                <div className="relative" style={{ height: rows * PEG_MARGIN_Y + 50 }}>
                  {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center" style={{ height: PEG_MARGIN_Y }}>
                      {Array.from({ length: rowIndex + 1 }).map((_, pegIndex) => {
                         const leftOffset = (pegIndex - rowIndex / 2) * PEG_MARGIN_X;
                         return (
                            <div
                                key={pegIndex}
                                className="absolute w-3 h-3 bg-border rounded-full shadow-md"
                                style={{ top: rowIndex * PEG_MARGIN_Y + 30, left: `calc(50% + ${leftOffset}px - 6px)` }}
                            />
                         )
                      })}
                    </div>
                  ))}
                  <AnimatePresence>
                    {balls.map(ball => <BallComponent key={ball.id} ball={ball} />)}
                  </AnimatePresence>
                </div>
            </div>
            <div className="w-full flex justify-center gap-1 p-2">
                {multipliers.map((m, i) => {
                    const isWinner = balls.length > 0 && !isDropping && balls[balls.length - 1].finalMultiplier === m;
                    return (
                       <div
                          key={i}
                          className={cn(
                            'flex-1 text-center text-xs font-bold py-3 rounded-md transition-all duration-300',
                            'transform-gpu',
                            getMultiplierColor(m),
                            isWinner && 'animate-plinko-win'
                           )}
                           style={{ maxWidth: '60px' }}
                        >
                        {m}x
                      </div>
                    )
                })}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlinkoGame;
