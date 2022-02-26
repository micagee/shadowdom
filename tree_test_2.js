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
        index += 1;
    }

    return accu;
};
    
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

/** The new method has the advantage that the array to search 
 *  for the children is getting smaller with each search
 *  the old way had to search the complete node list for each node
 */
let nodes_augm_2 = ((nodes) => {
    let arr = nodes;

    for(let node of nodes) {
        
        let {lft, rgt} = splitArray(arr, (n) => n.parentName === node.name);
        
        node.children = rgt.map((ch)=> {
            
            ch.depth = node.depth + 1;
            ch.parent = node;

            return ch;
        });
        
        arr = lft;
    }

    return nodes;
})(nodes);

traverse(nodes_augm_2[0], ({node, index, accu}) => {
    accu.push(node);
    node.start = index;
}).forEach((node, i, a) => {
    if(node.parent) {
        let selfIndex = node.parent.children.indexOf(node);
        if (selfIndex !== node.parent.children.length - 1) {
            node.next = node.parent.children[selfIndex+1].start;
        }
        else {
            node.next = "???"
        }
    }


    let out = `${INDENT.repeat(node.depth)}`;
    out += `${printNum(node.name)}`;
    out += `  (${printNum(node.start)}`;
    out += `, ${printNum(node.next)})`;
    console.log(out);
});
