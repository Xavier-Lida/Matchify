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
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "playerId",
      "type",
      "matchId"
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Champ manquant: ${field}` },
          { status: 400 }
        );
      }
    }

    // Add used flag if not present
    if (typeof data.used === "undefined") {
      data.used = false;
    }

    const result = await db.collection("cards").insertOne(data);
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      card: data,
    });
  } catch (error) {
    console.error("POST /api/cards:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
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
  try {
    const client = await clientPromise;
    const db = client.db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.collection("cards").deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/cards:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}