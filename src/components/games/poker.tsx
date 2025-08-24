'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle } from '@/components/ui/alert';

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
  return deck.sort(() => Math.random() - 0.5);
};

const GameCard = ({ card, isSelected, onClick }: { card: CardType; isSelected?: boolean; onClick?: () => void }) => {
  const cardColor = card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-white';
  return (
    <div 
        onClick={onClick}
        className={`w-24 h-36 rounded-lg bg-card border-2 shadow-lg flex flex-col justify-between p-2 ${cardColor} transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${isSelected ? 'border-accent transform -translate-y-2' : 'border-border'}`}
    >
      <div className="text-2xl font-bold">{card.rank}</div>
      <div className="text-4xl text-center">{card.suit}</div>
      <div className="text-2xl font-bold self-end transform rotate-180">{card.rank}</div>
    </div>
  );
};

// Simplified hand evaluation
const evaluateHand = (hand: Hand): { name: string; payout: number } => {
    const ranks = hand.map(c => RANK_VALUES[c.rank]).sort((a, b) => a - b);
    const suits = hand.map(c => c.suit);
    const rankCounts = ranks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);
    const counts = Object.values(rankCounts).sort((a, b) => b - a);

    const isFlush = new Set(suits).size === 1;
    const isStraight = ranks[4] - ranks[0] === 4 && new Set(ranks).size === 5;
    
    if (isStraight && isFlush && ranks[4] === 14) return { name: 'Escalera Real', payout: 250 };
    if (isStraight && isFlush) return { name: 'Escalera de Color', payout: 50 };
    if (counts[0] === 4) return { name: 'Póker', payout: 25 };
    if (counts[0] === 3 && counts[1] === 2) return { name: 'Full House', payout: 9 };
    if (isFlush) return { name: 'Color', payout: 6 };
    if (isStraight) return { name: 'Escalera', payout: 4 };
    if (counts[0] === 3) return { name: 'Trío', payout: 3 };
    if (counts[0] === 2 && counts[1] === 2) return { name: 'Doble Pareja', payout: 2 };
    if (counts[0] === 2 && ranks.some(r => r >= 11)) return { name: 'Jotas o Mejor', payout: 1 };
    
    return { name: 'Carta Alta', payout: 0 };
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
  const [gameState, setGameState] = useState<'betting' | 'dealt' | 'finished'>('betting');
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
    setPlayerHand(initialHand);
    setHeld([false, false, false, false, false]);
    setGameState('dealt');
    setMessage('');
    setHandResult(null);
  }, [balance, bet, onBalanceChange]);

  const handleHold = (index: number) => {
    if (gameState !== 'dealt') return;
    const newHeld = [...held];
    newHeld[index] = !newHeld[index];
    setHeld(newHeld);
  };
  
  const handleDraw = () => {
    if (gameState !== 'dealt') return;
    
    const newDeck = [...deck];
    const newHand = [...playerHand];
    
    for (let i = 0; i < 5; i++) {
        if (!held[i]) {
            newHand[i] = newDeck.pop()!;
        }
    }
    
    setPlayerHand(newHand);
    setDeck(newDeck);
    setGameState('finished');
    
    const result = evaluateHand(newHand);
    setHandResult(result);

    if (result.payout > 0) {
        const winnings = bet * result.payout;
        setMessage(`¡Conseguiste ${result.name}! Ganaste $${winnings}.`);
        onBalanceChange(winnings);
    } else {
        setMessage(`${result.name}. No has ganado.`);
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

  return (
    <Card className="w-full bg-card/70 border-primary shadow-2xl shadow-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Video Póker</CardTitle>
        <CardDescription>Jotas o Mejor - 5 Cartas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        
        <div className="flex justify-center items-start gap-8 w-full">
            <div className="w-2/3 space-y-6">
                {gameState !== 'betting' && (
                  <div>
                    <h3 className="text-xl font-semibold text-center mb-4">Tu Mano {handResult && <Badge>{handResult.name}</Badge>}</h3>
                    <div className="flex justify-center gap-4">
                      {playerHand.map((card, index) => (
                        <GameCard key={index} card={card} isSelected={held[index]} onClick={() => handleHold(index)} />
                      ))}
                    </div>
                  </div>
                )}

                {message && (
                  <Alert className={handResult && handResult.payout > 0 ? 'border-accent text-accent' : 'border-destructive text-destructive'}>
                    <AlertTitle className="font-bold text-lg">{message}</AlertTitle>
                  </Alert>
                )}

                {gameState === 'betting' && (
                    <div className="flex flex-col items-center gap-4 pt-16">
                        <div className="text-2xl font-bold">Haz tu Apuesta</div>
                        <div className="flex items-center gap-4">
                            <Button onClick={() => handleBetChange(-5)} disabled={bet <= 5}>-</Button>
                            <div className="text-3xl font-bold text-accent">${bet}</div>
                            <Button onClick={() => handleBetChange(5)} disabled={bet >= balance}>+</Button>
                        </div>
                        <Button size="lg" onClick={startNewRound} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Repartir</Button>
                    </div>
                )}
            </div>

            <Card className="w-1/3">
                <CardHeader><CardTitle>Tabla de Pagos</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-1 text-sm">
                        {PAYOUT_TABLE.map(p => (
                            <li key={p.name} className="flex justify-between">
                                <span>{p.name}</span>
                                <span className="font-mono text-accent">{p.payout}x</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>


        {gameState === 'dealt' && (
          <div className="flex gap-4">
            <Button size="lg" onClick={handleDraw} className="bg-accent hover:bg-accent/90">Cambiar</Button>
          </div>
        )}

        {gameState === 'finished' && (
            <Button size="lg" onClick={() => setGameState('betting')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Jugar de Nuevo</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PokerGame;
