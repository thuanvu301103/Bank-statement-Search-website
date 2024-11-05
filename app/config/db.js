const fs = require('fs');

class Database {

    // Static property to hold the singleton instance
    static instance;
    // Other attributes
    static folder_path;
    static file_names;

    constructor(folder_path) {
        if (Database.instance) {
            return Database.instance;
        }
        console.log("Create file-based Database instance");
        Database.folder_path = folder_path;
        // Get all files' names in folder
        Database.file_names = [];
        fs.readdir(Database.folder_path, async (err, files) => {
            if (err) {
                return console.error('Unable to scan directory: ' + err);
            }
            // Loop through each file and get their name
            files.forEach(file => {
                Database.file_names.push(file); // This will push the name of each file to result array
            });
        });
        console.log("Database files' names: ", Database.file_names);
        Database.instance = this;
    }

    // Static method to get the instance
    static getInstance(folder_path) {
        if (!Database.instance) {
            Database.instance = new Database(folder_path); // Create the instance if it doesn't exist
        }
        return Database.instance; // Return the singleton instance
    }


}

// Export
module.exports = Database;