import React from 'react';
import { Card, CardComponent, Rank, Suit } from './Card.tsx';

export type DeckContentProps = {
    playerCards: Card[],
    tableCards: Card[],
    playerHand: Card[],
    onClose: () => void
};


export const DeckContentComponent: React.FC<DeckContentProps> = ({ playerCards, tableCards, playerHand, onClose }) => {
    const values: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits: Suit[] = ['clubs', 'diamonds', 'spades', 'hearts'];

    return (
        <div className="deck-popup">
            <div className="popup-content">
                <h2>Remaining Cards in Deck</h2>
                <div className="deck-grid">
                    {suits.map((suit) =>
                        values.map((value) => {
                            const playerCard = playerCards.find((c: Card) => c.suit === suit && c.value === value && !c.hidden);
                            if (playerCard)
                                return (
                                    <div key={`${suit}-${value}`} className="deck-card">
                                        {(
                                            <CardComponent suit={suit} value={value} hidden={false}/>
                                        )}
                                    </div>
                                );
                            const tableCard = tableCards.find((c: Card) => c.suit === suit && c.value === value && !c.hidden);
                            if (tableCard)
                                return (<div className="empty-card"></div>);
                            const handCard = playerHand.find((c: Card) => c.suit === suit && c.value === value);
                            if (handCard)
                                return (
                                    <div key={`${suit}-${value}`} className="deck-card in-hand">
                                        {(
                                            <CardComponent suit={suit} value={value} hidden={false}/>
                                        )}
                                    </div>
                                );
                            return (
                                <div key={`${suit}-${value}`} className="deck-card">
                                    {(
                                        <CardComponent suit={suit} value={value} hidden={true}/>
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
