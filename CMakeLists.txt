cmake_minimum_required (VERSION 3.15...3.28 FATAL_ERROR)

set (CMAKE_MODULE_PATH
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
configure_file ("include/${PROJECT_NAME}/version.h" "include/${PROJECT_NAME}/version.h")

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
