// import * as fs from "fs";
// import * as Diff from "diff";

import { downloadDep } from "./utils/download-dep";

// const text1Path = "./data/text1.txt";
// const text2Path = "./data/text2.txt";

// // Read the contents of text1.txt and text2.txt
// const text1 = fs.readFileSync(text1Path, "utf8");
// const text2 = fs.readFileSync(text2Path, "utf8");

// // Create the diff
// const patch = Diff.createTwoFilesPatch(text2Path, text1Path, text2, text1);

// // Save the diff to diff.patch
// fs.writeFileSync("./data/diff.patch", patch, "utf8");

// console.log("Diff created and saved to ./data/diff.patch");

const TEMP_DIR = "temp-package/";
const PATCHES_DIR = "patches/";

export function createDiff(deps: string[]) {
    for (let i = 0; i < deps.length; i++) {
        let pathToRootOfDep = "./node_modules/" + deps[i];
        downloadDep(deps[i]);
    }
}
