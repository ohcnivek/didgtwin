'use client';

export interface GameResultMetadata {
    won: boolean | null;
    opponent: string | null;
    score: string | null;
    date?: string;
    shortName: string | null;
}


export function GameResult({ gameData }: { gameData: GameResultMetadata }) {
  const { won, score, date } = gameData;
  
  if (won === null) {
    return (
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">KEVIN SUCKS AT CODING!</h1>
        <p className="text-xl text-gray-600">tell kevin his website is broken</p>
      </div>
    );
  }
  
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : '';
  
  return (
    <div className="text-center px-8">
      <h1 className={`text-9xl font-black mb-8 transition-all ${
        won ? 'text-green-600' : 'text-red-600'
      }`}>
        {won ? 'YES' : 'NO'}
      </h1>
      <div className="text-gray-800 space-y-2">
        <p className="text-2xl font-semibold"> {gameData.shortName} </p>
        <p className="text-xl text-gray-600">{score}</p>
        {formattedDate && <p className="text-lg text-gray-500">{formattedDate}</p>}
      </div>
    </div>
  );
}