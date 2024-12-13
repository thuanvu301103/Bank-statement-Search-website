const Database = require('../config/db');

function parseDate(dateTimeStr) {
    // Split the date and time parts
    const [datePart] = dateTimeStr.split('_');

    // Parse the date part
    const [day, month, year] = datePart.split('/').map(Number);

    // Create a new Date object
    const date = new Date(year, month - 1, day);

    return date;
}

function intersection(arrays) {
    if (arrays.length === 0) return [];
    return arrays.reduce((acc, array) => acc.filter(value => array.includes(value)));
}


// Search for Data
exports.search = async (req, res) => {
    const {
        q, // detail search
    } = req.query;
    let file = Database.getFile(0);
    if (file) {
        var input_arrs = [];
        var idsByDetail = [];
        var ids = [];
        var resData = [];
        if (q) {
            idsByDetail = await file.searchDetail(q);
            //console.log("Ids by Detail: ", idsByDetail);
            input_arrs.push(idsByDetail);
        }

        // Union of all ids list
        var ids = intersection(input_arrs);
        //console.log(ids);

        if (ids.length != 0) resData = await file.getRows(ids.slice(0, 20));
        //console.log(resData);
        res.status(200).json({
            total: ids.length,
            ids: ids,
            data: resData
        });
    }
    else {
        console.error('Error reading file: Out of range');
        res.status(400).json({
            success: false,
            message: "Resource not found"
        })
    }
};

// Search for Data
exports.get = async (req, res) => {
    const {
        ids
    } = req.query;
    let file = Database.getFile(0);
    if (file) {
        if (ids.length != 0) resData = await file.getRows(ids.split(','));
        //console.log(resData);
        res.status(200).json({
            data: resData
        });
    }
    else {
        console.error('Error reading file: Out of range');
        res.status(400).json({
            success: false,
            message: "Resource not found"
        })
    }
};