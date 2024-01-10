/**
 * @file noderc.cpp
 * @author Nathan J. Hood (nathanjhood@googlemail.com)
 * @brief
 * @version 1.0.0
 * @date 2024-01-10
 *
 * @copyright Copyright (c) 2024
 *
 */

#include "noderc/version.hpp"
#include "noderc/noderc.hpp"

#include <cmrc/cmrc.hpp>

CMRC_DECLARE(noderc::resources);

namespace noderc
{
namespace resources
{

/**
 * @brief Get the ```cmrc::embedded_filesystem``` object.
 *
 * @return ```cmrc::embedded_filesystem```
 */
cmrc::embedded_filesystem get_filesystem() {
  return cmrc::noderc::resources::get_filesystem();
}

} // namespace resources
} // namespace noderc
