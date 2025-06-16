import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get distinct bands from the repeaters table
    const bands = await prisma.repeaters.findMany({
      select: {
        band: true,
      },
      distinct: ["band"],
      where: {
        deleted: 0,
      },
      orderBy: {
        band: "asc",
      },
    })

    return NextResponse.json(bands.map((b) => b.band))
  } catch (error) {
    console.error("Error fetching bands:", error)
    return NextResponse.json({ error: "Failed to fetch bands" }, { status: 500 })
  }
}
