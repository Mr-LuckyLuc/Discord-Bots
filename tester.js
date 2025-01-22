const { dbScripts } = require("./dbScripts.js");

location = dbScripts.getLocation("test1");
console.log(location);


// const mysql = require('mysql2');

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "castleRP"
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("looking for location!");
//     db.query(`select * from location;`, function (err, result) {
//       if (err) throw err;
//       console.log(result);
//       return result;
//     });
// });