# Bank-statement-Search-website
A website that helps you search bank statements quickly

## Requirements
- The website is used to search for information of bank statement: time, credit, debit, detail...
- No database server connection. Every query must be out-of-the-box
- The data is read from ```*csv``` file
- Provide API Endpoints for testing

## Database

### Approach
- Implement File-based database - An singleton object that serve as a database across all modules

### Implementation
- Step 1: Implement Database class using Singleton pattern ```/config/db.js```
	```javascript
	class Database {

    		// Static property to hold the singleton instance
    		static instance;
    		// Other attributes
    		static folder_path;

    		constructor(folder_path) {
        		if (Database.instance) {return Database.instance;}
        		console.log("Craete file-based Database instance");
        		Database.folder_path = folder_path;
        		Database.instance = this;
    		}

    		// Static method to get the instance
    		static getInstance(folder_path) {
        		if (!Database.instance) {
            			Database.instance = new Database(folder_path); // Create the instance if it doesn't exist
        		}
        		return Database.instance; // Return the singleton instance
    		}
	```
- Srep 2: 

