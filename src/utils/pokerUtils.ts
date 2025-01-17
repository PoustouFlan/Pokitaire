import { Card, Rank } from '../components/Card';
import { Hand } from '../components/Hand';

function rankToIndex(rank: Rank): number {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    return ranks.indexOf(rank);
}

function getRankHistogram(ranks: number[]): [number, number][] {
    const histogram: { [key: number]: number } = {};

    // Count the occurrences of each rank
    for (const rank of ranks) {
        histogram[rank] = (histogram[rank] || 0) + 1;
    }

    // Convert the histogram to an array of [count, rank] pairs
    const sortedHistogram = Object.entries(histogram)
        .map(([rank, count]) => [parseInt(rank), count] as [number, number])
        .sort((a, b) => b[1] - a[1] || b[0] - a[0]); // Sort by count (desc) and then by rank (desc)

    return sortedHistogram;
}

export const handTypes = [
    "High Card",
    "Pair",
    "Two Pairs",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Full House",
    "Four of a Kind",
    "Straight Flush"
];

export const evaluatePokerHand = (cards: Card[]): number[] => {
    // 8 - Straight Flush
    // 7 - Four of a Kind
    // 6 - Full House
    // 5 - Flush
    // 4 - Straight
    // 3 - Three of a Kind
    // 2 - Two Pairs
    // 1 - Pair
    // 0 - High Card
    const ranks = cards.map(card => rankToIndex(card.value)).sort((a, b) => b - a);
    const suits = cards.map(card => card.suit).sort();

    const flush = suits.length == 5 && suits.every(suit => suit === suits[0]);
    const straight = (
        ranks[3] === ranks[4] + 1
        && ranks[2] === ranks[4] + 2
        && ranks[1] === ranks[4] + 3
        && ranks[0] === ranks[4] + 4
    ) || (JSON.stringify(ranks) === "[12,3,2,1,0]");

    const histogram = getRankHistogram(ranks);

    if (straight && flush)
        return [8, ranks[1]];
    if (histogram.length > 0 && histogram[0][1] === 4)
        return [7, ...histogram.map(([rank, _]) => rank)];
    if (histogram.length > 1 && histogram[0][1] === 3 && histogram[1][1] === 2)
        return [6, ...histogram.map(([rank, _]) => rank)];
    if (flush)
        return [5, ...ranks];
    if (straight)
        return [4, ranks[1]];
    if (histogram.length > 0 && histogram[0][1] === 3)
        return [3, ...histogram.map(([rank, _]) => rank)];
    if (histogram.length > 1 && histogram[0][1] === 2 && histogram[1][1] === 2)
        return [2, ...histogram.map(([rank, _]) => rank)];
    if (histogram.length > 0 && histogram[0][1] === 2)
        return [1, ...histogram.map(([rank, _]) => rank)];
    return [0, ...ranks];
};

function getCombinations<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    const f = (prefix: T[], remaining: T[]) => {
        if (prefix.length === size) {
            result.push(prefix);
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            f([...prefix, remaining[i]], remaining.slice(i + 1));
        }
    };
    f([], arr);
    return result;
}

export const extractBestHand = (hand: Hand): Card[] => {
    const allCombinations = getCombinations(hand.cards, 5);
    let bestHand: Card[] = hand.cards.slice(0, 5);
    let bestEval: number[] = evaluatePokerHand(bestHand);

    for (const combination of allCombinations) {
        const evaluation = evaluatePokerHand(combination);
        if (compareEval(evaluation, bestEval) === 1) {
            bestEval = evaluation;
            bestHand = [...combination];
        }
    }

    return bestHand;
};

export const compareEval = (eval1 : number[], eval2: number[]) : -1 | 0 | 1 => {
    // 1  - eval1 wins
    // 0  - tie
    // -1 - eval2 wins

    for (let i = 0; i < Math.min(eval1.length, eval2.length); i++) {
        if (eval1[i] > eval2[i]) return 1;
        if (eval1[i] < eval2[i]) return -1;
    }
    if (eval1.length > eval2.length)
        return 1;
    if (eval1.length < eval2.length)
        return -1;
    return 0;
}
