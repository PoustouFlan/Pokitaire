import './App.css';
import { useState } from "react";
import { createDeck, dealCards, shuffled } from "./utils/deckUtils";
import { Rank } from "./components/Card";
import { Board, BoardComponent } from "./components/Board";
import { compareHands } from "./utils/pokerUtils";

function App() {
    const values: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    const [gamePhase, setGamePhase] = useState<'discard' | 'play'>('play');
    const [board, setBoard] = useState<Board>({
        playerDeck: shuffled(createDeck(['hearts', 'diamonds'], values)),
        tableDeck: shuffled(createDeck(['clubs', 'spades'], values)),
        playerHand: { cards: [] },
        tableHand: { cards: [] },
    });

    // Handle discarding a card
    function onPlayerDiscard(index: number) {
        if (board.playerDeck.cards.length === 0) return;

        const discarded = board.playerHand.cards[index];
        const picked = board.playerDeck.cards.pop()!;
        const newBoard = {
            ...board,
            playerHand: {
                cards: [
                    ...board.playerHand.cards.slice(0, index),
                    ...board.playerHand.cards.slice(index + 1),
                    picked
                ]
            },
            tableDeck: { cards: board.tableDeck.cards.concat(discarded) }
        };
        setBoard(newBoard);
    }

    // Start a new round by dealing cards
    function startRound() {
        const { deck: playerDeck, hand: playerHand } = dealCards(board.playerDeck, board.playerHand, 5);
        const { deck: tableDeck, hand: tableHand } = dealCards(board.tableDeck, board.tableHand, 7);
        const newBoard = { playerDeck, tableDeck, playerHand, tableHand };
        setBoard(newBoard);
        setGamePhase('discard'); // Set phase to discard after dealing cards
    }

    // Handle the play phase where hands are compared
    function playRound() {
        const playerHand = board.playerHand;
        const tableHand = board.tableHand;

        const result = compareHands(playerHand, tableHand);

        let newBoard;
        if (result === 1) {
            // Player wins, add table hand to player deck
            newBoard = {
                ...board,
                playerDeck: { cards: [...board.playerDeck.cards, ...tableHand.cards, ...playerHand.cards] },
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
        } else if (result === 0) // tie
        {
            newBoard = {
                playerDeck: { cards: [...board.playerDeck.cards, ...tableHand.cards] },
                tableDeck: { cards: [...board.tableDeck.cards, ...playerHand.cards] },
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
        }
        else {
            // Table wins, add player hand to table deck
            newBoard = {
                ...board,
                tableDeck: { cards: [...board.tableDeck.cards, ...tableHand.cards, ...playerHand.cards] },
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
        }

        setBoard(newBoard);
        setGamePhase('play'); // End the round and switch to play phase
    }

    return (
        <BoardComponent
            playerDeck={board.playerDeck}
            tableDeck={board.tableDeck}
            playerHand={board.playerHand}
            tableHand={board.tableHand}
            onPlayerDiscard={onPlayerDiscard}
            startRound={startRound}
            gamePhase={gamePhase}
            playRound={playRound}
        />
    );
}

export default App;
