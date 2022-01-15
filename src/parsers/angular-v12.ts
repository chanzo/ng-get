import { acornSelect, MatchArray, MatchFirstArray } from './acorn-tools';
import { AngularGeneric } from './angular-v9';

export class AngularV12 extends AngularGeneric {
  public get name(): string {
    return 'AngularV12';
  }

  public constructor(node: acorn.Node) {
    super(node);
  }
}
