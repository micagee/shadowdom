// Brutaler Javascript Code (asynchrones Laden mit generator):
// aufrufen mit node generator_demo.js

import fs from "fs" // fs := filesystem

function workAsync(fileName)
{
    // async logic
    var worker = (function* () {

        function read(path) {
            return function (done) {
                fs.readFile(path, "utf8", done);
            }
        }

        console.log(yield read(fileName));
    })();

    // driver
    function nextStep(err, result) {
        try {
            var item = err? 
                worker.throw(err):
                worker.next(result);
            if (item.done)
                return;
            item.value(nextStep);
        }
        catch(ex) {
            console.log(ex.message);
            return;
        }
    }

    // first step
    nextStep();
}

workAsync("generator_demo.js");
