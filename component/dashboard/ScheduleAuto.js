export default function ScheduleAuto({
  onSubmit,
  submitLabel = "Sauvegarder",
}) {
  return (
    <form
      className="bg-white p-6 w-full max-w-md flex flex-col"
      onSubmit={onSubmit}
    >
      <div className="mb-3">
        <label className="block mb-1 font-medium">
          Premier dimanche de la saison
        </label>
        <input
          name="firstSunday"
          type="date"
          className="input input-bordered w-full"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Ce sera la date du premier jour de match (Jour 1).
        </p>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">
          Heure de début des matchs
        </label>
        <input
          name="startTime"
          type="time"
          className="input input-bordered w-full"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Par exemple : 17:00. Les matchs suivants s'enchaîneront ensuite.
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="btn btn-warning w-full" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
