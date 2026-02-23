// ZIP packaging utility

import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

export class ZipPackager {
  /**
   * Create ZIP archive from directory
   */
  static async createZip(sourceDir: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create output stream
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Maximum compression
      });

      // Listen for completion
      output.on('close', () => {
        console.log(`ZIP created: ${archive.pointer()} bytes`);
        resolve();
      });

      // Listen for errors
      archive.on('error', (err) => {
        reject(err);
      });

      output.on('error', (err) => {
        reject(err);
      });

      // Pipe archive data to the file
      archive.pipe(output);

      // Add directory contents to archive
      archive.directory(sourceDir, false);

      // Finalize the archive
      archive.finalize();
    });
  }

  /**
   * Get ZIP file size in bytes
   */
  static getZipSize(zipPath: string): number {
    if (!fs.existsSync(zipPath)) {
      return 0;
    }
    const stats = fs.statSync(zipPath);
    return stats.size;
  }

  /**
   * Format bytes to human-readable size
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
