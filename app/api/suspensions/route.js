import clientPromise from "@/libs/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET endpoint: returns all suspensions as JSON array
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const suspensions = await db.collection("suspensions").find({}).toArray();
    return NextResponse.json(suspensions);
  } catch (error) {
    console.error("GET /api/suspensions:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST endpoint: creates a new suspension
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "player_id",
      "reason",
      "start_match_id",
      "matches_remaining",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Champ manquant: ${field}` },
          { status: 400 }
        );
      }
    }

    // Add a unique id if not present
    if (!data.id) {
      data.id = `${data.player_id}_${data.start_match_id}_${Date.now()}`;
    }

    const result = await db.collection("suspensions").insertOne(data);
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      suspension: data,
    });
  } catch (error) {
    console.error("POST /api/suspensions:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE endpoint: removes a suspension by id
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.collection("suspensions").deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/suspensions:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
