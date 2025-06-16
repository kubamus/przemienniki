export interface Repeater {
  id: number
  qra: string
  status: number
  licensevalid?: Date
  qrg_tx?: number
  qrg_rx?: number
  crossbandmode?: number
  qrg_cross?: number
  band: number
  mode: number
  locator?: string
  qth: string
  country?: string
  latitude?: number
  longitude?: number
  altoversea?: number
  altoverground?: number
  activation?: number
  ctcss_rx?: number
  ctcss_tx?: number
  dcs_rx?: string
  dcs_tx?: string
  dtmf_rx?: string
  power?: number
  operators?: string
  url?: string
  remarks?: string
  created?: Date
  createdby?: number
  updated?: Date
  updatedby?: number
  updatedfromreport?: number
  hash?: string
  source?: string
  externalid?: string
  echolink?: number
  deleted?: number
}

export interface Country {
  shortcode: string
  description: string
  nativename?: string
  prefixes?: string
  enabled?: number
  latitude?: number
  longitude?: number
  zoom?: number
  httpcode?: string
}

export interface Source {
  sourcename: string
  shorturl?: string
  url?: string
  vhash?: string
}

export interface Mask {
  type: string
  mask: number
  description: string
  constname?: string
  color?: string
  enabled?: number
}
