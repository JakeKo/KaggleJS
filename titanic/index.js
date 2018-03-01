"use strict";

var $, jQuery;
$ = jQuery = require("jquery");
const parser = require("../lib/jquery-csv.min.js");
const FileApi = require('file-api');

const reader = new FileApi.FileReader();
reader.readAsDataURL(new FileApi.File("./data/titanic/train.csv"));

reader.on("data", (data) => {
  console.log(parser.toObjects(data.toString()));
});

// reader.addEventListener('load', (event) => {
//   console.log("dataUrlSize:", event.target.result.length);
// });