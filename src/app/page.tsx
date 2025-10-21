import { GameResult, GameResultMetadata } from "@/components/GameResult";

async function getLastGame(): Promise<GameResultMetadata> {
  try {
    // FYI: Georgia Tech's team ID in ESPN is 59
    const res = await fetch(
      'http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/59/schedule',
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );
    
    if (!res.ok) throw new Error('Failed to fetch');
    
    const data = await res.json();
    const events = data.events || [];
    
    const completedGames = events
      // 1. Find the most recent game where both teams have non-null scores && status of the game is completed.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((event: any) => {
        const competitors = event.competitions?.[0]?.competitors || [];
        const gameStatusIsCompleted = event.competitions?.[0]?.status?.type?.completed === true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return gameStatusIsCompleted && competitors.every((team: any) => 
          team.score?.value != null
        );
      })
      // 2. Sort by descending dates. ie. newest first.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    
    if (completedGames.length === 0) {
      throw new Error("Unable to find recent Georgia Tech games")
    }
    
    const lastGame = completedGames[0];
    const competition = lastGame.competitions[0];
    const teams = competition.competitors;

    // eg. GT @ DUKE
    const shortName = lastGame.shortName;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtTeam = teams.find((team: any) => team.id === '59');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opponentTeam = teams.find((team: any) => team.id !== '59');
    
    const gtScore = gtTeam?.score?.value || 0;
    const oppScore = opponentTeam?.score?.value || 0;
    const didGtWin = gtScore > oppScore;
    
    return {
      won: didGtWin,
      opponent: opponentTeam?.team?.displayName || 'Unknown',
      score: `${Math.round(gtScore)}-${Math.round(oppScore)}`,
      date: lastGame.date,
      shortName: shortName
    };
  } catch (error) {
    console.error('Error trace:', error);
    throw new Error("Failed to fetch Georgia Tech data from ESPN API")
  }
}

export default async function Home() {
  const gameData = await getLastGame();
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <GameResult gameData={gameData} />
    </main>
  );
}
