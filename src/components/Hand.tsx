import React from 'react';
import {Card, CardComponent} from './Card';
import {evaluatePokerHand, handTypes} from '../utils/pokerUtils';

export type Hand = {
    cards: Card[];
};

export type HandProps = {
    hand: Hand;
    onDiscard?: (index: number) => void;
}

export const HandComponent: React.FC<HandProps> = ({ hand, onDiscard }) => {
    const visibleCards = hand.cards.filter(card => !card.hidden);
    const handKind = visibleCards.length == 0 ? "" :
        handTypes[evaluatePokerHand(visibleCards)[0]];

    return (
        <div className="hand">
            {hand.cards.map((card, index) => (
                <div key={index} className="card-container">
                    <CardComponent {...card}/>
                    {onDiscard && <button onClick={() => onDiscard(index)}>Discard</button>}
                </div>
            ))}
            <div className="hand-type">{handKind}</div>
        </div>
    );
};
