export default function leaderboardTable({ data = [], columns = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2 px-3 font-semibold ${
                  col.align || "text-center"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || row._id || idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-2 px-3 ${col.align || "text-center"} ${
                    col.key === "name" ? "font-medium text-left" : ""
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
