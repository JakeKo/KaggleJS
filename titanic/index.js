"use strict";

const RJS = require("../lib/rjs");
const DataSet = RJS.DataSet;

function cleanData(filePath) {
	let dataSet = RJS.readCSV(filePath);

	dataSet.castPropertyToScalar("PassengerId");
	dataSet.castPropertyToBoolean("Survived", (property) => property === "1");
	dataSet.castPropertyToScalar("Pclass");
	dataSet.castPropertyToScalar("Age");
	dataSet.castPropertyToScalar("SibSp");
	dataSet.castPropertyToScalar("Fare");
	dataSet.castPropertyToScalar("Parch");

	return dataSet;
}

let train = cleanData(__dirname + "\\train.csv");
let test = cleanData(__dirname + "\\test.csv");

let trainTable = train.head(15);
console.log(trainTable.toString());

// let testTable = test.head(5);
// console.log(testTable.toString());

let splitOnSex = train.splitOn([
	record => record["Sex"] === "male",
	record => record["Sex"] === "female"
], "Survived");

let splitOnPclass = train.splitOn([
	record => record["Pclass"] >= 2,
	record => record["Pclass"] < 2
], "Survived");

let splitOnAge = train.splitOn([
	record => record["Age"] >= 50,
	record => record["Age"] >= 30 && record["Age"] < 50,
	record => record["Age"] >= 15 && record["Age"] < 30,
	record => record["Age"] < 15
], "Survived");


console.log(RJS.getInformationGain(train.property("Survived"), splitOnSex));
console.log(RJS.getInformationGain(train.property("Survived"), splitOnPclass));
console.log(RJS.getInformationGain(train.property("Survived"), splitOnAge));