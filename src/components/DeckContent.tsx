import React from 'react';
import { Card, CardComponent, Rank, Suit } from './Card.tsx';

export type DeckContentProps = {
    playerKnown: Card[],
    tableKnown: Card[],
    playerHand: Card[],
    onClose: () => void
};


export const DeckContentComponent: React.FC<DeckContentProps> = ({ playerKnown, tableKnown, playerHand, onClose }) => {
    const values: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits: Suit[] = ['clubs', 'diamonds', 'spades', 'hearts'];

    return (
        <div className="deck-popup">
            <div className="popup-content">
                <h2>Remaining Cards in Deck</h2>
                <div className="deck-grid">
                    {suits.map((suit) =>
                        values.map((value) => {
                            const handCard = playerHand.find((c: Card) => c.suit === suit && c.value === value);
                            if (handCard)
                                return (
                                    <div key={`${suit}-${value}`} className="deck-card in-hand">
                                        {(
                                            <CardComponent suit={suit} value={value} hidden={false}/>
                                        )}
                                    </div>
                                );
                            const playerCard = playerKnown.find((c: Card) => c.suit === suit && c.value === value);
                            if (playerCard)
                                return (
                                    <div key={`${suit}-${value}`} className="deck-card">
                                        {(
                                            <CardComponent suit={suit} value={value} hidden={false}/>
                                        )}
                                    </div>
                                );
                            const tableCard = tableKnown.find((c: Card) => c.suit === suit && c.value === value);
                            if (tableCard)
                                return (<div key={`${suit}-${value}`} className="empty-card"></div>);
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
                <div className="rules">
                    <ul>
                        <li>Cards you have in your hand are highlighted.</li>
                        <li>Cards you that are in your deck are shown.</li>
                        <li>Cards you that are in the table's deck are absent.</li>
                        <li>Cards you have no sufficient information about are shown face down.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
