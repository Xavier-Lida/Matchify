import { NextResponse } from "next/server";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Sort teams alphabetically by name in MongoDB
    const teams = await db
      .collection("teams")
      .find({})
      .sort({ name: 1 })
      .toArray();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("GET /api/teams:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await request.json();
  const result = await db.collection("teams").insertOne(data);
  return NextResponse.json(result);
}

export async function PUT(request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await request.json();
  const { _id, ...update } = data; // Destructure and ignore 'players'
  await db
    .collection("teams")
    .updateOne({ _id: new ObjectId(_id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const client = await clientPromise;
  const db = client.db();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await db.collection("teams").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
