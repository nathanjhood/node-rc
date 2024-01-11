/**
 * @file addon.cpp
 * @author Nathan J. Hood (nathanjood@googlemail.com)
 * @brief Exports 'noderc' as a binary NodeJS addon.
 * @version 0.1
 * @date 2024-01-09
 *
 * @copyright Copyright (c) 2024 Nathan J. Hood (nathanjood@googlemail.com)
 *
 */

// Required header and C++ flag
#if __has_include(<napi.h>) && BUILDING_NODE_EXTENSION

#include "noderc/version.hpp"

#include <algorithm>
#include <fstream>
#include <iostream>
#include <iterator>

// Get Node Addon API
#include <napi.h>

// Get CMakeRC
#include <cmrc/cmrc.hpp>

// Register our resource library namespace
CMRC_DECLARE(noderc::resources);

namespace noderc
{

namespace addon
{

Napi::Value Hello(const Napi::CallbackInfo& info)
{
  return Napi::String::New(info.Env(), "noderc is online!");
}

Napi::Value Version(const Napi::CallbackInfo& info)
{
  return Napi::String::New(info.Env(), NODERC_VERSION);
}

Napi::Value Open(const Napi::CallbackInfo& args)
{
  Napi::Env env = args.Env();

  // Arguments required: one only
  if (args.Length() != 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Param 1 must be a string
  if (!args[0].IsString())
  {
    Napi::TypeError::New(env, "Wrong argument type!").ThrowAsJavaScriptException();
    return env.Null();
  }

  using bytes = std::vector<int>;
  bytes chunk;

  Napi::String out;

  auto fs = cmrc::noderc::resources::get_filesystem();

  try {

    auto data = fs.open(args[0].ToString().Utf8Value());
    chunk.reserve(data.size());

    for (auto i = data.begin(); i != data.end(); i++)
    {
      chunk.emplace_back(*i);
    }

    out = Napi::String::New(env, std::string(chunk.begin(), chunk.end()));

  } catch (const std::system_error& e) {

    // If there was an error...
    if (e.code() == std::errc::no_such_file_or_directory)
    {
      std::string message(e.what());
      message += '\n';
      message += "noderc: No such file or directory: ";
      message += args[0].As<Napi::String>();
      Napi::TypeError::New(env, message).ThrowAsJavaScriptException();
      message.clear();
      return env.Null();
    }

    std::string message(e.what());
    message += '\n';
    message += args[0].As<Napi::String>();
    Napi::TypeError::New(env, message).ThrowAsJavaScriptException();
    message.clear();
    return env.Null();
  }

  return out;
}

Napi::Value IsFile(const Napi::CallbackInfo& args)
{
  Napi::Env env = args.Env();

  // Arguments required: one only
  if (args.Length() != 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Param 1 must be a string
  if (!args[0].IsString())
  {
    Napi::TypeError::New(env, "Wrong argument type!").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto fs = cmrc::noderc::resources::get_filesystem();

  return Napi::Boolean::New(env, fs.is_file(args[0].ToString().Utf8Value()));
}

Napi::Value IsDirectory(const Napi::CallbackInfo& args)
{
  Napi::Env env = args.Env();

  // Arguments required: one only
  if (args.Length() != 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Param 1 must be a string
  if (!args[0].IsString())
  {
    Napi::TypeError::New(env, "Wrong argument type!").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto fs = cmrc::noderc::resources::get_filesystem();

  return Napi::Boolean::New(env, fs.is_directory(args[0].ToString().Utf8Value()));
}

Napi::Value Exists(const Napi::CallbackInfo& args)
{
  Napi::Env env = args.Env();

  // Arguments required: one only
  if (args.Length() != 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Param 1 must be a string
  if (!args[0].IsString())
  {
    Napi::TypeError::New(env, "Wrong argument type!").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto fs = cmrc::noderc::resources::get_filesystem();

  return Napi::Boolean::New(env, fs.exists(args[0].ToString().Utf8Value()));
}

Napi::Value Compare(const Napi::CallbackInfo& args)
{
  Napi::Env env = args.Env();

  // Arguments required: two only
  if (args.Length() != 2)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Params must be strings
  if (!args[0].IsString() || !args[1].IsString())
  {
    Napi::TypeError::New(env, "Wrong argument type!").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto arg0 = args[0].ToString().Utf8Value();
  auto arg1 = args[1].ToString().Utf8Value();

  std::ifstream arg0_fs{arg0.data(), std::ios_base::binary};

  if (!arg0_fs)
  {
    Napi::TypeError::New(env, "Invalid filename").ThrowAsJavaScriptException();
    return env.Null();
  }

  using iter         = std::istreambuf_iterator<char>;
  const auto fs_size = std::distance(iter(arg0_fs), iter());
  auto       fs      = cmrc::noderc::resources::get_filesystem();

  arg0_fs.seekg(0);

  if (!fs.exists(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Does not exist").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (fs.is_directory(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Is a directory").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!fs.is_file(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Is not a file").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto       arg1_rc   = fs.open(arg1);
  const auto rc_size   = std::distance(arg1_rc.begin(), arg1_rc.end());

  if (rc_size != fs_size)
  {
    std::cerr << "File sizes do not match: FS == " << fs_size << ", RC == " << rc_size << "\n";
    return Napi::Boolean::New(env, false);
  }

  if (!std::equal(arg1_rc.begin(), arg1_rc.end(), iter(arg0_fs)))
  {
    std::cerr << "File contents do not match\n";
    return Napi::Boolean::New(env, false);
  }

  std::cout << "File contents match: FS == " << arg0 << ", RC == " << arg1 << "\n";
  return Napi::Boolean::New(env, true);
}

Napi::Value CompareSize(const Napi::CallbackInfo& args)
{
  Napi::Env env = args.Env();

  // Arguments required: two only
  if (args.Length() != 2)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Params must be strings
  if (!args[0].IsString() || !args[1].IsString())
  {
    Napi::TypeError::New(env, "Wrong argument type!").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto arg0 = args[0].ToString().Utf8Value();
  auto arg1 = args[1].ToString().Utf8Value();

  std::ifstream arg0_fs{arg0.data(), std::ios_base::binary};

  if (!arg0_fs)
  {
    Napi::TypeError::New(env, "Invalid filename").ThrowAsJavaScriptException();
    return env.Null();
  }

  using iter         = std::istreambuf_iterator<char>;
  const auto fs_size = std::distance(iter(arg0_fs), iter());
  auto       fs      = cmrc::noderc::resources::get_filesystem();

  arg0_fs.seekg(0);

  if (!fs.exists(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Does not exist").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (fs.is_directory(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Is a directory").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!fs.is_file(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Is not a file").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto       arg1_rc   = fs.open(arg1);
  const auto rc_size   = std::distance(arg1_rc.begin(), arg1_rc.end());

  if (rc_size != fs_size)
  {
    std::cerr << "File sizes do not match: FS == " << fs_size << ", RC == " << rc_size << "\n";
    return Napi::Boolean::New(env, false);
  }

  std::cout << "File sizes match:    FS == " << arg0 << ", RC == " << arg1 << "\n";
  return Napi::Boolean::New(env, true);
}

Napi::Value CompareContent(const Napi::CallbackInfo& args)
{
  Napi::Env env = args.Env();

  // Arguments required: two only
  if (args.Length() != 2)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Params must be strings
  if (!args[0].IsString() || !args[1].IsString())
  {
    Napi::TypeError::New(env, "Wrong argument type!").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto arg0 = args[0].ToString().Utf8Value();
  auto arg1 = args[1].ToString().Utf8Value();

  std::ifstream arg0_fs{arg0.data(), std::ios_base::binary};

  if (!arg0_fs)
  {
    Napi::TypeError::New(env, "Invalid filename").ThrowAsJavaScriptException();
    return env.Null();
  }

  using iter         = std::istreambuf_iterator<char>;
  auto       fs      = cmrc::noderc::resources::get_filesystem();

  arg0_fs.seekg(0);

  if (!fs.exists(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Does not exist").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (fs.is_directory(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Is a directory").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!fs.is_file(arg1))
  {
    Napi::TypeError::New(env, "Invalid filename: Is not a file").ThrowAsJavaScriptException();
    return env.Null();
  }

  auto       arg1_rc   = fs.open(arg1);

  if (!std::equal(arg1_rc.begin(), arg1_rc.end(), iter(arg0_fs)))
  {
    std::cerr << "File contents do not match\n";
    return Napi::Boolean::New(env, false);
  }

  std::cout << "File contents match: FS == " << arg0 << ", RC == " << arg1 << "\n";
  return Napi::Boolean::New(env, true);
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

  exports.Set(
    Napi::String::New(env, "open"),
    Napi::Function::New(env, Open)
  );

  exports.Set(
    Napi::String::New(env, "isFile"),
    Napi::Function::New(env, IsFile)
  );

  exports.Set(
    Napi::String::New(env, "isDirectory"),
    Napi::Function::New(env, IsDirectory)
  );

  exports.Set(
    Napi::String::New(env, "exists"),
    Napi::Function::New(env, Exists)
  );

  exports.Set(
    Napi::String::New(env, "compare"),
    Napi::Function::New(env, Compare)
  );

  exports.Set(
    Napi::String::New(env, "compareSize"),
    Napi::Function::New(env, CompareSize)
  );

  exports.Set(
    Napi::String::New(env, "compareContent"),
    Napi::Function::New(env, CompareContent)
  );

  // The above will expose the C++ function 'Hello' as a javascript function named 'hello', etc...

  return exports;
}

// Register a new addon with the intializer function defined above
NODE_API_MODULE(noderc, Init) // (name to use, initializer to use)

// The above attaches the functions exported in 'Init()' to the name used in the fist argument.
// The C++ functions are then obtainable on the Javascript side under e.g. 'noderc.hello()'

} // namespace addon

// Here, we can extend the namepsace with Napi overloads, if we need them.

} // namespace noderc

#else
 #warning "Warning: Cannot find '<napi.h>'"
#endif // __has_include(<napi.h>) && BUILDING_NODE_EXTENSION
