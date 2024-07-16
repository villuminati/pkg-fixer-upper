# pkg-fixer-upper

This is a clone of [patch-package](https://github.com/ds300/patch-package) but for Bun.

To install this package in your project:

```bash
bun add @villuminati/pkg-fixer-upper
```

### How to use this package

Once you have installed this package, you can use it to save diffs of the changes you make to your dependencies.

##### Create diffs

To create diffs of the changes you make to your dependencies, run the following command:

```bash
bun run index.ts [...list of dependencies changed]
```

This will create diffs of the changes you make to your dependencies and save them in the `./patches` directory.

##### Apply diffs

Add the following script to your `package.json` file:

```json
{
    "scripts": {
        "postinstall": "bun run index.ts"
    }
}
```

Then whenever the dependencies are installed, the post install script will run and apply the diffs of the changes you made to your dependencies.

## Development

### To build this project

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
