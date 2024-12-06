function isEqual(value1, value2) {

    // Check if both values are Date objects
    if (value1 instanceof Date && value2 instanceof Date) {
        return value1.getTime() === value2.getTime();
    }

    // Check if both values are numbers
    if (typeof value1 === 'number' && typeof value2 === 'number') {
        return value1 === value2;
    }

    // Check if both values are strings
    if (typeof value1 === 'string' && typeof value2 === 'string') {
        return value1 === value2;
    }

    // If types are different or not handled, return false
    return false;
}

class AVLNode {
    constructor(key, value) {
        this.key = key;
        this.values = [value]; // Support multiple values for the same key
        this.height = 1;
        this.left = null;
        this.right = null;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    // Helper to get height of a node
    getHeight(node) {
        return node ? node.height : 0;
    }

    // Helper to get balance factor
    getBalanceFactor(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    // Rotate Right
    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        // Update heights
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        return x; // New root
    }

    // Rotate Left
    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        // Update heights
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y; // New root
    }

    // Insert key-value pair into the AVL Tree
    insert(root, key, value) {
        // Perform normal BST insert
        if (!root) return new AVLNode(key, value);

        if (key < root.key) {
            root.left = this.insert(root.left, key, value);
        } else if (key > root.key) {
            root.right = this.insert(root.right, key, value);
        } else {
            // If the key already exists, add the value to the values array
            root.values.push(value);
            return root;
        }

        // Update height of this ancestor node
        root.height = Math.max(this.getHeight(root.left), this.getHeight(root.right)) + 1;

        // Get balance factor
        const balance = this.getBalanceFactor(root);

        // Rotate if unbalanced
        // Left Left Case
        if (balance > 1 && key < root.left.key) {
            return this.rotateRight(root);
        }
        // Right Right Case
        if (balance < -1 && key > root.right.key) {
            return this.rotateLeft(root);
        }
        // Left Right Case
        if (balance > 1 && key > root.left.key) {
            root.left = this.rotateLeft(root.left);
            return this.rotateRight(root);
        }
        // Right Left Case
        if (balance < -1 && key < root.right.key) {
            root.right = this.rotateRight(root.right);
            return this.rotateLeft(root);
        }

        return root; // Return unchanged root
    }

    // Public method to insert a key-value pair
    insertKeyValue(key, value) {
        this.root = this.insert(this.root, key, value);
    }

    // Search for a key and return its values
    search(root, key) {
        if (!root) return [];
        if (isEqual(key, root.key)) return root.values;
        if (key < root.key) return this.search(root.left, key);
        return this.search(root.right, key);
    }

    // Public search method
    searchKey(key) {
        return this.search(this.root, key);
    }

    // Range search: Find all values in the range [minKey, maxKey]
    rangeSearch(root, minKey, maxKey, result = []) {
        if (!root) return result;

        // Traverse left subtree if there's a chance of smaller keys in range
        if (minKey < root.key) {
            this.rangeSearch(root.left, minKey, maxKey, result);
        }

        // Add node values if the key is within range
        if ((minKey < root.key || isEqual(minKey, root.key)) && (root.key < maxKey || isEqual(maxKey, root.key))) {
            result.push(...root.values);
        }

        // Traverse right subtree if there's a chance of larger keys in range
        if (maxKey > root.key) {
            this.rangeSearch(root.right, minKey, maxKey, result);
        }

        return result;
    }

    // Public range search method
    rangeSearchKeys(minKey, maxKey) {
        return this.rangeSearch(this.root, minKey, maxKey);
    }
}

module.exports = AVLTree;