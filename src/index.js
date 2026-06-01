#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { evaluate } = require("./rules");

function main(argv) {
  const target = argv[2];

  if (!target || target === "-h" || target === "--help") {
    printHelp();
    return target ? 0 : 1;
  }

  const profilePath = path.resolve(process.cwd(), target);
  const profile = readJson(profilePath);
  const report = evaluate(profile);

  printReport(report, profilePath);
  return report.summary.fail > 0 ? 2 : 0;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read JSON profile at ${filePath}: ${error.message}`);
  }
}

function printHelp() {
  console.log("Usage: matrix-admin-bridge-kit <profile.json>");
  console.log("");
  console.log("Run readiness checks for a Matrix/Synapse admin integration profile.");
}

function printReport(report, profilePath) {
  console.log(`Matrix Admin Bridge Kit report for ${profilePath}`);
  console.log("");

  for (const result of report.results) {
    console.log(`[${result.status.toUpperCase()}] ${result.id}`);
    console.log(`  ${result.message}`);
  }

  console.log("");
  console.log(`Summary: ${report.summary.pass} pass, ${report.summary.warn} warn, ${report.summary.fail} fail`);
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  main,
  printReport,
  readJson
};
