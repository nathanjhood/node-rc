function test_is_file() {

  let status = false;

  try {

    const noderc = require("../../lib/noderc.node");

    // missing path prefix....
    const thisWillBeFalse  = noderc.exists("layout.pug")

    // is a file
    const thisWillBeTrueA  = noderc.exists("test/views/layout.pug")

    // is a directory
    const thisWillBeTrueB  = noderc.exists("test/views")

    if(!thisWillBeFalse && thisWillBeTrueA && thisWillBeTrueB)
      status = true;

  } catch(e) {

    console.log(`${e}`);
  }

  return status;
};

const res_test_is_file = test_is_file();

if((!res_test_is_file))
{
  console.log("'test_is_file()' failed.");
  return false;
}

console.log("'test_is_file()' passed.");
return true;
