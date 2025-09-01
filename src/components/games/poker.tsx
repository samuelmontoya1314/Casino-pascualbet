'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { BookOpen } from 'lucide-react';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type CardType = { suit: Suit; rank: Rank };
type Hand = CardType[];

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUES: Record<Rank, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

const createDeck = (): CardType[] => {
  return SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank })));
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const GameCard = ({ card, isSelected, onClick, style, className }: { card: CardType; isSelected?: boolean; onClick?: () => void, style?: React.CSSProperties, className?: string }) => {
  const cardColor = card.suit === '♥' || card.suit === '♦' ? 'text-accent' : 'text-foreground';
  return (
    <div 
        onClick={onClick}
        style={style}
        className={cn('w-24 h-36 rounded-none bg-card border-2 flex flex-col justify-between p-2 transition-all duration-200 font-mono', cardColor, onClick ? 'cursor-pointer' : '', isSelected ? 'border-primary transform -translate-y-2' : 'border-border', className)}
    >
      <div className="text-2xl font-bold">{card.rank}</div>
      <div className="text-4xl text-center">{card.suit}</div>
      <div className="text-2xl font-bold self-end transform rotate-180">{card.rank}</div>
    </div>
  );
};

// Jacks or Better hand evaluation
const evaluateHand = (hand: Hand): { name: string; payout: number } => {
    const ranks = hand.map(c => RANK_VALUES[c.rank]).sort((a, b) => a - b);
    const suits = hand.map(c => c.suit);
    const rankCounts = ranks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);
    const counts = Object.values(rankCounts).sort((a, b) => b - a);

    const isFlush = new Set(suits).size === 1;
    const isStraight = (ranks[4] - ranks[0] === 4 && new Set(ranks).size === 5) || (ranks[0] === 2 && ranks[1] === 3 && ranks[2] === 4 && ranks[3] === 5 && ranks[4] === 14);
    
    if (isStraight && isFlush && ranks[4] === 14 && ranks[3] === 13) return { name: 'Escalera Real', payout: 250 };
    if (isStraight && isFlush) return { name: 'Escalera de Color', payout: 50 };
    if (counts[0] === 4) return { name: 'Póker', payout: 25 };
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Full House', payout: 9 };
    if (isFlush) return { name: 'Color', payout: 6 };
    if (isStraight) return { name: 'Escalera', payout: 4 };
    if (counts[0] === 3) return { name: 'Trío', payout: 3 };
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Doble Pareja', payout: 2 };
    if (counts[0] === 2 && Object.keys(rankCounts).some(r => Number(r) >= 11 && rankCounts[Number(r) as keyof typeof rankCounts] === 2)) return { name: 'Jotas o Mejor', payout: 1 };
    
    return { name: 'Nada. Inténtalo de nuevo', payout: 0 };
};


interface PokerGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const PokerGame: React.FC<PokerGameProps> = ({ balance, onBalanceChange }) => {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<Hand>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [bet, setBet] = useState(5);
  const [gameState, setGameState] = useState<'betting' | 'dealt' | 'drawing' | 'finished'>('betting');
  const [message, setMessage] = useState('');
  const [handResult, setHandResult] = useState<{name: string, payout: number} | null>(null);

   const startNewRound = useCallback(() => {
    if (balance < bet) {
      setMessage("Saldo insuficiente.");
      return;
    }
    
    onBalanceChange(-bet);
    const newDeck = shuffleDeck(createDeck());
    const initialHand = [newDeck.pop()!, newDeck.pop()!, newDeck.pop()!, newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand([]);
    setHeld([false, false, false, false, false]);
    setGameState('dealt');
    setMessage('');
    setHandResult(null);

    let tempHand: Hand = [];
    initialHand.forEach((card, index) => {
        setTimeout(() => {
            tempHand.push(card);
            setPlayerHand([...tempHand]);
        }, index * 100);
    });

  }, [balance, bet, onBalanceChange]);

  const handleHold = (index: number) => {
    if (gameState !== 'dealt') return;
    const newHeld = [...held];
    newHeld[index] = !newHeld[index];
    setHeld(newHeld);
  };
  
  const handleDraw = () => {
    if (gameState !== 'dealt') return;
    
    setGameState('drawing');
    const newDeck = [...deck];
    let newHand = [...playerHand];
    
    for (let i = 0; i < 5; i++) {
        if (!held[i]) {
            newHand[i] = newDeck.pop()!;
        }
    }
    
    setDeck(newDeck);
    setPlayerHand(newHand);
    const result = evaluateHand(newHand);
    setHandResult(result);
    setGameState('finished');
    
    if (result.payout > 0) {
        const winnings = bet * result.payout;
        setMessage(`¡${result.name}! Ganas $${winnings}.`);
        onBalanceChange(winnings);
    } else {
        setMessage(result.name);
    }
  };

  const handleBetChange = (amount: number) => {
    const newBet = bet + amount;
    if (newBet > 0 && newBet <= balance) {
        setBet(newBet);
    }
  }

  const PAYOUT_TABLE = [
    { name: 'Escalera Real', payout: 250 },
    { name: 'Escalera de Color', payout: 50 },
    { name: 'Póker', payout: 25 },
    { name: 'Full House', payout: 9 },
    { name: 'Color', payout: 6 },
    { name: 'Escalera', payout: 4 },
    { name: 'Trío', payout: 3 },
    { name: 'Doble Pareja', payout: 2 },
    { name: 'Jotas o Mejor', payout: 1 },
  ];

  const playerWon = handResult && handResult.payout > 0;

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary uppercase">Video Póker</CardTitle>
        <CardDescription>Jotas o Mejor - Consigue la mejor mano</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        
        <div className="flex justify-center items-start gap-8 w-full">
            <div className="w-2/3 space-y-6">
                <div className="min-h-[220px]">
                    {gameState !== 'betting' && (
                        <>
                        <h3 className="text-xl font-semibold text-center mb-4 uppercase">Tu Mano {handResult && <Badge variant="secondary" className={cn(playerWon && 'animate-win-pulse bg-primary/80')}>{handResult.name}</Badge>}</h3>
                        <div className="flex justify-center gap-4">
                        {playerHand.map((card, index) => (
                            <GameCard 
                                key={index} 
                                card={card} 
                                isSelected={held[index]} 
                                onClick={gameState === 'dealt' ? () => handleHold(index) : undefined} 
                                style={{ animationDelay: `${index * 100}ms`}}
                                className={cn(gameState === 'dealt' || gameState === 'betting' ? 'animate-deal-card' : '', gameState === 'drawing' && !held[index] ? 'animate-flip-card': '')}
                            />
                        ))}
                        </div>
                        </>
                    )}
                </div>

                {message && (
                  <Alert variant={playerWon ? 'default' : 'destructive'} className={cn('transition-opacity duration-300 min-h-[60px]', playerWon ? 'pixel-border pixel-border-primary text-primary' : message ? 'border-destructive text-destructive' : 'border-transparent')}>
                    <AlertTitle className="font-bold text-lg uppercase text-center">{message}</AlertTitle>
                  </Alert>
                )}

                <div className="flex flex-col items-center gap-4 min-h-[148px]">
                    {gameState === 'betting' && (
                        <div className="flex flex-col items-center gap-4 pt-16">
                            <div className="text-2xl font-bold uppercase">Haz tu Apuesta</div>
                            <div className="flex items-center gap-4">
                                <Button onClick={() => handleBetChange(-5)} disabled={bet <= 5}>-</Button>
                                <div className="text-3xl font-bold text-primary">${bet}</div>
                                <Button onClick={() => handleBetChange(5)} disabled={bet >= balance}>+</Button>
                            </div>
                            <Button size="lg" onClick={startNewRound} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">Repartir</Button>
                        </div>
                    )}
                    {gameState === 'dealt' && (
                        <Button size="lg" onClick={handleDraw} className="bg-secondary hover:bg-secondary/80 uppercase">Cambiar Cartas</Button>
                    )}
                    {gameState === 'finished' && (
                        <Button size="lg" onClick={() => setGameState('betting')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">Jugar de Nuevo</Button>
                    )}
                </div>

            </div>

            <Card className="w-1/3">
                <CardHeader><CardTitle className="text-lg uppercase">Tabla de Pagos</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-1 text-xs uppercase">
                        {PAYOUT_TABLE.map(p => (
                            <li key={p.name} className="flex justify-between">
                                <span>{p.name}</span>
                                <span className="font-mono text-primary">{p.payout}x</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
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
                    <p><strong>Objetivo:</strong> Conseguir la mejor mano de póker de 5 cartas. Ganas con un par de Jotas (J) o superior.</p>
                    <p><strong>Reglas:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Elige tu apuesta y pulsa "Repartir".</li>
                        <li>Recibes 5 cartas. Haz clic en las que quieras conservar ("Hold").</li>
                        <li>Pulsa "Cambiar Cartas" para descartar el resto y recibir nuevas.</li>
                        <li>Tu mano final se compara con la tabla de pagos. ¡A mejor mano, mayor premio!</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PokerGame;
