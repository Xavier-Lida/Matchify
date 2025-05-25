export default function PlayerForm({
  form,
  teams,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Nom du joueur"
        value={form.name}
        onChange={onChange}
        className="input input-bordered w-full bg-gray-50"
        required
      />
      <select
        name="teamId"
        value={form.teamId}
        onChange={onChange}
        className="input input-bordered w-full bg-gray-50"
        required
      >
        <option value="">Sélectionner une équipe</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="goals"
        placeholder="Buts"
        value={form.goals}
        onChange={onChange}
        className="input input-bordered w-full bg-gray-50"
        min={0}
      />
      <input
        type="text"
        name="photo"
        placeholder="URL photo de profil"
        value={form.photo === "" ? "https://placehold.co/60x60" : form.photo}
        onChange={onChange}
        className="input input-bordered w-full bg-gray-50"
      />
      <div className="flex gap-2 justify-end">
        <button type="button" className="btn" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
