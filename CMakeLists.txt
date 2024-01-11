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

if (NOT DEFINED RESOURCES)

  # Start a list of resources to compile and serve as Javascript objects
  set (RESOURCES)

  list (APPEND RESOURCES

    # Resources to compile (add/remove as you please)...
    favicon.ico
    tst.txt
    test/views/layout.pug # note that the path prefix was used here...
  )

endif ()


#[===========================================================================[
  Resources to compile
]===========================================================================]#
# Compile some resources to binary
include(CMakeRC)
message (STATUS "Configuring noderc::resources")
if (NOT ${PROJECT_SOURCE_DIR} EQUAL ${PROJECT_BINARY_DIR})
  # Just for intellisense...
  configure_file ("include/cmrc/cmrc.hpp" "include/cmrc/cmrc.hpp")
endif ()
# Create a CMakeRC library
cmrc_add_resource_library(resources
	ALIAS ${PROJECT_NAME}::resources
	NAMESPACE ${PROJECT_NAME}::resources
  # Resources to compile...
  ${RESOURCES}
)
# Place it int he correct output dir
set_target_properties (resources
  PROPERTIES
  ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
  POSITION_INDEPENDENT_CODE ON
)
# Add it (and the CMakeRC dependency) to the targets
list (APPEND TARGETS resources cmrc-base)

#[===========================================================================[
  Main target: NodeJs C++ Addon (requires building from 'npm run build')
]===========================================================================]#
if (-DBUILDING_NODE_EXTENSION IN_LIST CMAKE_CXX_FLAGS)
  # Include Node-API headers
  include (GetNodeAPIHeaders)
  # Include Node-API wrappers
  include (GetNodeAPIWrappers)
  message (STATUS "Configuring noderc::noderc")
  add_library (${PROJECT_NAME} SHARED)
  add_library (${PROJECT_NAME}::${PROJECT_NAME} ALIAS ${PROJECT_NAME})
  target_include_directories (${PROJECT_NAME}
    PUBLIC
      $<BUILD_INTERFACE:${PROJECT_BINARY_DIR}/include>
      $<INSTALL_INTERFACE:include>
  )
  target_include_directories (${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})
  target_sources (${PROJECT_NAME} PRIVATE "src/${PROJECT_NAME}/${PROJECT_NAME}.cpp" ${CMAKE_JS_SRC})
  target_link_libraries (${PROJECT_NAME} ${PROJECT_NAME}::resources ${CMAKE_JS_LIB})
  set_target_properties (${PROJECT_NAME}
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
  list (APPEND TARGETS ${PROJECT_NAME})
endif ()

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
