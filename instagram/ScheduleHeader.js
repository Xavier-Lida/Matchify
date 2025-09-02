import Image from "next/image";

export function ScheduleHeader({ leagueLogoUrl, matchday, subtitle }) {
  return (
    <div className="flex items-center justify-between px-8 py-6 text-white">
      {/* Logo */}
      <div className="flex items-center">
        {leagueLogoUrl && (
          <div className="w-20 h-20 bg-white rounded-xl p-3">
            <Image
              src={leagueLogoUrl}
              alt="League Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Program Title */}
      <div className="flex-1 text-center">
        <h1
          className="text-6xl text-white tracking-wider"
          style={{ fontWeight: 900 }}
        >
          PROGRAMME
        </h1>
      </div>

      {/* Subtitle and Matchday */}
      <div className="text-right">
        <div className="text-cyan-300 text-xl mb-2" style={{ fontWeight: 600 }}>
          {subtitle}
        </div>
        <div className="bg-blue-900 px-6 py-3 rounded-xl">
          <span className="text-white text-xl" style={{ fontWeight: 700 }}>
            JOURNÉE {matchday}
          </span>
        </div>
      </div>
    </div>
  );
}
