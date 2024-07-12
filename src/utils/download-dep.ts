import fs from "fs-extra";
import path from "path";
import axios from "axios";
import * as tar from "tar";

const tempDir = path.join("./", process.env.TEMP_DIR!);

async function getPackageMetadata(dep: string) {
    const packageUrl = `https://registry.npmjs.org/${dep}`;
    const response = await axios.get(packageUrl);
    return response;
}

function getTarballUrl(response: any) {
    const latestVersion = response.data["dist-tags"].latest;
    const tarballUrl = response.data.versions[latestVersion].dist.tarball;

    return {
        latestVersion,
        tarballUrl,
    };
}

async function downloadTarballFromUrl(tarballUrl: string, dep: string) {
    // download the tarball
    const tarballResponse = await axios.get(tarballUrl, {
        responseType: "stream",
    });
    const tarballPath = path.join(tempDir, `${dep}.tgz`);

    // save the tarball
    const writer = fs.createWriteStream(tarballPath);
    tarballResponse.data.pipe(writer);

    // ensure the stream is finished
    await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });

    // extract the tarball to the {dep} directory
    await tar.x({
        file: tarballPath,
        cwd: path.join(tempDir, dep),
        strip: 1, // strip the first directory
    });

    // clean up tarball
    fs.removeSync(tarballPath);

    console.log(
        `Package downloaded and extracted to ${path.join(tempDir, dep)}`
    );
}

export async function downloadDep(dep: string) {
    const depDir = path.join(tempDir, dep);
    fs.ensureDirSync(depDir);

    const response = await getPackageMetadata(dep);

    const { latestVersion, tarballUrl } = getTarballUrl(response);

    await downloadTarballFromUrl(tarballUrl, dep);
}
