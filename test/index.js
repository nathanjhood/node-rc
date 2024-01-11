const noderc = require("../lib/noderc.node");

console.log(noderc.hello());
console.log(noderc.version());

function doTest(tst) {

  if(!noderc.exists(tst)) {
    console.log("Entry '%s' does not exist.", tst)
    return false;
  }

  if(noderc.isFile(tst)) {

    // Do file functions...
    console.log("Contents of '%s' = \n%s", tst, noderc.open(tst))
    return true;
  }

  if(noderc.isDirectory(tst)) {

    // Do directory functions...
    console.log("Entry '%s' is a directory", tst)
    return true;
  }

  console.log("Entry exists, but is neither a file nor a directory... this should never happen.")
  return false;
}

const tstA = "tst.txt";
const resA = doTest(tstA);

const tstB = "sts.xtx";
const resB = doTest(tstB);

const tstC = "/";
const resC = doTest(tstC);

const tstD = "/usr";
const resD = doTest(tstD);

const tstE = "/tst.txt";
const resE = doTest(tstE);

const tstF = "test/views";
const resF = doTest(tstF);

const tstG = "test/views/layout.pug";
const resG = doTest(tstG);

if(!noderc.diff(tstA, tstE)) {
  console.log("File '%s' does not match the compiled resource '%s'.", tstG, tstG)
  return false;
}
