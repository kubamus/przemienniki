"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Radio, Info, ExternalLink } from "lucide-react"

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Repeater } from "@/lib/types"

export default function RepeaterResults() {
  const searchParams = useSearchParams()

  const [repeaters, setRepeaters] = useState<Repeater[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRepeater, setSelectedRepeater] = useState<Repeater | null>(null)

  useEffect(() => {
    const query = searchParams.get("q")
    const type = searchParams.get("type")

    if (type) {
      fetchRepeaters(10, 0)
    }
  }, [searchParams])

  const fetchRepeaters = async (limit: number, offset: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/repeaters?${searchParams.toString()}&limit=${limit}&offset=${offset}`)
      if (!response.ok) {
        throw new Error("Nie udało się pobrać danych z serwera")
      }

      const data = await response.json()
      setRepeaters(JSON.parse(data))
    } catch (error) {
      setError("Nie udało się pobrać przemienników. Spróbuj ponownie później.")
    } finally {
      setLoading(false)
    }
  }

  const fetchMoreRepeaters = () => {
    const currentLength = repeaters.length;
    const limit = 10
    const offset = currentLength;
    try {
      const response = fetch(`/api/repeaters?${searchParams.toString()}&limit=${limit}&offset=${offset}`)
      response.then(res => {
        if (!res.ok) {
          throw new Error("Nie udało się pobrać danych z serwera");
        }
        return res.json();
      }).then(data => {
        const newRepeaters = JSON.parse(data);
        setRepeaters(prev => [...prev, ...newRepeaters]);
      }).catch(err => {
        setError("Nie udało się pobrać przemienników. Spróbuj ponownie później.");
      });
    } catch (error) {
      setError("Nie udało się pobrać przemienników. Spróbuj ponownie później.");
    }
  }
  const getBandName = (band: number) => {
    const bands: Record<number, string> = {
      2: "2m",
      70: "70cm",
      23: "23cm",
      13: "13cm",
      6: "6m",
    }
    return bands[band] || `Band ${band}`
  }

  const getModeName = (mode: number) => {
    const modes: Record<number, string> = {
      1: "FM",
      2: "DMR",
      3: "D-STAR",
      4: "C4FM/Fusion",
      5: "APCO P25",
      6: "TETRA",
    }
    return modes[mode] || `Mode ${mode}`
  }

  const getStatusBadge = (status: number) => {
    if (status === 1) return <Badge className="bg-green-500">Aktywny</Badge>
    if (status === 2) return <Badge className="bg-yellow-500">Testowanie</Badge>
    if (status === 3) return <Badge className="bg-red-500">Nieaktywny</Badge>
    return <Badge className="bg-gray-500">Nieznany</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ładowanie wyników</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => fetchRepeaters(10, 0)}>Spróbuj ponownie</Button>
        </CardContent>
      </Card>
    )
  }

  if (!searchParams.has("type")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wyszukiwanie Przemienników</CardTitle>
          <CardDescription>Użyj formularza wyszukiwania powyżej, aby znaleźć przemienniki</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Radio className="h-12 w-12 mb-4" />
            <p>Wprowadź kryteria wyszukiwania i kliknij Wyszukaj, aby znaleźć przemienniki</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (repeaters.length === 0 && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nie znaleziono wyników</CardTitle>
          <CardDescription>Żadne przemienniki nie pasują do Twoich kryteriów wyszukiwania</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <Info className="h-12 w-12 mb-4" />
            <p>Spróbuj dostosować swoje parametry wyszukiwania</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log(repeaters)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wyniki wyszukiwania</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>QRA</TableHead>
              <TableHead>QTH</TableHead>
              <TableHead>Częstotliwość</TableHead>
              <TableHead>Pasmo</TableHead>
              <TableHead>Tryb</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Szczegóły</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repeaters.map((repeater) => (
              <TableRow key={repeater.id}>
                <TableCell className="font-medium">{repeater.qra}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {repeater.qth}
                    {repeater.country && (
                      <Badge variant="outline" className="ml-2">
                        {repeater.country}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{repeater.qrg_tx ? `${repeater.qrg_tx} MHz` : "N/A"}</TableCell>
                <TableCell>{getBandName(repeater.band)}</TableCell>
                <TableCell>{getModeName(repeater.mode)}</TableCell>
                <TableCell>{getStatusBadge(repeater.status)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedRepeater(repeater)}>
                        Szczegóły
                      </Button>
                    </DialogTrigger>
                    {selectedRepeater && (
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl flex items-center gap-2">
                            <Radio className="h-5 w-5" />
                            {selectedRepeater.qra} - {selectedRepeater.qth}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Podstawowe informacje:</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                <span>{getStatusBadge(selectedRepeater.status)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">QRA:</span>
                                <span>{selectedRepeater.qra}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">QTH:</span>
                                <span>{selectedRepeater.qth}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Kraj:</span>
                                <span>{selectedRepeater.country}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Lokator:</span>
                                <span>{selectedRepeater.locator}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Pasmo:</span>
                                <span>{getBandName(selectedRepeater.band)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tryb:</span>
                                <span>{getModeName(selectedRepeater.mode)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">Szczegóły techniczne</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Częstotliwość TX:</span>
                                <span>
                                  {selectedRepeater.qrg_tx ? `${selectedRepeater.qrg_tx} MHz` : "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Częstotliwość RX:</span>
                                <span>
                                  {selectedRepeater.qrg_rx ? `${selectedRepeater.qrg_rx} MHz` : "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">CTCSS TX:</span>
                                <span>{selectedRepeater.ctcss_tx ? `${selectedRepeater.ctcss_tx} Hz` : "None"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">CTCSS RX:</span>
                                <span>{selectedRepeater.ctcss_rx ? `${selectedRepeater.ctcss_rx} Hz` : "None"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">DCS TX:</span>
                                <span>{selectedRepeater.dcs_tx || "None"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">DCS RX:</span>
                                <span>{selectedRepeater.dcs_rx || "None"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Moc:</span>
                                <span>{selectedRepeater.power ? `${selectedRepeater.power} W` : "Unknown"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-semibold mb-2">Lokacja</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Szerokość geograficzna:</span>
                                <span>
                                  {selectedRepeater.latitude ? selectedRepeater.latitude : "Unknown"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Wysokość geograficzna:</span>
                                <span>
                                  {selectedRepeater.longitude ? selectedRepeater.longitude : "Unknown"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Wysokość od morza:</span>
                                <span>
                                  {selectedRepeater.altoversea ? `${selectedRepeater.altoversea} m` : "Unknown"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Wysokość od ziemi:</span>
                                <span>
                                  {selectedRepeater.altoverground ? `${selectedRepeater.altoverground} m` : "Unknown"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {selectedRepeater.remarks && (
                            <div className="col-span-1 md:col-span-2">
                              <h3 className="text-lg font-semibold mb-2">Uwagi</h3>
                              <p className="text-sm">{selectedRepeater.remarks}</p>
                            </div>
                          )}

                          {selectedRepeater.url && (
                            <div className="col-span-1 md:col-span-2">
                              <Button variant="outline" className="w-full" asChild>
                                <a href={selectedRepeater.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Odwiedź stronę
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-left">
                {repeaters.length} wyników
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={fetchMoreRepeaters}>
                  Pokaż więcej
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
