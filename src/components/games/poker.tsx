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
import { Awaited } from '@/lib/i18n';

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
  t: Awaited<typeof import('@/lib/i18n').getTranslator>
}

const PokerGame: React.FC<PokerGameProps> = ({ balance, onBalanceChange, t }) => {
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
      setMessage(t('games.notEnoughBalance'));
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
    setMessage(t('games.poker.bettingRoundMessage'));
    setPlayerHandRank(null);
    setDealerHandRank(null);
  }, [balance, bet, onBalanceChange, t]);

  const proceedWithCommunityCards = () => {
      // Burn a card and deal the flop
      let currentDeck = [...deck];
      currentDeck.pop(); // Burn
      const flop = [currentDeck.pop()!, currentDeck.pop()!, currentDeck.pop()!];
      
      setGameState('flop');
      setCommunityCards(flop);
      setDeck(currentDeck);
      setMessage(t('games.poker.flopMessage'));

      setTimeout(() => {
          // Burn and deal the turn
          currentDeck.pop(); // Burn
          const turn = currentDeck.pop()!;
          const newCommunity = [...flop, turn];
          setCommunityCards(newCommunity);
          setGameState('turn');
          setMessage(t('games.poker.turnMessage'));
          setDeck(currentDeck);

          setTimeout(() => {
              // Burn and deal the river
              currentDeck.pop(); // Burn
              const river = currentDeck.pop()!;
              const finalCommunity = [...newCommunity, river];
              setCommunityCards(finalCommunity);
              setGameState('river');
               setMessage(t('games.poker.riverMessage'));
              setDeck(currentDeck);
              
              setTimeout(() => {
                  setGameState('showdown');
              }, 1500)
          }, 1500);
      }, 1500);
  }

  const handleAction = (action: 'bet' | 'check' | 'fold') => {
    if (gameState !== 'pre-flop') return;

    if (action === 'fold') {
      setMessage(t('games.poker.foldMessage'));
      setGameState('finished');
      return;
    }

    if (action === 'bet') {
      const raiseAmount = bet;
      if (balance < raiseAmount) {
        setMessage(t('games.notEnoughBalance'));
        return;
      }
      onBalanceChange(-raiseAmount);
      setPot(pot + raiseAmount);
    }
    
    // Both 'bet' and 'check' proceed to the next stages
    proceedWithCommunityCards();
  };

  useEffect(() => {
    if (gameState === 'showdown') {
        const pHand = rankPokerHand(playerHand.concat(communityCards));
        const dHand = rankPokerHand(dealerHand.concat(communityCards));
        setPlayerHandRank(pHand);
        setDealerHandRank(dHand);
        
        const winner = compareHands(pHand, dHand);
        const finalPot = pot * 2; // Ante + Bet

        if (winner === 'player') {
            setMessage(t('games.poker.winMessage', { handName: pHand.name }));
            onBalanceChange(finalPot);
        } else if (winner === 'dealer') {
            setMessage(t('games.poker.dealerWinMessage', { handName: dHand.name }));
        } else {
            setMessage(t('games.push'));
            onBalanceChange(pot); // Bets are returned (ante + bet / 2 per player)
        }
        setGameState('finished');
    }
  }, [gameState, communityCards, playerHand, dealerHand, onBalanceChange, pot, t]);

  const handleBetChange = (amount: number) => {
    const newBet = bet + amount;
    if (newBet > 5 && newBet <= balance) {
        setBet(newBet);
    }
  }

  const playerWon = gameState === 'finished' && message.includes(t('games.youWin'));
  const finalPot = pot + (gameState === 'pre-flop' ? bet : 0);

  return (
    <Card className="w-full bg-card/70 border-0 pixel-border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary uppercase">{t('games.poker.title')}</CardTitle>
        <CardDescription>{t('games.poker.description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Dealer Area */}
            <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold text-center mb-2 uppercase flex items-center gap-2">
                    <Bot /> {t('games.dealer')} 
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
                 <div className="text-2xl font-bold uppercase">{t('games.poker.pot')}: <span className="text-primary">${finalPot}</span></div>
            </div>

            {/* Player Area */}
            <div className="flex flex-col items-center">
                 <h3 className="text-xl font-semibold text-center mb-2 uppercase flex items-center gap-2">
                    <User /> {t('games.yourHand')}
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
                    <div className="text-2xl font-bold uppercase">{t('games.poker.ante')}</div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => handleBetChange(-10)} disabled={bet <= 10}>-</Button>
                        <div className="text-3xl font-bold text-primary">${bet}</div>
                        <Button onClick={() => handleBetChange(10)} disabled={bet >= balance}>+</Button>
                    </div>
                    <Button size="lg" onClick={startNewRound} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">{t('games.blackjack.deal')}</Button>
                </div>
            )}
            {gameState === 'pre-flop' && (
                <div className="flex flex-wrap justify-center gap-4">
                     <Button size="lg" onClick={() => handleAction('bet')} className="bg-green-600 hover:bg-green-700 uppercase">{t('games.poker.bet')} (${bet})</Button>
                     <Button size="lg" onClick={() => handleAction('check')} variant="outline" className="uppercase">{t('games.poker.check')}</Button>
                     <Button size="lg" onClick={() => handleAction('fold')} className="bg-red-600 hover:bg-red-700 uppercase">{t('games.poker.fold')}</Button>
                </div>
            )}
            {gameState === 'finished' && (
                <Button size="lg" onClick={() => setGameState('betting')} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase">{t('games.playAgain')}</Button>
            )}
        </div>

        <Accordion type="single" collapsible className="w-full max-w-2xl">
            <AccordionItem value="how-to-play">
                <AccordionTrigger className='text-sm uppercase'>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{t('games.poker.howToPlay')}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs space-y-4">
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-1">{t('games.objective')}</h4>
                        <p>{t('games.poker.objective')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-2">{t('games.poker.gamePhases')}</h4>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>
                                <strong>{t('games.poker.ante')}:</strong> {t('games.poker.rule1_ante')}
                            </li>
                            <li>
                                <strong>{t('games.poker.postDealDecision')}:</strong> {t('games.poker.rule2_options')}
                                <div className="flex flex-col gap-2 my-2 pl-4">
                                  <div className="flex gap-2 items-center">
                                      <Button size="sm" disabled className="h-6 px-2 text-xs uppercase bg-green-600">{t('games.poker.bet')}</Button> <span>- {t('games.poker.rule2_bet')}</span>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                      <Button size="sm" disabled variant="outline" className="h-6 px-2 text-xs uppercase">{t('games.poker.check')}</Button> <span>- {t('games.poker.rule2_check')}</span>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                      <Button size="sm" disabled className="h-6 px-2 text-xs uppercase bg-red-600">{t('games.poker.fold')}</Button> <span>- {t('games.poker.rule2_fold')}</span>
                                  </div>
                                </div>
                            </li>
                            <li>
                                <strong>{t('games.poker.communityCards')}:</strong> {t('games.poker.rule3_community')}
                                <div className="flex items-center justify-center gap-2 my-2 p-2 bg-background/50 rounded">
                                   <MiniCard rank="A" suit="♥" /><MiniCard rank="K" suit="♥" /><MiniCard rank="Q" suit="♥" />
                                   <MiniCard rank="J" suit="♥" />
                                   <MiniCard rank="10" suit="♥" />
                                </div>
                            </li>
                             <li>
                                <strong>Showdown:</strong> {t('games.poker.rule4_showdown')}
                            </li>
                        </ol>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase text-primary mb-2">{t('games.poker.handRankings')}</h4>
                         <ul className="space-y-1 text-xs uppercase bg-background/50 p-2 rounded-md">
                            {[
                                {name: t('games.poker.royalFlush'), value: 'Royal Flush'},
                                {name: t('games.poker.straightFlush'), value: 'Straight Flush'},
                                {name: t('games.poker.fourOfAKind'), value: 'Four of a Kind'},
                                {name: t('games.poker.fullHouse'), value: 'Full House'},
                                {name: t('games.poker.flush'), value: 'Flush'},
                                {name: t('games.poker.straight'), value: 'Straight'},
                                {name: t('games.poker.threeOfAKind'), value: 'Three of a Kind'},
                                {name: t('games.poker.twoPair'), value: 'Two Pair'},
                                {name: t('games.poker.onePair'), value: 'One Pair'},
                                {name: t('games.poker.highCard'), value: 'High Card'},
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
