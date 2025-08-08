import clientPromise from "@/libs/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET endpoint: returns all cards as JSON array
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const cards = await db.collection("cards").find({}).toArray();
    return NextResponse.json(cards);
  } catch (error) {
    console.error("GET /api/cards:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST endpoint: creates a new card
export async function POST(request) {
  const client = await clientPromise;
  const db = client.db();
  const card = await request.json();

  // Check if a card for this player in this match already exists
  const existing = await db.collection("cards").findOne({
    playerId: card.playerId,
    matchId: card.matchId,
  });

  if (existing) {
    // Optionally: update the existing card with the new type/used value
    await db.collection("cards").updateOne(
      { _id: existing._id },
      { $set: { type: card.type, used: card.used } }
    );
    return NextResponse.json({
      success: true,
      updated: true,
      card: { ...existing, type: card.type, used: card.used },
    });
  } else {
    // Insert new card
    const result = await db.collection("cards").insertOne(card);
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      card: { ...card, _id: result.insertedId },
    });
  }
}

// PUT endpoint: updates a card (e.g. to set used: true)
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const result = await db.collection("cards").updateOne(
      { id: data.id },
      { $set: data }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      card: data,
    });
  } catch (error) {
    console.error("PUT /api/cards:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE endpoint: removes a card by id
export async function DELETE(request) {
  const url = new URL(request.url);
  const matchId = url.searchParams.get("matchId");
  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  await db.collection("cards").deleteMany({ matchId });
  return NextResponse.json({ success: true });
}