function test_get_filesystem_object() {

  let status = false;

  try {

    const noderc = require("../../lib/noderc.node");

    // Cast a single embedded filesystem entry to a Javascript object
    const fs = noderc.getFileSystemObject();

    // Cast the entire embedded filesystem object to JSON for inspection
    const fs_to_json = JSON.stringify(fs, null, "\n \t")
    console.log(fs_to_json)

    const tst_txt = fs["tst.txt"];
    console.log(tst_txt)

    status = true;

  } catch(e) {

    console.log(`${e}`);
  }

  return status;
};

const res_test_get_filesystem_object = test_get_filesystem_object();

if((!res_test_get_filesystem_object))
{
  console.log("'test_get_filesystem_object()' failed.");
  return false;
}

console.log("'test_get_filesystem_object()' passed.");
return true;
