import React, {useEffect, useState} from 'react';
import { Card } from './Card.tsx';
import {evaluatePokerHand, extractBestHand, getRandomCombination, handTypes} from '../utils/pokerUtils.ts';

export type PredictorProps = {
    tableKnown: Card[],
};


export const Predictor: React.FC<PredictorProps> = ({ tableKnown }) => {
    const [histogram, setHistogram] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        const sim = setInterval(() => {
            for (let i = 0; i < 3000; i++)
            {
                const combination = getRandomCombination(tableKnown, 7);
                const hand = extractBestHand({ cards: combination });
                const evaluation = evaluatePokerHand(hand);
                histogram[evaluation[0]]++;
            }
            setHistogram([...histogram]);
        }, 3000);
        return () => clearInterval(sim);
    }, [tableKnown]);


    const total = histogram.reduce((a, b) => a + b);
    const approx = Math.min(100, Math.pow(10, Math.round(Math.log10(total) - 4)));
    const sortedHistogram = Object.entries(histogram)
        .map(([rank, count]) => [parseInt(rank), count] as [number, number])
        .sort((a, b) => b[1] - a[1] || a[0] - b[0]);

    return (
        <>
            {total > 0 && (
                <>
                <h1>Predictor</h1>
                <div className="rules">
                <ol>
                    { sortedHistogram.map(([index, value]) => (
                        <li key={index}>
                            {handTypes[index]} ({Math.round(value * 100 * approx / total) / approx}%)
                        </li>
                    ))}
                </ol>
                </div>
                </>
            )}
        </>
    );
};
