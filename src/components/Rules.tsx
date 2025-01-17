import React from 'react';

export const Rules: React.FC = () => {
    return (
        <>
            <h1>Rules</h1>
            <div>
            <div className="rules">
                This is a solitaire game, opposing you to the table.
                You both start with 26 cards in your <b>deck</b>.
                Your deck is he bottom one, highlighted in red.
                Multiple <b>rounds</b> are played as follows:

                <ul>
                    <li>The table draws 7 cards from its deck.
                        You draw 5 cards from yours.</li>
                    <li>As many time as you wish, you may discard one of the
                        cards in your hand and draw a new card to improve your
                        hand. Be careful, as discarded cards goes directly
                        into the table's deck.</li>
                    <li>When you feel comfortable with your hand, you can
                        then hit <b>reveal</b>.
                        The table will then chose 5 cards from its hand,
                        making the best Poker hand it can.</li>
                    <li>The player having the best Poker hand gets to take
                        all of the opponent cards into his deck.</li>
                    <li>In the event of a tie, both players gets to take
                        the opponent's cards into his deck.</li>
                </ul>

                You may click on your deck to reveal what information you
                have about the cards.

                First player to get all 52 cards in his deck wins.
                Good luck!
            </div>
            <h2>Poker Hands</h2>
            <div className="rules">
                Memo about Poker hands ranking, from strongest to weakest:
                <ol>
                    <li><b>Straight Flush</b>: 5 cards of same suit in sequential order</li>
                    <li><b>Four of a Kind</b>: 4 cards of same rank</li>
                    <li><b>Full House</b>: Combination of Three of a Kind and a Pair in the same hand</li>
                    <li><b>Flush</b>: 5 cards of the same suit, in any order</li>
                    <li><b>Straight</b>: 5 cards in sequential order, of any suit</li>
                    <li><b>Three of a Kind</b>: Any 3 cards of same rank</li>
                    <li><b>Two Pairs</b>: Two different pairs in the same hand</li>
                    <li><b>Pair</b>: Any 2 cards of same rank</li>
                    <li><b>High Card</b>: Anything else.</li>
                </ol>

                In the event of a tie, hands are decided by the rank of the cards,
                Ace being the highest card and 2 the lowest.
            </div>
            </div>
        </>
    );
};
