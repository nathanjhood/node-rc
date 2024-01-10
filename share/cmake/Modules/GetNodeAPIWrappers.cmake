# Include Node-API wrappers
execute_process(
  COMMAND node -p "require('node-addon-api').include"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE NODE_ADDON_API_DIR
)

string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

set(NODE_ADDON_API_DIR "${NODE_ADDON_API_DIR}"
  CACHE
  PATH
  "Node Addon API Headers directory."
  FORCE
)

if (VERBOSE)
  message(STATUS "NODE_ADDON_API_DIR = ${NODE_ADDON_API_DIR}")
endif()

include_directories(${NODE_ADDON_API_DIR})
