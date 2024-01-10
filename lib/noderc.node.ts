/**
 * The 'noderc' C++ addon interface.
 */
interface noderc {
  /**
   * Returns a string, confirming the module is online.
   * @returns string
   */
  hello(): string;
  /**
   * Returns a string, confirming the module version number.
   * @returns string
   */
  version(): string;

  /**
   * Opens and returns a non-directory file object at ```path```, or throws
   * ```std::system_error()``` on error.
   * @param path
   * @returns string
   */
  open(path: string): string;

  /**
   * Returns ```true``` if the given ```path``` names a regular file, ```false```
   * otherwise.
   * @param path
   * @returns boolean
   */
  isFile(path: string): boolean;

}
const noderc: noderc = require('../build/lib/noderc.node');
export = noderc;
