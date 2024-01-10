/**
 * @file addon.cpp
 * @author Nathan J. Hood (nathanjood@googlemail.com)
 * @brief Exports 'base64' as a binary NodeJS addon.
 * @version 0.1
 * @date 2024-01-03
 *
 * @copyright Copyright (c) 2024 Nathan J. Hood (nathanjood@googlemail.com)
 *
 */

// Required header and C++ flag
#if __has_include(<napi.h>) && BUILDING_NODE_EXTENSION

#include "noderc/version.hpp"
// #include "base64/base64.hpp"

#include <napi.h>

namespace noderc {

namespace addon {

Napi::Value Hello(const Napi::CallbackInfo& info)
{
  return Napi::String::New(info.Env(), "noderc is online!");
}

Napi::Value Version(const Napi::CallbackInfo& info)
{
  return Napi::String::New(info.Env(), NODERC_VERSION);
}

// Construct an 'initializer' object that carries our functions
Napi::Object Init(Napi::Env env, Napi::Object exports)
{

  // Export a chosen C++ function under a given Javascript key
  exports.Set(
    Napi::String::New(env, "hello"), // Name of function on Javascript side...
    Napi::Function::New(env, Hello)  // Name of function on C++ side...
  );

  exports.Set(
    Napi::String::New(env, "version"),
    Napi::Function::New(env, Version)
  );

  // The above will expose the C++ function 'Hello' as a javascript function named 'hello', etc...

  return exports;
}

// Register a new addon with the intializer function defined above
NODE_API_MODULE(base64, Init) // (name to use, initializer to use)

// The above attaches the functions exported in 'Init()' to the name used in the fist argument.
// The C++ functions are then obtainable on the Javascript side under e.g. 'base64.hello()'

} // namespace addon

// Here, we can extend the namepsace with Napi overloads.

} // namespace noderc

#else
 #warning "Warning: Cannot find '<napi.h>'"
#endif // __has_include(<napi.h>) && BUILDING_NODE_EXTENSION
