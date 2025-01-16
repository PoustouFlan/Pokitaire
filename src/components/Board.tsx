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
    onPlayerDiscard: (index: number) => void;
    startRound: () => void;
    gamePhase: 'discard' | 'play';
    playRound: () => void;
}

export const BoardComponent: React.FC<BoardProps> = ({
    playerDeck,
    tableDeck,
    playerHand,
    tableHand,
    onPlayerDiscard,
    startRound,
    gamePhase,
    playRound
}) => {
    return (
        <div className="game-board">
            <HandComponent hand={tableHand} hidden={gamePhase === 'play' ? 0 : 7} />
            <DeckComponent {...tableDeck} />
            <HandComponent hand={playerHand} onDiscard={onPlayerDiscard} hidden={0}/>
            {gamePhase === 'discard' && (
                <button onClick={playRound}>Play</button>
            )}
            {gamePhase === 'play' && (
                <button onClick={startRound}>New Round</button>
            )}
            <DeckComponent {...playerDeck} />
        </div>
    );
};
