import { NextResponse } from "next/server";
import clientPromise from "@/libs/mongo";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const teams = await db.collection("teams").find({}).toArray();
  return NextResponse.json(teams);
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
  const { _id, ...update } = data;
  await db.collection("teams").updateOne(
    { _id: new ObjectId(_id) },
    { $set: update }
  );
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