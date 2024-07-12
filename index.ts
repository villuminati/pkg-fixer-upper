import minimist from "minimist";
import { createDiff } from "./src/create-diff";

const argv = minimist(process.argv.slice(2));

// console.debug({ argv });

function main() {
    if (argv._.length > 0) {
        createDiff(argv._);
    } else if (argv._.length === 0) {
        // applyDiff
        console.debug("case: apply diff");
    }
}

main();
