import { NextResponse } from "next/server";
import clientPromise from "@/libs/mongo";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const teams = await db
    .collection("teams")
    .find({}, { projection: { coachEmail: 1 } })
    .toArray();
  const coachEmails = teams
    .map((team) => team.coachEmail)
    .filter((email) => !!email);
  return NextResponse.json(coachEmails);
}
