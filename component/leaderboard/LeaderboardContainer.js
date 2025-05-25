import ClassementFilters from "./ClassementFilters";
import ClassementTable from "./ClassementTable";

export default function LeaderboardContainer({
  title,
  subtitle,
  filters = [],
  onFilterChange,
  columns = [],
  data = [],
}) {
  return (
    <section className="w-full max-w-5xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-md mt-4 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && <div className="text-gray-500 font-medium">{subtitle}</div>}
          </div>
          <ClassementFilters filters={filters} onFilterChange={onFilterChange} />
        </div>
        <ClassementTable data={data} columns={columns} />
      </div>
    </section>
  );
}