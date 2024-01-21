# NodeRC

CMakeRC as a NodeJs C++ Addon.

## Content

- [Usage](https://github.com/nathanjhood/noderc#usage)
  - [Build your own](https://github.com/nathanjhood/noderc#build-your-own)
  - [Requirements](https://github.com/nathanjhood/noderc#requirements)
- [Hacking](https://github.com/nathanjhood/noderc#hacking)
- [Docs](https://github.com/nathanjhood/noderc#usage)
  - [```noderc.open()```](https://github.com/nathanjhood/noderc#nodercopen)
  - [```noderc.isFile()```](https://github.com/nathanjhood/noderc#nodercisfile)
  - [```noderc.isDirectory()```](https://github.com/nathanjhood/noderc#nodercisdirectory)
  - [```noderc.exists()```](https://github.com/nathanjhood/noderc#nodercexists)
  - [```noderc.compare()```](https://github.com/nathanjhood/noderc#noderccompare)
  - [```noderc.compareSize()```](https://github.com/nathanjhood/noderc#noderccomparesize)
  - [```noderc.compareContent()```](https://github.com/nathanjhood/noderc#noderccomparecontent)
  - [```noderc.getFileSystemObject()```](https://github.com/nathanjhood/noderc#noderccompare)
- [Acknowledgments](https://github.com/nathanjhood/noderc#acknowledgments)

## Usage

To see how to serve binary-compiled resources as Javascript objects, follow these steps:

- clone the repo, and ```cd``` into it
- run ```npm run install``` or ```yarn install``` to install the dependencies and build the test project
- the file ```/test/index.js``` calls some functions that are defined and exported in ```/src/noderc.cpp```
- the actual files and directories to be compiled are specified in the [```CMakeLists.txt```](https://github.com/nathanjhood/noderc/blob/main/CMakeLists.txt#L29C11-L29C25) file:

```.cmake
list (APPEND RESOURCES
  # Resources to compile (add more as you please)...
  favicon.ico
  tst.txt
)
```

- the resources added to the above list shall be available in Javascript with ```noderc.open("filename")```.
- [see the test file](https://github.com/nathanjhood/noderc/blob/main/test/index.js) for further functionality, such as testing if a given filename or directory exists (within the compiled library), or whether a file on disk matches the compiled resource (an excellent safety feature).
- run the tests with ```npm run start``` or ```yarn start```

## Build your own

To build your own custom resource library and use it in your own NodeJs projects:

- fork this repo
- customize the [```RESOURCES``` to be compiled in ```CMakeLists.txt```](https://github.com/nathanjhood/noderc/blob/main/CMakeLists.txt#L29C11-L29C25) - they also need to be under version control
- push your changes to your fork
- add the URL of your fork to the ```package.json``` dependencies of the NodeJs project which will consume your library
```.json
"dependencies": {
    "@<GithubUserName>/noderc": "https://github.com/<GithubUserName>/noderc",
    // etc...
}
```
- run ```npm run install``` or ```yarn install``` in your NodeJs project to acquire and build your library
- your library will be available in your NodeJs project by requiring/importing:

```.js
const noderc = require("@<GithubUserName>/noderc")

// or

import noderc from '@<GithubUserName>/noderc'

// then

const my_compiled_resource = noderc.open("somefile.ext")
```

## Requirements

- NodeJs
- CMake
- A C/C++ compiler toolchain (GCC, LLVM, MSVC...)
- A build generator (Ninja, Make, MSVC...)

The remaining dependencies either ship with the repo (such as the 'CMakeRC.cmake' file), or are acquired when running ```npm install``` or ```yarn install``` to initialize the project.

## Hacking

### Trying to build the NodeJs addon manually?

When building this project from the npm/yarn command, the package ```cmake-js``` is invoked, which then reads from the same build script - ```CMakeLists.txt``` - as the CMake CLI does in a typical build scenario. However, ```cmake-js``` also passes an argument to the compiler equivalent to passing ```-DCMAKE_CXX_FLAGS:STRING=-DBUILDING_NODE_EXTENSION``` on the command line. You may also pass the above arg manually when building with CMake directly on the command line, as long as you have already done ```npm install``` or ```yarn install``` to acquire these headers; they should be found in the usual ```node_modules``` folder at the project root.

You will also need to install the ```cmake-js``` package globally in order to acquire necessary NodeJS development files; just run ```npm -g install cmake-js``` or ```yarn global add cmake-js``` before building. Note that the entire content of 'noderc.cpp' is guarded by requiring ```napi.h``` to be found and ```BUILDING_NODE_EXTENSION``` to be defined. See the next section if you can't find ```napi.h```.

### "Where is 'napi.h'?"

When building the NodeJS addon, your IDE might not find the ```<napi.h>``` file, even when building successfully. The file(s) you need should be in the ```node_modules``` directory, under ```node-api-headers/include``` (C headers for NodeJs) and ```node-addon-api``` (C++ headers which wrap the C headers)\*. The build script(s) will pick them up automatically, but your IDE might not. You just need to add these two directories appropriately to your IDE's intellisense engine path.

VSCode with C++ extension example:

```.json
// .vscode/c_cpp_properties.json
{
  "configurations": [
    {
      "name": "Linux",
      "includePath": [
        "${workspaceFolder}/**",
        "node_modules/node-addon-api",
        "node_modules/node-api-headers/include"
      ],
      "defines": [],
      "compilerPath": "/usr/bin/g++",
      "cStandard": "c17",
      "cppStandard": "c++14",
      "intelliSenseMode": "linux-gcc-x64",
      "configurationProvider": "ms-vscode.cmake-tools"
    }
  ],
  "version": 4
}

```

\*Important distinction: ```<napi.h>``` is the C++ addon header, and is ABI-stable.

### Node versions, nvm, and ABI stability

If you are using nvm (node version manager), or have different Node installations on your system, Node addons written using the ```Node API``` C headers will complain that the Node version used during build is different to the one attempting to run the built module. The ```Node Addon API``` C++  header provides an ABI stability promise, which circumvents this issue.

When choosing to build an addon using the Node ```Node API``` C headers directly, you must build against the same Node version that you intend to run on.

With this in mind, ```noderc``` is written using ```Node Addon API``` in C++; you should not experience any issues with differing Node versions and nvm when building this project, thanks to the ```Node Addon API```'s' ABI stability promise.

## Docs

The ```build``` step generates a dynamic library in the output directory. The contents of the dynamic library work like an 'embedded' file system - the files listed in [```RESOURCES```](https://github.com/nathanjhood/noderc/blob/main/CMakeLists.txt#L29C11-L29C25) are compiled in to this embedded filesystem, making their contents available as a ```file``` and their path prefixes available as a ```directory``` tree.

A second library is generated by the ```build``` step, which contains an interface that connects the embedded filesystem library to the NodeJs Addon interface, all written in C++.

The functionality exposed by this interface just provides and exports Javascript-side wrappers around the [CMakeRC](https://github.com/vector-of-bool/cmrc.git) functions.

All of the currently-implemented functionality available on the Javascript is described below.

## ```noderc.open()```

```.js
(method) noderc.open(path: string): string
```
Opens and returns a non-directory ```file``` object at ```path```, or throws ```std::system_error()``` (as a Javascript exception) on error. The ```file``` object, if it exists, is returned as a Javascript ```string``` (for now).

Example:
```.js
const favicon = noderc.open("favicon.ico")
```

The ```file``` objects returned by this method are the ones added to the [```RESOURCES``` list in ```CMakeLists.txt```](https://github.com/nathanjhood/noderc/blob/main/CMakeLists.txt#L29C11-L29C25). It should be possible to add basically *any* file to this list and make it available in Javascript using ```noderc.open("filename.ext")```.

When adding to ```RESOURCES```, the items you want to compile should be specified *relative to the project root folder*, ideally. CMakeRC uses the full filename specified in this list, *including any path prefixes*, when making the compiled resource available via ```noderc.open()```.

This means that you could add the following entries to the list to be compiled (in ```CMakeLists.txt```):
```.cmake
list (APPEND RESOURCES

  # Resources to compile (add/remove as you please)...
  favicon.ico
  tst.txt
  test/views/layout.pug # note that the path prefix was used here...
)
```

Now, the added ```layout.pug``` file should be available via ```noderc.open()```, but you must specifiy the entire path prefix in order to find it:
```.js
const tst_txt     = noderc.open("tst.txt");
const favicon_ico = noderc.open("favicon.ico");
const layout_pug  = noderc.open("test/views/layout.pug"); // path prefix required
```

## ```noderc.isFile()```

```.js
(method) noderc.isFile(path: string): boolean
```

Returns ```true``` if the given ```path``` names a regular file, ```false``` otherwise.

Example:
```.js
const thisWillBeFalse = noderc.isFile("test/views")
const thisWillBeTrue  = noderc.isFile("test/views/layout.pug")
```

## ```noderc.isDirectory()```

```.js
(method) noderc.isDirectory(path: string): boolean
```

Returns ```true``` if the given ```path``` names a directory, ```false``` otherwise.

Example:
```.js
const thisWillBeFalse = noderc.isDirectory("test/views/layout.pug")
const thisWillBeTrue  = noderc.isDirectory("test/views")
```

## ```noderc.exists()```

```.js
(method) noderc.exists(path: string): boolean
```

Returns ```true``` if the given ```path``` names an existing file or directory, ```false``` otherwise.

Example:
```.js
// missing path prefix....
const thisWillBeFalse  = noderc.exists("layout.pug")

// is a file
const thisWillBeTrueA  = noderc.exists("test/views/layout.pug")

// is a directory
const thisWillBeTrueB  = noderc.exists("test/views")
```

## ```noderc.compare()```

```.js
(method) noderc.compare(file: string, path: string): boolean
```

Compare a ```file``` on disk to a  compiled resource at ```path```; returns ```false``` if the ```file``` is not the same size (in bytes) as the compiled resource at ```path```, or if the content of ```file``` (in bytes) does not match the content of the compiled resource at ```path```. Otherwise, returns true. Can also print to ```STDOUT```.

Example:

Say we have a file located on disk at ```/home/myconfig.cfg```, and that we compile it with ```noderc```, so that the file is accessible at ```noderc.open("myconfig.cfg")```.

test = true, *if* the file (param A) matches the resource (param B)
```.js
const test = noderc.compare("/home/myconfig.cfg", "myconfig.cfg")
```
test = false, *if* the file (param A) does not match the resource (param B)
```.js
const test = noderc.compare("/backup/my_backup_config.cfg", "myconfig.cfg")
```

## ```noderc.compareSize()```

```.js
(method) noderc.compareSize(file: string, path: string): boolean
```

Compare a ```file``` on disk to a  compiled resource at ```path```; returns ```false``` if the ```file``` is not the same size (in bytes) as the compiled resource at ```path```. Otherwise, returns true. Can also print to ```STDOUT```.

Example:
```.js
const trueIfSameSize = noderc.compareSize("/home/myconfig.cfg", "myconfig.cfg")
```

## ```noderc.compareContent()```

```.js
(method) noderc.compareContent(file: string, path: string): boolean
```

Compare a ```file``` on disk to a  compiled resource at ```path```; returns ```false``` if the ```file``` does not match (in byte-to-byte comparison) the compiled resource at ```path```. Otherwise, returns true. Can also print to ```STDOUT```.

Example:
```.js
const trueIfSameBytes = noderc.compareContent("/home/myconfig.cfg", "myconfig.cfg")
```

## ```noderc.getFileSystemObject()```

```.js
(method) noderc.getFileSystemObject(): object
```

Returns the entire ```cmrc::embedded_filesystem()``` as a Javascript ```object```.

Javascript ```object``` semantics can then be used to access the entries in the embedded filesystem in various ways.

Examples:

```.js
// Cast the entire embedded filesystem object to JSON for inspection
const fs_to_json = JSON.stringify(noderc.getFileSystemObject(), null, "\n \t")
console.log(fs_to_json)
```

```.js
// Cast a single embedded filesystem entry to a Javascript object
const fs = noderc.getFileSystemObject();
const tst_txt = fs["tst.txt"];
```

## Thanks for reading!

[Nathan J. Hood](https://github.com/nathanjhood)

## Acknowledgements

- [CMakeRC - Copyright 2018 vector-of-bool](https://github.com/vector-of-bool/cmrc.git)
- [CMakeRC Blog article](https://vector-of-bool.github.io/2017/01/21/cmrc.html)
- [Node-API Resource](https://nodejs.github.io/node-addon-examples/)
- [Node Addon API documentation](https://github.com/nodejs/node-addon-api#api-documentation)

Please note that the version of CMakeRC in the project root has been slightly enhanced to provide intellisense, and to ensure a consistent C++ exceptions policy is used throughout the codebase. These changes may be reverted in a future update which intends to incorporate throwing CMakeRC's exceptions as a ```Napi::Exception``` to the Javascript side.
