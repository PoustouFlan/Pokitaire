import {Rank, Suit} from '../components/Card';
import {Deck} from '../components/Deck';
import {Hand} from '../components/Hand';

export const createDeck = (suits: Suit[], values: Rank[]): Deck => {
    return {
        cards: suits.flatMap(suit => values.map(value => ({suit, value})))
    };
};

export const shuffled = (deck: Deck): Deck => {
    const shuffled : Deck = { cards: [...deck.cards] };
    for (let i = shuffled.cards.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        [shuffled.cards[i], shuffled.cards[j]] = [shuffled.cards[j], shuffled.cards[i]];
    }
    return shuffled;
}

export const dealCards = (deck: Deck, hand: Hand, count: number): { deck: Deck, hand: Hand } => {
    const dealt = deck.cards.slice(0, count);
    return {
        deck: { cards: deck.cards.slice(count) },
        hand: { ...hand, cards: [...hand.cards, ...dealt] }
    };
};
