const noderc = require("../lib/noderc.node");

console.log(noderc.hello());
console.log(noderc.version());
console.log("\n");

function doTest(tst) {

  if(!noderc.exists(tst)) {
    console.log(" \u{2715} Entry '%s' does not exist.\n", tst)
    return false;
  }

  if(noderc.isFile(tst)) {

    // Do file functions...
    console.log(" \u{2713} Contents of '%s' = \n\n%s\n", tst, noderc.open(tst))
    return true;
  }

  if(noderc.isDirectory(tst)) {

    // Do directory functions...
    console.log(" \u{2713} Entry '%s' is a directory.\n", tst)
    return true;
  }

  console.log(" \u{2715} Entry exists, but is neither a file nor a directory... this should never happen.\n")
  return false;
}

function doCompareSize(a, b) {
  if (!noderc.compareSize(a, b)) {
    console.log(" \u{2715} File '%s' size does not match the compiled resource '%s' size.", a, b)
    return false;
  }
  console.log(" \u{2713} File '%s' size matches the compiled resource '%s' size.", a, b)
  return true;
}

function doCompareContent(a, b) {
  if (!noderc.compareContent(a, b)) {
    console.log(" \u{2715} File '%s' content does not match the compiled resource '%s' content.", a, b)
    return false;
  }
  console.log(" \u{2713} File '%s' content matches the compiled resource '%s' content.", a, b)
  return true;
}

function doCompare(a, b) {
  if (!noderc.compare(a, b)) {
    console.log(" \u{2715} File '%s' does not match the compiled resource '%s'.", a, b)
    return false;
  }
  console.log(" \u{2713} File '%s' matches the compiled resource '%s'.", a, b)
  return true;
}

function doComparisons(a, b) {
  var result = false;
  result = doCompareSize   (a, b);
  result = doCompareContent(a, b);
  result = doCompare       (a, b);
  console.log("\n");
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

const tstE = "/test/views/layout.pug";
const resE = doTest(tstE);

const tstF = "include/noderc";
const resF = doTest(tstF);

const tstG = "include/noderc/version.hpp";
const resG = doTest(tstG);

const comparisonA = doComparisons("tst.txt", "/tst.txt");
const comparisonB = doComparisons("include/noderc/version.hpp", "include/noderc/version.hpp");
