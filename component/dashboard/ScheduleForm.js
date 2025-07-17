import { useEffect, useState } from "react";
import ScheduleAuto from "./ScheduleAuto";
import ScheduleManu from "./ScheduleManu"; // <-- import the manual form

export default function ScheduleForm({
  onSubmitAuto,
  onSubmitManu,
  onSubmitEdit,
  onCancel,
}) {
  const [activeMode, setActiveMode] = useState(""); // "auto", "manu", "edit"
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data));
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
            className="btn btn-primary"
            onClick={() => setActiveMode("auto")}
          >
            Générer automatiquement l'horaire
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveMode("manu")}
          >
            Générer manuellement l'horaire
          </button>
          <button
            className="btn btn-accent"
            onClick={() => setActiveMode("edit")}
          >
            Modifier l'horaire existant
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
          <form onSubmit={onSubmitEdit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Modifier l'horaire existant
              </label>
              {/* Add your edit schedule fields here */}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-info" type="submit">
                Sauvegarder les modifications
              </button>
            </div>
          </form>
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
