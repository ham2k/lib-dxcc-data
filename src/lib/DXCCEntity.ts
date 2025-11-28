export interface DXCCEntity {
  source: 'DXCC' | 'CTY'
  dxccName: string
  dxccCode: number
  continents: string[]
  ituZones: number[]
  cqZones: number[]
  deleted: boolean
  traffic: boolean
  tz?: string
  start?: string
  end?: string
  flag: string
  countryCode: string
  notes: string
  regex: string
  prefixes: string[]
  entityPrefix: string
  shortName: string
  name: string
  otherNames?: string[]
  fullName: string
  lotwName: string
  clublogName?: string
  qrzName?: string
  ituRegion: number
  lat?: number
  lon?: number
  ituZone?: number
  cqZone?: number
}
