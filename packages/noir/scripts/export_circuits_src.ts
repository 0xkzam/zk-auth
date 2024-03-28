import { readFileSync, writeFileSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";

const TARGET_FILE = "../nextjs/generated/circuits.json";
const CIRCUITS_FOLDER_PATH = "./circuits";

function getData(project: string) {
  const path = `${CIRCUITS_FOLDER_PATH}/${project}/target/${project}.json`;
  try {
    console.log("🤓 trying to read:", path);
    const code = JSON.parse(readFileSync(path, "utf8") as string);

    const keys = Object.keys(code);
    for (const key of keys) {
      if (key === "abi") {
        const subKeys = Object.keys(code[key]);
        for (const subKey of subKeys) {
          if (subKey === "param_witnesses") {
            const finalKeys = Object.keys(code[key][subKey]);
            for (const finalKey of finalKeys) {
              const data = code[key][subKey][finalKey][0];
              code[key][subKey][finalKey] = Array.from(
                { length: data.end - data.start },
                (_, index) => index + data.start + 1,
              );
            }
          }
        }
      }
    }

    return code;
  } catch (err: any) {
    console.error(`❌ error when reading file (${path}) with error: ${err.stack}\n`);
  }
}

async function exportAsJson() {
  const data: any = {};
  const circuits = await readdir(CIRCUITS_FOLDER_PATH);
  for (const name of circuits) {
    data[name] = getData(name);
  }
  writeFileSync(path.resolve(TARGET_FILE), JSON.stringify(data, null, 2));
}

exportAsJson();
