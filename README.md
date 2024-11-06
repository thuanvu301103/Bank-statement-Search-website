# Bank-statement-Search-website
A website that helps you search bank statements quickly

## Requirements
- The website is used to search for information of bank statement: time, credit, debit, detail...
- No database server connection. Every query must be out-of-the-box
- The data is read from ```*csv``` file
- Provide API Endpoints for testing

## Database

### Approach
- Implement File-based database - A Singleton object that serves as a database across all modules
- The size of ```*csv``` file is enormous and we will conduct load/stress tests, so reading the entire file to RAM for query is not a good choice. The best option is to create a streamline to read ```*cvs``` file.
- For random Access line or cell, we build Offset Index mechanism for each file then run this inside constructor.

### Implementation

#### File
- Each file in data folder is stored in a ```File``` object 
- Implement in ```/models/File.js```:
	```javascript
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
	    async buildOffsetIndex(delimiter = ',') {/*...*/}

	    /**
	     * Reads a specific cell from a CSV file by line and column index, using pre-built byte offsets.
	     *
	     * @param {number} lineNumber - The 0-based line number of the desired cell.
	     * @param {number} columnNumber - The 0-based column number within the line.
	     * @returns {Promise<string>} - A promise that resolves to the content of the specified cell, trimmed of whitespace.
	     */
	    async readSpecificCell(lineNumber, columnNumber) {/*...*/}
	}
	```
- Implement OffsetIndex mechanism
	```javascript
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
	```

### Database
- A singleton object that serves as a database across all modules
- Implements in ```/config/db.js```:
	```javascript
	class Database {

	    static instance;

	    constructor(folder_path) {
	        if (Database.instance) {
	            return Database.instance; // Return existing instance if it exists
	        }

	        Database.folder_path = folder_path;
	        Database.files = []; // Initialize files array

	        // Initialize the database and return a promise
	        this.initialize().then(() => {
	            //console.log("Files' names: ", Database.file_names);
	        }).catch(err => {
	            console.error('Error during initialization:', err);
	        });

	        Database.instance = this; // Set singleton instance
	    }

	    async initialize() {
	        try {
	            const files = await fs.readdir(Database.folder_path); // Read directory contents

	            // Initialize file_names as an empty array
	            Database.file_names = [];
	
	            // Use Promise.all to create File instances and push file names
	            Database.files = await Promise.all(
	                files.map(file => {
	                    Database.file_names.push(file); // Push file name to the array
	                    return new File(`${Database.folder_path}/${file}`); // Create and return a new File instance
	                })
	            );
	        } catch (err) {
	            console.error('Unable to scan directory:', err);
	            throw err; // Re-throw the error to be caught in the constructor
	        }
	    }


	    // Static method to get the instance
	    static getInstance(folder_path) {
	        if (!Database.instance) {
	            Database.instance = new Database(folder_path); // Create the instance if it doesn't exist
	        }
	        return Database.instance; // Return the singleton instance
	    }

	    /**
	     * Get the Data Folder directory
	     * 
	     * @return {string} Data folder of this file-based database
	     */
	    static getDataFolderDir() {/*...*/}

	    /**
	     * Get the name of file that have ID = fileId
	     * 
	     * @param {number} fileId
	     * @return {string} Name of file that has ID = fileId
	     */
	    static getFileName(fileId) {/*...*/}

	    /**
	     * Get the name of all file in the Database
	     * 
	     * @return {Array<string>} Name of file that has ID = fileId
	     */
	    static getAllFileName() {/*...*/}

	    /**
	     * return File object that hass ID = fileId
	     * 
	     * @param {number} fileId
	     * @returns {File} File object that has ID = fileID
	     */
	    static getFile(fileId) {/*...*/}
	```


## Appendix

### Install dependencies
```
npm install
```

### Start app
```
npm start
```

### Kill process (server) running on specific port:
- Find PID of server running on port:
	```
	netstat -ano | findstr :<Port number>
	```
- Kill that process:
	```
	taskkill /F /PID <PID>
	```


