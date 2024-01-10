declare interface noderc {
  hello(): string;
  version(): string;
  open(file: string): string;
}
declare const noderc: noderc;
export = noderc;
