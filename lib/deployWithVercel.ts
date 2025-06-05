import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function deployUserStore(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const userDir = path.resolve(process.cwd(), 'stores', username);

    if (!fs.existsSync(userDir)) {
      return reject(new Error('User store directory not found.'));
    }

    // Build and export static site
    exec('next build && next export -o out', { cwd: userDir }, (error, stdout, stderr) => {
      if (error) {
        console.error('Export error:', stderr);
        return reject(error);
      }

      // Deploy using Vercel CLI
      exec('vercel deploy --prod --confirm --token=' + process.env.VERCEL_TOKEN, { cwd: userDir }, (err, out, errOut) => {
        if (err) {
          console.error('Deployment error:', errOut);
          return reject(err);
        }

        const deployedUrlMatch = out.match(/https?:\/\/[\w.-]+\.vercel\.app/);
        if (deployedUrlMatch) {
          resolve(deployedUrlMatch[0]);
        } else {
          reject(new Error('Deployment URL not found in output.'));
        }
      });
    });
  });
}
