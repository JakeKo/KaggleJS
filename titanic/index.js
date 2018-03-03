"use strict";

const Parser = require("../lib/jquery-csv.min");
const FS = require("fs");
const RJS = require("../lib/rjs");

let train = Parser.toObjects(FS.readFileSync("./data/titanic/train.csv", { encoding: 'utf-8' }));
let test = Parser.toObjects(FS.readFileSync("./data/titanic/test.csv", { encoding: 'utf-8' }));

let table = RJS.head(train, 5);
console.log(table.toString());
RJS.tail(train, 5, table.columns, table.widths);

console.log(RJS.getProperty(table.data, "PassengerId"));
console.log(RJS.getProperties(train));