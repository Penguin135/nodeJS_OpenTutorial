var fs = require('fs');

fs.readFile('.\\nodejs\\sample.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// fs.readFile('.\\nodejs\\sample.txt', function(err, data){
//     if(err) throw err;
//     console.log(data.toString());
// });