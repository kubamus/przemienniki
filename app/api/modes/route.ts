import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get distinct modes from the repeaters table
    const modes = await prisma.repeaters.findMany({
      select: {
        mode: true,
      },
      distinct: ["mode"],
      where: {
        deleted: 0,
      },
      orderBy: {
        mode: "asc",
      },
    })

    return NextResponse.json(modes.map((m) => m.mode))
  } catch (error) {
    console.error("Error fetching modes:", error)
    return NextResponse.json({ error: "Failed to fetch modes" }, { status: 500 })
  }
}
