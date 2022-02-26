import fs from 'fs';

const NUM_NODES = 30;
const INDENT = "  ";
const EDGELIST_FILE = "./logs/edgelist.json";
const ECODING = "utf8";

// print helper
const printArray = (a) => `[${a.map((v) => v.name).join(', ')}]`
const printNum = (n) => n < 10 ? ` ${n}` : n;

export
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

/** @typedef {{ id:number, pid: number }} Edge */
/**
 * @param {number} numNodes - number of nodes to create
 * @returns {Edge} - id, parent id
 */
export
const CreateEdges = (numNodes) => {
    let nodes = [];
    for(let i = 0; i < numNodes; ++i) {
        nodes.push({
            id: i, 
            pid: ~~(Math.random() * i)
        })
    }
    nodes[0].pid = -1;
    return nodes;
};

/**
 * @typedef {Object} TreeNode
 * @property {TreeNode[]} children
 */

/**
 * @function TreeVisitor 
 * @param {TreeNode} node
 * @param {number} index
 * @param {[]} accu
 * @returns void
 */

// stack.pop() := preorder depth traversal
// stack.shift() := level order traversal
/**
 * breadth first traversal
 * @param {TreeNode} tree - root
 * @param {TreeVisitor} cb - called for each node of the tree
 * @param {Object} options
 * @param {Object} options.includeRoot
 * @param {Object} options.includeDepth
 * @param {Object} options.enableIndex TODO
 * @param {Object} options.depthFirst
 */
export
const traverse = (tree, cb, options) => {
    options = {...options};
    let stack = options.includeRoot !== false ?
        [tree] :
        tree.children.reverse();
    let index = 0;
    let accu = [];

    stack.map((n) => { n.depth = 0; return n; }); // add depth

    while (stack.length) {
        let node = options.depthFirst !== false ? stack.pop(): stack.shift();
        let children = options.addDepth !== false ?
            node.children.map((ch) => {
                ch.depth = node.depth + 1;
                return ch;
            }) :
            node.children;
        stack = stack.concat(children.reverse());
        cb(node, index, accu);
    }

    return accu;
};
    

/** split array into two parts depending on condition
 * @param {[]} arr
 * @param {(entry:any) => boolean} condition
 */
export
function splitArray(arr, condition) {
    let lft=[], rgt=[];
    arr.forEach((entry) => {
        condition(entry) ? rgt.push(entry) : lft.push(entry);        
    });
    return { lft, rgt };
}

export
const traversePrePost = (tree, pre, post) => {
    let index = 0;
    let accu = [];
    const visit = (node, pre, post) => {
        pre(node, index, accu);
        index += 1;
        accu.push(node);
        node.children.forEach((child) => visit(child, pre, post));
        if (post) post(node, index, accu);
        accu.pop();
    };
    visit(tree, pre, post);
};


/**
 * Adds a "children" and a "parent" property to each edge
 * so it becomes { id, pid, children }
 * @param {Edge[]} edges
 * @param {Object} options
 * @param {Object} options.addDepth
 * @param {Object} options.addParent
 */
export
const TreeFromEdges = (edges, options) => {
    options = {...options};
    let nodes = edges.map(x => x);
    let arr = nodes;
    for(let node of nodes) {
        let {lft, rgt} = splitArray(arr, (n) => n.pid === node.id);
        options.addParent !== false ? 
            node.children = rgt.map((ch) => { ch.parent = node; return ch; }) :
            node.children = rgt;
        arr = lft;
    }
    let root = nodes.find((node) => node.pid === -1);
    root.parent = { id: -1, pid: -1, children: [] };
    return root;
};

