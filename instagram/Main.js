import { ScheduleHeader } from "@/instagram/ScheduleHeader.js";
import { MatchCard } from "@/instagram/MatchCard.js";
import logoFutsalMauricie from "@/public/logo-futsal-mauricie.png";

export default function App() {
  // Sample match data
  const matches = [
    {
      teamALogo: "/logos/McDonaldFC.JPG",
      teamAName: "LEVIS EST",
      teamBLogo: "/logos/BuffaloFC.PNG",
      teamBName: "CHARLESBOURG",
      date: "Div 1, terrain 1",
      time: "16H30",
    },
    {
      teamALogo: null,
      teamAName: "CSR",
      teamBLogo: null,
      teamBName: "AS GATINEAU",
      date: "SAM, 30 AOÛT",
      time: "18H00",
    },
    {
      teamALogo: null,
      teamAName: "CS PREMIER",
      teamBLogo: null,
      teamBName: "FC QUEBEC",
      date: "SAM, 30 AOÛT",
      time: "18H00",
    },
    {
      teamALogo: null,
      teamAName: "MISTRAL FC",
      teamBLogo: null,
      teamBName: "LONGUEUIL",
      date: "SAM, 30 AOÛT",
      time: "18H00",
    },
    {
      teamALogo: null,
      teamAName: "PHÉNIX",
      teamBLogo: null,
      teamBName: "BEAUPORT",
      date: "SAM, 30 AOÛT",
      time: "19H00",
    },
    {
      teamALogo: null,
      teamAName: "ÉTOILES",
      teamBLogo: null,
      teamBName: "EXPRESS",
      date: "SAM, 30 AOÛT",
      time: "19H00",
    },
    {
      teamALogo: null,
      teamAName: "OLYMPIQUE",
      teamBLogo: null,
      teamBName: "ROYALE",
      date: "SAM, 30 AOÛT",
      time: "19H00",
    },
    {
      teamALogo: null,
      teamAName: "VARENNES",
      teamBLogo: null,
      teamBName: "ST MICHEL",
      date: "SAM, 30 AOÛT",
      time: "20H00",
    },
    {
      teamALogo: null,
      teamAName: "ASCO",
      teamBLogo: null,
      teamBName: "SHAMROCKS",
      date: "SAM, 30 AOÛT",
      time: "20H00",
    },
  ];

  const matchOfTheWeek = {
    teamALogo: null,
    teamAName: "CASPARS",
    teamBLogo: null,
    teamBName: "LONGUEUIL FC",
    date: "DIM, 31 AOÛT",
    time: "18H00",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Instagram Post Container - 1080x1350px */}
      <div
        className="bg-gradient-to-br from-slate-500 via-primary to-slate-900 overflow-hidden shadow-2xl rounded-3xl border-4 border-accent"
        style={{
          width: "1080px",
          height: "1350px",
        }}
      >
        {/* Header */}
        <ScheduleHeader
          leagueLogoUrl={logoFutsalMauricie}
          date={"30 août 2025"}
          matchday={1}
          subtitle="Ligue Futsal Mauricie"
        />

        {/* Matches Grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {matches.map((match, index) => (
              <MatchCard
                key={index}
                teamALogo={match.teamALogo}
                teamAName={match.teamAName}
                teamBLogo={match.teamBLogo}
                teamBName={match.teamBName}
                division={match.date}
                time={match.time}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
