const parser = new DOMParser();

function traverseDOM(rootNode, elementCB) {
    let stack = [rootNode];
    while (stack.length) {
        let elem = stack.pop();
        for(let child of Array.from(elem.children)) {
            stack.push(child);
        }
        elementCB(elem);
    }
}

const xmlString = "<warning>Beware of the tiger</warning>";
const doc1 = parser.parseFromString(xmlString, "application/xml");
// XMLDocument

const svgString = `
<g>
    <g>
        <circle r="50" cx="100" cy="100" />
        <circle r="30" cx="100" cy="100" />
        <line x1="30" y1="100" x2="100" y2="100" />
    </g>
    <g>
        <rect x="50" y="100" width="100" height="100" />
        <circle r="30" cx="100" cy="100" />
        <circle r="10" cx="100" cy="100" />
    </g>
</g>
`.replace(/[\s\n]*\n[\s\n]*/g, '');
const doc2 = parser.parseFromString(svgString, "image/svg+xml");
// XMLDocument
const errorNode = doc2.querySelector('parsererror');
if (errorNode) {
  console.log(errorNode.innerText);
} else {
  // parsing succeeded
  traverseDOM(doc2.documentElement, (node) => console.log(node.tagName));
}

const htmlString = "<strong>Beware of the leopard</strong>";
const doc3 = parser.parseFromString(htmlString, "text/html");
// HTMLDocument

console.log(doc1.documentElement.textContent)
// "Beware of the tiger"

console.log(doc2.firstChild.tagName);
// "circle"

console.log(doc3.body.firstChild.textContent);
// "Beware of the leopard"
