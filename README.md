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

## Acknowledgements

- [CMakeRC - Copyright 2018 vector-of-bool](https://github.com/vector-of-bool.git)
- [CMakeRC Blog article](https://vector-of-bool.github.io/2017/01/21/cmrc.html)
- [Node-API Resource](https://nodejs.github.io/node-addon-examples/)
- [Node Addon API documentation](https://github.com/nodejs/node-addon-api#api-documentation)
