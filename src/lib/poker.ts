export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
    suit: Suit;
    rank: Rank;
}

export interface HandRank {
    name: string;
    value: number; // For comparing hands
    handCards: Card[];
    kickers: Card[];
}

const ranksOrder: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const getRankValue = (rank: Rank): number => ranksOrder.indexOf(rank);

export const rankPokerHand = (allCards: Card[]): HandRank => {
    const combinations = getCombinations(allCards, 5);
    let bestHand: HandRank = { name: 'High Card', value: 0, handCards: [], kickers: [] };

    for (const hand of combinations) {
        const currentRank = evaluateHand(hand);
        if (currentRank.value > bestHand.value) {
            bestHand = currentRank;
        } else if (currentRank.value === bestHand.value) {
            // Tie-breaking logic
            if (compareHandRanks(currentRank, bestHand) > 0) {
                bestHand = currentRank;
            }
        }
    }
    return bestHand;
};

// Simplified comparison for the best hand out of all combinations
const compareHandRanks = (a: HandRank, b: HandRank): number => {
    if (a.value !== b.value) return a.value - b.value;

    const handA = a.handCards.slice().sort((c1, c2) => getRankValue(c2.rank) - getRankValue(c1.rank));
    const handB = b.handCards.slice().sort((c1, c2) => getRankValue(c2.rank) - getRankValue(c1.rank));
    
    for (let i = 0; i < handA.length; i++) {
        const diff = getRankValue(handA[i].rank) - getRankValue(handB[i].rank);
        if (diff !== 0) return diff;
    }
    return 0;
}

export const compareHands = (player: HandRank, dealer: HandRank): 'player' | 'dealer' | 'tie' => {
     if (player.value > dealer.value) return 'player';
     if (dealer.value > player.value) return 'dealer';

     // Compare hand cards for tie-breaking
     const playerHandCards = player.handCards.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
     const dealerHandCards = dealer.handCards.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));

     for(let i = 0; i < playerHandCards.length; i++) {
         const diff = getRankValue(playerHandCards[i].rank) - getRankValue(dealerHandCards[i].rank);
         if (diff !== 0) return diff > 0 ? 'player' : 'dealer';
     }

     // Compare kickers if hand cards are identical
     const playerKickers = player.kickers.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
     const dealerKickers = dealer.kickers.sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));

     for(let i = 0; i < playerKickers.length; i++) {
         const diff = getRankValue(playerKickers[i].rank) - getRankValue(dealerKickers[i].rank);
         if (diff !== 0) return diff > 0 ? 'player' : 'dealer';
     }

     return 'tie';
}


function getCombinations<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    function combination(index: number, current: T[]) {
        if (current.length === size) {
            result.push(current);
            return;
        }
        if (index === array.length) {
            return;
        }
        combination(index + 1, [...current, array[index]]);
        combination(index + 1, current);
    }
    combination(0, []);
    return result;
}

export const evaluateHand = (hand: Card[]): HandRank => {
    hand.sort((a, b) => getRankValue(a.rank) - getRankValue(b.rank));
    const ranks = hand.map(c => c.rank);
    const suits = hand.map(c => c.suit);
    const rankCounts = ranks.reduce((acc, rank) => {
        acc[rank] = (acc[rank] || 0) + 1;
        return acc;
    }, {} as Record<Rank, number>);

    const counts = Object.values(rankCounts);
    const uniqueRanks = Object.keys(rankCounts) as Rank[];

    const isFlush = new Set(suits).size === 1;
    const rankValues = hand.map(c => getRankValue(c.rank));
    const isStraight = (rankValues[4] - rankValues[0] === 4 && new Set(rankValues).size === 5) ||
        (ranks.includes('A') && ranks.includes('2') && ranks.includes('3') && ranks.includes('4') && ranks.includes('5'));
    
    const getCardsByCount = (count: number) => uniqueRanks.filter(r => rankCounts[r] === count).map(r => hand.filter(c => c.rank === r)).flat();
    const getKickers = (handCards: Card[]) => hand.filter(c => !handCards.find(hc => hc.rank === c.rank && hc.suit === c.suit));

    if (isStraight && isFlush) {
        const handCards = hand;
        return { name: ranks[4] === 'A' ? 'Royal Flush' : 'Straight Flush', value: ranks[4] === 'A' ? 9 : 8, handCards, kickers: [] };
    }
    if (counts.includes(4)) {
        const handCards = getCardsByCount(4);
        return { name: 'Four of a Kind', value: 7, handCards, kickers: getKickers(handCards) };
    }
    if (counts.includes(3) && counts.includes(2)) {
        const handCards = hand;
        return { name: 'Full House', value: 6, handCards, kickers: [] };
    }
    if (isFlush) {
        return { name: 'Flush', value: 5, handCards: hand, kickers: [] };
    }
    if (isStraight) {
        return { name: 'Straight', value: 4, handCards: hand, kickers: [] };
    }
    if (counts.includes(3)) {
        const handCards = getCardsByCount(3);
        return { name: 'Three of a Kind', value: 3, handCards, kickers: getKickers(handCards) };
    }
    if (counts.filter(c => c === 2).length === 2) {
        const handCards = getCardsByCount(2);
        return { name: 'Two Pair', value: 2, handCards, kickers: getKickers(handCards) };
    }
    if (counts.includes(2)) {
        const handCards = getCardsByCount(2);
        return { name: 'One Pair', value: 1, handCards, kickers: getKickers(handCards) };
    }

    return { name: 'High Card', value: 0, handCards: hand.slice(0, 1), kickers: hand.slice(1) };
};
