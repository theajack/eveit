/*
 * @Author: tackchen
 * @Date: 2022-08-03 21:07:04
 * @Description: Coding something
 */

const {
    copyFile, buildPackageJson,
    writeFile,
    resolveRootPath,
} = require('../utils');
const pkg = require('../../package.json');
const {build, builddts} = require('../rollup.base');

async function main () {
    const iife = process.argv[2] === 'iife';
    if (iife) {
        await build({
            input: resolveRootPath('src/iife.ts'),
            output: resolveRootPath('npm/eveit.iife.js'),
        });
    } else {
        writeFile('@src/version.ts', `export default '${pkg.version}';`);
        await build();
        await builddts();
        buildPackageJson();
        copyFiles();
    }
}


function copyFiles () {
    copyFile('@LICENSE', '@npm/LICENSE');
    copyFile('@README.md', '@npm/README.md');
}

main();

