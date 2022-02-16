let getType = (o) => Object.prototype.toString.call(o).replace(/\object /,"");
let getType_1 = (o) => Object.prototype.toString.call(o).replace(/.+\s(\w+)./,"$1");
let getType_2 = (o) => Object.prototype.toString.call(o).replace(/\[\w+ (.+)\]/,"$1");
let getType_3 = (o) => Object.prototype.toString.call(o).slice(8,-1);

import {kind} from "./helper.js";

let tree = {
  apple: {
      __data: [],
      i11: {
          i111: "Vogel",
          i112: {
              i1121: {
                  i11211: "i11211 data"
              },
              x: 0, 
              y: null,
              w: 400
          },
          i113: "Ente",
      },
      i12: {
          i121: "i121 data"
      }
  },
  pear: "i2 data",
  banana: "i3 data"
};


if(0) {
    const traverseObject = (rootObj, nodeCB) => {
        let stack = [["root", rootObj]];

        while(stack.length) {
            let [childKey, childValue] = stack.pop();
        
            if (childValue && typeof childValue === "object") {
                Object.entries(childValue).reverse().forEach((v) => {
                    stack.push(v);
                });
            }
            nodeCB(childKey, childValue);
        }
    };

    traverseObject(tree, (key, value) => {
        let strValue = typeof value === "object" ? "{" : value;
        console.log(`${key}: ${strValue}`);
    });
}

/**
 * @typedef NodeInfo
 * @property {string} key
 * @property {object|boolean|string|number|array|function} value
 * @property {boolean} hasChildren
 * @property {boolean} isLastChild
 * @property {number} depth
 */

/**
 * @param {object} obj
 */
 const hasChildrenTest = (obj) => obj && typeof obj == "object" && Object.keys(obj).length;
 
 /**
 * @param {object} rootObj
 * @param {(nodeInfo:NodeInfo) => void} nodeCB
 */
const traverseObject_2 = (rootObj, nodeCB) => {
    let stack = [{
        key:"root", 
        value: rootObj, 
        isLastChild: true, // because it's root
        depth: 0
    }];
    while(stack.length) {
        let node = stack.pop();
        node.hasChildren = hasChildrenTest(node.value);
        if (node.hasChildren) {
            let children = Object.entries(node.value).reverse();
            children.forEach((v, i, a) => { // v:= child, i := index, a:= children
                stack.push({
                    key: v[0], 
                    value: v[1],
                    isLastChild: i === 0, //a.length - 1,
                    depth: node.depth + 1
                });
            });
        }
        nodeCB(node);
    }
};

// this is my attempt to construct a JSON output, it's NOT working correctly
let brax = [];
traverseObject_2(tree, (node) => {
    let offset = Array(node.depth).fill("  ");
    let strValue;

    if(node.hasChildren) {
        strValue = "{";
        brax.push("\n" + offset.join("") + "}" + (node.isLastChild ? "": ","));
    }
    else {
        strValue = typeof node.value === "string" ? `"${node.value}"` : node.value;
        if (node.value instanceof Array && !node.value.length) strValue += "[]";
        if (!node.isLastChild) strValue += ",";
    }
    
    if(node.hasChildren) {
    }
    else {
        if(node.isLastChild) {
            strValue += brax.pop();
        }
    }

    console.log(`${offset.join('')}"${node.key}": ${strValue}`);
});

// This is the most simple traversal function, obviously not very tree-like
traverseObject_2(tree, (node) => { console.log(node); });

// This is how JSON looks like. Uncomment the line below to see it!
console.log(JSON.stringify(tree, null, 2)); // _ := replacer, 2 := indentation