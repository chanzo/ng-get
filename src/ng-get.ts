import { Parser } from 'htmlparser2';
import * as http from 'https';

async function wget(url: string): Promise<Buffer> {
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

class NGInspect {
  public static async getScripts(uri: string): Promise<string[]> {
    const content = await wget(uri);
    const scripts: string[] = [];
    const parser = new Parser({
      onopentag: (name, attributes) => {
        if (name === 'script' && (attributes.type === 'module' || (attributes.nomodule === '' && attributes.defer === ''))) {
          scripts.push(attributes.src);
        }
      },
      ontext: text => {},
      onclosetag: tagname => {}
    });

    parser.write(content.toString());
    parser.end();

    return scripts;
  }

  public static async getEnvironment(uri: string): Promise<void> {
    const content = await wget(uri);
    const scripts: string[] = [];
    const parser = new Parser({
      onopentag: (name, attributes) => {
        console.log(name);
      },
      ontext: text => {},
      onclosetag: tagname => {}
    });

    parser.write(content.toString());
    parser.end();
  }

  public static async parse(uri: string): Promise<NGInspect> {
    const script = await NGInspect.getScripts(uri);
    const ngi = new NGInspect(script);

    return ngi;
  }
  private constructor(public readonly scripts: string[]) {}
}

export async function main(argv: string[]): Promise<void> {
  if (argv.length < 3) {
    console.log('Usage: npx ng-get https://my-angular-website.com');
    process.exit(1);
  }

  const url = argv[2];

  console.log('Inspecting:', url);

  const result = await NGInspect.parse(url);

  console.log(result.scripts);
}
