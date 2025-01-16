import React from 'react';
import {Card} from './Card';

export type Deck = {
    cards: Card[];
};

export const DeckComponent: React.FC<Deck> = ({ cards }) => {
    return (
        <div
            className="deck"
            style={{
                backgroundImage: cards.length > 0 ? `url(/assets/Cards/Card_DeckA-88x140.png)` : "",
                backgroundPosition: cards.length > 0 ? `-88px 0px` : "",
                width: '88px',
                height: `${140 - (52 - cards.length) / 4}px`,
            }}
        >
            <h1>{ cards.length } Card{ cards.length > 1 && "s"}</h1>
        </div>
    );
};
