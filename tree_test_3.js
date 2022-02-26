import * as TH from "./tree_helper.js"
import fs from 'fs';

const EDGELIST_FILE = "./logs/edgelist2.json";
const NUM_NODES = 50;
const ENCODING = "utf8";

// an Edge is just a node that has an id together with a parent id: 
// edge = { id, pid }
/** @type Edge[] */
let edges;

// create new or load from file
if(0) {
    edges = TH.CreateEdges(NUM_NODES);
    let json = JSON.stringify(edges, null, 2);
    fs.writeFileSync(EDGELIST_FILE, json, {encoding: ENCODING});
}
else {
    let json = fs.readFileSync(EDGELIST_FILE, ENCODING);
    edges = JSON.parse(json);
}

// now each edge gets children and a parent
// only the edge with pid == -1 gets returned since it's root
let tree = TH.TreeFromEdges(edges);

// depth preorder (stack-based)
console.log("\nlevel order traversal (id, pid = parent id)");
TH.traverse(tree, (v,i,a) => {
    let indent = "  ".repeat(v.depth);
    console.log(`${indent}(${v.id}, ${v.pid})`);
});

// breadth first with accu
let accu = TH.traverse(tree, (v,i,a)=>{
    a.push(v.id);
});
console.log("\nlevel order traversal with accu\n" + accu.join(", "));

// depth first
console.log("\ndepth first");

// this adds nested set entries { lft, rgt } to edges
// rgt - lft is the number of sub entries
TH.traversePrePost(tree, (v,i,a)=>{ v.lft = i; }, (v,i,a)=>{ v.rgt = i; });

TH.traversePrePost(tree, (v, i, a) => {
    console.log(`${v.id}: (${v.lft}, ${v.rgt}), path: /${a.map(n=>n.id).join("/")}`);
});

// after edges being decorated with { lft, rgt } it's easy to find
// the sub entries of an egde, examples here are edge[7] and edge[17]
console.log(`\nFind subs of entry 7:`);
const findSubs = (edges, row) => edges.filter((edge) =>
    edge.lft > edges[row].lft && edge.rgt <= edges[row].rgt
);
console.log("edge[7] subs: " + findSubs(edges, 7).map((sub) => sub.id).join(", "));
console.log("edge[17] subs: " + findSubs(edges, 17).map((sub) => sub.id).join(", "));

