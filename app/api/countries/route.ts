import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const countries = await prisma.countries.findMany({
      where: {
        enabled: 1,
      },
      orderBy: {
        description: "asc",
      },
    })

    return NextResponse.json(countries)
  } catch (error) {
    console.error("Error fetching countries:", error)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}
