import React from 'react';
import {Card, CardComponent} from './Card';

export type Hand = {
    cards: Card[];
};

export type HandProps = {
    hand: Hand;
    onDiscard?: (index: number) => void;
    hidden: number;
}

export const HandComponent: React.FC<HandProps> = ({ hand, onDiscard, hidden }) => {
    return (
        <div className="hand">
            {hand.cards.map((card, index) => (
                <div key={index} className="card-container">
                    <CardComponent card={{suit:card.suit, value:card.value}} hidden={index < hidden}/>
                    {onDiscard && <button onClick={() => onDiscard(index)}>Discard</button>}
                </div>
            ))}
        </div>
    );
};
