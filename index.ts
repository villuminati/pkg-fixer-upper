import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

// console.debug({ argv });

function main() {
    if (argv._.length > 0) {
        // createDiff
        console.debug("case: create diff");
    } else if (argv._.length === 0) {
        // applyDiff
        console.debug("case: apply diff");
    }
}

main();
