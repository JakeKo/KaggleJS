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
	
		const properties = [];
	
		for (let property in this._data[0]) {
			if (this._data[0].hasOwnProperty(property)) {
				properties.push(property.toString());
			}
		}
	
		return properties;
	}

	castColumnToScalar(column) {
		if (!this.hasColumn(column)) {
			return;
		}

		for (let row of this._data) {
			row[column] = parseFloat(row[column]);
		}
	}

	castColumnToBoolean(column, condition) {
		if (!this.hasColumn(column)) {
			return;
		}

		for (let row of this._data) {
			row[column] = condition(row[column]);
		}
	}

	hasColumn(column) {
		if (!this.hasData()) {
			return false;
		}

		return this._data[0].hasOwnProperty(column);
	}

	hasData() {
		return this._data !== undefined && this._data.length >= 0;
	}

	head(rowCount) {
		return _tabulateData(this._data.slice(0, rowCount));
	}

	tail(rowCount) {
		return _tabulateData(this._data.slice(-rowCount));
	}

	at(row, column) {
		if (row !== undefined && column !== undefined) {
			return this._data[row][column];
		} else if (row === undefined && column !== undefined) {
			const values = [];

			for (let row of this._data) {
				values.push(row[column]);
			}

			return values;
		} else if (row !== undefined && column === undefined) {
			return this._data[row];
		}

		return undefined;
	}

	subset(condition) {
		const data = [];

		for (let row of this._data) {
			if (condition(row)) {
				data.push(row);
			}
		}

		return new DataSet(data);
	}
};

module.exports.DataSet = DataSet;

module.exports.sum = (data) => data.reduce((a, b) => a + b, 0);

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

	for (let col of columns) {
		let maxWidth = col.length; // Column width should be at least as big as the column header

		for (let row of dataSet.data) {
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

	for (let row of dataSet.data) {
		for (let i = 0; i < columns.length; i++) {
			output += `${row[columns[i]].toString().padEnd(widths[i])}| `;
		}

		output = `${output.slice(0, -2)}\n`;
	}

	return output;
}