import Stack from './stack.js';

export default class Tree {
    root;
    constructor(value) {
        this.root = new Node(value);
    }

    addValue(value) {
        const node = new Node(value);
        this.root.appendChild(node);
    }

    dfs(callback) {
        const stack = new Stack();
        const discovered = new Set();
        stack.push(this.root);
        let current;
        while (stack.getSize() > 0) {
            current = stack.pop();
            if (!discovered.has(current)) {
                callback(current);
                discovered.add(current);
            }
            if(current.hasChildNodes()) {
                current.children.forEach(child => {
                    if (!discovered.has(child)) {
                        stack.push(child);
                    }
                });
            }
        }
    }

    findValue(value) {
        let found = null;
        this.dfs(node => {
            if (node.value === value) {
                found = node;
                return;
            }
        });
        return found;
    }

    removeValue(value) {
        const node = this.findValue(value);
        if (!node) return;
        if (node === this.root) {
            this.root = null;
        } else {
            node.parent.removeChild(node);
        }
    }

    dump() {
        const printNode = (node, prefix = '', isLastChild = true) => {
            console.log(prefix + (isLastChild ? '└─ ' : '├─ ') + node.value);
            if (node.hasChildNodes()) {
                const lastIndex = node.children.length - 1;
                node.children.forEach((child, index) => {
                    printNode(child, prefix + (isLastChild ? '    ' : '│   '), index === lastIndex);
                });
            }
        };
        printNode(this.root, '', true);
    }
}

export class Node {
    value;
    parent;
    children = [];
    constructor(value) {
        this.value = value;
    }

    firstChild() {
        return this.children[0];
    }

    lastChild() {
        return this.children[this.children.length - 1];
    }

    hasChildNodes() {
        return this.children.length > 0;
    }

    appendChild(node) {
        node.parent = this;
        this.children.push(node);
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    replaceChild(newNode, oldNode) {
        const index = this.children.indexOf(oldNode);
        if (index > -1) {
            this.children[index] = newNode;
        }

        newNode.parent = this;
    }
}