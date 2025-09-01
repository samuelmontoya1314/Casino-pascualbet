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
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
type CardType = { suit: Suit; rank: Rank };
type Hand = CardType[];

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): CardType[] => {
  return SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank })));
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const getCardValue = (card: CardType): number => {
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  if (card.rank === 'A') return 11;
  return parseInt(card.rank);
};

const calculateScore = (hand: Hand): number => {
  let score = 0;
  let aceCount = 0;
  hand.forEach(card => {
    if (card.rank === 'A') {
      aceCount++;
    }
    score += getCardValue(card);
  });
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
};

const GameCard = ({ card, hidden, revealed, style }: { card: CardType; hidden?: boolean, revealed?: boolean, style?: React.CSSProperties }) => {
    const cardColor = card.suit === '♥' || card.suit === '♦' ? 'text-accent' : 'text-foreground';
    
    if (hidden) {
      return (
        <div style={style} className="w-24 h-36 rounded-none bg-primary border-2 border-blue-700 flex items-center justify-center">
          <div className="w-20 h-32 rounded-none bg-blue-600" />
        </div>
      );
    }

    return (
        <div style={style} className={cn('w-24 h-36 rounded-none bg-card border-2 border-border flex flex-col justify-between p-2 font-mono', cardColor, revealed && 'animate-flip-card')}>
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

    const initialPlayerHand: Hand = [];
    const initialDealerHand: Hand = [];

    initialPlayerHand.push(newDeck.pop()!);
    initialDealerHand.push(newDeck.pop()!);
    initialPlayerHand.push(newDeck.pop()!);
    initialDealerHand.push(newDeck.pop()!);

    onBalanceChange(-bet);
    setDeck(newDeck);
    setPlayerHand(initialPlayerHand);
    setDealerHand(initialDealerHand);
    setGameState('playing');
    setMessage('');

    const initialPlayerScore = calculateScore(initialPlayerHand);
    if (initialPlayerScore === 21) {
        setGameState('finished');
        setMessage('¡Blackjack! ¡Has ganado!');
        onBalanceChange(bet * 2.5);
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
    const updatedHand = [...playerHand, newCard];
    setDeck(newDeck);
    setPlayerHand(updatedHand);
    if (calculateScore(updatedHand) > 21) {
      setMessage('¡Te pasaste! Pierdes.');
      setGameState('finished');
    }
  };

  const handleStand = useCallback(() => {
    if (gameState !== 'playing') return;
    setGameState('dealer');

    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    const dealerTurn = () => {
      const score = calculateScore(currentDealerHand);
      if (score < 17) {
        currentDealerHand.push(currentDeck.pop()!);
        setDealerHand([...currentDealerHand]);
        setTimeout(dealerTurn, 500); 
      } else {
        setDeck(currentDeck);
        const finalPlayerScore = calculateScore(playerHand);
        const finalDealerScore = score;
        
        setGameState('finished');

        if (finalDealerScore > 21 || finalPlayerScore > finalDealerScore) {
          setMessage('¡Ganas!');
          onBalanceChange(bet * 2);
        } else if (finalPlayerScore < finalDealerScore) {
          setMessage('El crupier gana.');
        } else {
          setMessage("Empate. Se devuelve la apuesta.");
          onBalanceChange(bet);
        }
      }
    };
    
    setTimeout(dealerTurn, 500);

  }, [gameState, dealerHand, deck, playerHand, onBalanceChange, bet]);
  
  const handleBetChange = (amount: number) => {
    const newBet = bet + amount;
    if (newBet > 0 && newBet <= balance) {
        setBet(newBet);
    }
  }

  const isBusted = playerScore > 21;
  const playerWon = gameState === 'finished' && (message.includes('Ganas') || message.includes('Blackjack'));

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary uppercase">Blackjack</CardTitle>
        <CardDescription>Acércate a 21. El crupier se planta en 17.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="w-full space-y-6 min-h-[360px]">
           {gameState !== 'betting' ? (
             <>
                <div>
                  <h3 className="text-xl font-semibold text-center mb-2 uppercase">Crupier <Badge variant="secondary">{gameState === 'playing' ? '?' : dealerScore}</Badge></h3>
                  <div className="flex justify-center gap-4 h-36 items-center">
                    {dealerHand.map((card, index) => (
                      <GameCard 
                        key={index}
                        card={card} 
                        hidden={gameState === 'playing' && index === 1}
                        revealed={gameState !== 'playing' && gameState !== 'dealer'}
                        />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-center mb-2 uppercase">Tu Mano <Badge className={cn(isBusted && 'bg-destructive', playerWon && 'bg-primary')}>{playerScore}</Badge></h3>
                  <div className={cn("flex justify-center gap-4 h-36 items-center", isBusted && 'animate-bust-shake', playerWon && 'animate-win-pulse')}>
                    {playerHand.map((card, index) => (
                      <GameCard 
                        key={index} 
                        card={card} 
                        style={{animationDelay: `${index * 100}ms`}}
                        className="animate-deal-card"
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 pt-16 h-full min-h-[360px]">
                    <div className="text-2xl font-bold uppercase">Haz tu Apuesta</div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => handleBetChange(-10)} disabled={bet <= 10}>-</Button>
                        <div className="text-3xl font-bold text-primary">${bet}</div>
                        <Button onClick={() => handleBetChange(10)} disabled={bet >= balance}>+</Button>
                    </div>
                    <Button size="lg" onClick={startNewRound} disabled={balance < bet} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">Repartir</Button>
                </div>
            )
        }
        </div>
        
        {message && (
          <Alert variant={playerWon ? 'default' : 'destructive'} className={cn('transition-opacity duration-300 min-h-[60px]', playerWon ? 'pixel-border pixel-border-primary text-primary' : message ? 'border-destructive text-destructive' : 'border-transparent')}>
            <AlertTitle className="font-bold text-lg uppercase text-center">{message}</AlertTitle>
          </Alert>
        )}

        <div className="flex gap-4 min-h-[52px]">
            {gameState === 'playing' && (
              <>
                <Button size="lg" onClick={handleHit} className="uppercase bg-secondary hover:bg-secondary/80">Pedir</Button>
                <Button size="lg" onClick={handleStand} variant="outline" className="uppercase">Plantarse</Button>
              </>
            )}

            {gameState === 'finished' && (
                <Button size="lg" onClick={() => setGameState('betting')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">Jugar de Nuevo</Button>
            )}
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
                    <p><strong>Objetivo:</strong> Tu mano debe sumar un valor más cercano a 21 que la del crupier, sin pasarte.</p>
                    <p><strong>Reglas:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Elige tu apuesta y pulsa "Repartir".</li>
                        <li>Recibes 2 cartas. El crupier recibe 2, una de ellas boca abajo.</li>
                        <li>Pulsa "Pedir" para recibir otra carta, o "Plantarse" para quedarte con tu mano.</li>
                        <li>Si te pasas de 21, pierdes automáticamente.</li>
                        <li>El crupier debe pedir carta hasta sumar 17 o más.</li>
                        <li>Blackjack (un As y una carta de valor 10) paga 3 a 2.</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BlackjackGame;
