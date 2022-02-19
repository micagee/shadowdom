const NUM_NODES = 20;

// generate a graph where each node has exactly one outgoing edge
let nodes = Array(NUM_NODES).fill({}).map((v, i, a) => ({
    name: i, 
    parentName: ~~(Math.random() * a.length),
    children: [],
    depth: 0,
    info: ""
}));

// this generates a tree, no cycles possible!
let nodes2 = [];
for(let i = 0; i < NUM_NODES; ++i) {
    nodes2.push({
        name: i, 
        parentName: ~~(Math.random() * i),
        children: [],
        depth: 0,
        info: ""
    })
}

const printArray = (a) => `[${a.map((v) => v.name).join(', ')}]`
const printNum = (n) => n < 10 ? ` ${n}` : n;

const printNodes = (nodes) =>
    nodes.forEach((node, i) => {
        let out = `${i}\t[${printNum(node.name)} `;
        out += `^: ${printNum(node.parentName)} `;
        out += `[]: ${printArray(node.children)} `;
        out += `d: ${node.depth} `;
        out += `i: ${node.info}]`;
        console.log(out);
    });

const traverse = (tree, cb) => {
    let stack = [tree];

    while (stack.length) {
        let node = stack.pop();
        for(let child of node.children.reverse()) {
            stack.push(child);
        }
        cb(node);
    }
};
    
let nodes_filtered = nodes2.map((node, i ,a) => {
    let parentNode = a.find((n) => n.name === node.parentName);

    // break cycle, does not work
    if(node.children.some((child) => child.name === node.parentName)) {
        node.parentName = node.name;
        return node;
    }
    
    if (node.name !== node.parentName) {
        parentNode.children.push(node);
        
        // beware of cycles
        traverse(node, (child) => { child.depth = parentNode.depth + 1; });
    }

    return node;
}).filter((node, i, a) => {
    if(i==a.length-1) { printNodes(a); console.log("") }
    return true;
}).filter((node, i, a) => {
    return node.children.length;
    // return true;
}).filter((node, i, a) => {
    if(node.name == node.parentName){
        node.info = "  <-";
    }
    
    return node.name == node.parentName;
    // return true;
});
printNodes(nodes_filtered);
console.log("");

let Tree = {
    name: "root",
    parentName: "",
    children: nodes_filtered,
    depth: -1
};

traverse(Tree, (node) => {
    let indent = Array(node.depth+1).fill("  ").join("");
    console.log(`${indent}${node.name}`);
});