export type VisualSquare = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type AudioSound = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Pair
{
    square: VisualSquare;
    sound: AudioSound;
}

export interface Round
{
    round: number;
    n: number;
    generatedPairs: Pair[];
}