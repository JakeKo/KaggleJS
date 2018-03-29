"use strict";

const HEADER_PADDING = 2;

const DataSet = class {
	constructor(data) {
		this._data = data === undefined ? data : data.slice();
	}

	get data() {
		return this._data;
	}

	getProperties() {
		if (!this.hasData()) {
			return [];
		}
	
		return Object.getOwnPropertyNames(this.at(0)).slice();
	}

	castPropertyToScalar(property) {
		// Fail quietly if the property does not exist
		if (!this.hasProperty(property)) {
			return;
		}

		for (const record of this._data) {
			record[property] = parseFloat(record[property]);
		}
	}

	castPropertyToBoolean(property, condition) {
		// Fail quietly if the property does not exist
		if (!this.hasProperty(property)) {
			return;
		}

		for (const record of this._data) {
			record[property] = condition(record[property]);
		}
	}

	hasProperty(property) {
		return this.hasData() ? this.at(0).hasOwnProperty(property) : false;
	}

	hasData() {
		return this.data !== undefined && this.data.length >= 0;
	}

	head(recordCount) {
		return _tabulateData(this.data.slice(0, recordCount));
	}

	tail(recordCount) {
		return _tabulateData(this.data.slice(-recordCount));
	}

	at(record, property) {
		if (record === undefined && property !== undefined) {
			const values = [];
			this.data.forEach((element) => values.push(element[property]));
			return values;
		} else if (record !== undefined && property === undefined) {
			return this.data[record];
		} else if (record !== undefined && property !== undefined) {
			return this.data[record][property];
		}

		return undefined;
	}

	property(property) {
		return this.at(undefined, property);
	}

	record(index) {
		return this.at(index, undefined);
	}

	subset(condition) {
		return new DataSet(this.data.filter((record) => condition(record)));
	}

	splitOn(conditions, returnProperty) {
		let splits = [];
	
		for (let i = 0; i < conditions.length; i++) {
			splits.push(this.subset(conditions[i]).data)
		}
	
		if (returnProperty !== undefined) {
			for (let i = 0; i < splits.length; i++) {
				for (let j = 0; j < splits[i].length; j++) {
					splits[i][j] = splits[i][j][returnProperty];
				}
			}
		}
	
		return splits;
	}
};

module.exports.DataSet = DataSet;
module.exports.sum = (data) => data.reduce((a, b) => a + b, 0);
module.exports.unique = (data) => [... new Set(data)];
module.exports.readCSV = (filePath) => new DataSet(require("./jquery-csv.min").toObjects(require("fs").readFileSync(filePath, { encoding: 'utf-8' })));

module.exports.getEntropy = (set) => {
	// Set should be an array of T/F or 1/0
	let posRatio = this.sum(set) / set.length;
	let negRatio = 1 - posRatio;

	let posScalar = posRatio === 0 ? 0 : Math.log2(posRatio);
	let negScalar = negRatio === 0 ? 0 : Math.log2(negRatio);

	return -posRatio * posScalar - negRatio * negScalar;
}

module.exports.getAggregateEntropy = (sets) => {
	let count = 0;
	let total = 0;

	for (let set of sets) {
		count += set.length;
		total += set.length * this.getEntropy(set);
	}

	return total / count;
}

module.exports.getInformationGain = (parent, children) => {
	let childEntropy = this.getAggregateEntropy(children);
	let parentEntropy = this.getEntropy(parent);
	return parentEntropy - childEntropy;
}







function _tabulateData(data) {
	const dataSet = new DataSet(data);

	let output = _stringifyColumnHeaders(dataSet);
	output += `${"-".repeat(output.length - 3)}\n`; // Divide column headers and data
	output += _stringifyData(dataSet);	

	return {
		dataSet: dataSet,
		columns: dataSet.getProperties(),
		widths: _getColumnWidths(dataSet),
		toString: () => output
	};
}

function _getColumnWidths(dataSet) {
	const columns = dataSet.getProperties();
	const widths = [];

	for (const col of columns) {
		let maxWidth = col.length; // Column width should be at least as big as the column header

		for (const row of dataSet.data) {
			maxWidth = Math.max(row[col].toString().length, maxWidth);
		}

		widths.push(maxWidth + HEADER_PADDING);
	}

	return widths;
}

function _stringifyColumnHeaders(dataSet) {
	const columns = dataSet.getProperties();
	const widths = _getColumnWidths(dataSet);
	let output = "";

	for (let i = 0; i < columns.length; i++) {
		output += `${columns[i].padEnd(widths[i])}| `;
	}

	return `${output.slice(0, -2)}\n`;
}

function _stringifyData(dataSet) {
	const columns = dataSet.getProperties();
	const widths = _getColumnWidths(dataSet);
	let output = "";

	for (const row of dataSet.data) {
		for (let i = 0; i < columns.length; i++) {
			output += `${row[columns[i]].toString().padEnd(widths[i])}| `;
		}

		output = `${output.slice(0, -2)}\n`;
	}

	return output;
}