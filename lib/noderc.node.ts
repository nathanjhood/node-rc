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
}
const noderc: noderc = require('../build/lib/noderc.node');
export = noderc;
