cmake_minimum_required (VERSION 3.15...3.28 FATAL_ERROR)

set (CMAKE_MODULE_PATH
  "${CMAKE_CURRENT_LIST_DIR}"
  "${CMAKE_CURRENT_LIST_DIR}/share/cmake/Modules"
  "${CMAKE_MODULE_PATH}"
)

#[===========================================================================[
  Project setup
]===========================================================================]#
project (noderc VERSION 1.0.0.0)

# Use git to update version information
include (WriteVersionFile)
write_version_file ()
include (WriteVersionHeader)
write_version_header ()
configure_file ("include/${PROJECT_NAME}/version.hpp" "include/${PROJECT_NAME}/version.hpp")

# Start a list of targets to be built
set (TARGETS)

#[===========================================================================[
  Resources to compile
]===========================================================================]#
# Compile some resources to binary
include(CMakeRC)
message (STATUS "Configuring noderc::resources")
if (NOT ${PROJECT_SOURCE_DIR} EQUAL ${PROJECT_BINARY_DIR})
  # Just for intellisense...
  configure_file ("include/cmrc/cmrc.hpp" "include/cmrc/cmrc.hpp")
endif()
cmrc_add_resource_library(resources

	ALIAS ${PROJECT_NAME}::resources
	NAMESPACE ${PROJECT_NAME}::resources

  favicon.ico
)
# cmrc_add_resources(resources
#   WHENCE src/img
#   src/img/icon__32x32.png
#   src/img/icon__48x48.png
#   src/img/icon__64x64.png
#   src/img/icon__96x96.png

#   src/img/icon__144x144.png
#   src/img/icon__168x168.png
#   src/img/icon__256x256.png
#   src/img/icon__512x512.png

#   src/img/w_icon__196x128.png
#   src/img/w_icon__384x256.png
#   src/img/w_icon__768x512.png
#   src/img/w_icon__1024x768.png
# )
set_target_properties (resources
  PROPERTIES
  ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
  POSITION_INDEPENDENT_CODE ON
)
# # Add the target to the list
# list(APPEND TARGETS resources)

#[===========================================================================[
  Main project target: Shared library
]===========================================================================]#
message (STATUS "Configuring noderc::noderc")
# Add our headers to a list
set (HEADERS)
list (APPEND HEADERS
  "include/${PROJECT_NAME}/${PROJECT_NAME}.hpp"
)
# Add out sources to a list
set (SOURCE_FILES)
list (APPEND SOURCE_FILES
  "src/${PROJECT_NAME}/${PROJECT_NAME}.cpp"
)
# If building out-of-source...
if (NOT ${PROJECT_SOURCE_DIR} EQUAL ${PROJECT_BINARY_DIR})
  # ...copy our headers to the binary directory.
  foreach (HEADER IN LISTS HEADERS)
    configure_file ("${HEADER}" "${HEADER}")
  endforeach ()
endif ()
# Build a shared library named after the project
# Alias it to the vendor namespace
add_library (${PROJECT_NAME} SHARED)
add_library (${PROJECT_NAME}::${PROJECT_NAME} ALIAS ${PROJECT_NAME})
# Put our target in the right output dir
set_target_properties (${PROJECT_NAME}
  PROPERTIES
  ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
  PDB_OUTPUT_DIRECTORY     "${CMAKE_BINARY_DIR}/bin"
)
# Include our configured headers
target_include_directories (${PROJECT_NAME}
  PUBLIC
    $<BUILD_INTERFACE:${PROJECT_BINARY_DIR}/include>
    $<INSTALL_INTERFACE:include>
)
# Create a fileset of 'header' type as part of the library
target_sources (${PROJECT_NAME}
  PUBLIC
  FILE_SET ${PROJECT_NAME}_PUBLIC_HEADERS
  TYPE HEADERS
  BASE_DIRS
    $<BUILD_INTERFACE:${PROJECT_BINARY_DIR}/include>
    $<INSTALL_INTERFACE:include>
  FILES
    # include/noderc/noderc.hpp
    $<BUILD_INTERFACE:${PROJECT_BINARY_DIR}/include/${PROJECT_NAME}/${PROJECT_NAME}.hpp>
    $<INSTALL_INTERFACE:include/${PROJECT_NAME}/${PROJECT_NAME}.hpp>

    # include/noderc/version.hpp
    $<BUILD_INTERFACE:${PROJECT_BINARY_DIR}/include/${PROJECT_NAME}/version.hpp>
    $<INSTALL_INTERFACE:include/${PROJECT_NAME}/version.hpp>
)
# Include our sources to be compiled
target_sources (${PROJECT_NAME} PRIVATE ${SOURCE_FILES})
# Add the target to the list
list (APPEND TARGETS ${PROJECT_NAME})

#[===========================================================================[
  Optional target: NodeJs C++ Addon (requires building from 'npm run build')
]===========================================================================]#
if (-DBUILDING_NODE_EXTENSION IN_LIST CMAKE_CXX_FLAGS)
  # Include Node-API headers
  include (GetNodeAPIHeaders)
  # Include Node-API wrappers
  include (GetNodeAPIWrappers)
  message (STATUS "Configuring noderc::addon")
  add_library (addon SHARED)
  add_library (${PROJECT_NAME}::addon ALIAS addon)
  target_include_directories (addon
    PUBLIC
      $<BUILD_INTERFACE:${PROJECT_BINARY_DIR}/include>
      $<INSTALL_INTERFACE:include>
  )
  target_include_directories (addon PRIVATE ${CMAKE_JS_INC})
  target_sources (addon PRIVATE "src/${PROJECT_NAME}/addon.cpp" ${CMAKE_JS_SRC})
  target_link_libraries (addon ${PROJECT_NAME} ${CMAKE_JS_LIB})
  set_target_properties (addon
    PROPERTIES
    LIBRARY_OUTPUT_NAME "${PROJECT_NAME}"
    PREFIX ""
    SUFFIX ".node"
    ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
  )
  if (MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
    execute_process (COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
  endif ()
  list (APPEND TARGETS addon)
endif ()

#[===========================================================================[
  Link targets
]===========================================================================]#

target_link_libraries(${PROJECT_NAME} PRIVATE ${PROJECT_NAME}::resources)
# target_link_libraries(resources PRIVATE ${PROJECT_NAME}::addon)

#[===========================================================================[
  Export this configuration to share it with other CMake projects
]===========================================================================]#

# Collect and export targets
set (${PROJECT_NAME}_TARGETS ${TARGETS} CACHE STRING "Targets to be built." FORCE)

export (
  TARGETS ${${PROJECT_NAME}_TARGETS}
  FILE ${PROJECT_BINARY_DIR}/share/cmake/${PROJECT_NAME}_targets.cmake
  NAMESPACE ${PROJECT_NAME}::
)

# get access to helper functions for creating config files
include (CMakePackageConfigHelpers)

include (JoinPaths)
join_paths (libdir_for_pc_file     "\${exec_prefix}" "${CMAKE_INSTALL_LIBDIR}")
join_paths (includedir_for_pc_file "\${prefix}"      "${CMAKE_INSTALL_INCLUDEDIR}")

# Create package config file
configure_file (
  ${PROJECT_SOURCE_DIR}/share/pkgconfig/${PROJECT_NAME}.pc.in
  ${PROJECT_BINARY_DIR}/share/pkgconfig/${PROJECT_NAME}.pc
  @ONLY
)

# create cmake config file
configure_package_config_file (
    ${PROJECT_SOURCE_DIR}/share/cmake/${PROJECT_NAME}_config.cmake.in
    ${PROJECT_BINARY_DIR}/share/cmake/${PROJECT_NAME}_config.cmake
  INSTALL_DESTINATION
    ${CMAKE_INSTALL_LIBDIR}/cmake/${PROJECT_NAME}
)

# generate the version file for the cmake config file
write_basic_package_version_file (
	${PROJECT_BINARY_DIR}/share/cmake/${PROJECT_NAME}_config_version.cmake
	VERSION ${PROJECT_VERSION}
	COMPATIBILITY AnyNewerVersion
)
