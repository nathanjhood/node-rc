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
   * ```std::system_error()``` (as a Javascript exception) on error.
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

  /**
   * Returns ```true``` if the given ```path``` names a directory, ```false```
   * otherwise.
   * @param path
   * @returns boolean
   */
  isDirectory(path: string): boolean;

  /**
   * Returns ```true``` if the given ```path``` names an existing file or
   * directory, ```false``` otherwise.
   * @param path
   * @returns boolean
   */
  exists(path: string): boolean;

  /**
   * Compare a ```file``` on disk to a  compiled resource at ```path```;
   * returns ```false``` if the ```file``` is not the same size (in bytes) as
   * the compiled resource at ```path```, or if the content of ```file``` (in
   * bytes) does not match the content of the compiled resource at ```path```.
   * Otherwise, returns true. Also prints to ```STDOUT```.
   *
   * Example:
   *
   * We have a file located at ```/home/myconfig.cfg``` and we compile it with
   * ```noderc```, so that the file is accessible at
   * ```noderc.open("myconfig.cfg")```.
   *
   * ```
   * // test = true, *if* the file (param A) matches the resource (param B)
   * test = noderc.compare("/home/myconfig.cfg", "myconfig.cfg")
   *
   * // test = false, *if* the file (param A) does not match the resource (param B)
   * test = noderc.compare("/backup/my_backup_config.cfg", "myconfig.cfg")
   *
   * ```
   *
   * @param file
   * @param path
   * @returns boolean
   */
  compare(file: string, path: string): boolean;

  /**
   * Compare a ```file``` on disk to a  compiled resource at ```path```;
   * returns ```false``` if the ```file``` is not the same size (in bytes) as
   * the compiled resource at ```path```. Otherwise, returns true. Also prints
   * to ```STDOUT```.
   *
   * Example:
   *
   * We have a file located at ```/home/myconfig.cfg``` and we compile it with
   * ```noderc```, so that the file is accessible at
   * ```noderc.open("myconfig.cfg")```.
   *
   * ```
   * // test = true, *if* size of file (param A) == size of resource (param B)
   * test = noderc.compareSize("/home/myconfig.cfg", "myconfig.cfg")
   *
   * // test = false, *if* size of file (param A) != size of resource (param B)
   * test = noderc.compareSize("/backup/my_backup_config.cfg", "myconfig.cfg")
   * ```
   * @param file
   * @param path
   * @returns boolean
   */
  compareSize(file: string, path: string): boolean;

  /**
   * Compare a ```file``` on disk to a  compiled resource at ```path```;
   * returns ```false``` if the ```file``` is not the same (in byte-to-byte comparison)
   * as the compiled resource at ```path```. Otherwise, returns true. Also
   * prints to ```STDOUT```.
   *
   * Example:
   *
   * We have a file located at ```/home/myconfig.cfg``` and we compile it with
   * ```noderc```, so that the file is accessible at
   * ```noderc.open("myconfig.cfg")```.
   *
   * ```
   * // test = true, *if* bytes of file (param A) == bytes of resource (param B)
   * test = noderc.compareContent("/home/myconfig.cfg", "myconfig.cfg")
   *
   * // test = false, *if* bytes of file (param A) != bytes of resource (param B)
   * test = noderc.compareContent("/backup/my_backup_config.cfg", "myconfig.cfg")
   * ```
   * @param file
   * @param path
   * @returns boolean
   */
  compareContent(file: string, path: string): boolean;
}
const noderc: noderc = require('../build/lib/noderc.node');
export = noderc;
