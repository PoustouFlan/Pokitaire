import React from 'react';
import { Hand, HandComponent } from "./Hand";
import { Deck, DeckComponent } from "./Deck";

export type Board = {
    playerDeck: Deck;
    tableDeck: Deck;
    playerHand: Hand;
    tableHand: Hand;
};

export type BoardProps = {
    playerDeck: Deck;
    tableDeck: Deck;
    playerHand: Hand;
    tableHand: Hand;
    onPlayerDiscard?: (index: number) => void;
    onDeckClick?: () => void;
}

export const BoardComponent: React.FC<BoardProps> = ({
    playerDeck,
    tableDeck,
    playerHand,
    tableHand,
    onPlayerDiscard,
    onDeckClick,
}) => {
    return (
        <div className="game-board">
            <div className="side table">
                <HandComponent hand={tableHand} />
            </div>
            <div className="side player">
                <HandComponent hand={playerHand} onDiscard={onPlayerDiscard} />
            </div>
            <div className="decks">
                <DeckComponent {...tableDeck} />
                <DeckComponent cards={playerDeck.cards} onClick={onDeckClick}/>
            </div>
        </div>
    );
};
