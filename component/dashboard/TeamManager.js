"use client";
import TeamCard from "./TeamCard";
import TeamForm from "./TeamForm";
import useCrudManager from "@/hooks/useCrudManager";
import { useState } from "react";

export default function TeamManager({ team }) {
  // For editing the current team
  const [isEditing, setIsEditing] = useState(false);

  // You can use the CRUD manager if you want to allow editing/deleting
  // (optional: you can remove if not needed for now)
  const teamInitialForm = { name: "", division: "", points: "", logo: "" };
  const teamManager = useCrudManager("/api/teams", teamInitialForm);

  // If editing, show the form
  if (isEditing) {
    return (
      <TeamForm
        form={team}
        onChange={(e) =>
          teamManager.setForm({ ...team, [e.target.name]: e.target.value })
        }
        onSubmit={(e) => {
          e.preventDefault();
          // Call your update logic here
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
        submitLabel="Sauvegarder"
      />
    );
  }

  // Otherwise, just show the team card
  return (
    <TeamCard
      team={team}
      onEdit={() => setIsEditing(true)}
      // You can add onDelete or other actions if needed
    />
  );
}
