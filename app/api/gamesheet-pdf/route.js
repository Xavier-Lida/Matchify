// /app/api/gamesheet-pdf/route.js
import { NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import GamesheetDocument from "@/pdf/GamesheetDocument";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

export const runtime = "nodejs"; // Ensure Node.js runtime for DB access

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("gameId");
  const teamId = searchParams.get("teamId");

  const client = await clientPromise;
  const db = client.db();

  // Fetch the game
  const game = await db
    .collection("games")
    .findOne({ _id: new ObjectId(gameId) });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  // Fetch the team
  const team = await db
    .collection("teams")
    .findOne({ _id: new ObjectId(teamId) });
  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  // Find opponent team
  const opponentId = game.teamA === teamId ? game.teamB : game.teamA;
  const opponent = await db
    .collection("teams")
    .findOne({ _id: new ObjectId(opponentId) });
  if (!opponent) {
    return NextResponse.json({ error: "Opponent not found" }, { status: 404 });
  }

  // Fetch players for the team
  const players = await db.collection("players").find({ teamId }).toArray();
  if (!players) {
    return NextResponse.json({ error: "Players not found" }, { status: 404 });
  }

  if (!game || !team || !opponent || !players) {
    return NextResponse.json(
      { error: "Missing data for PDF" },
      { status: 400 }
    );
  }

  function sanitize(obj) {
    if (!obj) return obj;
    const result = {};
    for (const key in obj) {
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        obj[key].toString
      ) {
        result[key] = obj[key].toString();
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }

  const safeGame = sanitize(game);
  const safeTeam = sanitize(team);
  const safeOpponent = sanitize(opponent);
  const safePlayers = players.map(sanitize);

  // Prepare the PDF document
  const doc = (
    <GamesheetDocument
      game={safeGame}
      team={safeTeam}
      opponent={safeOpponent}
      players={safePlayers}
    />
  );
  const pdfBuffer = await pdf(doc).toBuffer();

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=gamesheet.pdf",
    },
  });
}
