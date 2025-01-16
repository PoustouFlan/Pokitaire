import './App.css';
import { useState } from "react";
import { createDeck, dealCards, shuffled } from "./utils/deckUtils";
import { Card, CardComponent, Rank, Suit } from "./components/Card";
import { Board, BoardComponent } from "./components/Board";
import { compareEval, evaluatePokerHand, extractBestHand } from "./utils/pokerUtils";
import {DeckContentComponent} from './components/DeckContent';

function App() {
    const values: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const deck = shuffled(createDeck(suits, values));

    const [gamePhase, setGamePhase] = useState<'discard' | 'play' | 'revealing' | 'win' | 'lose'>('play');
    const [board, setBoard] = useState<Board>({
        playerDeck: { cards: deck.cards.slice(0, 26) },
        tableDeck: { cards: deck.cards.slice(26) },
        playerHand: { cards: [] },
        tableHand: { cards: [] },
    });
    const [revealing, setRevealing] = useState(false);
    const [showDeckPopup, setShowDeckPopup] = useState(false); // New state for pop-up visibility

    function onPlayerDiscard(index: number) {
        if (board.playerDeck.cards.length === 0) return;

        const discarded = board.playerHand.cards[index];
        const picked: Card = {
            ...board.playerDeck.cards.pop()!,
            hidden: false
        };
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

    function startRound() {
        const { deck: playerDeck, hand: playerHand } = dealCards(shuffled(board.playerDeck), board.playerHand, 5, true);
        const { deck: tableDeck, hand: tableHand } = dealCards(shuffled(board.tableDeck), board.tableHand, 7);
        const newBoard = { playerDeck, tableDeck, playerHand, tableHand };
        setBoard(newBoard);
        setGamePhase('discard'); // Set phase to discard after dealing cards
    }

    function revealRound() {
        const tableHand = board.tableHand;
        const playedCards = extractBestHand(tableHand);

        setRevealing(true);
        let revealedCount = 0;
        const revealInterval = setInterval(() => {
            let oneRevealed = false;
            for (let i = 0; i < tableHand.cards.length; i++) {
                if (!tableHand.cards[i].hidden) continue;
                if (playedCards.includes(tableHand.cards[i])) {
                    if (revealedCount === 4) {
                        clearInterval(revealInterval);
                        setTimeout(() => {
                            tableHand.cards[i].hidden = false;
                            setBoard({ ...board });
                            setRevealing(false);
                            setGamePhase('revealing');
                        }, 500);
                        return;
                    }
                    oneRevealed = true;
                    tableHand.cards[i].hidden = false;
                    revealedCount++;
                    break;
                }
            }
            setBoard({ ...board });
            if (!oneRevealed) {
                clearInterval(revealInterval);
                setRevealing(false);
            }
        }, 200);
        setGamePhase('revealing');
    }

    function playRound() {
        const playerHand = board.playerHand;
        const playerEval = evaluatePokerHand(playerHand.cards);
        const tableHand = extractBestHand(board.tableHand);
        const tableEval = evaluatePokerHand(tableHand);

        const result = compareEval(playerEval, tableEval);

        let newBoard;
        if (result === 1) {
            newBoard = {
                ...board,
                playerDeck: { cards: [...board.playerDeck.cards, ...board.tableHand.cards, ...playerHand.cards] },
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
        } else if (result === 0) {
            newBoard = {
                playerDeck: { cards: [...board.playerDeck.cards, ...board.tableHand.cards] },
                tableDeck: { cards: [...board.tableDeck.cards, ...playerHand.cards] },
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
        } else {
            newBoard = {
                ...board,
                tableDeck: { cards: [...board.tableDeck.cards, ...board.tableHand.cards, ...playerHand.cards] },
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
        }
        setBoard(newBoard);
        setGamePhase('play');
        if (board.playerDeck.cards.length === 0) setGamePhase('lose');
        if (board.tableDeck.cards.length === 0) setGamePhase('win');
    }

    function handleReplay() {
        window.location.reload();
    }

    function toggleDeckPopup() {
        setShowDeckPopup(prev => !prev); // Toggle the visibility of the deck pop-up
    }

    return (
        <>
            {gamePhase === 'win' && (
                <div>
                    <h1>You Win! 🎉</h1>
                    <button onClick={handleReplay}>Play Again!</button>
                </div>
            )}
            {gamePhase === 'lose' && (
                <div>
                    <h1>You Lose! 😢</h1>
                    <button onClick={handleReplay}>Play again!</button>
                </div>
            )}
            {gamePhase !== 'win' && gamePhase !== 'lose' && (
                <>
                    <BoardComponent
                        playerDeck={board.playerDeck}
                        tableDeck={board.tableDeck}
                        playerHand={board.playerHand}
                        tableHand={board.tableHand}
                        onPlayerDiscard={(gamePhase === 'discard' && board.playerDeck.cards.length > 0) ? onPlayerDiscard : null}
                    />
                    <div className="deck-info" onClick={toggleDeckPopup}>
                        <button>Show Deck</button>
                    </div>
                    {gamePhase === 'discard' && (
                        <button onClick={revealRound}>Reveal</button>
                    )}
                    {gamePhase === 'revealing' && (
                        <button onClick={playRound} disabled={revealing}>Resolve</button>
                    )}
                    {gamePhase === 'play' && (
                        <button onClick={startRound}>New Round</button>
                    )}
                </>
            )}

            {/* Deck Pop-up */}
            {showDeckPopup && (
                <DeckContentComponent cards={board.playerDeck.cards} onClose={toggleDeckPopup}/>
            )}
        </>
    );
}

export default App;
