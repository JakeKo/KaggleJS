"use strict";

const Parser = require("../lib/jquery-csv.min");
const FS = require("fs");
const RJS = require("../lib/rjs");
const DataSet = RJS.DataSet;

function cleanData(filePath) {
	let dataSet = new DataSet(Parser.toObjects(FS.readFileSync(filePath, {
		encoding: 'utf-8'
	})));

	dataSet.castColumnToScalar("PassengerId");
	dataSet.castColumnToScalar("Survived");
	dataSet.castColumnToScalar("Pclass");
	dataSet.castColumnToScalar("Age");
	dataSet.castColumnToScalar("SibSp");
	dataSet.castColumnToScalar("Fare");

	return dataSet;
}

let train = cleanData("./data/titanic/train.csv");
let test = cleanData("./data/titanic/test.csv");

let trainTable = train.head(5);
console.log(trainTable.toString());

let testTable = test.head(5, trainTable.columns, trainTable.widths);
console.log(testTable.toString());







function getEntropy(response) {
	let positiveRatio = RJS.sum(response) / response.length;
	let negativeRatio = 1 - positiveRatio;

	let positiveScalar = positiveRatio === 0 ? 0 : Math.log2(positiveRatio);
	let negativeScalar = negativeRatio === 0 ? 0 : Math.log2(negativeRatio);

	return -positiveRatio * positiveScalar - negativeRatio * negativeScalar;
}

function getAggregateEntropy(responses) {
	let numElements = 0;
	let totalEntropy = 0;

	for (let response of responses) {
		numElements += response.length;
		totalEntropy += response.length * getEntropy(response);
	}

	return totalEntropy / numElements;
}

function getInformationGain(setResponses, childResponses) {
	let childEntropy = getAggregateEntropy(childResponses);
	let baseEntropy = getEntropy(setResponses);
	return baseEntropy - childEntropy;
}

let vampires = new DataSet([
	{ vampire: false, shadow: "?", garlic: true, complexion: "P", accent: "N" },
	{ vampire: false, shadow: "Y", garlic: true, complexion: "R", accent: "N" },
	{ vampire: true, shadow: "?", garlic: false, complexion: "R", accent: "N" },
	{ vampire: true, shadow: "N", garlic: false, complexion: "A", accent: "H" },
	{ vampire: true, shadow: "?", garlic: false, complexion: "A", accent: "O" },
	{ vampire: false, shadow: "Y", garlic: false, complexion: "P", accent: "H" },
	{ vampire: false, shadow: "Y", garlic: false, complexion: "A", accent: "H" },
	{ vampire: false, shadow: "?", garlic: true, complexion: "R", accent: "O" },
]);

let shadows = [
	vampires.subset(row => row.shadow === "?").at(undefined, "vampire"),
	vampires.subset(row => row.shadow === "Y").at(undefined, "vampire"),
	vampires.subset(row => row.shadow === "N").at(undefined, "vampire"),
];

let garlics = [
	vampires.subset(row => row.garlic).at(undefined, "vampire"),
	vampires.subset(row => !row.garlic).at(undefined, "vampire"),
];

let complexions = [
	vampires.subset(row => row.complexion === "P").at(undefined, "vampire"),
	vampires.subset(row => row.complexion === "R").at(undefined, "vampire"),
	vampires.subset(row => row.complexion === "A").at(undefined, "vampire"),
];

let accents = [
	vampires.subset(row => row.accent === "N").at(undefined, "vampire"),
	vampires.subset(row => row.accent === "H").at(undefined, "vampire"),
	vampires.subset(row => row.accent === "O").at(undefined, "vampire"),
];

console.log(`Information gain on shadow: ${getInformationGain(vampires.at(undefined, "vampire"), shadows)}`)
console.log(`Information gain on garlic: ${getInformationGain(vampires.at(undefined, "vampire"), garlics)}`)
console.log(`Information gain on complexion: ${getInformationGain(vampires.at(undefined, "vampire"), complexions)}`)
console.log(`Information gain on accent: ${getInformationGain(vampires.at(undefined, "vampire"), accents)}`)