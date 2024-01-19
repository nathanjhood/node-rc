include (GetGitRef)

macro (write_version_header)
  get_git_ref ()
  string(TOUPPER "${PROJECT_NAME}" ${PROJECT_NAME}_UPPER)
  set(HEADER_FILE "${PROJECT_SOURCE_DIR}/include/${PROJECT_NAME}/version.hpp")
  file(WRITE "${HEADER_FILE}.tmp" "// ${PROJECT_NAME} v${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}.${PROJECT_VERSION_PATCH}.${git_revision}\n")
  file(APPEND "${HEADER_FILE}.tmp" "// Version control info\n")
  file(APPEND "${HEADER_FILE}.tmp" "\n")

  file(APPEND "${HEADER_FILE}.tmp" "#ifndef ${${PROJECT_NAME}_UPPER}_VERSION_HPP_\n")
  file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_VERSION_HPP_\n")
  file(APPEND "${HEADER_FILE}.tmp" "\n")

  file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_MAKE_VERSION(major, minor, patch)                              \\\n")
  file(APPEND "${HEADER_FILE}.tmp" "((major) * 0x1000 + (minor) * 0x100 + (patch))\n")
  file(APPEND "${HEADER_FILE}.tmp" "\n")

  file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_VERSION_MAJOR \"${PROJECT_VERSION_MAJOR}\"\n")
  file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_VERSION_MINOR \"${PROJECT_VERSION_MINOR}\"\n")
  file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_VERSION_PATCH \"${PROJECT_VERSION_PATCH}\"\n")

  if(DEFINED git_revision)
      file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_VERSION_TWEAK \"${git_revision}\"\n")
      file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_VERSION \"${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}.${PROJECT_VERSION_PATCH}.${git_revision}\"\n")
  else()
      file(APPEND "${HEADER_FILE}.tmp" "#undef ${${PROJECT_NAME}_UPPER}_VERSION_TWEAK\n")
      file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_VERSION \"${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}.${PROJECT_VERSION_PATCH}\"\n")
  endif()

  if(git_url)
      file(APPEND "${HEADER_FILE}.tmp" "#define ${${PROJECT_NAME}_UPPER}_REPOSITORY \"${git_url}\"\n")
  else()
      file(APPEND "${HEADER_FILE}.tmp" "#undef ${${PROJECT_NAME}_UPPER}_REPOSITORY\n")
  endif()

  file(APPEND "${HEADER_FILE}.tmp" "\n")
  file(APPEND "${HEADER_FILE}.tmp" "#endif // ${${PROJECT_NAME}_UPPER}_VERSION_HPP_\n")
  file(APPEND "${HEADER_FILE}.tmp" "\n")

  #Copy the file only if it has changed.
  execute_process(COMMAND ${CMAKE_COMMAND} -E copy_if_different "${HEADER_FILE}.tmp" "${HEADER_FILE}")
  file(REMOVE "${HEADER_FILE}.tmp")
endmacro ()
