function InfoTable ({ name, info }) {
  if (!info || info.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{name}</h2>
        <div className="text-gray-500">Pas de données.</div>
      </div>
    );
  }

  const headers = Object.keys(info[0]);

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <table className="table table-zebra w-full border border-base-300">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-base-300 px-4 py-2 text-left">
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {info.map((row, idx) => (
            <tr key={idx}>
              {headers.map((header) => (
                <td key={header} className="px-4 py-2 border-b border-base-200">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InfoTable;