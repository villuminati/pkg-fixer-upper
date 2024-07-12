import { downloadDep } from "./utils/download-dep";
import fs from "fs-extra";

import path from "path";

async function diffDep(dep: string) {
    console.log("diffing dependency ...");
    let pathToRootOfDep = path.join("node_modules", dep);
    console.log({ pathToRootOfDep });
    const metadata = await fs.stat(pathToRootOfDep);
    console.log(metadata);

    if (metadata.isDirectory()) {
        console.log("metadata.isDirectory() is true");
        const filesAndDirs = await listAllFilesAndDirs(pathToRootOfDep);
        console.log({ filesAndDirs });
    }
}

export function createDiff(deps: string[]) {
    for (let i = 0; i < deps.length; i++) {
        downloadDep(deps[i]);
        diffDep(deps[i]);
    }
}
async function listAllFilesAndDirs(dirPath: string) {
    console.log("listAllFilesAndDirs");
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
