import { logFileSize } from "@remvst/js13k-tools";
import { spawn } from 'child_process';
import yargs from 'yargs/yargs';
import { archiveFile } from "zip-lib";

const argv = yargs(process.argv.slice(2)).options({
    html: { type: 'string', demandOption: true },
    zip: { type: 'string', default: null },
    optimize: { type: 'boolean', default: false },
}).parse();

(async () => {
    console.log('Zipping...');
    await archiveFile(argv.html, argv.zip);
    await logFileSize(argv.zip, 13 * 1024);

    if (argv.optimize) {
        // Optional advzip optimization if available on PATH
        try {
            await new Promise<void>((resolve, reject) => {
                const subprocess = spawn('advzip', ['-z', argv.zip, '--shrink-insane']);
                subprocess.on('error', () => resolve()); // Ignore if advzip not installed
                subprocess.on('exit', (code) => {
                    if (code === 0) resolve();
                    else resolve();
                });
            });
            await logFileSize(argv.zip, 13 * 1024);
        } catch {
            // Optional
        }
    }
})();
