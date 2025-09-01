'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { BookOpen, User, Bot } from 'lucide-react';
import { evaluateHand, HandRank, Card as PokerCard, rankPokerHand, compareHands } from '@/lib/poker';

const GameCard = ({ card, hidden, revealed, style, className }: { card?: PokerCard; hidden?: boolean, revealed?: boolean, style?: React.CSSProperties, className?: string }) => {
    if (hidden || !card) {
      return (
        <div style={style} className={cn("w-20 md:w-24 h-28 md:h-36 rounded-none bg-primary border-2 border-blue-700 flex items-center justify-center", className)}>
          <div className="w-16 md:w-20 h-24 md:h-32 rounded-none bg-blue-600" />
        </div>
      );
    }
    
    const cardColor = card.suit === '♥' || card.suit === '♦' ? 'text-accent' : 'text-foreground';

    return (
        <div style={style} className={cn('w-20 md:w-24 h-28 md:h-36 rounded-none bg-card border-2 border-border flex flex-col justify-between p-2 font-mono', cardColor, revealed && 'animate-flip-card', className)}>
            <div className="text-xl md:text-2xl font-bold">{card.rank}</div>
            <div className="text-3xl md:text-4xl text-center">{card.suit}</div>
            <div className="text-xl md:text-2xl font-bold self-end transform rotate-180">{card.rank}</div>
        </div>
    );
};

const MiniCard = ({rank, suit}: {rank: string; suit: '♠' | '♥' | '♦' | '♣'}) => {
    const color = suit === '♥' || suit === '♦' ? 'text-accent' : 'text-foreground';
    return (
        <div className={cn("w-8 h-12 rounded-sm bg-card border flex flex-col justify-between items-center text-xs p-1 font-mono", color)}>
            <span>{rank}</span>
            <span>{suit}</span>
        </div>
    )
}

interface PokerGameProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

const PokerGame: React.FC<PokerGameProps> = ({ balance, onBalanceChange }) => {
  const [deck, setDeck] = useState<PokerCard[]>([]);
  const [playerHand, setPlayerHand] = useState<PokerCard[]>([]);
  const [dealerHand, setDealerHand] = useState<PokerCard[]>([]);
  const [communityCards, setCommunityCards] = useState<PokerCard[]>([]);
  
  const [bet, setBet] = useState(10);
  const [pot, setPot] = useState(0);

  const [gameState, setGameState] = useState<'betting' | 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown' | 'finished'>('betting');
  const [message, setMessage] = useState('');
  
  const [playerHandRank, setPlayerHandRank] = useState<HandRank | null>(null);
  const [dealerHandRank, setDealerHandRank] = useState<HandRank | null>(null);


  const createDeck = (): PokerCard[] => {
    const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const newDeck: PokerCard[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push({ suit, rank });
      }
    }
    return newDeck;
  };

  const startNewRound = useCallback(() => {
    if (balance < bet) {
      setMessage("Saldo insuficiente.");
      return;
    }

    const ante = bet;
    onBalanceChange(-ante);
    setPot(ante);
    
    const newDeck = [...createDeck()].sort(() => Math.random() - 0.5);
    
    setPlayerHand([newDeck.pop()!, newDeck.pop()!]);
    setDealerHand([newDeck.pop()!, newDeck.pop()!]);
    setCommunityCards([]);
    
    setDeck(newDeck);
    setGameState('pre-flop');
    setMessage('Ronda de apuestas inicial. ¿Subes la apuesta o te retiras?');
    setPlayerHandRank(null);
    setDealerHandRank(null);
  }, [balance, bet, onBalanceChange]);

  const handleAction = (action: 'raise' | 'fold') => {
    if (gameState !== 'pre-flop') return;

    if (action === 'fold') {
      setMessage('Te has retirado. El crupier gana el bote.');
      setGameState('finished');
      return;
    }

    if (action === 'raise') {
      const raiseAmount = bet * 2;
      if (balance < raiseAmount) {
        setMessage('No tienes suficiente saldo para subir la apuesta.');
        return;
      }
      onBalanceChange(-raiseAmount);
      setPot(pot + raiseAmount);
      
      // Burn a card and deal the flop
      let currentDeck = [...deck];
      currentDeck.pop(); // Burn
      const flop = [currentDeck.pop()!, currentDeck.pop()!, currentDeck.pop()!];
      
      setGameState('flop');
      setCommunityCards(flop);
      setDeck(currentDeck);
      setMessage('Flop. Se revelan las 3 primeras cartas.');

      setTimeout(() => {
          // Burn and deal the turn
          currentDeck.pop(); // Burn
          const turn = currentDeck.pop()!;
          const newCommunity = [...flop, turn];
          setCommunityCards(newCommunity);
          setGameState('turn');
          setMessage('Turn. Se revela la cuarta carta.');
          setDeck(currentDeck);

          setTimeout(() => {
              // Burn and deal the river
              currentDeck.pop(); // Burn
              const river = currentDeck.pop()!;
              const finalCommunity = [...newCommunity, river];
              setCommunityCards(finalCommunity);
              setGameState('river');
               setMessage('River. Se revela la última carta. ¡Showdown!');
              setDeck(currentDeck);
              
              setTimeout(() => {
                  setGameState('showdown');
              }, 1500)
          }, 1500);
      }, 1500);
    }
  };

  useEffect(() => {
    if (gameState === 'showdown') {
        const pHand = rankPokerHand(playerHand.concat(communityCards));
        const dHand = rankPokerHand(dealerHand.concat(communityCards));
        setPlayerHandRank(pHand);
        setDealerHandRank(dHand);
        
        const winner = compareHands(pHand, dHand);

        if (winner === 'player') {
            setMessage(`¡Ganas con ${pHand.name}!`);
            onBalanceChange(pot * 2); // Player gets the pot + their bet back
        } else if (winner === 'dealer') {
            setMessage(`El crupier gana con ${dHand.name}.`);
        } else {
            setMessage('¡Empate! Se divide el bote.');
            onBalanceChange(pot); // Bets are returned
        }
        setGameState('finished');
    }
  }, [gameState, communityCards, playerHand, dealerHand, onBalanceChange, pot]);

  const handleBetChange = (amount: number) => {
    const newBet = bet + amount;
    if (newBet > 5 && newBet <= balance) {
        setBet(newBet);
    }
  }

  const playerWon = gameState === 'finished' && message.includes('Ganas');

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary uppercase">Póker Texas Hold'em</CardTitle>
        <CardDescription>1v1 contra el crupier. ¿Tienes lo que se necesita?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Dealer Area */}
            <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-center mb-2 uppercase flex items-center gap-2">
                    <Bot /> Crupier 
                    {dealerHandRank && <Badge variant="secondary" className={cn(!playerWon && 'animate-win-pulse bg-primary/80')}>{dealerHandRank.name}</Badge>}
                </h3>
                <div className="flex justify-center gap-4">
                    {dealerHand.map((card, index) => (
                        <GameCard key={index} card={card} hidden={gameState !== 'showdown' && gameState !== 'finished'} revealed={gameState === 'showdown'}/>
                    ))}
                </div>
            </div>

            {/* Community Cards Area */}
            <div className="flex flex-col items-center gap-4 my-4">
                <div className="flex justify-center gap-2 md:gap-4">
                    {Array(5).fill(null).map((_, index) => (
                        <GameCard key={index} card={communityCards[index]} revealed={true} />
                    ))}
                </div>
                 <div className="text-2xl font-bold uppercase">Bote: <span className="text-primary">${pot * 2}</span></div>
            </div>

            {/* Player Area */}
            <div className="flex flex-col items-center">
                 <h3 className="text-xl font-semibold text-center mb-2 uppercase flex items-center gap-2">
                    <User /> Tu Mano 
                    {playerHandRank && <Badge variant="secondary" className={cn(playerWon && 'animate-win-pulse bg-primary/80')}>{playerHandRank.name}</Badge>}
                </h3>
                <div className={cn("flex justify-center gap-4", playerWon && 'animate-win-pulse')}>
                    {playerHand.map((card, index) => (
                        <GameCard key={index} card={card} revealed={true}/>
                    ))}
                </div>
            </div>
        </div>

        {message && (
          <Alert variant={playerWon ? 'default' : 'destructive'} className={cn('transition-opacity duration-300 min-h-[60px]', playerWon ? 'pixel-border pixel-border-primary text-primary' : message ? 'border-destructive text-destructive' : 'border-transparent')}>
            <AlertTitle className="font-bold text-lg uppercase text-center">{message}</AlertTitle>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-4 min-h-[148px]">
            {gameState === 'betting' && (
                <div className="flex flex-col items-center gap-4 pt-8">
                    <div className="text-2xl font-bold uppercase">Apuesta Inicial (Ante)</div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => handleBetChange(-10)} disabled={bet <= 10}>-</Button>
                        <div className="text-3xl font-bold text-primary">${bet}</div>
                        <Button onClick={() => handleBetChange(10)} disabled={bet >= balance}>+</Button>
                    </div>
                    <Button size="lg" onClick={startNewRound} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">Repartir</Button>
                </div>
            )}
            {gameState === 'pre-flop' && (
                <div className="flex gap-4">
                     <Button size="lg" onClick={() => handleAction('raise')} className="bg-green-600 hover:bg-green-700 uppercase">Subir (x2)</Button>
                     <Button size="lg" onClick={() => handleAction('fold')} className="bg-red-600 hover:bg-red-700 uppercase">No Ir</Button>
                </div>
            )}
            {gameState === 'finished' && (
                <Button size="lg" onClick={() => setGameState('betting')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">Jugar de Nuevo</Button>
            )}
        </div>

        <Accordion type="single" collapsible className="w-full max-w-2xl">
            <AccordionItem value="how-to-play">
                <AccordionTrigger className='text-sm uppercase'>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Cómo Jugar al Texas Hold'em</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs space-y-4">
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-1">Objetivo</h4>
                        <p>Consigue la mejor mano de póker de 5 cartas combinando tus 2 cartas privadas con las 5 cartas comunitarias de la mesa.</p>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-2">Fases del Juego</h4>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>
                                <strong>Apuesta Inicial (Ante):</strong> Eliges tu apuesta y pulsas <Button size="sm" disabled className="h-6 px-2 text-xs uppercase">Repartir</Button>.
                                Se te reparten 2 cartas boca arriba. El crupier recibe 2 boca abajo.
                            </li>
                            <li>
                                <strong>Decisión Post-Reparto:</strong> Tienes dos opciones:
                                <div className="flex gap-2 items-center my-1">
                                    <Button size="sm" disabled className="h-6 px-2 text-xs uppercase bg-green-600">Subir (x2)</Button> para doblar tu apuesta y continuar.
                                </div>
                                <div className="flex gap-2 items-center my-1">
                                    <Button size="sm" disabled className="h-6 px-2 text-xs uppercase bg-red-600">No Ir</Button> para rendirte y perder tu apuesta inicial.
                                </div>
                            </li>
                            <li>
                                <strong>El Flop, Turn y River:</strong> Si decides subir, se revelarán las 5 cartas comunitarias en tres etapas (3, luego 1 y finalmente 1).
                                <div className="flex items-center justify-center gap-2 my-2 p-2 bg-background/50 rounded">
                                   <MiniCard rank="A" suit="♥" /><MiniCard rank="K" suit="♥" /><MiniCard rank="Q" suit="♥" />
                                   <MiniCard rank="J" suit="♥" />
                                   <MiniCard rank="10" suit="♥" />
                                </div>
                            </li>
                             <li>
                                <strong>Showdown:</strong> Al final, el crupier revela sus cartas. El jugador con la mejor mano de 5 cartas gana el bote completo.
                            </li>
                        </ol>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-2">Ranking de Manos (De mejor a peor)</h4>
                         <ul className="space-y-1 text-xs uppercase bg-background/50 p-2 rounded-md">
                            {[
                                {name: 'Escalera Real', value: 'Royal Flush'},
                                {name: 'Escalera de Color', value: 'Straight Flush'},
                                {name: 'Póker', value: 'Four of a Kind'},
                                {name: 'Full House', value: 'Full House'},
                                {name: 'Color', value: 'Flush'},
                                {name: 'Escalera', value: 'Straight'},
                                {name: 'Trío', value: 'Three of a Kind'},
                                {name: 'Doble Pareja', value: 'Two Pair'},
                                {name: 'Pareja', value: 'One Pair'},
                                {name: 'Carta Alta', value: 'High Card'},
                            ].map(p => (
                                <li key={p.name} className="flex justify-between items-center">
                                    <span>{p.name}</span>
                                    <span className="font-mono text-primary">{p.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PokerGame;
