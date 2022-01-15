import { Parser } from 'htmlparser2';
import { wget } from './common';
import * as fs from 'fs';
import * as acorn from 'acorn';
import { AngularGeneric } from './parsers/angular-v9';
import { AngularV12 } from './parsers/angular-v12';
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
    const location = url.href.replace(/^file:\/\//, '').replace(/\/$/, '');

    if (fs.existsSync(location)) {
      const main = fs.readFileSync(location).toString();
      const index = {
        scripts: [],
        main: url.href
      };
      return new NGInspect(index, main);
    }

    const index = await NGInspect.parseIndex(url);
    const main = await NGInspect.getMain(url, index.main);

    return new NGInspect(index, main);
  }

  private constructor(public readonly index: IIndex, main: string) {
    try {
      const node = acorn.parse(main, { ecmaVersion: 2020 });

      // fs.writeFileSync('acorn.json', JSON.stringify(node, null, 2));

      const parser = new AngularGeneric(node);

      console.error('Using parser:', parser.name);

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
        console.error();

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
    console.log('       npx ng-get main.387d31798bf703f92978.js');
    process.exit(1);
  }

  let location = argv[2].toLowerCase().replace(/^file:\/\//, '');

  if (!fs.existsSync(location)) {
    if (!location.startsWith('http')) {
      location = 'https://' + location;
    }
  } else {
    location = 'file://' + location;
  }

  const url = new URL(location);

  console.error('Inspecting:', url.href);
  console.error();

  const result = await NGInspect.parse(url);

  console.log(JSON.stringify(result, null, 2));
}
