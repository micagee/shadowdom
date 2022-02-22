const __ = require("../Util/ParamCheck");


if (__DEBUG__) {
    const ObjectTree = require("./ObjectTree");
    var NodePrinter = ObjectTree.NodePrinter;

    function createNode(parent, nodeInfo) {
        // 'parent' is just an object here, so we just add a key and set its value.
        // This has not always to be the case.
        // 'parent' could also be any arbitrary class that is able to 
        // create and add a child node.

        parent[nodeInfo.id] = nodeInfo.hasChildren ? {} : nodeInfo.data

        return parent[nodeInfo.id];
    }
}


/**
  @typedef NodeInfo
  @type {Object}
  @property {string} id
  @property {boolean} hasChildren
  @property {boolean} isLastChild
  @property {*} data
 */

 // CAUTION - this uses a pre-order traveral

/**
 * @typedef CreateNodeCb
 * @type {Function}
 * @param { Node } parent - if !parent, create root, Node can be anything
 * @param { NodeInfo } childNodeInfo - if no parent this isn't used
 * @return { Node }
 * Note that you have not to care about tree structure here
 * all that is left to do is to create a Node from NodeInfo.
 * Also note that its totally up to the user what a created
 * node actually is. It can be 'undefined' if you wish so.
 * But it will reappear as 'parent' argument of the subsequent call
 * if nodeInfo.hasChildren is true.
 */

/**
 * @typedef SkipNodeCb
 * @type {Function}
 * @param { Node } node - currently tested node
 * @return { boolean } - if true, node and its descendants are skipped
 */

/**
 * @typedef TraverseFuncPovider
 * @type {Object}
 * @property {(treeNode: *) => boolean } traverse
 */

/**
  * @typedef ReplicateTreeArgs
  * @type {Object}
  * @property {CreateNodeCb} createNode - creates a node and adds it to parent.
  * @property {SkipNodeCb} skipNode
  * @property {TraverseFuncPovider} container
 */

/**
 * @param {ReplicateTreeArgs} args
 * @return {Object}
 */
function ReplicateTree(args) {
    if (__DEBUG__) {
        if (!__.checkObject(args)) {
            return { error: "ReplicateTree: no argument provided." };
        }
        if (!__.checkObject(args.container)) {
            return { error: "ReplicateTree: no container provided." };
        }
        if (typeof args.createNode !== "function") {
            return { error: "ReplicateTree: no createNode function provided." };
        }
    }

    // createNode has to deal with undefined args (and create the root node)
    // at this point/context we haven't got a parent and also no nodeInfo
    // so we cannot provide it
    // Note: nodes created are completey opaque to ReplicateTree
    // if createNode decides to return nothing this will be ok.
    var root = args.createNode();
    
    // we know that root is last, there is only one root
    var ancestors = [{ node: root, isLast: true }];
    var skipAncestors = [];
    var skipMode = false;

    /** decides wether or not to skip a node given by nodeInfo
     * @param { NodeInfo } nodeInfo
     * @return { boolean }
     */
    function skipNode(nodeInfo) {

        if (nodeInfo.hasChildren) {
            skipAncestors.push(nodeInfo);
            ancestors.push({ isLast: nodeInfo.isLastChild });
        }
        else if (nodeInfo.isLastChild) {
            while (skipAncestors.length && skipAncestors.pop().isLastChild) { }
            while (ancestors.length > 1 && ancestors.pop().isLast) { }
        }
        if (!skipAncestors.length) {
            skipMode = false;
        }
    }

    /** visits traversable
     * @param { NodeInfo } nodeInfo
     * @return { boolean }
     */
    function onNode(nodeInfo) {

        // How to rewrite that? Looks strange, but works.
        if (!!args.skipNode) {
            if (skipMode) {
                skipNode(nodeInfo);
                return;
            }
            else {
                skipMode = args.skipNode(nodeInfo);
                if (skipMode) {
                    skipNode(nodeInfo);
                    return;
                }
            }
        }

        let currentParent = ancestors[ancestors.length - 1].node;

        // create a node from nodeInfo and add it to parent
        let child = args.createNode(currentParent, nodeInfo);

        if (nodeInfo.hasChildren) {
            ancestors.push({
                node: child, // this will be parent in the next call
                isLast: nodeInfo.isLastChild
            });
        }
        else if (nodeInfo.isLastChild) {
            while (ancestors.length && (ancestors.pop()).isLast) { }

            if (!(ancestors.length)) {
                return false;
            }
        }
    }

    args.container.traverse(onNode);

    return root;
}

module.exports = { ReplicateTree };