var getType = param => Object.prototype.toString.call(param);
const parser = new DOMParser();

function traverseDOM(rootNode, elementCB, includeRoot=false) {
    let stack = [rootNode];
    while (stack.length) {
        let elem = stack.pop();
        for(let child of Array.from(elem.children).reverse()) {
            stack.push(child);
        }
        elementCB(elem);
    }
}

if(null) {
    const xmlString = "<warning>Beware of the tiger</warning>";
    const doc1 = parser.parseFromString(xmlString, "application/xml");
    // XMLDocument

    console.log(doc1.documentElement.textContent)
    // "Beware of the tiger"
}

if (null) {
    const htmlString = "<strong>Beware of the leopard</strong>";
    const doc3 = parser.parseFromString(htmlString, "text/html");
    // HTMLDocument
    
    
    console.log(doc3.body.firstChild.textContent);
    // "Beware of the leopard"
}

const svgString = `
<g class="piece">
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

// XMLDocument
const doc2 = parser.parseFromString(svgString, "image/svg+xml");

const errorNode = doc2.querySelector('parsererror');
if (errorNode) {
  console.log(errorNode.innerText);
} else {
  // parsing succeeded
  traverseDOM(doc2.documentElement, (node) => {
    let out = `${node.tagName} ${getType(node)}`;

    console.log(out);
  });
}

