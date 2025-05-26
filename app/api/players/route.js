import { NextResponse } from "next/server";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const players = await db.collection("players").find({}).toArray();
  return NextResponse.json(players);
}

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db();
  const data = await request.json();

  if (Array.isArray(data.players)) {
    // Bulk insert
    const result = await db.collection("players").insertMany(data.players);
    return NextResponse.json({ insertedCount: result.insertedCount });
  } else {
    // Single insert (fallback)
    const result = await db.collection("players").insertOne(data);
    return NextResponse.json(result);
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
  const client = await clientPromise;
  const db = client.db();
  const data = await request.json();
  const { _id, ...rest } = data;
  await db
    .collection("players")
    .updateOne({ _id: new ObjectId(_id) }, { $set: rest });
  return NextResponse.json({ success: true });
}
