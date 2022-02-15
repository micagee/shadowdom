var getType = param => Object.prototype.toString.call(param);

let tree = {
  "i1": {
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
  i2: "i2 data",
  i3: "i3 data"
};


const traverseObject = (rootObj, nodeCB) => {
  let stack = [["root", rootObj]];
  while(stack.length){
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
  let strValue = typeof value === "object" ? "obj" : value;
  console.log(`${key}: ${strValue}`);
});
