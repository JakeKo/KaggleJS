"use strict";

const Parser = require("../lib/jquery-csv.min");
const FS = require("fs");
const RJS = require("../lib/rjs");
const DataSet = RJS.DataSet;

function cleanData(data) {
	let dataSet = new DataSet(data);
	dataSet.castColumnToScalar("PassengerId");
	dataSet.castColumnToBoolean("Survived", x => x === "1");
	dataSet.castColumnToScalar("Pclass");
	dataSet.castColumnToScalar("Age");
	dataSet.castColumnToScalar("SibSp");
	dataSet.castColumnToScalar("Fare");

	return dataSet.data;
}

let train = cleanData(Parser.toObjects(FS.readFileSync("./data/titanic/train.csv", { encoding: 'utf-8' })));
let test = cleanData(Parser.toObjects(FS.readFileSync("./data/titanic/test.csv", { encoding: 'utf-8' })));

console.log(RJS.head(train, 50).toString());

function getEntropy(response) {
	let positiveRatio = RJS.sum(response) / response.length;
	let negativeRatio = 1 - positiveRatio;

	let positiveScalar = positiveRatio === 0 ? 0 : Math.log2(positiveRatio);
	let negativeScalar = negativeRatio === 0 ? 0 : Math.log2(negativeRatio);

	return -positiveRatio * positiveScalar - negativeRatio * negativeScalar;
}

/*
```{r}
getEntropy = function(response) {
	posRatio = sum(response) / length(response)
	negRatio = 1 - posRatio
	entropy = - posRatio * ifelse(posRatio == 0, 0, log2(posRatio)) - negRatio * ifelse(negRatio == 0, 0, log2(negRatio))
	return(entropy)
}

getAggregateEntropy = function(responses) {
	numElements = 0
	totalEntropy = 0
	
	for (i in 1:length(responses)) {
		numElements = numElements + length(responses[[i]])
		totalEntropy = totalEntropy + length(responses[[i]]) * getEntropy(responses[[i]])
	}
	
	return(totalEntropy / numElements)
}

# setResponses is a single vector
# childResponses is a list of vectors
getInformationGain = function(setResponses, childResponses) {
	childEntropy = getAggregateEntropy(childResponses)
	baseEntropy = getEntropy(setResponses)
	return(baseEntropy - childEntropy)
}
```

```{r}
vampires = data.frame(
	vampire = c(F, F, T, T, T, F, F, F),
	shadow = c("?", "Y", "?", "N", "?", "Y", "Y", "?"),
	garlic = c(T, T, F, F, F, F, F, T),
	complexion = c("P", "R", "R", "A", "A", "P", "A", "R"),
	accent = c("N", "N", "N", "H", "O", "H", "H", "O")
)

shadows = list(
	subset(vampires, shadow == "?")$vampire,
	subset(vampires, shadow == "Y")$vampire,
	subset(vampires, shadow == "N")$vampire
)

garlics = list(
	subset(vampires, garlic == T)$vampire,
	subset(vampires, garlic == F)$vampire
)

complexions = list(
	subset(vampires, complexion == "P")$vampire,
	subset(vampires, complexion == "R")$vampire,
	subset(vampires, complexion == "A")$vampire
)

accents = list(
	subset(vampires, accent == "N")$vampire,
	subset(vampires, accent == "H")$vampire,
	subset(vampires, accent == "O")$vampire
)


cat("Information gain from splitting vampires on shadow:", getInformationGain(vampires$vampire, shadows), "\n")
cat("Information gain from splitting vampires on garlic:", getInformationGain(vampires$vampire, garlics), "\n")
cat("Information gain from splitting vampires on complexion:", getInformationGain(vampires$vampire, complexions), "\n")
cat("Information gain from splitting vampires on accent:", getInformationGain(vampires$vampire, accents), "\n")
*/