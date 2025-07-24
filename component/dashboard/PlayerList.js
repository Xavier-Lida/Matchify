import React from "react";

const PlayerList = ({ players }) => {
  return (
    <div className="mt-2">
      <div className="rounded-lg shadow">
        <div
          className="max-h-[384px] overflow-y-auto" // 8 rows * 48px (approx row height)
        >
          <table className="min-w-full table-auto border-collapse">
            <colgroup>
              <col className="min-w-[150px]" />
              <col className="min-w-[200px]" />
              <col className="min-w-[80px]" />
            </colgroup>
            <thead>
              <tr className="sticky top-0 bg-gray-100 font-bold text-gray-700 z-10">
                <th className="py-3 px-4 text-left">Prénom</th>
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Numéro</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4">{player.firstName}</td>
                  <td className="py-3 px-4">{player.lastName}</td>
                  <td className="py-3 px-4">{player.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
