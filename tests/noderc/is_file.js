function test_is_file() {

  let status = false;

  try {

    const noderc = require("../../lib/noderc.node");

    const thisWillBeFalse = noderc.isFile("test/views")
    const thisWillBeTrue  = noderc.isFile("test/views/layout.pug")

    if(!thisWillBeFalse && thisWillBeTrue)
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
