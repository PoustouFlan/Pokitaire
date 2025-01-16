import {Card, Rank, Suit} from '../components/Card';
import {Deck} from '../components/Deck';
import {Hand} from '../components/Hand';

export const createDeck = (suits: Suit[], values: Rank[]): Deck => {
    return {
        cards: suits.flatMap(suit => values.map(value => ({suit, value, hidden: true})))
    };
};

export const shuffled = (deck: Deck): Deck => {
    const shuffled : Deck = { 
        cards: deck.cards.map(({value, suit}) => ({value, suit, hidden:true}))
    };
    for (let i = shuffled.cards.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        [shuffled.cards[i], shuffled.cards[j]] = [shuffled.cards[j], shuffled.cards[i]];
    }
    return shuffled;
}

export const dealCards = (deck: Deck, hand: Hand, count: number, reveal: boolean = false): { deck: Deck, hand: Hand } => {
    const dealt : Card[] = deck.cards.slice(0, count).map(
        ({suit, value, hidden}) => ({suit, value, hidden:hidden && !reveal})
    );
    return {
        deck: { cards: deck.cards.slice(count) },
        hand: { ...hand, cards: [...hand.cards, ...dealt] }
    };
};
