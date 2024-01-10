const noderc = require("../lib/noderc.node");

console.log(noderc.hello());
console.log(noderc.version());

console.log("Does NodeRC contain a file named 'tst.txt'? = %s",   noderc.isFile("tst.txt"));
console.log("Does NodeRC contain a file named 'sts.xtx'? = %s",   noderc.isFile("sts.xtx"));

console.log("Does NodeRC contain a directory at '/'? = %s", noderc.isDirectory("/"));
console.log("Does NodeRC contain a directory at '.'? = %s", noderc.isDirectory("."));

console.log("Does NodeRC contain a file or directory named 'tst.txt'? = %s",   noderc.exists("tst.txt"));
console.log("Does NodeRC contain a file or directory named '/tst.txt'? = %s",   noderc.exists("/tst.txt"));

console.log("Contents of 'tst.txt' = \n%s", noderc.open("tst.txt"))
