const fetch = require("node-fetch");
const fs = require("fs");
const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} = require("quicktype-core");
const Diff = require("diff");
const Diff2html = require("diff2html");
const open = require("open");

const targetLanguage = "typescript";
async function jsonToTsSchema(jsonEndpoint) {
  const response = await fetch(jsonEndpoint);
  const data = await response.json();

  const jsonInput = jsonInputForTargetLanguage(targetLanguage);
  await jsonInput.addSource({
    name: "root",
    samples: [JSON.stringify(data)],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const { lines } = await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: {
      "just-types": true,
    },
  });

  return lines.join("\n");
}

async function main() {
  let currentJson;
  let nextJson;
  let out;
  try {
    [currentJson, nextJson, out] = process.argv.slice(2);
  } catch (error) {
    console.error(
      error,
      "Must provide three arguments: <current-json-endpoint-url> <next-json-endpoint-url> <out>"
    );
  }

  // Generate TS schema for both
  const currentSchema = await jsonToTsSchema(currentJson);
  const nextSchema = await jsonToTsSchema(nextJson);

  // Create diff of the two TS schemas
  const t = Diff.createTwoFilesPatch(
    "current",
    "new",
    currentSchema,
    nextSchema,
    undefined,
    undefined,
    {
      context: 1000,
    }
  );

  // Create an HTML page to view diffs
  const diffJson = Diff2html.parse(t);
  const diffHtml = Diff2html.html(diffJson, {
    drawFileList: false,
    outputFormat: "side-by-side",
  });
  try {
    const html = fs.readFileSync("./template.html", "utf8");
    fs.writeFileSync(out, html + diffHtml);
  } catch (err) {
    console.error(err);
  }
  open(out);
}

main();
