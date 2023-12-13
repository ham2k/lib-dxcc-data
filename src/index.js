export * from './lib/continents'

let _entities
if (typeof window === 'undefined')  {
  import { createRequire } from "node:module"
  const require = createRequire(import.meta.url)
  _entities = require('./data/dxccByCode.json')
} else {
  import { _entities } from './data/dxccByCode.json'
}

export const ENTITIES = _entities

