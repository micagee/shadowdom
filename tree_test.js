import fs from 'fs';

const NUM_NODES = 30;
const INDENT = "  ";

// print helper
const printArray = (a) => `[${a.map((v) => v.name).join(', ')}]`
const printNum = (n) => n < 10 ? ` ${n}` : n;

const printNodes = (nodes) =>
    nodes.forEach((node, i) => {
        // let out = `${printNum(i)}\t[${printNum(node.name)} `;
        let out = `[${printNum(node.name)} `;
        // out += `^: ${printNum(node.parentName)} `;
        out += `: ${printNum(node.parentName)} `;
        // out += `[]: ${printArray(node.children)} `;
        // out += `d: ${node.depth} `;
        // out += `i: ${node.info}]`;
        out += `]`;
        console.log(out);
    });


// list of edges
let nodes = [];

// this generates a tree, no cycles possible!
if(0) { // change to 1 if new data is needed
    for(let i = 0; i < NUM_NODES; ++i) {
        nodes.push({
            name: i, 
            parentName: ~~(Math.random() * i),
            children: [],
            depth: 0,
            info: ""
        })
    }

    let json = JSON.stringify(nodes, null, 2);
    fs.writeFileSync("./assets/edgelist.json", json, {encoding: 'utf-8'});
}
else {
    let json = fs.readFileSync("./assets/edgelist.json", "utf8");
    nodes = JSON.parse(json);
}

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
    
let nodes_filtered = nodes.map((node, i ,a) => {
    if (i === 0) return node; // this is root
    let parentNode = a.find((n) => n.name === node.parentName);

    // 
    // if (node.name !== node.parentName) {
        parentNode.children.push(node);
        traverse(node, (child) => { child.depth = parentNode.depth + 1; });
    // }

    return node;
});

// printNodes(nodes_filtered);

// root is always the first entry when using nodes generator
// traverse(nodes_filtered[0], (node) => {
//     let indent = INDENT.repeat(node.depth);
//     console.log(`${indent}${node.name}`);
// });


// ================================================
if(0) {
    nodes_filtered.map((node,i,a) => {
        node.lft = 0;
        node.rgt = 42;
        return node;
    }).forEach((node, i) => {
        let out = "";
        out += `[${printNum(node.name)} : `;
        out += `${printNum(node.parentName)} : `;
        out += `(${printNum(node.lft)}, ${printNum(node.rgt)})]`;
        console.log(out);
    });
    traverse(nodes_filtered[0], (node) => {
        // name, parentName, lft, rgt 
    })
}




const traverseDFS = (tree, cb) => {
    let i = 0;
    const preorder = (node, cb) => {
        cb({ index: i, node });
        i += 1;
        node.children.forEach((child) => preorder(child, cb));
    };
    preorder(tree, cb);
};


let nodes_preorder = [];
traverseDFS(nodes_filtered[0], ({node, index}) => {
    let out = "";
    out += `${printNum(index)} : `;
    out += `[${printNum(node.name)} : `;
    out += `${printNum(node.parentName)}]`;
    console.log(out);
    nodes_preorder.push({ node, index });
});

nodes_preorder.map(({node, index}, _, a) => {
    node.lft = index;
    
});
