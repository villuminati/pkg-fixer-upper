import * as fs from "fs";
import * as Diff from "diff";

// Read the contents of text2.txt and diff.patch
const text2 = fs.readFileSync("./data/text2.txt", "utf8");
const patch = fs.readFileSync("./data/diff.patch", "utf8");

// Apply the patch to text2
const result = Diff.applyPatch(text2, patch);

if (result === false) {
    console.error("Failed to apply patch", result);
} else {
    // Save the reconstructed text1.txt
    fs.writeFileSync("./data/reconstructed_text1.txt", result, "utf8");
    console.log(
        "Patch applied successfully, reconstructed_text1.txt has been created"
    );
}
