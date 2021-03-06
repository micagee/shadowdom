import fs from 'fs';

const NUM_NODES = 30;
const INDENT = "  ";
const EDGELIST_FILE = "./logs/edgelist.json";
const ECODING = "utf8";

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
    nodes[0].parentName = -1;

    let json = JSON.stringify(nodes, null, 2);
    fs.writeFileSync(EDGELIST_FILE, json, {encoding: ECODING});
}
else {
    let json = fs.readFileSync(EDGELIST_FILE, ECODING);
    nodes = JSON.parse(json);
}

const traverse = (tree, cb) => {
    let stack = [tree];
    let index = 0;
    let accu = [];

    while (stack.length) {
        let node = stack.pop();
        stack = stack.concat(node.children.reverse());
        cb({node, index, accu});
    }
};
    
let nodes_augm = nodes.map((node, i ,a) => {
    if (i === 0) return node; // this is root

    let parentNode = a.find((n) => n.name === node.parentName);
    parentNode.children.push(node);
    // traverse(node, (child) => { child.depth = parentNode.depth + 1; });
    node.depth = parentNode.depth + 1;

    return node;
});

/** split array into two parts depending on condition
 * @param {[]} arr
 * @param {(entry:any) => boolean} cond
 */
function splitArray(arr, cond) {
    let lft=[], rgt=[];
    arr.forEach((entry) => {
        cond(entry) ? rgt.push(entry) : lft.push(entry);        
    });
    return { lft, rgt };
}
let nodes_augm_2 = ((nodes) => {
    let arr = nodes;
    for(let node of nodes) {
        let {lft, rgt} = splitArray(arr, (n) => n.parentName === node.name);
        node.children = rgt;
        arr = lft;
    }
    
    // remove root from its children
    nodes[0].children.shift();

    return nodes;
})(nodes);

// printNodes(nodes_augm);

// root is always the first entry when using nodes generator
// traverse(nodes_augm[0], (node) => {
//     let indent = INDENT.repeat(node.depth);
//     console.log(`${indent}${node.name}`);
// });


// ================================================
if(0) {
    nodes_augm.map((node,i,a) => {
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
    traverse(nodes_augm[0], (node) => {
        // name, parentName, lft, rgt 
    })
}


const traverseDFS = (tree, cb) => {
    let index = 0;
    let accu = [];
    const preorder = (node, cb) => {
        node.start = index;
        cb({ node, index, accu });
        index += 1;
        accu.push(node);
        node.children.forEach((child) => preorder(child, cb));
        node.next = index;
        accu.pop()
    };
    preorder(tree, ()=>0); index = 0;
    preorder(tree, cb);
};


let nodes_preorder = [];
traverseDFS(nodes_augm[0], ({node, index, accu}) => {
    let out = "";
    // out += `${printNum(index)}.  `;
    out += `${INDENT.repeat(node.depth)}  `;
    out += `[${printNum(node.name)} : `;
    out += `${printNum(node.parentName)}]`;
    out += `  ${accu.map((v)=>v.name).join("/")}`;
    out += `  (${printNum(node.start)}, ${printNum(node.next)})`;
    console.log(out);
    nodes_preorder.push({ node, index });
});

traverse(nodes_augm_2[0], ({node, index, accu}) => {
    let out = `${INDENT.repeat(node.depth)}`;
    out += `${printNum(node.name)}`;
    console.log(out);
});
