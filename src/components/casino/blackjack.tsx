'use client';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CardType = {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string;
  value: number;
};

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];

const createDeck = (): CardType[] => {
  return suits.flatMap(suit =>
    ranks.map(rank => {
      let value = parseInt(rank);
      if (['J', 'Q', 'K'].includes(rank)) value = 10;
      if (rank === 'A') value = 11;
      return { suit, rank, value };
    })
  );
};

export default function Blackjack({ balance, setBalance }: { balance: number, setBalance: (balance: number) => void }) {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'ended'>('betting');
  const [message, setMessage] = useState('Place your bet to start.');
  const { toast } = useToast();

  const shuffleDeck = () => {
    const newDeck = createDeck();
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    setDeck(newDeck);
  };

  const calculateHandValue = (hand: CardType[]) => {
    let value = hand.reduce((sum, card) => sum + card.value, 0);
    let aces = hand.filter(card => card.rank === 'A').length;
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    return value;
  };

  const playerValue = useMemo(() => calculateHandValue(playerHand), [playerHand]);
  const dealerValue = useMemo(() => calculateHandValue(dealerHand), [dealerHand]);

  const dealCard = (currentDeck: CardType[], hand: CardType[]): [CardType[], CardType] => {
    const card = currentDeck.pop()!;
    return [currentDeck, card];
  };

  const handleDeal = () => {
    if (bet > balance) {
      toast({ title: 'Invalid Bet', description: 'Your bet cannot exceed your balance.', variant: 'destructive' });
      return;
    }
    if (bet <= 0) {
      toast({ title: 'Invalid Bet', description: 'Please enter a bet amount greater than 0.', variant: 'destructive' });
      return;
    }
    
    setBalance(balance - bet);
    setMessage('');
    shuffleDeck();
    setGameState('playing');
    
    let currentDeck = createDeck();
    let newPlayerHand: CardType[] = [];
    let newDealerHand: CardType[] = [];
    let card: CardType;

    [currentDeck, card] = dealCard(currentDeck, newPlayerHand);
    newPlayerHand.push(card);
    [currentDeck, card] = dealCard(currentDeck, newDealerHand);
    newDealerHand.push(card);
    [currentDeck, card] = dealCard(currentDeck, newPlayerHand);
    newPlayerHand.push(card);
    [currentDeck, card] = dealCard(currentDeck, newDealerHand);
    newDealerHand.push(card);
    
    setDeck(currentDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
  };

  const handleHit = () => {
    if (gameState !== 'playing') return;
    let [newDeck, card] = dealCard([...deck], playerHand);
    const newPlayerHand = [...playerHand, card];
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
  };

  const handleStand = () => {
    if (gameState !== 'playing') return;

    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    let dealerHandValue = calculateHandValue(currentDealerHand);

    while (dealerHandValue < 17) {
        let card: CardType;
        [currentDeck, card] = dealCard(currentDeck, currentDealerHand);
        currentDealerHand.push(card);
        dealerHandValue = calculateHandValue(currentDealerHand);
    }
    setDeck(currentDeck);
    setDealerHand(currentDealerHand);
    setGameState('ended');
  };

  useEffect(() => {
    if (gameState === 'playing' && playerValue > 21) {
      setMessage('Bust! You lose.');
      setGameState('ended');
      toast({ title: 'You Lose!', description: `You lost $${bet}.`, variant: 'destructive' });
    } else if(gameState === 'playing' && playerValue === 21) {
      handleStand();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerHand, gameState]);

  useEffect(() => {
    if (gameState === 'ended') {
      const finalDealerValue = calculateHandValue(dealerHand);
      if (playerValue > 21) {
        setMessage('Bust! You lose.');
      } else if (finalDealerValue > 21) {
        setMessage('Dealer busts! You win!');
        setBalance(balance + bet * 2);
        toast({ title: 'You Win!', description: `You won $${bet * 2}!` });
      } else if (finalDealerValue > playerValue) {
        setMessage('Dealer wins.');
        toast({ title: 'You Lose!', description: `You lost $${bet}.`, variant: 'destructive' });
      } else if (finalDealerValue < playerValue) {
        setMessage('You win!');
        setBalance(balance + bet * 2);
        toast({ title: 'You Win!', description: `You won $${bet * 2}!` });
      } else {
        setMessage('Push. It\'s a tie.');
        setBalance(balance + bet);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, dealerHand]);

  const RenderHand = ({ hand, title, isDealer, hideSecondCard }: { hand: CardType[], title: string, isDealer?: boolean, hideSecondCard?: boolean }) => (
    <div>
      <h3 className="text-xl font-bold mb-2 text-center text-primary">{title} ({isDealer && hideSecondCard ? '?' : calculateHandValue(hand)})</h3>
      <div className="flex justify-center gap-2 min-h-[100px]">
        {hand.map((card, index) => (
          <div key={index} className={cn(
            "w-16 h-24 rounded-lg flex items-center justify-center text-2xl font-bold border-2 shadow-lg",
            (isDealer && hideSecondCard && index === 1) ? "bg-red-800 border-red-900" : "bg-white",
            (isDealer && hideSecondCard && index === 1) ? "" : (card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'),
          )}>
            {(isDealer && hideSecondCard && index === 1) ? '' : `${card.rank}${card.suit}`}
          </div>
        ))}
      </div>
    </div>
  );
  
  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('betting');
    setMessage('Place your bet to start a new game.');
  };

  return (
    <Card className="w-full max-w-4xl bg-card/50 border-primary/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-4xl font-headline text-primary tracking-wider">Blackjack</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-2 gap-8 w-full">
          <RenderHand hand={dealerHand} title="Dealer's Hand" isDealer hideSecondCard={gameState === 'playing'} />
          <RenderHand hand={playerHand} title="Your Hand" />
        </div>
        {message && <p className="text-lg font-bold text-center text-primary">{message}</p>}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-center justify-center">
        {gameState === 'betting' && (
          <div className="flex items-center gap-2">
            <span className="font-bold">Bet:</span>
            <Input type="number" value={bet} onChange={(e) => setBet(parseInt(e.target.value) || 0)} className="w-24" />
            <Button onClick={handleDeal} className="bg-primary text-primary-foreground">Deal</Button>
          </div>
        )}
        {gameState === 'playing' && (
          <div className="flex gap-4">
            <Button onClick={handleHit} size="lg" className="w-32 text-lg">Hit</Button>
            <Button onClick={handleStand} variant="outline" size="lg" className="w-32 text-lg">Stand</Button>
          </div>
        )}
        {gameState === 'ended' && (
            <Button onClick={resetGame} size="lg" className="w-48 text-lg">Play Again</Button>
        )}
        <p className="text-xs text-muted-foreground">Get closer to 21 than the dealer without going over.</p>
      </CardFooter>
    </Card>
  );
}
