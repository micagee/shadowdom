const NUM_NODES = 100;

// generate a graph where each node has exactly one outgoing edge
let nodes = Array(NUM_NODES).fill({}).map((v, i, a) => ({
    name: i, 
    parentName: ~~(Math.random() * a.length),
    children: [],
    depth: 0,
    info: ""
}));

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
    let stack = [{ tree, visited: false }];

    while (stack.length) {
        let { node, visited } = stack.pop();
        if (visited) continue;

        for(let child of node.children.reverse()) {
            stack.push({node: child, visited: false });
        }
        
        cb(node);
    }
};
    
let nodes_filtered = nodes2.map((node, i ,a) => {
    if (i === 0) return node; // this is root
    let parentNode = a.find((n) => n.name === node.parentName);

    // if(node.children.some((child) => child.name === node.parentName)) {
    //     node.parentName = node.name;
    //     return node;
    // }
    
    // 
    if (node.name !== node.parentName) {
        parentNode.children.push(node);
        
        // beware of cycles, if the nodes form a graph and not a tree
        traverse(node, (child) => { child.depth = parentNode.depth + 1; });
    }
    else {
        console.log("node == parent")
    }

    return node;
}).filter((node, i, a) => {
    // just for intermediate logging
    if(i==a.length-1) { printNodes(a); console.log("") }
    return true;
}).filter((node, i, a) => {
    // get rid of nodes that have no children, they are already in a children array
    return node.children.length;
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

traverse(nodes_filtered[0], (node) => {
    let indent = Array(node.depth).fill("  ").join("");
    console.log(`${indent}${node.name}`);
});