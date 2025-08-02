import clientPromise from "@/libs/mongo";
import { NextResponse } from "next/server";

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
