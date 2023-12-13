import fs from 'fs'
import { preprocessDXCCData } from '../src/lib/preprocessing.js'

console.log('Generating DXCC json')

/* eslint-disable n/handle-callback-err */
const dxccCSV = fs.readFileSync('data/dxcc-2020-02.csv', 'utf8', (err, data) => data)

const dxcc = preprocessDXCCData(dxccCSV)

const currentDXCC = {}
Object.values(dxcc).forEach((entity) => {
  if (!entity.deleted) {
    currentDXCC[entity.entityPrefix] = entity
  }
})

fs.writeFileSync('src/data/dxccByCode.json', JSON.stringify(dxcc), 'utf8')
fs.writeFileSync('src/data/dxccByCode.js', `export const DXCC_BY_CODE = ${JSON.stringify(dxcc)}`, 'utf8')
fs.writeFileSync('src/data/dxcc.json', JSON.stringify(Object.values(dxcc)), 'utf8')
fs.writeFileSync('src/data/dxcc.js', `export const DXCC = ${JSON.stringify(Object.values(dxcc))}`, 'utf8')
fs.writeFileSync('src/data/dxccCurrent.json', JSON.stringify(Object.values(currentDXCC)), 'utf8')
fs.writeFileSync('src/data/dxccCurrent.js', `export const DXCC_CURRENT = ${JSON.stringify(Object.values(currentDXCC))}`, 'utf8')
fs.writeFileSync('src/data/dxccByPrefix.json', JSON.stringify(currentDXCC), 'utf8')
fs.writeFileSync('src/data/dxccByPrefix.js', `export const DXCC_BY_PREFIX = ${JSON.stringify(currentDXCC)}`, 'utf8')

console.log('DXCC Entities written to data/dxcc.json, dxccByCode.json, dxccCurrent.json and dxccByPrefix.json')
console.log('')
