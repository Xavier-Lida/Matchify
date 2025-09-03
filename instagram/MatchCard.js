import Image from "next/image";

export function MatchCard({
  teamALogo,
  teamAName,
  teamBLogo,
  teamBName,
  division,
  time,
}) {
  return (
    <div className="bg-secondary rounded-xl p-5 flex items-center justify-between shadow-lg border border-base-100">
      {/* Team A */}
      <div className="flex items-center h-full">
        <div className="aspect-square h-full bg-white rounded-lg p-1 shadow-sm flex items-center justify-center">
          <Image
            src={teamALogo}
            alt={teamAName}
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Division and Time */}
      <div className="flex flex-col items-center">
        <div
          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm"
          style={{ fontWeight: 700 }}
        >
          {division}
        </div>
        <div
          className="text-4xl text-white mt-2"
          style={{
            fontFamily: "var(--font-titan-one), system-ui",
            fontWeight: 400,
            fontStyle: "normal",
          }}
        >
          {time}
        </div>
      </div>

      {/* Team B */}
      <div className="flex items-center h-full">
        <div className="aspect-square h-full bg-white rounded-lg p-1 shadow-sm flex items-center justify-center">
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
