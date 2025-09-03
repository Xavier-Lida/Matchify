import Image from "next/image";

export function ScheduleHeader({ leagueLogoUrl, date, matchday, subtitle }) {
  return (
    <div className="flex items-center justify-between px-8 py-6 text-white">
      {/* Logo */}
      <div className="flex items-center">
        {leagueLogoUrl && (
          <div className="w-30 h-30 bg-white rounded-xl p-3">
            <Image
              src={leagueLogoUrl}
              alt="League Logo"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Program Title */}
      <div className="flex-1 text-center">
        <h1
          className="text-5xl tracking-wider text-base-100"
          style={{
            fontFamily: "var(--font-titan-one), system-ui",
            fontWeight: 400,
            fontStyle: "normal",
          }}
        >
          {subtitle}
        </h1>
      </div>

      {/* Subtitle and Matchday */}
      <div className="text-right">
        <div className="text-base-100 text-xl mb-2" style={{ fontWeight: 600 }}>
          JOURNÉE {matchday}
        </div>
        <div className="bg-blue-900 px-6 py-3 rounded-xl">
          <span className="text-base-100 text-xl" style={{ fontWeight: 700 }}>
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}
