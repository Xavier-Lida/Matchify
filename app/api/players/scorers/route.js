import { NextResponse } from "next/server";
import clientPromise from "@/libs/mongo";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const scorers = await db
    .collection("players")
    .find({ goals: { $gt: 0 } })
    .toArray();
  return NextResponse.json(scorers);
}