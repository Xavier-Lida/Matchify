export default function TeamForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) {
  return (
    <form
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md flex flex-col"
      onSubmit={onSubmit}
    >
      <div className="mb-3">
        <label className="block mb-1 font-medium">Nom</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Division</label>
        <input
          name="division"
          type="number"
          value={form.division}
          onChange={onChange}
          className="input input-bordered w-full"
          required
          min={1}
          max={3}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Email du coach</label>
        <input
          name="coachEmail"
          type="email"
          value={form.coachEmail || ""}
          onChange={onChange}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Logo URL</label>
        <input
          name="logo"
          value={form.logo}
          onChange={onChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary" type="submit">
          {submitLabel}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
