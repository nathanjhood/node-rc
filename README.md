# NodeRC

CMakeRC as a NodeJs C++ Addon.

## Requirements

- NodeJs
- CMake
- A C/C++ compiler toolchain (GCC, LLVM, MSVC...)
- A build generator (Ninja, Make, MSVC...)

The remaining dependencies either ship with the repo (such as the 'CMakeRC.cmake' file), or are acquired when running ```npm install``` or ```yarn install``` to initialize the project.

## Usage

To see how to serve compiled resources as Javascript objects, follow these steps:

- clone the repo, and ```cd``` into it
- run ```npm run install``` or ```yarn``` to install the dependencies and build the project
- the file ```/test/index.js``` calls some functions that are defined and exported in ```/src/noderc.cpp```
- the actual files and directories to be compiled are specified in the ```CMakeLists.txt``` file:

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

## Docs

### ```noderc.open()```

```.js
(method) noderc.open(path: string): string
```
Opens and returns a non-directory ```file``` object at ```path```, or throws ```std::system_error()``` (as a Javascript exception) on error. The ```file``` object, if it exists, is returned as a Javascript ```string``` (for now).

Example:
```.js
const favicon = noderc.open("favicon.ico")
```

The ```file``` objects returned by this method are the ones added to the ```RESOURCES``` list in ```CMakeLists.txt```. It should be possible to add basically *any* file to this list and make it available in Javascript using ```noderc.open("filename.ext")```.

When adding to ```RESOURCES```, the items you want to compile should be specified *relative to the project root folder*, ideally. CMakeRC uses the full filename specified in this list, *including any path prefixes*, when making the compiled resource available via ```noderc.open()```.

This means that you could add the following entries to the list to be compiled (in ```CMakeLists.txt```):
```.cmake
list (APPEND RESOURCES
  # Resources to compile (add more as you please)...
  favicon.ico
  tst.txt
  test/views/layout.pug # note that the path prefix was used here...
)
```

Now, the ```layout.pug``` file should be available via ```noderc.open()```, but you must specifiy the entire path prefix in order to find it:
```.js
const tst_txt     = noderc.open("tst.txt");
const favicon_ico = noderc.open("favicon.ico");
const layout_pug  = noderc.open("test/views/layout.pug");
```

### ```noderc.isFile()```

```.js
(method) noderc.isFile(path: string): boolean
```

Returns ```true``` if the given ```path``` names a regular file, ```false``` otherwise.

Example:
```.js
const thisWillBeFalse = noderc.isFile("test/views")
const thisWillBeTrue  = noderc.isFile("test/views/layout.pug")
```

### ```noderc.isDirectory()```

```.js
(method) noderc.isDirectory(path: string): boolean
```

Returns ```true``` if the given ```path``` names a directory, ```false``` otherwise.

Example:
```.js
const thisWillBeFalse = noderc.isDirectory("test/views/layout.pug")
const thisWillBeTrue  = noderc.isDirectory("test/views")
```

### ```noderc.exists()```

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

### ```noderc.diff()```

```.js
(method) noderc.diff(file: string, path: string): boolean
```

Compare a ```file``` on disk to a  compiled resource at ```path```; returns ```false``` if the ```file``` is not the same size (in bytes) as the compiled resource at ```path```, or if the content of ```file``` (in bytes) does not match the content of the compiled resource at ```path```. Otherwise, returns true. Also prints to ```STDOUT```.

Example:

Say we have a file located on disk at ```/home/myconfig.cfg```, and that we compile it with ```noderc```, so that the file is accessible at ```noderc.open("myconfig.cfg")```.

test = true, *if* the file (param A) matches the resource (param B)
```.js
const test = noderc.diff("/home/myconfig.cfg", "myconfig.cfg")
```
test = false, *if* the file (param A) does not match the resource (param B)
```.js
const test = noderc.diff("/backup/my_backup_config.cfg", "myconfig.cfg")
```

## Acknowledgements

- [CMakeRC - Copyright 2018 vector-of-bool](https://github.com/vector-of-bool.git)
- [CMakeRC Blog article](https://vector-of-bool.github.io/2017/01/21/cmrc.html)
- [Node-API Resource](https://nodejs.github.io/node-addon-examples/)
- [Node Addon API documentation](https://github.com/nodejs/node-addon-api#api-documentation)
