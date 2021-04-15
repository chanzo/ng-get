import * as http from 'https';
import * as zlib from 'zlib';

export async function wget(url: string): Promise<Buffer> {
  const options = url;

  return new Promise((resolve, reject) => {
    http.get(options, response => {
      const chunks: Buffer[] = [];

      response
        .on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        })
        .on('end', () => {
          const buffer = Buffer.concat(chunks);
          const encoding = response.headers['content-encoding'];

          if (encoding === 'gzip') {
            zlib.gunzip(buffer, (err, decoded) => {
              resolve(decoded);
            });
          } else if (encoding === 'deflate') {
            zlib.inflate(buffer, (err, decoded) => {
              resolve(decoded);
            });
          } else {
            resolve(buffer);
          }
        })
        .on('error', error => {
          reject(error);
        });
    });
  });
}
