import Image from "next/image";

export function MatchCard({
  teamALogo,
  teamAName,
  teamBLogo,
  teamBName,
  date,
  time,
}) {
  return (
    <div className="bg-blue-600 rounded-xl p-5 flex items-center justify-between shadow-lg border border-blue-500">
      {/* Team A */}
      <div className="flex items-center">
        <div className="w-14 h-14 bg-white rounded-lg p-1 shadow-sm">
          <Image
            src={teamALogo}
            alt={teamAName}
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="flex flex-col items-center">
        <div
          className="bg-sky-400 text-white px-4 py-2 rounded-lg text-sm"
          style={{ fontWeight: 700 }}
        >
          {date}
        </div>
        <div className="text-2xl text-white mt-2" style={{ fontWeight: 900 }}>
          {time}
        </div>
      </div>

      {/* Team B */}
      <div className="flex items-center">
        <div className="w-14 h-14 bg-white rounded-lg p-1 shadow-sm">
          <Image
            src={teamBLogo}
            alt={teamBName}
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
