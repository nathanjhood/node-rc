cmake_minimum_required (VERSION 3.15)

list (APPEND CMAKE_MODULE_PATH
  "${CMAKE_CURRENT_LIST_DIR}/node_modules/cmake-js/share/cmake"
  "${CMAKE_CURRENT_LIST_DIR}/share/cmake/Modules"
  "${CMAKE_CURRENT_LIST_DIR}"
)

#[===========================================================================[
  Project setup
]===========================================================================]#

project (NodeRC VERSION 1.0.1)

# Start a list of targets to be built
set (TARGETS)

# Start a list of resources to compile and serve as Javascript objects
set (RESOURCES)

list (APPEND RESOURCES
  # Resources to compile (add/remove as you please)...
  favicon.ico
  tst.txt
  test/views/layout.pug # note that the path prefix was used here...
)

include (CMakeRC)

# Create a CMakeRC library
# See https://github.com/vector-of-bool/cmrc/blob/master/README.md#usage
cmrc_add_resource_library(resources
	ALIAS NodeRC::resources
	NAMESPACE NodeRC::resources
  # Resources to compile...
  ${RESOURCES}
)
# Place it in the correct output dir
set_target_properties (resources
  PROPERTIES
  OUTPUT_NAME "resources"
  ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib"
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
  POSITION_INDEPENDENT_CODE ON
)
# Add it (and the CMakeRC dependency) to the targets
list (APPEND TARGETS resources cmrc-base)



include (CMakeJS)

cmakejs_create_napi_addon (
  noderc
  "src/noderc/noderc.cpp"
  NAMESPACE NodeRC
  ALIAS NodeRC
)

target_link_libraries (noderc PRIVATE NodeRC::resources)

list (APPEND TARGETS noderc)

#[===========================================================================[
  Export this configuration to share it with other CMake projects
]===========================================================================]#

# Collect and export targets
set (NodeRC_TARGETS ${TARGETS} CACHE STRING "Targets to be built." FORCE)

export (
  TARGETS ${NodeRC_TARGETS}
  FILE ${PROJECT_BINARY_DIR}/share/cmake/NodeRCTargets.cmake
  NAMESPACE NodeRC::
)

install(
  EXPORT NodeRCTargets
  FILE NodeRCTargets.cmake
  NAMESPACE NodeRC::
  DESTINATION lib/cmake/NodeRC
)

install(TARGETS ${NodeRC_TARGETS}
    EXPORT NodeRCTargets
    LIBRARY DESTINATION  "${CMAKE_INSTALL_LIBDIR}"
    ARCHIVE DESTINATION  "${CMAKE_INSTALL_LIBDIR}"
    RUNTIME DESTINATION  "${CMAKE_INSTALL_BINDIR}"
    INCLUDES DESTINATION "${CMAKE_INSTALL_INCLUDEDIR}"
  )

# get access to helper functions for creating config files
include (CMakePackageConfigHelpers)

include (JoinPaths)
join_paths (libdir_for_pc_file     "\${exec_prefix}" "${CMAKE_INSTALL_LIBDIR}")
join_paths (includedir_for_pc_file "\${prefix}"      "${CMAKE_INSTALL_INCLUDEDIR}")

# Create package config file
configure_file (
  ${PROJECT_SOURCE_DIR}/share/pkgconfig/NodeRC.pc.in
  ${PROJECT_BINARY_DIR}/share/pkgconfig/NodeRC.pc
  @ONLY
)

# create cmake config file
configure_package_config_file (
    ${PROJECT_SOURCE_DIR}/share/cmake/NodeRCConfig.cmake.in
    ${PROJECT_BINARY_DIR}/share/cmake/NodeRCConfig.cmake
  INSTALL_DESTINATION
    ${CMAKE_INSTALL_LIBDIR}/cmake/NodeRC
)

# generate the version file for the cmake config file
write_basic_package_version_file (
	${PROJECT_BINARY_DIR}/share/cmake/NodeRCConfigVersion.cmake
	VERSION ${NodeRC_VERSION}
	COMPATIBILITY AnyNewerVersion
)

# copy the addon types
file(COPY
  "${CMAKE_CURRENT_LIST_DIR}/lib/noderc.node.js"
  "${CMAKE_CURRENT_LIST_DIR}/lib/noderc.node.ts"
  "${CMAKE_CURRENT_LIST_DIR}/lib/noderc.node.d.ts"
  DESTINATION
  "${PROJECT_BINARY_DIR}/lib"
)

install(FILES
  "${PROJECT_BINARY_DIR}/lib/noderc.node.js"
  "${PROJECT_BINARY_DIR}/lib/noderc.node.ts"
  "${PROJECT_BINARY_DIR}/lib/noderc.node.d.ts"
  DESTINATION
  "${CMAKE_INSTALL_LIBDIR}"
)

if(TRUE) # BUILD_TESTS
  # include(CTest) # If you want to see all the test dashboard targets, uncomment this
  enable_testing()
  include("${CMAKE_CURRENT_LIST_DIR}/tests/noderc/tests.cmake")
endif()
