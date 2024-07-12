import fs from "fs-extra";
import path from "path";
import { createTwoFilesPatch } from "diff";

import { downloadDep } from "./utils/download-dep";

async function diffDir(pathDir: string, dep: string) {
    const metadata = await fs.stat(pathDir);

    if (metadata.isDirectory()) {
        const filesAndDirs = await listAllFilesAndDirs(pathDir);

        for (let entry of filesAndDirs) {
            // console.log({ entry });
            if (entry.type === "file") {
                // TODO: check the file is a js or ts file etc
                if (entry.name.endsWith(".js")) {
                    // const text1Path = "./data/text1.txt";
                    // const text2Path = "./data/text2.txt";

                    // this is the one inside node_modules that the user would've touched
                    const text1Path = path.join(pathDir, entry.name);

                    // this is the one inside .tmp
                    const text2Path = path.join(
                        "./",
                        process.env.TEMP_DIR!,
                        dep,
                        entry.name
                    );

                    console.log({
                        text1Path,
                        text2Path,
                    });

                    // Read the contents of text1.txt and text2.txt
                    const text1 = fs.readFileSync(text1Path, "utf8");
                    const text2 = fs.readFileSync(text2Path, "utf8");
                    console.log("file to process:", entry.name);
                    const patch = createTwoFilesPatch(
                        text2Path,
                        text1Path,
                        text2,
                        text1
                    );

                    const pathToPatchFile = path.join(
                        process.env.PATCHES_DIR!,
                        dep,
                        `${entry.name}.patch`
                    );

                    fs.ensureDirSync(path.dirname(pathToPatchFile));

                    console.log({ pathToPatchFile });
                    // Save the diff to pathToPatchFile
                    fs.writeFileSync(pathToPatchFile, patch, "utf8");
                }
            } else if (
                entry.type === "directory" &&
                // TODO: research: the user can't make changes inside the node_modules of the dep they want to change
                entry.name !== "node_modules"
            ) {
                diffDir(path.join(pathDir, entry.name), dep);
            }
        }
    }
}

async function diffDeps(dep: string) {
    let pathToRootOfDep = path.join("node_modules", dep);
    diffDir(pathToRootOfDep, dep);
}

async function listAllFilesAndDirs(dirPath: string) {
    const entries = await fs.readdir(dirPath, {
        withFileTypes: true,
    });

    const filesAndDirs = [];

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
            filesAndDirs.push({ name: entry.name, type: "directory" });
        } else if (stats.isFile()) {
            filesAndDirs.push({ name: entry.name, type: "file" });
        }
    }

    return filesAndDirs;
}

export function createDiff(deps: string[]) {
    for (let i = 0; i < deps.length; i++) {
        downloadDep(deps[i]);
        diffDeps(deps[i]);
    }
}
