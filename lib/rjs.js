const HEADER_PADDING = 2;

module.exports.DataSet = class DataSet {
	constructor(data = []) {
		this._data = data.slice();
	}

	get data() {
		return this._data;
	}

	castColumnToScalar(column) {
		for (let row of this._data) {
			row[column] = parseFloat(row[column]);
		}
	}

	castColumnToBoolean(column, condition) {
		for (let row of this._data) {
			row[column] = condition(row[column]);
		}
	}
};

/**
 * @param {Object[]} data A list of objects containing the data to be tabulated
 * @param {Integer} rowCount A count of the number of rows to display
 * @param {String[]} columns A list of object properties to display
 * @param {Integer[]} widths A list of widths each column should have
 */
module.exports.head = (data, rowCount, columns, widths) => {
	return _tabulateData(data.slice(0, rowCount), columns, widths);
}

/**
 * @param {Object[]} data A list of objects containing the data to be tabulated
 * @param {Integer} rowCount A count of the number of rows to display
 * @param {String[]} columns A list of object properties to display
 * @param {Integer[]} widths A list of widths each column should have
 */
module.exports.tail = (data, rowCount, columns, widths) => {
	return _tabulateData(data.slice(-rowCount), columns, widths);
}

/**
 * @param {Object[]} data A list of objects containing the data to be fetched
 * @param {String} column The name of property to fetch from each record
 */
module.exports.getProperty = (data, column) => {
	const values = [];

	for (let row of data) {
		values.push(row[column]);
	}

	return values;
}

/**
 * @param {Object[]} data A list of objects from which to fetch properties
 */
module.exports.getProperties = (data) => {
	if (data === undefined || data.length === 0) {
		return undefined;
	}

	const properties = [];

	for (let property in data[0]) {
		if (data[0].hasOwnProperty(property)) {
			properties.push(property.toString());
		}
	}

	return properties;
}

module.exports.sum = (data) => data.reduce((a, b) => a + b, 0);

function _tabulateData(data, columns, widths) {
	// Constructs the column headers and widths unless manual values are provided
	columns = columns !== undefined ? columns : module.exports.getProperties(data);
	widths = widths !== undefined ? widths : _getColumnWidths(data, columns);

	let output = _stringifyColumnHeaders(columns, widths);
	output += `${"-".repeat(output.length - 3)}\n`; // Divide column headers and data
	output += _stringifyData(data, columns, widths);	

	return {
		data: data,
		columns: columns,
		widths: widths,
		toString: () => output
	};
}

function _getColumnWidths(data, columns) {
	if (columns === undefined) {
		columns = module.exports.getProperties(data);
	}

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