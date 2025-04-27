import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

const sourceDir = './dist';
const exportDir = './export';

async function exportBuild() {
  try {
    // Create export directory
    await mkdir(exportDir, { recursive: true });
    
    // Create a gzipped tarball of the dist directory
    const outputFile = join(exportDir, 'build.tar.gz');
    const output = createWriteStream(outputFile);
    const gzip = createGzip();
    
    await pipeline(
      createReadStream(sourceDir),
      gzip,
      output
    );
    
    console.log(`✅ Build exported successfully to ${outputFile}`);
  } catch (error) {
    console.error('❌ Error exporting build:', error);
    process.exit(1);
  }
}

exportBuild();