import fs from 'fs';
import Tree, {Node} from '../model/tree.js';

const PATH = process.argv[2] || './';

logFileTree(PATH);

async function logFileTree(directoryPath) {
    const tree = new Tree(directoryPath);

    const addChildren = async (path, node) => {
        try {
            const files = await fs.promises.readdir(path); 
            for (const file of files) {
                const filePath = path + file;
                const stats = await fs.promises.stat(filePath); 
                if (stats.isDirectory()) {
                    const childNode = new Node(file);
                    node.appendChild(childNode);
                    await addChildren(filePath + '/', childNode); 
                } else {
                    node.appendChild(new Node(file));
                }
            }
        } catch (err) {
            console.log('Error processing directory: ' + err);
        }
    };

    await addChildren(directoryPath, tree.root);

    tree.dump();
}