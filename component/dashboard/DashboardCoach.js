"use client";
import { useState, useEffect } from "react";
import TeamManager from "./TeamManager";
import SuccessMessage from "./SuccessMessage";

export default function DashboardCoach({ userEmail }) {
  const [team, setTeam] = useState(null);
  const [success, setSuccess] = useState("");

  // Fetch the coach's team
  useEffect(() => {
    async function fetchTeam() {
      try {
        const teamRes = await fetch(`/api/teams?coachEmail=${userEmail}`);
        const teams = await teamRes.json();
        if (teams.length > 0) {
          setTeam(teams[0]);
        } else {
          setTeam(null);
        }
      } catch (err) {
        setSuccess("Erreur lors du chargement de l'équipe.");
      }
    }
    if (userEmail) fetchTeam();
  }, [userEmail]);

  // Handler for updating team info
  const handleTeamUpdate = async () => {
    if (team) {
      const teamRes = await fetch(`/api/teams?coachEmail=${userEmail}`);
      const teams = await teamRes.json();
      setTeam(teams[0]);
      setSuccess("Équipe mise à jour !");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <h2 className="text-xl font-bold mb-4">Tableau de bord Coach</h2>
          <p>Aucune équipe trouvée pour ce coach.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Tableau de bord Coach
        </h2>
        {success && <SuccessMessage message={success} />}
        <TeamManager
          team={team}
          onUpdate={handleTeamUpdate}
          isCoachView={true}
        />
      </div>
    </div>
  );
}
