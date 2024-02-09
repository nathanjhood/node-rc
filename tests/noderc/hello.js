function test_hello() {

  let status = false;

  try {

    const noderc = require("../../lib/noderc.node");

    console.log(noderc.hello());

    status = true;

  } catch(e) {

    console.log(`${e}`);
  }

  return status;
};

const res_test_hello = test_hello();

if((!res_test_hello))
{
  console.log("'test_hello()' failed.");
  return false;
}

console.log("'test_hello()' passed.");
return true;
