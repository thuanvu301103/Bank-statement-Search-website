const fs = require('fs');

class File {

    file_path = "";
    offset_index = null;

    constructor(file_path) {
        this.file_path = file_path;
        this.offset_index = this.buildOffsetIndex();
    }

    /**
     * Build OffsetIndex mechanism for file
     * 
     * @param {string} delimiter
     * @returns {Promise<Array<{ lineOffset: number, columnOffsets: number[] }>>} -
     *   A promise that resolves to an array of objects, each representing a line's starting byte offset
     *   and the byte offsets for each column within that line.
     */
    async buildOffsetIndex(delimiter = ',') {
        const index = [];
        const fileStream = fs.createReadStream(this.file_path);
        // Read lines
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let byteOffset = 0;

        for await (const line of rl) {
            const columnOffsets = [];
            let currentColumnOffset = byteOffset; // Start with the line's byte offset

            // Calculate offsets for each column
            line.split(delimiter).forEach((column) => {
                columnOffsets.push(currentColumnOffset);
                currentColumnOffset += Buffer.byteLength(column, 'utf8') + Buffer.byteLength(delimiter); // Update for each column
            });

            index.push({
                lineOffset: byteOffset,    // Starting byte offset of the line
                columnOffsets: columnOffsets // Byte offsets for each column in the line
            });

            byteOffset += Buffer.byteLength(line, 'utf8') + 1; // Update for next line (+1 for newline)
        }

        return index;
    }

    /**
     * Reads a specific cell from a CSV file by line and column index, using pre-built byte offsets.
     *
     * @param {number} lineNumber - The 0-based line number of the desired cell.
     * @param {number} columnNumber - The 0-based column number within the line.
     * @returns {Promise<string>} - A promise that resolves to the content of the specified cell, trimmed of whitespace.
     */
    async readSpecificCell(lineNumber, columnNumber) {
        const { lineOffset, columnOffsets } = this.offset_index[lineNumber];

        // Create a readable stream starting from the byte offset of the specified line
        const fileStream = fs.createReadStream(this.file_path, { start: lineOffset });
        const rl = readline.createInterface({ input: fileStream });

        for await (const line of rl) {
            // Calculate the byte offset for the specified column within the line
            const columnByteOffset = columnOffsets[columnNumber];

            // Determine the end byte offset for the column data
            const columnEndByteOffset = columnNumber < columnOffsets.length - 1
                ? columnOffsets[columnNumber + 1] // Offset for the next column
                : line.length; // End of the line if it's the last column

            // Extract the specific cell data based on byte offsets and trim whitespace
            const cellData = line.slice(columnByteOffset - lineOffset, columnEndByteOffset - lineOffset);
            return cellData.trim(); // Return the cell data
        }
    }

}

module.exports = User;
