function test_open() {

  let status = false;

  try {

    const noderc = require("../../lib/noderc.node");

    const tst_txt = noderc.open("tst.txt")

    console.log(tst_txt)

    status = true;

  } catch(e) {

    console.log(`${e}`);
  }

  return status;
};

const res_test_open = test_open();

if((!res_test_open))
{
  console.log("'test_open()' failed.");
  return false;
}

console.log("'test_open()' passed.");
return true;
