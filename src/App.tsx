import './App.css';
import { useState } from "react";
import { createDeck, dealCards, shuffled } from "./utils/deckUtils";
import { Card, Rank, Suit } from "./components/Card";
import { Board, BoardComponent } from "./components/Board";
import { compareEval, evaluatePokerHand, extractBestHand } from "./utils/pokerUtils";
import { DeckContentComponent } from './components/DeckContent';
import { Amogus } from './components/Amogus';
import { Rules } from './components/Rules';


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
    const [playerKnown, setPlayerKnown] = useState<Card[]>([]);
    const [tableKnown, setTableKnown] = useState<Card[]>([]);
    const [revealAnim, setRevealAnim] = useState<any>(null);

    function onPlayerDiscard(index: number) {
        if (board.playerDeck.cards.length === 0)
            return;

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
        setPlayerKnown(playerKnown.filter(
            ({suit, value}) => suit !== discarded.suit && value !== discarded.value
        ));

        if (newBoard.playerDeck.cards.length === 0)
            setTableKnown(newBoard.tableDeck.cards.concat(newBoard.tableHand.cards));
        else
            setTableKnown(tableKnown.concat(discarded));
    }

    function startRound() {
        const { deck: playerDeck, hand: playerHand } = dealCards(shuffled(board.playerDeck), board.playerHand, 5, true);
        const { deck: tableDeck, hand: tableHand } = dealCards(shuffled(board.tableDeck), board.tableHand, 7);
        setBoard({ playerDeck, tableDeck, playerHand, tableHand });
        setGamePhase('discard'); // Set phase to discard after dealing cards
        setTableKnown([...new Set(tableKnown)]);
        setPlayerKnown([...new Set(playerKnown)]);
    }

    function revealRound() {
        const tableHand = board.tableHand;
        const playedCards = extractBestHand(tableHand);
        const newTableKnown = tableKnown;

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
                            newTableKnown.push(tableHand.cards[i]);
                            setTableKnown(newTableKnown);
                            setBoard({ ...board });
                            setRevealing(false);
                        }, 500);
                        return;
                    }
                    oneRevealed = true;
                    tableHand.cards[i].hidden = false;
                    newTableKnown.push(tableHand.cards[i]);
                    setTableKnown(newTableKnown);
                    revealedCount++;
                    break;
                }
            }
            setBoard({ ...board });
            if (!oneRevealed) {
                clearInterval(revealInterval);
                setRevealing(false);
                setRevealAnim(null);
            }
        }, 200);
        setRevealAnim(revealInterval);
        setGamePhase('revealing');
    }

    function playRound() {
        if (revealing)
        {
            clearInterval(revealAnim);
            setRevealAnim(null);

            const tableHand = board.tableHand;
            const playedCards = extractBestHand(tableHand);
            for (let i = 0; i < tableHand.cards.length; i++) {
                if (!tableHand.cards[i].hidden) continue;
                if (playedCards.includes(tableHand.cards[i])) {
                    tableHand.cards[i].hidden = false;
                }
            }
            setBoard({ ...board });

            setRevealing(false);
            return;
        }

        const playerHand = board.playerHand;
        const playerEval = evaluatePokerHand(playerHand.cards);
        const tableHand = extractBestHand(board.tableHand);
        const tableEval = evaluatePokerHand(tableHand);

        const result = compareEval(playerEval, tableEval);

        let newBoard: Board;
        if (result === 1) {
            newBoard = {
                tableDeck: {cards: [...board.tableDeck.cards,
                    ...board.tableHand.cards.filter(
                    ({value, suit}) => !tableHand.find(
                        ({value:v2, suit:s2}) => value === v2 && suit === s2
                    ))
                ]},
                playerDeck: { cards: [...board.playerDeck.cards, ...tableHand, ...playerHand.cards] },
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
            setPlayerKnown([...playerKnown, ...tableHand, ...playerHand.cards]);
            setTableKnown(tableKnown.filter(
                    ({value, suit}) => !tableHand.find(
                        ({value:v2, suit:s2}) => value === v2 && suit === s2
                    ))
            );
        } else if (result === 0) {
            newBoard = {
                playerDeck: { cards: [...board.playerDeck.cards, ...tableHand] },
                tableDeck: { cards: [...board.tableDeck.cards, ...playerHand.cards,
                    ...board.tableHand.cards.filter(
                    ({value, suit}) => !tableHand.find(
                        ({value:v2, suit:s2}) => value === v2 && suit === s2
                    ))
                ]},
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
            setTableKnown([...playerHand.cards, ...tableKnown.filter(
                    ({value, suit}) => !tableHand.find(
                        ({value:v2, suit:s2}) => value === v2 && suit === s2
                    ))
            ]);
            setPlayerKnown([...tableHand, ...playerKnown.filter(
                    ({value, suit}) => !playerHand.cards.find(
                        ({value:v2, suit:s2}) => v2 === value && s2 === suit
                    ))
            ]);
        } else {
            newBoard = {
                ...board,
                tableDeck: { cards: [...board.tableDeck.cards, ...board.tableHand.cards, ...playerHand.cards] },
                playerHand: { cards: [] },
                tableHand: { cards: [] },
            };
            setTableKnown([...tableKnown, ...playerHand.cards, ...tableHand]);
            setPlayerKnown(playerKnown.filter(
                    ({value, suit}) => !playerHand.cards.find(
                        ({value:v2, suit:s2}) => v2 === value && s2 === suit
                    ))
            );
        }
        setBoard(newBoard);
        setGamePhase('play');
        if (newBoard.playerDeck.cards.length === 0) setGamePhase('lose');
        if (newBoard.tableDeck.cards.length === 0) setGamePhase('win');
    }


    function toggleDeckPopup() {
        setShowDeckPopup(prev => !prev); // Toggle the visibility of the deck pop-up
    }

    return (
        <div className="page">
            {gamePhase === 'win' && (
                <div className="end-screen">
                    <h1>You Win! 🎉</h1>
                    <Amogus/>
                </div>
            )}
            {gamePhase === 'lose' && (
                <div className="end-screen">
                    <h1>You Lose! 😢</h1>
                    <Amogus/>
                </div>
            )}
            {gamePhase !== 'win' && gamePhase !== 'lose' && (
                <>
                    <h1>Pokitaire</h1>
                    <BoardComponent
                        playerDeck={board.playerDeck}
                        tableDeck={board.tableDeck}
                        playerHand={board.playerHand}
                        tableHand={board.tableHand}
                        onPlayerDiscard={(gamePhase === 'discard' && board.playerDeck.cards.length > 0) ? onPlayerDiscard : undefined}
                        onDeckClick={toggleDeckPopup}
                    />
                    {gamePhase === 'discard' && (
                        <button onClick={revealRound}>Reveal</button>
                    )}
                    {gamePhase === 'revealing' && !revealing && (
                        <button onClick={playRound}>Resolve</button>
                    )}
                    {gamePhase === 'revealing' && revealing && (
                        <button onClick={playRound}>Skip</button>
                    )}
                    {gamePhase === 'play' && (
                        <button onClick={startRound}>New Round</button>
                    )}
                    <Rules/>
                </>
            )}

            {showDeckPopup && (
                <DeckContentComponent
                    playerKnown={playerKnown}
                    tableKnown={tableKnown}
                    playerHand={board.playerHand.cards}
                    onClose={toggleDeckPopup}/>
            )}
        </div>
    );
}

export default App;
