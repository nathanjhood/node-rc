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

function doCompareSize(a, b) {
  if (!noderc.compareSize(a, b)) {
    console.log("File '%s' size does not match the compiled resource '%s' size.", a, b)
    return false;
  }
  console.log("File '%s' size matches the compiled resource '%s' size.", a, b)
  return true;
}

function doCompareContent(a, b) {
  if (!noderc.compareContent(a, b)) {
    console.log("File '%s' content does not match the compiled resource '%s' content.", a, b)
    return false;
  }
  console.log("File '%s' content matches the compiled resource '%s' content.", a, b)
  return true;
}

function doCompare(a, b) {
  if (!noderc.compare(a, b)) {
    console.log("File '%s' does not match the compiled resource '%s'.", a, b)
    return false;
  }
  console.log("File '%s' matches the compiled resource '%s'.", a, b)
  return true;
}

function doComparisons(a, b) {
  var result = false;
  result = doCompareSize   (a, b);
  result = doCompareContent(a, b);
  result = doCompare       (a, b);
  return result;
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

const tstF = "include/noderc";
const resF = doTest(tstF);

const tstG = "include/noderc/version.hpp";
const resG = doTest(tstG);

const comparisonA = doComparisons("tst.txt", "/tst.txt");
const comparisonB = doComparisons("include/noderc/version.hpp", "include/noderc/version.hpp");
