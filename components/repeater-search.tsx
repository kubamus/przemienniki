"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, MapPin } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RepeaterResults from "@/components/repeater-results"

export default function RepeaterSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [searchType, setSearchType] = useState("qra")
  const [selectedBand, setSelectedBand] = useState("")
  const [selectedMode, setSelectedMode] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    // Build query parameters
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    params.set("type", searchType)
    if (selectedBand) params.set("band", selectedBand)
    if (selectedMode) params.set("mode", selectedMode)
    if (selectedCountry) params.set("country", selectedCountry)

    router.push(`/?${params.toString()}`)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
            <Card className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Wyszukaj po</label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue placeholder="Wyszukaj według" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qra">Sygnał Przemiennika (QRA)</SelectItem>
                  <SelectItem value="qth">Lokalizacja (QTH)</SelectItem>
                  <SelectItem value="locator">Lokator Siatki</SelectItem>
                  <SelectItem value="all">Pokaż wszystkie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Wyszukaj</label>
              <div className="relative">
                {searchType === "qth" ? (
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                ) : (
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  type="text"
                  placeholder={
                    searchType === "qra"
                      ? "Wprowadź sygnał przemiennika (np. SR3Z)"
                      : searchType === "qth"
                        ? "Wprowadź miasto lub region"
                        : searchType === "locator"
                          ? "Wprowadź lokator siatki"
                          : "Wyszukaj wszystkie przemienniki"
                  }
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={searchType === "all"}
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Pasmo</label>
              <Select value={selectedBand} onValueChange={setSelectedBand}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz pasmo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Jakiekolwiek</SelectItem>
                  <SelectItem value="0">BAND 0</SelectItem>
                  <SelectItem value="64">BAND 64</SelectItem>
                  <SelectItem value="1024">BAND 1024</SelectItem>
                  <SelectItem value="1088">BAND 1088</SelectItem>
                  <SelectItem value="2048">BAND 2048</SelectItem>
                  <SelectItem value="4096">BAND 4096</SelectItem>
                  <SelectItem value="16384">BAND 16384</SelectItem>
                  <SelectItem value="16448">BAND 16448</SelectItem>
                  <SelectItem value="18432">BAND 18432</SelectItem>
                  <SelectItem value="20480">BAND 20480</SelectItem>
                  <SelectItem value="21504">BAND 21504</SelectItem>
                  <SelectItem value="32768">BAND 32768</SelectItem>
                  <SelectItem value="49152">BAND 49152</SelectItem>
                  <SelectItem value="65536">BAND 65536</SelectItem>
                  <SelectItem value="98304">BAND 98304</SelectItem>
                  <SelectItem value="1048576">BAND 1048576</SelectItem>
                  <SelectItem value="1146880">BAND 1146880</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tryb</label>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz tryb" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Jakiekolwiek</SelectItem>
                  <SelectItem value="4">FM</SelectItem>
                  <SelectItem value="32">D-STAR</SelectItem>
                  <SelectItem value="260">ATV</SelectItem>
                  <SelectItem value="1028">EchoLink</SelectItem>
                  <SelectItem value="2048">DMR</SelectItem>
                  <SelectItem value="4100">APCO P25</SelectItem>
                  <SelectItem value="8192">C4FM/Fusion</SelectItem>
                  <SelectItem value="16388">FM LINK</SelectItem>
                  <SelectItem value="32768">TETRA</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2">
              <label className="text-sm font-medium">Kraj</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kraj" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Wszystkie</SelectItem>
                  <SelectItem value="at">at</SelectItem>
                  <SelectItem value="be">be</SelectItem>
                  <SelectItem value="bg">bg</SelectItem>
                  <SelectItem value="by">by</SelectItem>
                  <SelectItem value="ch">ch</SelectItem>
                  <SelectItem value="cz">cz</SelectItem>
                  <SelectItem value="de">de</SelectItem>
                  <SelectItem value="dk">dk</SelectItem>
                  <SelectItem value="es">es</SelectItem>
                  <SelectItem value="fi">fi</SelectItem>
                  <SelectItem value="fr">fr</SelectItem>
                  <SelectItem value="hu">hu</SelectItem>
                  <SelectItem value="is">is</SelectItem>
                  <SelectItem value="lt">lt</SelectItem>
                  <SelectItem value="lv">lv</SelectItem>
                  <SelectItem value="nl">nl</SelectItem>
                  <SelectItem value="no">no</SelectItem>
                  <SelectItem value="pl">pl</SelectItem>
                  <SelectItem value="ro">ro</SelectItem>
                  <SelectItem value="ru">ru</SelectItem>
                  <SelectItem value="se">se</SelectItem>
                  <SelectItem value="si">si</SelectItem>
                  <SelectItem value="sk">sk</SelectItem>
                  <SelectItem value="ua">ua</SelectItem>
                  <SelectItem value="uk">uk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Szukanie..." : "Wyszukaj"}
            </Button>
          </div>
        </form>
      </Card>

      <RepeaterResults />
    </div>
  )
}
