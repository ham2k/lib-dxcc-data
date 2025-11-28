import fs from 'fs'
import { preprocessDXCCData } from '../src/lib/preprocessing.js'
import type { DXCCEntity } from '../src/lib/DXCCEntity.js'

console.log('Generating DXCC json')

const dxccCSV = fs.readFileSync('data/dxcc-2020-02.csv', 'utf8')

const dxcc = preprocessDXCCData(dxccCSV)

const currentDXCC: Record<string, DXCCEntity> = {}
Object.values(dxcc).forEach((entity: DXCCEntity) => {
  if (!entity.deleted) {
    currentDXCC[entity.entityPrefix] = entity
  }
})

fs.writeFileSync('src/data/dxccByCode.json', JSON.stringify(dxcc), 'utf8')
fs.writeFileSync('src/data/dxccByCode.ts', `import type { DXCCEntity } from '../lib/DXCCEntity.js'\n\nexport const DXCC_BY_CODE: Record<number, DXCCEntity> = ${JSON.stringify(dxcc)}`, 'utf8')
fs.writeFileSync('src/data/dxcc.json', JSON.stringify(Object.values(dxcc)), 'utf8')
fs.writeFileSync('src/data/dxcc.ts', `import type { DXCCEntity } from '../lib/DXCCEntity.js'\n\nexport const DXCC: DXCCEntity[] = ${JSON.stringify(Object.values(dxcc))}`, 'utf8')
fs.writeFileSync('src/data/dxccCurrent.json', JSON.stringify(Object.values(currentDXCC)), 'utf8')
fs.writeFileSync('src/data/dxccCurrent.ts', `import type { DXCCEntity } from '../lib/DXCCEntity.js'\n\nexport const DXCC_CURRENT: DXCCEntity[] = ${JSON.stringify(Object.values(currentDXCC))}`, 'utf8')
fs.writeFileSync('src/data/dxccByPrefix.json', JSON.stringify(currentDXCC), 'utf8')
fs.writeFileSync('src/data/dxccByPrefix.ts', `import type { DXCCEntity } from '../lib/DXCCEntity.js'\n\nexport const DXCC_BY_PREFIX: Record<string, DXCCEntity> = ${JSON.stringify(currentDXCC)}`, 'utf8')

console.log('DXCC Entities written to data/dxcc.json, dxccByCode.json, dxccCurrent.json and dxccByPrefix.json')
console.log('')

