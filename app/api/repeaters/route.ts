import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const query = searchParams.get("q") || ""
  const searchType = searchParams.get("type") || "qra"
  const band = searchParams.get("band") !== "any" ? searchParams.get("band") : "";
  const mode = searchParams.get("mode") !== "any" ? searchParams.get("mode") : "";
  const country = searchParams.get("country") !== "any" ? searchParams.get("country") : "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  try {
    // Build the where clause based on search parameters
    const whereClause: Prisma.repeatersWhereInput = {
      deleted: 0, // Only show non-deleted repeaters
    }

    // Add search criteria based on search type
    if (query && searchType !== "all") {
      if (searchType === "qra") {
        whereClause.qra = {
          contains: query,
        }
      } else if (searchType === "qth") {
        whereClause.qth = {
          contains: query,
        }
      } else if (searchType === "locator") {
        whereClause.locator = {
          contains: query,
        }
      }
    }

    // Add filters
    if (band) {
      whereClause.band = Number.parseInt(band)
    }

    if (mode) {
      whereClause.mode = Number.parseInt(mode)
    }

    if (country) {
      whereClause.country = country
    }

    // Execute the query
    const repeaters = await prisma.repeaters.findMany({
      where: whereClause,
      orderBy: [
        { status: "asc" }, // Active repeaters first
        { qra: "asc" }, // Then alphabetically by call sign
      ],
      take: limit, // Limit results to prevent overwhelming the UI
      skip: offset, // Skip results for pagination
    })
    return NextResponse.json(JSON.stringify(repeaters, (_, v) => typeof v === 'bigint' ? v.toString() : v))
  } catch (error) {
    return NextResponse.json({ error: "Nie udało się pobrać przemienników. Spróbuj ponownie później." }, { status: 500 })
  }
}
