// import * as fs from "fs";
import * as Diff from "diff";
import { readdir, stat } from "fs/promises";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const patchesFolder = process.env.PATCHES_DIR!;

async function listDepsToPatch() {
    // list deps in patches directory
    const entries = await readdir(patchesFolder, { withFileTypes: true });
    const dirs = entries.filter((d) => d.isDirectory()).map((d) => d.name);

    console.log("dependencies that need to be patched: ", dirs);

    return dirs;
}

export async function applyDiff() {
    const depsToPatch = listDepsToPatch();
    for (const dep of await depsToPatch) {
        console.log("applying patch for", dep);

        // TODO: At this point i am using all files will in one level deep.
        // This is not ideal. We need to read nested dirs in the dep directory
        const allFilesAndDirsInDep = await readdir(
            path.join(patchesFolder, dep),
            {
                withFileTypes: true,
            }
        );

        const filesToPatchInDep = allFilesAndDirsInDep
            .filter((f) => f.isFile())
            .map((f) => f.name);

        console.log({ filesToPatchInDep });

        for (const patchfile of filesToPatchInDep) {
            console.log("applying patch for", patchfile);

            const nameWithoutExtension = patchfile.replace(".patch", "");

            // this text2 will be path to node_modules/dep/file.js
            const text2 = readFileSync(
                `./node_modules/${dep}/${nameWithoutExtension}`,
                "utf8"
            );
            // this will be path to patches/dep/file.js.patch
            const patch = readFileSync(`./patches/${dep}/${patchfile}`, "utf8");

            // // Apply the patch to text2
            const result = Diff.applyPatch(text2, patch);

            if (result === false) {
                console.error("Failed to apply patch", result);
            } else {
                // Save the reconstructed text1.txt to node_modules/dep/file.js again
                writeFileSync(
                    `./node_modules/${dep}/${nameWithoutExtension}`,
                    result,
                    "utf8"
                );
                console.log(
                    `Patch applied successfully, /node_modules/${dep}/${nameWithoutExtension} has been created`
                );
            }
        }
    }
}
