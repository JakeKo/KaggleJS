const HEADER_PADDING = 2;

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
module.exports.getColumn = (data, column) => {
	const values = [];

	for (let row of data) {
		values.push(row[column]);
	}

	return values;
}

function _tabulateData(data, columns, widths) {
	// Constructs the column headers and widths unless manual values are provided
	columns = columns !== undefined ? columns : _getColumnHeaders(data);
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

function _getColumnHeaders(data) {
	if (data === undefined || data.length === 0) {
		return undefined;
	}

	const columns = [];

	for (let column in data[0]) {
		if (data[0].hasOwnProperty(column)) {
			columns.push(column.toString());
		}
	}

	return columns;
}

function _getColumnWidths(data, columns) {
	if (columns === undefined) {
		columns = _getColumnHeaders(data);
	}

	const widths = [];

	for (let col of columns) {
		let maxWidth = col.length; // Column width should be at least as big as the column header

		for (let row of data) {
			maxWidth = Math.max(row[col].length, maxWidth);
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
			output += `${row[columns[i]].padEnd(widths[i])}| `;
		}

		output = `${output.slice(0, -2)}\n`;
	}

	return output;
}