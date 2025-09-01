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
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
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

const GameCard = ({ card, hidden, revealed, style, className }: { card: CardType; hidden?: boolean, revealed?: boolean, style?: React.CSSProperties, className?: string }) => {
    const cardColor = card.suit === '♥' || card.suit === '♦' ? 'text-accent' : 'text-foreground';
    
    if (hidden) {
      return (
        <div style={style} className={cn("w-24 h-36 rounded-none bg-primary border-2 border-blue-700 flex items-center justify-center", className)}>
          <div className="w-20 h-32 rounded-none bg-blue-600" />
        </div>
      );
    }

    return (
        <div style={style} className={cn('w-24 h-36 rounded-none bg-card border-2 border-border flex flex-col justify-between p-2 font-mono', cardColor, revealed && 'animate-flip-card', className)}>
            <div className="text-2xl font-bold">{card.rank}</div>
            <div className="text-4xl text-center">{card.suit}</div>
            <div className="text-2xl font-bold self-end transform rotate-180">{card.rank}</div>
        </div>
    );
};

// Mini-card for guide
const MiniCard = ({rank, suit}: {rank: Rank | string; suit: Suit}) => {
    const color = suit === '♥' || suit === '♦' ? 'text-accent' : 'text-foreground';
    return (
        <div className={cn("w-8 h-12 rounded-sm bg-card border flex flex-col justify-between items-center text-xs p-1 font-mono", color)}>
            <span>{rank}</span>
            <span>{suit}</span>
        </div>
    )
}

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
    
    setGameState('playing');
    setMessage('');
    onBalanceChange(-bet);
    
    const newDeck = shuffleDeck(createDeck());
    const playerHand: Hand = [newDeck.pop()!, newDeck.pop()!];
    const dealerHand: Hand = [newDeck.pop()!, newDeck.pop()!];

    setDeck(newDeck);
    setPlayerHand(playerHand);
    setDealerHand(dealerHand);
    
    if (calculateScore(playerHand) === 21) {
        setGameState('dealer');
    }
  }, [bet, balance, onBalanceChange]);
  
  useEffect(() => {
    if (gameState === 'playing') {
      const pScore = calculateScore(playerHand);
      setPlayerScore(pScore);
      if (pScore > 21) {
        setMessage('¡Te pasaste! Pierdes.');
        setGameState('finished');
      }
    } else {
        setPlayerScore(calculateScore(playerHand));
    }
    
    if (gameState !== 'playing') {
        setDealerScore(calculateScore(dealerHand));
    } else {
        setDealerScore(calculateScore(dealerHand.slice(0, 1)));
    }
  }, [playerHand, dealerHand, gameState]);

  const handleHit = () => {
    if (gameState !== 'playing' || !deck.length) return;
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    setDeck(newDeck);
    setPlayerHand([...playerHand, newCard]);
  };

  const handleStand = useCallback(() => {
    if (gameState !== 'playing') return;
    setGameState('dealer');
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'dealer') {
      let currentDealerHand = [...dealerHand];
      let currentDeck = [...deck];
      
      const dealerTurn = () => {
        let score = calculateScore(currentDealerHand);
        if (score < 17 && currentDeck.length > 0) {
          currentDealerHand.push(currentDeck.pop()!);
          setDealerHand([...currentDealerHand]);
          setTimeout(dealerTurn, 600);
        } else {
          setDeck(currentDeck);
          const finalPlayerScore = calculateScore(playerHand);
          const finalDealerScore = score;
          
          if (finalPlayerScore === 21 && playerHand.length === 2) {
             setMessage('¡Blackjack! ¡Ganas!');
             onBalanceChange(bet * 2.5);
          } else if (finalDealerScore > 21 || finalPlayerScore > finalDealerScore) {
            setMessage('¡Ganas!');
            onBalanceChange(bet * 2);
          } else if (finalPlayerScore < finalDealerScore) {
            setMessage('El crupier gana.');
          } else {
            setMessage("Empate. Se devuelve la apuesta.");
            onBalanceChange(bet);
          }
          setGameState('finished');
        }
      };
      
      setTimeout(dealerTurn, 200);
    }
  }, [gameState, dealerHand, deck, playerHand, onBalanceChange, bet]);
  
  const handleBetChange = (amount: number) => {
    const newBet = bet + amount;
    if (newBet > 0 && newBet <= balance) {
        setBet(newBet);
    }
  }

  const handleNewGame = () => {
      setGameState('betting');
      setMessage('');
      setPlayerHand([]);
      setDealerHand([]);
  }

  const isPlayerBusted = playerScore > 21;
  const showDealerSecondCard = gameState !== 'playing';
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
                  <h3 className="text-xl font-semibold text-center mb-2 uppercase">Crupier <Badge variant="secondary">{showDealerSecondCard ? calculateScore(dealerHand) : dealerScore}</Badge></h3>
                  <div className="flex justify-center gap-4 h-36 items-center">
                    {dealerHand.map((card, index) => (
                      <GameCard 
                        key={index}
                        card={card} 
                        hidden={!showDealerSecondCard && index === 1}
                        revealed={showDealerSecondCard}
                        className={cn(index > 1 && 'animate-deal-card')}
                        style={{animationDelay: `${(index-1) * 100}ms`}}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-center mb-2 uppercase">Tu Mano <Badge className={cn(isPlayerBusted && 'bg-destructive', playerWon && 'bg-primary')}>{playerScore}</Badge></h3>
                  <div className={cn("flex justify-center gap-4 h-36 items-center", isPlayerBusted && 'animate-bust-shake', playerWon && 'animate-win-pulse')}>
                    {playerHand.map((card, index) => (
                      <GameCard 
                        key={index} 
                        card={card} 
                        className="animate-deal-card"
                        style={{animationDelay: `${index * 100}ms`}}
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
                    <Button size="lg" onClick={startNewRound} disabled={balance < bet || bet <= 0} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">Repartir</Button>
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
                <Button size="lg" onClick={handleNewGame} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">Jugar de Nuevo</Button>
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
                <AccordionContent className="text-xs space-y-4">
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-1">Objetivo del Juego</h4>
                        <p>Tu mano debe sumar un valor más cercano a 21 que la del crupier, sin pasarte de 21.</p>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-2">Valor de las Cartas</h4>
                        <ul className="space-y-3">
                           <li className="flex items-center gap-4">
                                <div className="flex gap-1">
                                    <MiniCard rank="7" suit="♦" />
                                </div>
                                <span><strong>Cartas 2-10:</strong> Valen su número indicado.</span>
                           </li>
                           <li className="flex items-center gap-4">
                                <div className="flex gap-1">
                                    <MiniCard rank="K" suit="♠" />
                                </div>
                                <span><strong>Figuras (J, Q, K):</strong> Valen 10 puntos cada una.</span>
                           </li>
                           <li className="flex items-center gap-4">
                                <div className="flex gap-1">
                                    <MiniCard rank="A" suit="♥" />
                                </div>
                                <span><strong>As (A):</strong> Vale 1 u 11, lo que más te convenga.</span>
                           </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-2">Reglas Principales</h4>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Elige tu apuesta y pulsa <strong>"Repartir"</strong>.</li>
                            <li>Recibes 2 cartas. El crupier recibe 2, una de ellas boca abajo.</li>
                            <li>Pulsa <strong>"Pedir"</strong> para recibir otra carta, o <strong>"Plantarse"</strong> para quedarte con tu mano.</li>
                            <li>Si tu puntuación supera 21, pierdes automáticamente (Bust).</li>
                            <li>El crupier está obligado a pedir carta hasta que su mano sume 17 o más.</li>
                            <li>Un <strong>Blackjack</strong> (un As y una carta de valor 10 en la mano inicial) paga 3 a 2 (1.5x tu apuesta).</li>
                        </ul>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BlackjackGame;
