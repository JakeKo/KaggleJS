"use strict";

const Parser = require("../lib/jquery-csv.min.js");
const fs = require("fs");

console.log(Parser.toObjects(fs.readFileSync("./data/titanic/train.csv", { encoding: 'utf-8' })));