import React from 'react';
import {Card, CardComponent} from './Card';

export type Hand = {
    cards: Card[];
};

export type HandProps = {
    hand: Hand;
    onDiscard?: (index: number) => void;
}

export const HandComponent: React.FC<HandProps> = ({ hand, onDiscard }) => {
    return (
        <div className="hand">
            {hand.cards.map((card, index) => (
                <div key={index} className="card-container">
                    <CardComponent suit={card.suit} value={card.value}/>
                    {onDiscard && <button onClick={() => onDiscard(index)}>Discard</button>}
                </div>
            ))}
        </div>
    );
};
