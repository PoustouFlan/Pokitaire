import { Hand } from '../components/Hand';

export const evaluatePokerHand = (hand: Hand): number => {
    // TODO
    return Math.random();
};

export const compareHands = (hand1: Hand, hand2: Hand): -1 | 0 | 1 => {
    const score1 = evaluatePokerHand(hand1);
    const score2 = evaluatePokerHand(hand2);
    return score1 === score2 ? 0 : score1 > score2 ? 1 : -1;
};
