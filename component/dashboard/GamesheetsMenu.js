import { useState } from "react";

export default function GamesheetsMenu({
  team,
  games,
  teams,
  players,
  onClose,
}) {
  const [selectedGameId, setSelectedGameId] = useState("");

  const selectedGame = games.find((g) => g._id === selectedGameId);

  // Get the opponent's name for the game
  const getOpponentName = (game) => {
    if (!team || !game || !teams) return "";
    const opponentId = game.teamA === team._id ? game.teamB : game.teamA;
    const opponent = teams.find((t) => t._id === opponentId);
    return opponent ? opponent.name : opponentId;
  };

  // Find opponent object for selectedGame
  const opponent =
    selectedGame &&
    teams.find(
      (t) =>
        t._id ===
        (selectedGame.teamA === team._id
          ? selectedGame.teamB
          : selectedGame.teamA)
    );

  // Open the PDF in a new tab
  const handleServerPrint = () => {
    if (!selectedGame) return;
    window.open(
      `/api/gamesheet-pdf?gameId=${selectedGame._id}&teamId=${team._id}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Blur and freeze the background */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30 pointer-events-none" />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative z-10">
          <button
            className="absolute top-2 right-2 btn btn-sm btn-circle"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4 text-center">
            Feuilles de match
          </h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Sélectionner un match
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
            >
              <option value="">Choisir un match</option>
              {games.map((game) => (
                <option key={game._id} value={game._id}>
                  {game.date} — {team.name} vs {getOpponentName(game)} (
                  {game.location})
                </option>
              ))}
            </select>
          </div>
          {selectedGame && (
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <div>
                <strong>Date:</strong> {selectedGame.date}
              </div>
              <div>
                <strong>Heure:</strong> {selectedGame.time || "N/A"}
              </div>
              <div>
                <strong>Lieu:</strong> {selectedGame.location}
              </div>
              <div>
                <strong>Équipes:</strong> {team.name} vs{" "}
                {getOpponentName(selectedGame)}
              </div>
            </div>
          )}
          <button
            className="btn btn-primary w-full"
            onClick={handleServerPrint}
            disabled={!selectedGameId}
          >
            Imprimer la feuille de match
          </button>
        </div>
      </div>
    </div>
  );
}
