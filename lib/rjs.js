const HEADER_PADDING = 2;

module.exports.DataSet = class DataSet {
	constructor(data) {
		this._data = data === undefined ? data : data.slice();
	}

	get data() {
		return this._data;
	}

	getProperties() {
		if (!this.hasData()) {
			return undefined;
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

	head(rowCount, columns, widths) {
		return _tabulateData(this._data.slice(0, rowCount), columns, widths);
	}

	tail(rowCount, columns, widths) {
		return _tabulateData(this._data.slice(-rowCount), columns, widths);
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
};

module.exports.sum = (data) => data.reduce((a, b) => a + b, 0);

function _tabulateData(data, columns, widths) {
	// Constructs the column headers and widths unless manual values are provided
	columns = columns !== undefined ? columns : new module.exports.DataSet(data).getProperties();
	widths = widths !== undefined ? widths : _getColumnWidths(data, columns);

	let output = _stringifyColumnHeaders(columns, widths);
	output += `${"-".repeat(output.length - 3)}\n`; // Divide column headers and data
	output += _stringifyData(data, columns, widths);	

	return {
		data: new module.exports.DataSet(data),
		columns: columns,
		widths: widths,
		toString: () => output
	};
}

function _getColumnWidths(data, columns) {
	columns = columns !== undefined ? columns : new module.exports.DataSet(data).getProperties();

	const widths = [];

	for (let col of columns) {
		let maxWidth = col.length; // Column width should be at least as big as the column header

		for (let row of data) {
			maxWidth = Math.max(row[col].toString().length, maxWidth);
		}

		widths.push(maxWidth + HEADER_PADDING);
	}

	return widths;
}

function _stringifyColumnHeaders(columns, widths) {
	let output = "";

	for (let i = 0; i < columns.length; i++) {
		output += `${columns[i].padEnd(widths[i])}| `;
	}

	return `${output.slice(0, -2)}\n`;
}

function _stringifyData(data, columns, widths) {
	let output = "";

	for (let row of data) {
		for (let i = 0; i < columns.length; i++) {
			output += `${row[columns[i]].toString().padEnd(widths[i])}| `;
		}

		output = `${output.slice(0, -2)}\n`;
	}

	return output;
}