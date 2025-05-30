export default function ScheduleForm({
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
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Division</label>
        <input
          name="division"
          type="number"
          className="input input-bordered w-full"
          required
          min={1}
          max={3}
        />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Points</label>
        <input
          name="points"
          type="number"
          className="input input-bordered w-full"
          min={-5}
        />
      </div>
      <div className="flex gap-2">
        <button className="btn btn-warning" type="submit">
          {submitLabel}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
