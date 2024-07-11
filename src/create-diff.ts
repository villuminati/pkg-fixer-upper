import * as fs from "fs";
import * as Diff from "diff";

const text1Path = "./data/text1.txt";
const text2Path = "./data/text2.txt";

// Read the contents of text1.txt and text2.txt
const text1 = fs.readFileSync(text1Path, "utf8");
const text2 = fs.readFileSync(text2Path, "utf8");

// Create the diff
const patch = Diff.createTwoFilesPatch(text2Path, text1Path, text2, text1);

// Save the diff to diff.patch
fs.writeFileSync("./data/diff.patch", patch, "utf8");

console.log("Diff created and saved to ./data/diff.patch");
