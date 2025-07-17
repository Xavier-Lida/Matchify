import { useEffect, useState } from "react";
import ScheduleAuto from "./ScheduleAuto";
import ScheduleManu from "./ScheduleManu";
import ScheduleDelete from "./ScheduleDelete"; // Import the component

export default function ScheduleForm({
  onSubmitAuto,
  onSubmitManu,
  onDeleteGame,
  onCancel,
}) {
  const [activeMode, setActiveMode] = useState(""); // "auto", "manu", "edit"
  const [teams, setTeams] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data));
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, []);

  // Handler for back arrow
  const handleBack = () => setActiveMode("");

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col mt-15 mb-20">
      <h2 className="text-xl font-bold mb-2">Gestion de l'horaire</h2>
      {/* Main menu */}
      {activeMode === "" && (
        <div className="flex flex-col gap-3 mb-3">
          <button
            className="btn btn-warning"
            onClick={() => setActiveMode("auto")}
          >
            Générer automatiquement l'horaire
          </button>
          <button
            className="btn btn-success"
            onClick={() => setActiveMode("manu")}
          >
            Générer manuellement l'horaire
          </button>
          <button
            className="btn btn-error"
            onClick={() => setActiveMode("edit")}
          >
            Supprimer un match
          </button>
          <button
            className="btn btn-neutral-content"
            type="button"
            onClick={onCancel}
          >
            Annuler
          </button>
        </div>
      )}

      {/* Sub-menus with back arrow */}
      {activeMode === "auto" && (
        <>
          <ScheduleAuto
            onSubmit={onSubmitAuto}
            submitLabel="Générer l'horaire"
          />
          <div className="flex justify-end">
            <button
              className="btn btn-ghost flex items-center"
              type="button"
              onClick={handleBack}
            >
              <span className="mr-2">&#8592;</span> Retour
            </button>
            <button className="btn btn-ghost" type="button" onClick={onCancel}>
              Annuler
            </button>
          </div>
        </>
      )}

      {activeMode === "manu" && (
        <>
          <ScheduleManu
            teams={teams}
            divisions={["1", "2", "3"]}
            onSubmit={onSubmitManu}
            submitLabel="Ajouter le match"
          />
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="btn btn-ghost flex items-center"
              type="button"
              onClick={handleBack}
            >
              <span className="mr-2">&#8592;</span> Retour
            </button>
            <button className="btn btn-ghost" type="button" onClick={onCancel}>
              Annuler
            </button>
          </div>
        </>
      )}

      {activeMode === "edit" && (
        <>
          <ScheduleDelete
            games={games.map((game) => ({
              ...game,
              teamAName:
                teams.find((t) => t._id === game.teamA)?.name || game.teamA,
              teamBName:
                teams.find((t) => t._id === game.teamB)?.name || game.teamB,
            }))}
            onDelete={onDeleteGame}
          />
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-ghost flex items-center"
              type="button"
              onClick={handleBack}
            >
              <span className="mr-2">&#8592;</span> Retour
            </button>
            <button className="btn btn-ghost" type="button" onClick={onCancel}>
              Annuler
            </button>
          </div>
        </>
      )}
    </div>
  );
}
