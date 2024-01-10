# Read in the digits
file(READ "${INPUT_FILE}" bytes HEX)
message("${bytes}")
# Forat each pair into a character literal
string(REGEX REPLACE "(..)" "'\\\\x\\1', " chars "${bytes}")
# Just write it to stdout for this example
message("${chars}")
