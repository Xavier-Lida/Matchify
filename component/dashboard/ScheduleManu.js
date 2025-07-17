import { useState } from "react";

export default function ScheduleManu({
  teams = [],
  divisions = ["1", "2", "3"],
  onSubmit,
  submitLabel = "Ajouter le match",
}) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    location: "",
    day: "",
    division: "",
    teamA: "",
    teamB: "",
    trimester: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Filter teams by selected division
  const filteredTeams = form.division
    ? teams.filter((team) => String(team.division) === String(form.division))
    : [];

  return (
    <form
      className="bg-white p-6 w-full max-w-md flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {/* Date & Time */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Date</label>
          <input
            name="date"
            type="date"
            className="input input-bordered w-full"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Heure</label>
          <input
            name="time"
            type="time"
            className="input input-bordered w-full"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      {/* Location & Day */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Lieu</label>
          <select
            name="location"
            className="select select-bordered w-full"
            value={form.location}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner le lieu</option>
            <option value="Séminaire 1">Séminaire 1</option>
            <option value="Séminaire 2">Séminaire 2</option>
            <option value="Séminaire 3">Séminaire 3</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Jour</label>
          <select
            name="day"
            className="select select-bordered w-full"
            value={form.day}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner le jour</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="quart de finale">Quart de finale</option>
            <option value="demi-finale">Demi-finale</option>
            <option value="finale">Finale</option>
          </select>
        </div>
      </div>
      {/* Division & Trimester */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Division</label>
          <select
            name="division"
            className="select select-bordered w-full"
            value={form.division}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner une division</option>
            {divisions.map((div) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Trimestre</label>
          <select
            name="trimester"
            className="select select-bordered w-full"
            value={form.trimester}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner le trimestre</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>
      {/* Teams */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Équipe locale</label>
          <select
            name="teamA"
            className="select select-bordered w-full"
            value={form.teamA}
            onChange={handleChange}
            required
            disabled={!form.division}
          >
            <option value="">Sélectionner l'équipe locale</option>
            {filteredTeams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Équipe visiteuse</label>
          <select
            name="teamB"
            className="select select-bordered w-full"
            value={form.teamB}
            onChange={handleChange}
            required
            disabled={!form.division}
          >
            <option value="">Sélectionner l'équipe visiteuse</option>
            {filteredTeams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-success w-full" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
