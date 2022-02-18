// dependencies.js
// import fs from "fs";
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url'; // in Browser, the URL in native accessible on window
// import { dirname } from 'path';

const fileToTest = "../../domponents/src/Demo/TreeConverterDemo.js";

const filePath = (fileName) => (new URL(fileName, import.meta.url).pathname).slice(1);

console.log(filePath(fileToTest));

const fileLocation = filePath(fileToTest);

let res = fs.readFile(fileLocation, {encoding: 'utf-8'})
.then((data) => {
	let matches = data.matchAll(/^\s*import\s*(\w+)\s+from\s+"(.+)"/gm);
    let result = [];
    for (const match of matches) {
        result.push({
            name: match[1],
            file: match[2]
        });
    }
    return result; // gets returned as a Promise NOT as an Array
})
.then((list) => 
    list.forEach((entry) => {
        let parts = entry.file.split("/");
        console.log(entry);
    })
);

// function* wait(res) {
//     yield fs.readFile(fileLocation, {encoding: 'utf-8'});
// }

// console.log(...wait(res));