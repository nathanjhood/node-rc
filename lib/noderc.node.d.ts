declare interface noderc {
  hello(): string;
  version(): string;
  open(path: string): string;
  isFile(path: string): boolean;
  isDirectory(path: string): boolean;
  exists(path: string): boolean;
  compare(file: string, path: string): boolean;
  compareSize(file: string, path: string): boolean;
  compareContent(file: string, path: string): boolean;
}
declare const noderc: noderc;
export = noderc;
