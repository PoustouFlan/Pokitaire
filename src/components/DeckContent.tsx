import React from 'react';
import { Card, CardComponent, Rank, Suit } from './Card.tsx';

export type DeckContentProps = {
    cards: Card[],
    onClose: () => void
};


export const DeckContentComponent: React.FC<DeckContentProps> = ({ cards, onClose }) => {
    const values: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

    return (
        <div className="deck-popup">
            <div className="popup-content">
                <h2>Remaining Cards in Deck</h2>
                <div className="deck-grid">
                    {suits.map((suit) =>
                        values.map((value) => {
                            const card = cards.find(c => c.suit === suit && c.value === value);
                            return (
                                <div key={`${suit}-${value}`} className="deck-card">
                                    {card ? (
                                        <CardComponent suit={card.suit} value={card.value} hidden={false}/>
                                    ) : (
                                        <div className="empty-card"></div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};
