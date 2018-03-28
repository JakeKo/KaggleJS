"use strict";

const RJS = require("../lib/rjs");
const DataSet = RJS.DataSet;

function cleanData(filePath) {
	let dataSet = RJS.readCSV(filePath);

	dataSet.castPropertyToScalar("PassengerId");
	dataSet.castPropertyToScalar("Survived");
	dataSet.castPropertyToScalar("Pclass");
	dataSet.castPropertyToScalar("Age");
	dataSet.castPropertyToScalar("SibSp");
	dataSet.castPropertyToScalar("Fare");
	dataSet.castPropertyToScalar("Parch");

	return dataSet;
}

let train = cleanData(__dirname + "\\train.csv");
let test = cleanData(__dirname + "\\test.csv");

let trainTable = train.head(5);
console.log(trainTable.toString());

let testTable = test.head(5);
console.log(testTable.toString());

console.log(RJS.unique(train.property("Parch")))