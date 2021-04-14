import * as http from 'https';

export async function wget(url: string): Promise<Buffer> {
  const options = url;

  return new Promise((resolve, reject) => {
    http.get(options, message => {
      const bodyChunks: Buffer[] = [];

      message
        .on('data', (chunk: Buffer) => {
          bodyChunks.push(chunk);
        })
        .on('end', () => {
          resolve(Buffer.concat(bodyChunks));
        });
    });
  });
}
