const fs = require("fs")
const path = require("path")
const { preprocessDXCCData } = require("../src/lib/preprocessing")

console.log("Generating DXCC json")

const dxccCSV = fs.readFileSync(path.join(__dirname, "../data/dxcc-2020-02.csv"), "utf8", (err, data) => data)

const dxcc = preprocessDXCCData(dxccCSV)

const currentDXCC = {}
Object.values(dxcc).forEach((entity) => {
  if (!entity.deleted) {
    currentDXCC[entity.entityPrefix] = entity
  }
})

fs.writeFileSync(path.join(__dirname, "../src/data/dxccByCode.json"), JSON.stringify(dxcc), "utf8")
fs.writeFileSync(path.join(__dirname, "../src/data/dxcc.json"), JSON.stringify(Object.values(dxcc)), "utf8")

fs.writeFileSync(
  path.join(__dirname, "../src/data/dxccCurrent.json"),
  JSON.stringify(Object.values(currentDXCC)),
  "utf8"
)
fs.writeFileSync(path.join(__dirname, "../src/data/dxccByPrefix.json"), JSON.stringify(currentDXCC), "utf8")

console.log("DXCC Entities written to data/dxcc.json, dxccByCode.json, dxccCurrent.json and dxccByPrefix.json")
console.log("")
