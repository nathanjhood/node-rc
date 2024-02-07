cmake_minimum_required (VERSION 3.15)

list (APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_LIST_DIR}/node_modules/cmake-js/share/cmake")

#[===========================================================================[
  Project setup
]===========================================================================]#

project (NodeRC VERSION 1.0.1)

# Start a list of targets to be built
set (TARGETS)

include (CMakeRC)
include (CMakeJS)

cmakejs_create_napi_addon (

)
