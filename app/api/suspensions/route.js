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

    const result = await db.collection("suspensions").insertOne(data);

    // Update card usage based on suspension reason
    if (data.reason.includes("cartons jaunes")) {
      // Mark the relevant yellow cards as used
      await db.collection("cards").updateMany(
        {
          playerId: data.player_id,
          matchId: data.start_match_id,
          type: "yellow",
          used: false,
        },
        { $set: { used: true } }
      );
    }
    if (data.reason.includes("rouge")) {
      // Mark the relevant red card as used
      await db.collection("cards").updateOne(
        {
          playerId: data.player_id,
          matchId: data.start_match_id,
          type: { $in: ["red", "yellow/red"] },
          used: false,
        },
        { $set: { used: true } }
      );
    }

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
    const url = new URL(request.url, "http://localhost:3000");
    const playerId = url.searchParams.get("player_id");
    const client = await clientPromise;
    const db = client.db();

    if (playerId) {
      // Delete all suspensions for this player
      await db.collection("suspensions").deleteMany({ player_id: playerId });
      return NextResponse.json({ success: true });
    }

    // Optionally: handle delete by _id for single suspension
    const id = url.searchParams.get("id");
    if (id) {
      await db.collection("suspensions").deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing player_id or id" }, { status: 400 });
  } catch (error) {
    console.error("DELETE /api/suspensions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT endpoint: updates an existing suspension
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    if (!data._id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const { _id, ...updateFields } = data;
    await db.collection("suspensions").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/suspensions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
