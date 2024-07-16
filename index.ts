import minimist from "minimist";
import { createDiff } from "./src/create-diff";
import { applyDiff } from "./src/apply-diff";

const argv = minimist(process.argv.slice(2));

// console.debug({ argv });

function main() {
    console.log("running pkg-fixer-upper ...");
    if (argv._.length > 0) {
        createDiff(argv._);
    } else if (argv._.length === 0) {
        // applyDiff
        console.debug("case: apply diff");
        applyDiff();
    }
}

main();
