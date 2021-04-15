import { acornSelect, MatchArray, MatchFirstArray } from './acorn-tools';
import { Angular } from './angular-main';

export class AngularV9 extends Angular {
  public constructor(private readonly node: acorn.Node) {
    super();
  }

  public getVersion(): string {
    const found = acornSelect(
      this.node,
      {
        type: 'VariableDeclaration',
        kind: /^const|var$/,
        declarations: new MatchFirstArray([
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier'
            },
            init: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier'
              },
              arguments: [
                {
                  type: 'Literal',
                  value: /^\d+\.\d+.\d+$/
                }
              ]
            }
          }
        ])
      },
      0,
      2
    );

    if (found.length > 0) {
      const match = found[found.length - 1] as any;

      return match.declarations[0].init.arguments[0].value;
    }

    return '?.?.?';
  }

  public getEnvironment(): any {
    const found = acornSelect(
      this.node,
      {
        type: 'VariableDeclaration',
        kind: /^const|var$/,
        declarations: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier'
            },
            init: {
              type: 'ObjectExpression',
              properties: new MatchFirstArray(
                [
                  {
                    type: 'Property',
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      name: 'production'
                    },
                    value: {
                      type: 'UnaryExpression',
                      operator: '!',
                      prefix: true,
                      argument: {
                        type: 'Literal',
                        // value: 0,
                        raw: /^0|1$/
                      }
                    },
                    kind: 'init'
                  }
                ],
                1
              )
            }
          }
        ]
      },
      0, // 258527
      1
    );

    if (found.length > 0) {
      const match = found[0] as any;

      return this.convert(match.declarations[0].init.properties);
    }

    return [];
  }

  private convert(items: any[]): any {
    const result: { [name: string]: string | object } = {};

    for (const item of items) {
      if (item.value.argument) {
        result[item.key.name] = item.value.argument.value;
        continue;
      }
      if (item.value.value) {
        result[item.key.name] = item.value.value;
        continue;
      }

      if (item.value.properties) {
        result[item.key.name] = this.convert(item.value.properties);
        continue;
      }
    }

    return result;
  }
}
