import React from "react";

// Simple SVG icons for yellow and red cards
const YellowCardIcon = () => (
  <svg
    width="18"
    height="24"
    viewBox="0 0 18 24"
    className="inline mr-1 align-middle"
  >
    <rect
      width="14"
      height="20"
      x="2"
      y="2"
      rx="2"
      fill="#ffe066"
      stroke="#e2b400"
      strokeWidth="2"
    />
  </svg>
);

const RedCardIcon = () => (
  <svg
    width="18"
    height="24"
    viewBox="0 0 18 24"
    className="inline mr-1 align-middle"
  >
    <rect
      width="14"
      height="20"
      x="2"
      y="2"
      rx="2"
      fill="#ff4d4f"
      stroke="#b71c1c"
      strokeWidth="2"
    />
  </svg>
);

const PlayerList = ({ players }) => {
  return (
    <div className="mt-2">
      <div className="rounded-lg shadow">
        <div className="max-h-[384px] overflow-y-auto">
          <table className="min-w-full table-auto border-collapse">
            <colgroup>
              <col className="min-w-[150px]" />
              <col className="min-w-[200px]" />
              <col className="min-w-[80px]" />
              <col className="min-w-[80px]" />
              <col className="min-w-[100px]" />
            </colgroup>
            <thead>
              <tr className="sticky top-0 bg-gray-100 font-bold text-gray-700 z-10">
                <th className="py-3 px-4 text-left">Prénom</th>
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Numéro</th>
                <th className="py-3 px-4 text-left">Matchs</th>
                <th className="py-3 px-4 text-left">Cartons</th>
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
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {player.gamesPlayed || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {player.yellowCards > 0 && (
                      <>
                        <YellowCardIcon />
                        {player.yellowCards}
                      </>
                    )}
                    {player.redCards > 0 && (
                      <>
                        <RedCardIcon />
                        {player.redCards}
                      </>
                    )}
                    {player.yellowCards === 0 && player.redCards === 0 && (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
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
