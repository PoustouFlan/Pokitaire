import React from 'react';
import {CardComponent, Card} from './Card';

export type Deck = {
    cards: Card[];
};

export const DeckComponent: React.FC<Deck> = ({ cards }) => {
    return (
        <div className="deck">
            {cards.map((card, index) => (
                <CardComponent key={index} {...card} />
            ))}
        </div>
    );
};
