
'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CircleDot } from 'lucide-react';

interface PlinkoGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const riskMultipliers = {
  low: {
    8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    16: [16, 9, 2, 1.4, 1.1, 1, 0.5, 1, 0.5, 1, 1.1, 1.4, 2, 9, 16],
  },
  medium: {
    8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    16: [110, 15, 5, 3, 1.5, 0.5, 0.3, 0.2, 0.3, 0.5, 1.5, 3, 5, 15, 110],
  },
  high: {
    8: [29, 4, 1.5, 0.3, 0, 0.3, 1.5, 4, 29],
    16: [1000, 32, 10, 4, 2, 0.3, 0.2, 0.1, 0.2, 0.3, 2, 4, 10, 32, 1000],
  },
};

const getSafeMultipliers = (risk: 'low' | 'medium' | 'high', rows: number) => {
    if (rows < 12) return riskMultipliers[risk][8];
    return riskMultipliers[risk][16].slice(0, rows + 1);
}

const PlinkoGame: React.FC<PlinkoGameProps> = ({ balance, onBalanceChange }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [rows, setRows] = useState(8);
  const [isDropping, setIsDropping] = useState(false);
  const [ballPosition, setBallPosition] = useState<{ top: number, left: number, path: number[] } | null>(null);
  const [outcome, setOutcome] = useState<{ multiplier: number; winnings: number } | null>(null);

  const multipliers = useMemo(() => getSafeMultipliers(risk, rows), [risk, rows]);

  const handleDropBall = useCallback(() => {
    if (isDropping || balance < betAmount) return;

    setIsDropping(true);
    setOutcome(null);
    onBalanceChange(-betAmount);

    let currentPath: number[] = [];
    let currentLeftOffset = 0; // -0.5 for left, 0.5 for right

    // Initial position
    setBallPosition({ top: 0, left: 50, path: [] });

    const animateDrop = (row: number) => {
      if (row > rows) {
        // Animation finished, calculate outcome
        const finalIndex = Math.round((currentLeftOffset + (rows / 2)));
        const safeIndex = Math.max(0, Math.min(multipliers.length - 1, finalIndex));
        const multiplier = multipliers[safeIndex];
        const winnings = betAmount * multiplier;
        onBalanceChange(winnings);

        setOutcome({ multiplier, winnings });
        setIsDropping(false);
        setBallPosition(null);
        return;
      }

      const direction = Math.random() < 0.5 ? -0.5 : 0.5;
      currentLeftOffset += direction;
      currentPath.push(direction);
      
      const newTop = (row / (rows + 1)) * 100;
      const newLeft = 50 + (currentLeftOffset / (rows + 1)) * 100;
      
      setBallPosition({ top: newTop, left: newLeft, path: [...currentPath] });

      setTimeout(() => animateDrop(row + 1), 250);
    };

    animateDrop(1);

  }, [isDropping, balance, betAmount, rows, onBalanceChange, multipliers]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setBetAmount(value);
    }
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 100) return 'bg-red-500/80 text-white';
    if (multiplier >= 10) return 'bg-orange-500/80 text-white';
    if (multiplier >= 2) return 'bg-yellow-500/80 text-black';
    if (multiplier > 1) return 'bg-green-500/80 text-white';
    if (multiplier === 1) return 'bg-blue-500/80 text-white';
    return 'bg-gray-500/80 text-white';
  };

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border overflow-hidden">
      <CardContent className="flex flex-col md:flex-row p-0">
        {/* Controls Panel */}
        <div className="w-full md:w-80 bg-secondary/30 p-4 space-y-6 border-r border-border">
          <div>
            <label className="text-sm font-bold uppercase text-muted-foreground">Bet Amount</label>
            <Input
              type="number"
              value={betAmount}
              onChange={handleBetChange}
              className="mt-1 bg-input h-12 text-lg"
              disabled={isDropping}
            />
          </div>

          <div>
            <label className="text-sm font-bold uppercase text-muted-foreground">Risk</label>
            <ToggleGroup
              type="single"
              value={risk}
              onValueChange={(value: 'low' | 'medium' | 'high') => value && setRisk(value)}
              className="grid grid-cols-3 mt-1"
              disabled={isDropping}
            >
              <ToggleGroupItem value="low" className="h-12 text-base">Low</ToggleGroupItem>
              <ToggleGroupItem value="medium" className="h-12 text-base">Medium</ToggleGroupItem>
              <ToggleGroupItem value="high" className="h-12 text-base">High</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <label className="text-sm font-bold uppercase text-muted-foreground">Number of Rows</label>
             <ToggleGroup
                type="single"
                value={String(rows)}
                onValueChange={(value) => value && setRows(Number(value))}
                className="grid grid-cols-5 gap-1 mt-1"
                disabled={isDropping}
            >
                {[8, 9, 10, 11, 12, 13, 14, 15, 16].map(num => (
                    <ToggleGroupItem key={num} value={String(num)} className="h-10 w-full">{num}</ToggleGroupItem>
                ))}
            </ToggleGroup>
          </div>

          <Button onClick={handleDropBall} disabled={isDropping || balance < betAmount} size="lg" className="w-full h-16 text-xl uppercase font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
            {isDropping ? 'Dropping...' : 'Bet'}
          </Button>
        </div>

        {/* Game Board */}
        <div className="flex-1 flex flex-col items-center justify-between p-4 min-h-[600px] bg-background/50">
          <div className="w-full h-full relative">
            {/* Pegs */}
            {Array.from({ length: rows + 1 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center" style={{ marginBottom: `${24 / rows}%`}}>
                {Array.from({ length: rowIndex + 1 }).map((_, pegIndex) => (
                  <div key={pegIndex} className="w-3 h-3 bg-border rounded-full" style={{ margin: `0 ${30 / rows}%` }} />
                ))}
              </div>
            ))}

            {/* Ball */}
            {ballPosition && (
              <div
                className="absolute w-5 h-5 bg-primary rounded-full border-2 border-primary-foreground shadow-lg"
                style={{
                  top: `${ballPosition.top}%`,
                  left: `${ballPosition.left}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'top 0.25s ease-out, left 0.25s ease-out',
                }}
              />
            )}
          </div>
          
          {/* Multipliers */}
          <div className="w-full flex justify-center gap-1 mt-4">
            {multipliers.map((m, i) => (
               <div
                  key={i}
                  className={cn(
                    'flex-1 text-center text-xs font-bold py-2 rounded-md transition-all duration-300', 
                    getMultiplierColor(m),
                    outcome?.multiplier === m && 'scale-125 ring-2 ring-primary-foreground'
                   )}
                   style={{
                       maxWidth: '60px',
                   }}
                >
                {m}x
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlinkoGame;
