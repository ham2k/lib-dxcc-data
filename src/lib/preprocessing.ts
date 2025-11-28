import { parse } from 'csv/sync'
import { BIGCTY } from '@ham2k/lib-country-files'
import { createRequire } from 'node:module'
import type { DXCCEntity } from './DXCCEntity.js'

const require = createRequire(import.meta.url)
const QRZNames: Record<number, string> = require('../../data/qrz-names.json')
const ExtraInfo: Record<number, Partial<DXCCEntity>> = require('../../data/extra-info.json')
const ITUZonesToRegions: Record<number, number> = require('../../data/itu-zones-to-regions.json')

interface CSVRecord {
  prefix: string
  name: string
  continent: string
  itu: string
  cq: string
  entityCode: string
  deleted: string
  outgoingQslService: string
  thirdPartyTraffic: string
  validStart: string
  validEnd: string
  notes: string
  countryCode: string
  flag: string
  prefixRegex: string
}

const CTYbyCode: Record<number, any> = {}
Object.entries(BIGCTY.entities).forEach(([prefix, cty]: [string, any]) => {
  if (!cty.isWAE) CTYbyCode[cty.dxccCode] = cty
})

export function preprocessDXCCData(dxccCSV: string): Record<number, DXCCEntity> {
  const dxcc: Record<number, DXCCEntity> = {}

  const records = parse(dxccCSV, { columns: true, skip_empty_lines: true }) as CSVRecord[]
  console.log(`${records.length} records`)

  records.forEach((record) => {
    const code = Number.parseInt(record.entityCode)
    if (dxcc[code]) {
      console.log('Duplicate entity code', code)
      console.log(dxcc[code])
      console.log(record)
    }

    dxcc[code] = {
      source: 'DXCC',
      dxccName: record.name,
      dxccCode: code,
      continents: record.continent.split(','),
      ituZones: record.itu.split(',').map((zone) => Number.parseInt(zone)),
      cqZones: record.cq.split(',').map((zone) => Number.parseInt(zone)),
      deleted: record.deleted === 'Y',
      traffic: record.thirdPartyTraffic === 'Y',
      start: record.validStart,
      end: record.validEnd,
      flag: record.flag,
      countryCode: record.countryCode === 'ZZ' ? '' : record.countryCode.toLowerCase(),
      notes: record.notes,
      regex: record.prefixRegex,
      prefixes: record.prefix.split(','),
      entityPrefix: '',
      shortName: '',
      name: '',
      fullName: '',
      lotwName: '',
      ituRegion: 0
    }

    dxcc[code].entityPrefix = dxcc[code].prefixes[0] || `${record.deleted === 'Y' ? 'deleted' : 'dxcc'}-${code}`

    dxcc[code].shortName = dxcc[code].dxccName
      .replace(' Islands', ' Is.')
      .replace(' Island', ' I.')
      .replace('Saint ', 'St. ')
      .replace('East ', 'E. ')
      .replace('West ', 'W. ')
      .replace('Central ', 'C. ')
      .replace('Republic ', 'Rep. ')
      .replace(' and ', ' & ')

    dxcc[code].name = dxcc[code].dxccName
      .replace(' Islands', ' Is.')
      .replace(' Island', ' I.')
      .replace('St. ', 'Saint ')
      .replace('E. ', 'East ')
      .replace('W. ', 'West ')
      .replace('C. ', 'Central ')
      .replace('Rep. ', 'Republic ')
      .replace(' & ', ' and ')

    dxcc[code].fullName = dxcc[code].dxccName
      .replace(' I.', ' Island')
      .replace(' Is.', ' Islands')
      .replace(' HQ', ' Headquarters')
      .replace('St. ', 'Saint ')
      .replace('E. ', 'East ')
      .replace('W. ', 'West ')
      .replace('C. ', 'Central ')
      .replace('Rep. ', 'Republic ')
      .replace(' & ', ' and ')

    dxcc[code].lotwName = dxcc[code].fullName.toUpperCase()
    dxcc[code].clublogName = dxcc[code].lotwName

    if (QRZNames[code] !== record.name) dxcc[code].qrzName = QRZNames[code]

    if (CTYbyCode[code]) {
      const ctyData = { ...CTYbyCode[code] }
      // TODO: Fix this in CTY Data instead of here
      if (ctyData.alternate) {
        ctyData.otherNames = [ctyData.alternate]
        delete ctyData.alternate
      }
      if (ctyData.continent) {
        ctyData.continents = ctyData.continent.split(',')
        delete ctyData.continent
      }
      dxcc[code] = { ...ctyData, ...dxcc[code] } // CTY info should not override
      dxcc[code].entityPrefix = ctyData.entityPrefix // except for entityPrefix, for which we trust CTY over other sources
    }

    if (ExtraInfo[code]) dxcc[code] = { ...dxcc[code], ...ExtraInfo[code] } // Extra info should override

    if (ITUZonesToRegions[dxcc[code].ituZones?.[0]]) {
      dxcc[code].ituRegion = ITUZonesToRegions[dxcc[code].ituZones[0]]
    } else {
      dxcc[code].ituRegion = 0
    }
  })

  return dxcc
}

