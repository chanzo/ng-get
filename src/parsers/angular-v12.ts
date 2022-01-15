import { acornSelect, MatchFirstArray,MatchArray } from './acorn-tools';
import { AngularGeneric } from './angular-v9';

export class AngularV12 extends AngularGeneric {
  public get name() {
    return 'AngularV12';
  }

  public constructor(node: acorn.Node) {
    super(node);
  }
}
