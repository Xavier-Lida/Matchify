export default function LeaderboardFilters({ filters = [], onFilterChange }) {
  return (
    <div className="flex gap-3">
      {filters.map((filter) => (
        <select
          key={filter.name}
          className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filter.value}
          onChange={e => onFilterChange(filter.name, e.target.value)}
        >
          {filter.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
    </div>
  );
}