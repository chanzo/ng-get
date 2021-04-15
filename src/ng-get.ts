import { Parser } from 'htmlparser2';
import { wget } from './common';
import { acornSelect, MatchArray, MatchFirstArray } from './parsers/acorn-tools';
import * as fs from 'fs';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import { AngularV9 } from './parsers/angular-v9';

interface IIndex {
  readonly scripts: string[];
  readonly main: string;
}

class NGInspect {
  public readonly ngVersion: string;
  public environment: any;
  public static async parseIndex(uri: string): Promise<IIndex> {
    const content = await wget(uri);
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

  public static async parse(uri: string): Promise<NGInspect> {
    const index = await NGInspect.parseIndex(uri);
    const main = index.main ? (await wget(uri + '/' + index.main)).toString() : '';
    // const main = fs.readFileSync('../main-dump-min.js').toString();
    const ngi = new NGInspect(index, main);

    return ngi;
  }

  private constructor(public readonly index: IIndex, main: string) {
    const node = acorn.parse(main, { ecmaVersion: 2020 });

    // fs.writeFileSync('acorn.json', JSON.stringify(node, null, 2));
    // fs.writeFileSync('../main-dump-min.js');

    const parser = new AngularV9(node);

    this.ngVersion = parser.getVersion();
    this.environment = parser.getEnvironment();
  }
}

export async function main(argv: string[]): Promise<void> {
  if (argv.length < 3) {
    console.log('Usage: npx ng-get https://my-angular-website.com');
    process.exit(1);
  }

  const url = argv[2];

  console.log('Inspecting:', url);
  console.log();

  const result = await NGInspect.parse(url);

  console.log(JSON.stringify(result, null, 2));
}
