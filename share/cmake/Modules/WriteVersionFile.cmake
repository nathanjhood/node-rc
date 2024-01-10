include (GetGitRef)

macro (write_version_file)
  get_git_ref ()
  set(VERSION_FILE "${PROJECT_SOURCE_DIR}/VERSION")
  file(WRITE "${VERSION_FILE}.tmp" "${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}.${PROJECT_VERSION_PATCH}.${git_revision}\n")

  #Copy the file only if it has changed.
  execute_process(COMMAND ${CMAKE_COMMAND} -E copy_if_different "${VERSION_FILE}.tmp" "${VERSION_FILE}")
  file(REMOVE "${VERSION_FILE}.tmp")
endmacro ()
