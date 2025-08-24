'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
type CardType = { suit: Suit; rank: Rank };
type Hand = CardType[];

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): CardType[] => {
  return SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank })));
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  return deck.sort(() => Math.random() - 0.5);
};

const getCardValue = (card: CardType, currentScore: number): number => {
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  if (card.rank === 'A') return currentScore + 11 > 21 ? 1 : 11;
  return parseInt(card.rank);
};

const calculateScore = (hand: Hand): number => {
  let score = 0;
  let aceCount = 0;
  hand.forEach(card => {
    if (card.rank === 'A') {
      aceCount++;
      score += 11;
    } else {
      score += getCardValue(card, score);
    }
  });
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
};

const GameCard = ({ card, hidden }: { card: CardType; hidden?: boolean }) => {
  const cardColor = card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-white';
  if (hidden) {
    return (
      <div className="w-24 h-36 rounded-lg bg-blue-500 border-2 border-blue-700 flex items-center justify-center">
        <div className="w-20 h-32 rounded-md bg-blue-600" />
      </div>
    );
  }
  return (
    <div className={`w-24 h-36 rounded-lg bg-card border-2 border-border shadow-lg flex flex-col justify-between p-2 ${cardColor}`}>
      <div className="text-2xl font-bold">{card.rank}</div>
      <div className="text-4xl text-center">{card.suit}</div>
      <div className="text-2xl font-bold self-end transform rotate-180">{card.rank}</div>
    </div>
  );
};

interface BlackjackGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const BlackjackGame: React.FC<BlackjackGameProps> = ({ balance, onBalanceChange }) => {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<Hand>([]);
  const [dealerHand, setDealerHand] = useState<Hand>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting');
  const [message, setMessage] = useState('');

  const startNewRound = useCallback(() => {
    if (balance < bet) {
      setMessage("No tienes saldo suficiente para esa apuesta.");
      return;
    }
    
    const newDeck = shuffleDeck(createDeck());
    const initialPlayerHand = [newDeck.pop()!, newDeck.pop()!];
    const initialDealerHand = [newDeck.pop()!, newDeck.pop()!];
    
    setDeck(newDeck);
    setPlayerHand(initialPlayerHand);
    setDealerHand(initialDealerHand);
    setGameState('playing');
    setMessage('');

    const initialPlayerScore = calculateScore(initialPlayerHand);
    if (initialPlayerScore === 21) {
        setGameState('finished');
        setMessage('¡Blackjack! ¡Has ganado!');
        onBalanceChange(bet * 1.5);
    }
  }, [balance, bet, onBalanceChange]);
  
  useEffect(() => {
    setPlayerScore(calculateScore(playerHand));
    setDealerScore(calculateScore(dealerHand));
  }, [playerHand, dealerHand]);

  const handleHit = () => {
    if (gameState !== 'playing') return;
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];
    setDeck(newDeck);
    setPlayerHand(newHand);
    const newScore = calculateScore(newHand);
    if (newScore > 21) {
      setGameState('finished');
      setMessage('¡Te pasaste! Has perdido.');
      onBalanceChange(-bet);
    }
  };

  const handleStand = useCallback(() => {
    if (gameState !== 'playing') return;
    setGameState('dealer');

    let currentDealerHand = [...dealerHand];
    let newDeck = [...deck];

    while (calculateScore(currentDealerHand) < 17) {
      const newCard = newDeck.pop()!;
      currentDealerHand.push(newCard);
    }

    setDealerHand(currentDealerHand);
    setDeck(newDeck);
    setGameState('finished');

    const finalPlayerScore = calculateScore(playerHand);
    const finalDealerScore = calculateScore(currentDealerHand);
    
    if (finalDealerScore > 21 || finalPlayerScore > finalDealerScore) {
      setMessage('¡Has ganado!');
      onBalanceChange(bet);
    } else if (finalPlayerScore < finalDealerScore) {
      setMessage('El crupier gana.');
      onBalanceChange(-bet);
    } else {
      setMessage("Es un empate.");
    }
  }, [gameState, dealerHand, deck, playerHand, onBalanceChange, bet]);
  
  const handleBetChange = (amount: number) => {
    const newBet = bet + amount;
    if (newBet > 0 && newBet <= balance) {
        setBet(newBet);
    }
  }

  return (
    <Card className="w-full bg-card/70 border-primary shadow-2xl shadow-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">Blackjack</CardTitle>
        <CardDescription>Acércate a 21 más que el crupier sin pasarte.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        {gameState !== 'betting' && (
          <div className="w-full space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-center mb-2">Mano del Crupier <Badge>{gameState === 'playing' ? '?' : dealerScore}</Badge></h3>
              <div className="flex justify-center gap-4">
                {dealerHand.map((card, index) => (
                  <GameCard key={index} card={card} hidden={gameState === 'playing' && index === 1} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-center mb-2">Tu Mano <Badge>{playerScore}</Badge></h3>
              <div className="flex justify-center gap-4">
                {playerHand.map((card, index) => (
                  <GameCard key={index} card={card} />
                ))}
              </div>
            </div>
          </div>
        )}

        {message && (
          <Alert className={message.includes('ganado') ? 'border-accent text-accent' : 'border-destructive text-destructive'}>
            <AlertTitle className="font-bold text-lg">{message}</AlertTitle>
          </Alert>
        )}

        {gameState === 'betting' && (
            <div className="flex flex-col items-center gap-4">
                <div className="text-2xl font-bold">Haz tu Apuesta</div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => handleBetChange(-10)} disabled={bet <= 10}>-</Button>
                    <div className="text-3xl font-bold text-accent">${bet}</div>
                    <Button onClick={() => handleBetChange(10)} disabled={bet >= balance}>+</Button>
                </div>
                <Button size="lg" onClick={startNewRound} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Repartir Cartas</Button>
            </div>
        )}

        {gameState === 'playing' && (
          <div className="flex gap-4">
            <Button size="lg" onClick={handleHit} className="bg-accent hover:bg-accent/90">Pedir</Button>
            <Button size="lg" onClick={handleStand} variant="secondary">Plantarse</Button>
          </div>
        )}

        {gameState === 'finished' && (
            <Button size="lg" onClick={() => setGameState('betting')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Jugar de Nuevo</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BlackjackGame;
