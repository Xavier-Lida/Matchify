import { useState } from "react";

const statusMap = {
  scheduled: "À venir",
  played: "Joué",
  cancelled: "Annulé",
  postponed: "Reporté",
  // Add more if needed
};

export default function ScheduleDelete({ games = [], onDelete }) {
  const [selectedGameId, setSelectedGameId] = useState("");

  const selectedGame = games.find((game) => game._id === selectedGameId);

  const handleDelete = (e) => {
    e.preventDefault();
    if (selectedGameId && onDelete) {
      onDelete(selectedGameId);
      setSelectedGameId("");
    }
  };

  // Set background color based on status
  const infoBg =
    selectedGame?.status === "played" ? "bg-success" : "bg-gray-100";

  return (
    <form
      className="bg-white p-6 w-full max-w-md flex flex-col gap-4"
      onSubmit={handleDelete}
    >
      <div>
        <label className="block mb-1 font-medium">
          Sélectionner un match à supprimer
        </label>
        <select
          className="select select-bordered w-full"
          value={selectedGameId}
          onChange={(e) => setSelectedGameId(e.target.value)}
          required
        >
          <option value="">Choisir un match</option>
          {games.map((game) => (
            <option key={game._id} value={game._id}>
              {game.date} — {game.teamAName} vs {game.teamBName} (
              {game.location})
            </option>
          ))}
        </select>
      </div>
      {selectedGame?.status === "played" && (
        <div className="text-red-600 font-semibold mt-2">
          Attention ce match a déjà été disputé
        </div>
      )}
      {selectedGame && (
        <div className={`${infoBg} rounded p-3 text-sm mt-2`}>
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
            <strong>Jour:</strong> {selectedGame.day || "N/A"}
          </div>
          <div>
            <strong>Division:</strong> {selectedGame.division || "N/A"}
          </div>
          <div>
            <strong>Trimestre:</strong> {selectedGame.trimester || "N/A"}
          </div>
          <div>
            <strong>Équipe locale:</strong> {selectedGame.teamAName}
          </div>
          <div>
            <strong>Équipe visiteuse:</strong> {selectedGame.teamBName}
          </div>
        </div>
      )}
      <button
        className="btn btn-error w-full mt-2"
        type="submit"
        disabled={!selectedGameId}
      >
        Supprimer le match
      </button>
    </form>
  );
}
