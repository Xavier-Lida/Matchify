import { NextResponse } from "next/server";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db();
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");
  const filter = teamId ? { teamId } : {};
  // Sort players by lastName, then firstName
  const players = await db
    .collection("players")
    .find(filter)
    .sort({ lastName: 1, firstName: 1 })
    .toArray();
  return NextResponse.json(players);
}

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await request.json();

  if (Array.isArray(data.players) && data.players.length > 0) {
    // Bulk insert
    const result = await db.collection("players").insertMany(data.players);
    const insertedPlayers = await db
      .collection("players")
      .find({ _id: { $in: Object.values(result.insertedIds) } })
      .toArray();
    return NextResponse.json({ insertedPlayers });
  } else {
    // No players to insert, return empty array
    return NextResponse.json({ insertedPlayers: [] });
  }
}

export async function DELETE(request) {
  const client = await clientPromise;
  const db = client.db();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.collection("players").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}

export async function PUT(request) {
  const url = new URL(request.url, "http://localhost:3000");
  const id = url.searchParams.get("id");
  const updateData = await request.json(); // Accept all fields to update
  const client = await clientPromise;
  const db = client.db();
  await db
    .collection("players")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  return NextResponse.json({ success: true });
}
