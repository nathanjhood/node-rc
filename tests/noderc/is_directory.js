function test_is_directory() {

  let status = false;

  try {

    const noderc = require("../../lib/noderc.node");

    const thisWillBeFalse = noderc.isDirectory("test/views/layout.pug")
    const thisWillBeTrue  = noderc.isDirectory("test/views")

    if(!thisWillBeFalse && thisWillBeTrue)
      status = true;

  } catch(e) {

    console.log(`${e}`);
  }

  return status;
};

const res_test_is_directory = test_is_directory();

if((!res_test_is_directory))
{
  console.log("'test_is_directory()' failed.");
  return false;
}

console.log("'test_is_directory()' passed.");
return true;
