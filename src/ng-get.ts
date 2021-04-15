import { Parser } from 'htmlparser2';
import { wget } from './common';
import * as fs from 'fs';
import * as acorn from 'acorn';
import { AngularV9 } from './parsers/angular-v9';
import { version } from './package.json';

interface IIndex {
  readonly scripts: string[];
  readonly main: string;
}

class NGInspect {
  public readonly ngVersion: string;
  public environment: any;
  public static async parseIndex(url: URL): Promise<IIndex> {
    const content = await wget(url.href);
    const scripts: string[] = [];
    const parser = new Parser({
      onopentag: (name, attributes) => {
        // if (name === 'script' && (attributes.type === 'module' || (attributes.nomodule === '' && attributes.defer === ''))) {
        if (name === 'script' && attributes.src) {
          scripts.push(attributes.src);
        }
      },
      ontext: text => {},
      onclosetag: tagname => {}
    });

    parser.write(content.toString());
    parser.end();

    const index = scripts.findIndex(value => value.startsWith('main'));

    return {
      scripts: scripts,
      main: index !== -1 ? scripts[index] : ''
    };
  }

  public static async parse(url: URL): Promise<NGInspect> {
    const index = await NGInspect.parseIndex(url);
    const main = await NGInspect.getMain(url, index.main);

    // const main = fs.readFileSync('../main-dump-min.js').toString();
    const ngi = new NGInspect(index, main);

    return ngi;
  }

  private constructor(public readonly index: IIndex, main: string) {
    try {
      const node = acorn.parse(main, { ecmaVersion: 2020 });

      // fs.writeFileSync('acorn.json', JSON.stringify(node, null, 2));
      // fs.writeFileSync('../main-dump-min.js');

      const parser = new AngularV9(node);

      this.ngVersion = parser.getVersion();
      this.environment = parser.getEnvironment();
    } catch (error) {
      console.error(error);
      this.ngVersion = '';
      this.environment = {};
    }
  }

  private static async getMain(url: URL, main: string): Promise<string> {
    if (main) {
      try {
        console.error('Downloading main:', url.href + main);

        return (await wget(url.href + main)).toString();
      } catch (error) {
        console.error(error);
      }
    }

    return '';
  }
}

export async function main(argv: string[]): Promise<void> {
  if (argv.length < 3) {
    console.log('NG-Get ' + version);
    console.log();
    console.log('Usage: npx ng-get https://my-angular-website.com');
    process.exit(1);
  }

  let location = argv[2].toLowerCase();

  if (!location.startsWith('http')) {
    location = 'https://' + location;
  }

  const url = new URL(location);

  console.error('Inspecting:', url.href);
  console.error();

  const result = await NGInspect.parse(url);

  console.log(JSON.stringify(result, null, 2));
}
