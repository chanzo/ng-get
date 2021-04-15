import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

interface INode {
  type: string;
  start: number;
  end: number;
  declarations: Array<{
    type: string;
    start: number;
    end: number;
    id: {
      type: string;
      start: number;
      end: number;
      name: string;
    };
    init: {
      type: string;
      start: number;
      end: number;
      callee: {
        type: string;
        start: number;
        end: number;
        name: string;
      };
      arguments: Array<{
        type: string;
        start: number;
        end: number;
        value: string;
        raw: string;
      }>;
    };
  }>;
  kind: string;
}

export class MatchArray {
  public constructor(public readonly items: Array<{ [name: string]: any }>, public readonly min: number = 0, public readonly max: number = Number.MAX_SAFE_INTEGER) {}
}

export class MatchFirstArray {
  public constructor(public readonly items: Array<{ [name: string]: any }>, public readonly min: number = 0, public readonly max: number = Number.MAX_SAFE_INTEGER) {}
}

export interface ISelection {
  [name: string]: any;
}

export function nodeMatch(node: any, match: any): boolean {
  if (!node && node !== match) {
    return false;
  }

  if (Array.isArray(match)) {
    if (!Array.isArray(node) || match.length !== node.length) {
      return false;
    }

    for (let index = 0; index < match.length; index++) {
      if (!nodeMatch(node[index], match[index])) {
        return false;
      }
    }
    return true;
  }

  if (match instanceof RegExp) {
    return match.test(node);
  }

  if (match instanceof MatchArray) {
    if (!Array.isArray(node) || node.length < match.min || node.length > match.max) {
      return false;
    }

    for (let index = 0; index < node.length; index++) {
      if (match.items[index] && !nodeMatch(node[index], match.items[index])) {
        return false;
      }
    }

    return true;
  }

  if (match instanceof MatchFirstArray) {
    if (!Array.isArray(node) || node.length < match.min || node.length > match.max) {
      return false;
    }

    for (let nodeIndex = 0; nodeIndex < node.length; nodeIndex++) {
      if (node.length - nodeIndex < match.items.length) {
        return false;
      }

      let matchCount = 0;

      for (let matchIndex = 0; matchIndex < match.items.length; matchIndex++) {
        if (nodeMatch(node[nodeIndex + matchIndex], match.items[matchIndex])) {
          matchCount++;
        }
      }

      if (matchCount === match.items.length) {
        const backup = [];

        for (let index = nodeIndex; index < node.length; index++) {
          backup.push(node[index]);
        }

        node.length = 0;
        node.push(...backup);

        return true;
      }
    }

    return false;
  }

  for (const [name, value] of Object.entries(match)) {
    if (typeof value === 'object') {
      if (!nodeMatch(node[name], value)) {
        return false;
      }
      continue;
    }

    if (node[name] !== value) return false;
  }

  return true;
}

export function acornSelect(node: acorn.Node, selection: ISelection, start: number = 0, maximum: number = Number.MAX_SAFE_INTEGER): acorn.Node[] {
  const matches: acorn.Node[] = [];

  while (matches.length < maximum) {
    const match = walk.findNodeAfter(node, start, (type, node: any) => {
      return nodeMatch(node, selection);
    });

    if (!match || !match.node) {
      break;
    }

    matches.push(match.node);
    start = match.node.end;
  }

  return matches;
}
