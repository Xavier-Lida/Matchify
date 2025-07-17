import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/libs/mongo";

// POST — Ajouter plusieurs matchs
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      "date",
      "time",
      "location",
      "day",
      "division",
      "teamA",
      "teamB",
      "trimester",
      "status",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Champ manquant: ${field}` },
          { status: 400 }
        );
      }
    }

    // Insert the game
    const result = await db.collection("games").insertOne(data);
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("POST /api/games:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET — Récupérer tous les matchs
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Sort by date ASC, then time ASC
    const games = await db
      .collection("games")
      .find()
      .sort({ date: 1, time: 1 })
      .toArray();

    return NextResponse.json(games);
  } catch (error) {
    console.error("GET /api/games:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT — Mettre à jour un match existant (par _id)
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const updatedGame = await request.json();

    if (!updatedGame._id) {
      return NextResponse.json(
        { error: "ID du match requis." },
        { status: 400 }
      );
    }

    const id = new ObjectId(updatedGame._id);
    delete updatedGame._id;

    const result = await db
      .collection("games")
      .updateOne({ _id: id }, { $set: updatedGame });

    return NextResponse.json({
      message: "Match mis à jour.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PUT /api/games:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE — Supprimer un ou plusieurs matchs
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    if (status) {
      // Suppression par status (ex: status=scheduled)
      const result = await db.collection("games").deleteMany({ status });
      return NextResponse.json({
        message: `Matchs avec le statut "${status}" supprimés.`,
        deletedCount: result.deletedCount,
      });
    } else {
      // Suppression par ID (depuis le body)
      const { id } = await request.json();
      if (!id) {
        return NextResponse.json({ error: "ID requis." }, { status: 400 });
      }

      const result = await db
        .collection("games")
        .deleteOne({ _id: new ObjectId(id) });

      return NextResponse.json({
        message: "Match supprimé.",
        deletedCount: result.deletedCount,
      });
    }
  } catch (error) {
    console.error("DELETE /api/games:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
