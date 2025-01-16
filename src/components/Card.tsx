import React from 'react';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export type Card = {
    suit: Suit;
    value: Rank;
};

const suitToSprite: Record<Suit, string> = {
    hearts: '/assets/Cards/Hearts-88x124.png',
    diamonds: '/assets/Cards/Diamonds-88x124.png',
    clubs: '/assets/Cards/Clubs-88x124.png',
    spades: '/assets/Cards/Spades-88x124.png',
};

const rankToPosition: Record<Rank, { x: number; y: number }> = {
    A: { x: 0, y: 0 },
    '2': { x: 1, y: 0 },
    '3': { x: 2, y: 0 },
    '4': { x: 3, y: 0 },
    '5': { x: 4, y: 0 },
    '6': { x: 0, y: 1 },
    '7': { x: 1, y: 1 },
    '8': { x: 2, y: 1 },
    '9': { x: 3, y: 1 },
    '10': { x: 4, y: 1 },
    J: { x: 0, y: 2 },
    Q: { x: 1, y: 2 },
    K: { x: 2, y: 2 },
};

export const CardComponent: React.FC<Card> = ({ suit, value }) => {
    const sprite = suitToSprite[suit];
    const position = rankToPosition[value];

    return (
        <div
            className="card"
            style={{
                backgroundImage: `url(${sprite})`,
                backgroundPosition: `-${position.x * 88}px -${position.y * 124}px`,
                width: '88px',
                height: '124px',
            }}
        >
            {/* Optionally add overlay text for accessibility */}
            <span className="sr-only">{`${value} of ${suit}`}</span>
        </div>
    );
};
