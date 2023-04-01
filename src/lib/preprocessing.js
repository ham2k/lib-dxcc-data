// const { parse } = require("csv/dist/cjs/sync.cjs") // Use this line when running tests
const { parse } = require("csv/sync") // Use this line normally

const CountryFiles = require("@ham2k/lib-country-files/builtinData")
const QRZNames = require("../../data/qrz-names.json")
const ExtraInfo = require("../../data/extra-info.json")

const CTYbyCode = {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
Object.entries(CountryFiles.CTYData.entities).forEach(([prefix, cty]) => {
  if (!cty.isWAE) CTYbyCode[cty.dxccCode] = cty
})

function preprocessDXCCData(dxccCSV) {
  const dxcc = {}

  const records = parse(dxccCSV, { columns: true, skip_empty_lines: true })
  console.log(`${records.length} records`)
  records.forEach((record) => {
    // console.log(record)
    const code = Number.parseInt(record.entityCode)
    if (dxcc[code]) {
      console.log("Duplicate entity code", code)
      console.log(dxcc[code])
      console.log(record)
    }
    dxcc[code] = {
      source: "DXCC",
      dxccName: record.name,
      dxccCode: code,
      continents: record.continent.split(","),
      ituZones: record.itu.split(",").map((zone) => Number.parseInt(zone)),
      cqZones: record.cq.split(",").map((zone) => Number.parseInt(zone)),
      deleted: record.deleted === "Y",
      traffic: record.thirdPartyTraffic === "Y",
      start: record.validStart,
      end: record.validEnd,
      flag: record.flag,
      countryCode: record.countryCode == "ZZ" ? "" : record.countryCode.toLowerCase(),
      notes: record.notes,
      regex: record.regex,
      prefixes: record.prefix.split(","),
    }

    dxcc[code].entityPrefix = dxcc[code].prefixes[0] || `${record.deleted === "Y" ? "deleted" : "dxcc"}-${code}`

    dxcc[code].shortName = dxcc[code].dxccName
      .replace(" Islands", " Is.")
      .replace(" Island", " I.")
      .replace("Saint ", "St. ")
      .replace("East ", "E. ")
      .replace("West ", "W. ")
      .replace("Central ", "C. ")
      .replace("Republic ", "Rep. ")
      .replace(" and ", " & ")

    dxcc[code].name = dxcc[code].dxccName
      .replace(" Islands", " Is.")
      .replace(" Island", " I.")
      .replace("St. ", "Saint ")
      .replace("E. ", "East ")
      .replace("W. ", "West ")
      .replace("C. ", "Central ")
      .replace("Rep. ", "Republic ")
      .replace(" & ", " and ")

    dxcc[code].fullName = dxcc[code].dxccName
      .replace(" I.", " Island")
      .replace(" Is.", " Islands")
      .replace(" HQ", " Headquarters")
      .replace("St. ", "Saint ")
      .replace("E. ", "East ")
      .replace("W. ", "West ")
      .replace("C. ", "Central ")
      .replace("Rep. ", "Republic ")
      .replace(" & ", " and ")

    dxcc[code].lotwName = dxcc[code].fullName.toUpperCase()
    dxcc[code].clublogName = dxcc[code].lotwName

    if (QRZNames[code] !== record.name) dxcc[code].qrzName = QRZNames[code]

    if (CTYbyCode[code]) {
      dxcc[code] = { ...CTYbyCode[code], ...dxcc[code] } // CTY info should not override
      dxcc[code].entityPrefix = CTYbyCode[code].entityPrefix // except for entityPrefix, for which we trust CTY over other sources
    }

    if (ExtraInfo[code]) dxcc[code] = { ...dxcc[code], ...ExtraInfo[code] } // Extra info should override
  })

  return dxcc
}

module.exports = {
  preprocessDXCCData,
}
