'use client';
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from '../ui/badge';

interface PlinkoGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const riskMultipliers = {
  low: { 8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6], 16: [16, 9, 2, 1.4, 1.1, 1, 0.5, 1, 0.5, 1, 1.1, 1.4, 2, 9, 16] },
  medium: { 8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13], 16: [110, 15, 5, 3, 1.5, 0.5, 0.3, 0.2, 0.3, 0.5, 1.5, 3, 5, 15, 110] },
  high: { 8: [29, 4, 1.5, 0.3, 0, 0.3, 1.5, 4, 29], 16: [1000, 32, 10, 4, 2, 0.3, 0.2, 0.1, 0.2, 0.3, 2, 4, 10, 32, 1000] },
};

const getSafeMultipliers = (risk: 'low' | 'medium' | 'high', rows: number): number[] => {
  const base = rows <= 11 ? riskMultipliers[risk][8] : riskMultipliers[risk][16];
  const midPoint = Math.floor(base.length / 2);
  const rowCountForMultipliers = Math.floor(rows/2) * 2 + 1;
  
  if (rows > base.length) {
     const start = midPoint - Math.floor(base.length / 2);
     const end = start + base.length;
     return base.slice(start, end);
  }

  const start = midPoint - Math.floor(rowCountForMultipliers / 2);
  const end = start + rowCountForMultipliers;
  
  return base.slice(start, end);
};


const PEG_MARGIN_Y = 32;
const BUCKET_WIDTH = 60;
const BUCKET_GAP = 4;

const PlinkoGame: React.FC<PlinkoGameProps> = ({ balance, onBalanceChange }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [rows, setRows] = useState(8);
  const [isDropping, setIsDropping] = useState(false);
  const [history, setHistory] = useState<{ multiplier: number; profit: number }[]>([]);
  const [winningMultiplierIndex, setWinningMultiplierIndex] = useState<number | null>(null);
  
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [autoBetCount, setAutoBetCount] = useState(10);
  const [isAutoBetting, setIsAutoBetting] = useState(false);
  const [showBall, setShowBall] = useState(false);
  const [ballColor, setBallColor] = useState('hsl(var(--primary))');

  const multipliers = useMemo(() => getSafeMultipliers(risk, rows), [risk, rows]);

  const pegMarginX = useMemo(() => {
    const bucketRowWidth = multipliers.length * BUCKET_WIDTH + (multipliers.length - 1) * BUCKET_GAP;
    return bucketRowWidth / (multipliers.length);
  }, [multipliers]);


  const calculateOutcome = useCallback(() => {
    let finalBucketIndex = 0;
    for (let i = 0; i < rows; i++) {
        finalBucketIndex += (Math.random() < 0.5 ? -0.5 : 0.5);
    }
    const finalIndex = Math.round(finalBucketIndex + (multipliers.length-1)/2);
    return Math.max(0, Math.min(multipliers.length - 1, finalIndex));
  }, [rows, multipliers.length]);

  const dropSingleBall = useCallback(() => {
    if (balance < betAmount) {
      if (mode === 'auto') setIsAutoBetting(false);
      return Promise.resolve();
    }
    
    return new Promise<void>((resolve) => {
        setIsDropping(true);
        setWinningMultiplierIndex(null);
        onBalanceChange(-betAmount);
        
        const finalIndex = calculateOutcome();
        const multiplier = multipliers[finalIndex];
        const winnings = betAmount * multiplier;
        
        setBallColor(multiplier >= 2 ? 'hsl(var(--primary))' : multiplier > 0.5 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))');
        setShowBall(true);
        
        setTimeout(() => {
            setShowBall(false);
            const profit = winnings;
            onBalanceChange(profit);
            setWinningMultiplierIndex(finalIndex);
            setHistory(prev => [{ multiplier, profit: profit - betAmount }, ...prev.slice(0, 14)]);
            setIsDropping(false);
            resolve();
        }, 1000);
    })

  }, [betAmount, balance, multipliers, calculateOutcome, onBalanceChange, mode]);
  
  const handleBet = async () => {
    if (isAutoBetting || isDropping) return;

    if(mode === 'manual') {
      await dropSingleBall();
    } else { // Auto mode
      setIsAutoBetting(true);
      let betsLeft = autoBetCount;
      
      const runAutoBet = async () => {
        if (betsLeft > 0 && balance >= betAmount && document.visibilityState === 'visible') {
           await dropSingleBall();
           betsLeft--;
           setTimeout(runAutoBet, 300);
        } else {
           setIsAutoBetting(false);
        }
      }
      runAutoBet();
    }
  }


  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBetAmount(isNaN(value) || value <= 0 ? 1 : value);
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 100) return 'bg-red-500/80 text-white';
    if (multiplier >= 10) return 'bg-orange-400/80 text-white';
    if (multiplier >= 2) return 'bg-yellow-400/80 text-black';
    if (multiplier > 1) return 'bg-primary/80 text-primary-foreground';
    if (multiplier === 1) return 'bg-blue-500/80 text-white';
    return 'bg-muted/80 text-muted-foreground';
  };
  
  const getHistoryColor = (multiplier: number) => {
    if (multiplier > 1) return 'bg-primary/30 text-primary';
    return 'bg-muted text-muted-foreground';
  }
  
  const isBettingDisabled = isDropping || isAutoBetting;

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border overflow-hidden">
      <CardContent className="flex flex-col-reverse md:flex-row p-0">
        <div className="w-full md:w-[280px] bg-secondary/30 p-4 space-y-4 border-r border-border flex flex-col">
          <div className='flex-grow space-y-4'>
             <div>
                <ToggleGroup type="single" value={mode} onValueChange={(value: 'manual' | 'auto') => value && setMode(value)} className="grid grid-cols-2" disabled={isBettingDisabled}>
                    <ToggleGroupItem value="manual" className="h-12 text-base">Manual</ToggleGroupItem>
                    <ToggleGroupItem value="auto" className="h-12 text-base">Auto</ToggleGroupItem>
                </ToggleGroup>
            </div>
            
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Monto de Apuesta</label>
              <div className="flex gap-1 mt-1">
                 <Input type="number" value={betAmount} onChange={handleBetChange} className="bg-input h-12 text-lg font-bold flex-grow" disabled={isBettingDisabled} />
                 <Button onClick={() => setBetAmount(betAmount / 2)} variant="secondary" className="h-12" disabled={isBettingDisabled || betAmount <= 1}>½</Button>
                 <Button onClick={() => setBetAmount(betAmount * 2)} variant="secondary" className="h-12" disabled={isBettingDisabled}>2x</Button>
              </div>
            </div>
            
            {mode === 'auto' && (
               <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Número de Apuestas</label>
                <Input 
                  type="number" 
                  value={autoBetCount} 
                  onChange={(e) => setAutoBetCount(Math.max(1, parseInt(e.target.value) || 1))} 
                  className="bg-input h-12 text-lg font-bold w-full mt-1" 
                  disabled={isBettingDisabled} 
                />
               </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Riesgo</label>
              <ToggleGroup type="single" value={risk} onValueChange={(value: 'low' | 'medium' | 'high') => value && setRisk(value)} className="grid grid-cols-3 mt-1" disabled={isBettingDisabled}>
                <ToggleGroupItem value="low" className="h-12 text-base">Bajo</ToggleGroupItem>
                <ToggleGroupItem value="medium" className="h-12 text-base">Medio</ToggleGroupItem>
                <ToggleGroupItem value="high" className="h-12 text-base">Alto</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Filas</label>
              <ToggleGroup type="single" value={String(rows)} onValueChange={(value) => value && setRows(Number(value))} className="grid grid-cols-5 gap-1 mt-1" disabled={isBettingDisabled}>
                {[8, 10, 12, 14, 16].map(num => <ToggleGroupItem key={num} value={String(num)} className="h-10 w-full">{num}</ToggleGroupItem>)}
              </ToggleGroup>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
                onClick={handleBet} 
                disabled={isBettingDisabled || balance < betAmount} 
                size="lg" 
                className="w-full h-16 text-xl uppercase font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isAutoBetting ? `Parar (${autoBetCount})` : 'Apostar'}
            </Button>
             <div className="flex gap-2 overflow-x-auto pb-2">
                {history.map((item, i) => (
                    <Badge key={i} className={cn("text-xs font-bold whitespace-nowrap", getHistoryColor(item.multiplier))}>
                        {item.multiplier}x
                    </Badge>
                ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-end p-4 min-h-[500px] md:min-h-[600px] bg-background/50 relative overflow-hidden">
             <div className="absolute inset-0 w-full h-full" style={{
                background: 'radial-gradient(ellipse at top, hsl(var(--primary) / 0.1), transparent 70%)'
            }}></div>
            <div className="flex flex-col items-center">
              <div className="relative" style={{ height: rows * PEG_MARGIN_Y + 50 }}>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center" style={{ height: PEG_MARGIN_Y }}>
                    {Array.from({ length: rowIndex + 2 }).map((_, pegIndex) => {
                       const leftOffset = (pegIndex - (rowIndex + 1) / 2) * pegMarginX;
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
                {showBall && (
                    <div 
                        className="absolute z-10 w-4 h-4 rounded-full border-2 border-white/50 animate-plinko-ball-drop"
                        style={{
                            background: ballColor,
                            boxShadow: `0 0 10px ${ballColor}`,
                            left: 'calc(50% - 8px)',
                            top: 0
                        }}
                    />
                )}
              </div>
              <div className="flex justify-center gap-1 mt-4">
                  {multipliers.map((m, i) => {
                      const isWinner = winningMultiplierIndex === i;
                      return (
                         <div
                            key={i}
                            className={cn(
                              'flex items-center justify-center text-xs font-bold py-3 rounded-md transition-all duration-300',
                              'transform-gpu',
                              getMultiplierColor(m),
                              isWinner && 'animate-plinko-win'
                             )}
                             style={{ width: `${BUCKET_WIDTH}px` }}
                          >
                          {m}x
                        </div>
                      )
                  })}
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlinkoGame;
