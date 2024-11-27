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

class BPlusTreeNode {
    constructor(order, isLeaf = false) {
        this.order = order; // Số lượng con tối đa của một node
        this.isLeaf = isLeaf; // true nếu là leaf node
        this.keys = []; // Các key (có thể trùng)
        this.children = []; // Các giá trị (leaf node) hoặc con (internal node)
    }

    isFull() {
        return this.keys.length >= this.order - 1; // Số key tối đa = order - 1
    }
}

class BPlusTree {
    constructor(order) {
        if (order < 3) {
            throw new Error("Order phải lớn hơn hoặc bằng 3.");
        }
        this.order = order;
        this.root = new BPlusTreeNode(order, true); // Bắt đầu với một node leaf rỗng
    }

    insert(key, value) {
        const root = this.root;

        // Nếu root đầy, split
        if (root.isFull()) {
            const newRoot = new BPlusTreeNode(this.order);
            newRoot.children.push(this.root); // Gốc cũ trở thành con của gốc mới
            this.splitChild(newRoot, 0); // Split root
            this.root = newRoot; // Cập nhật root
        }

        // Thêm key và value vào đúng vị trí
        this.insertNonFull(this.root, key, value);
    }

    insertNonFull(node, key, value) {
        if (node.isLeaf) {
            // Tìm vị trí insert
            const index = this.findInsertPosition(node.keys, key);

            if (isEqual(node.keys[index], key)) {
                // Nếu key đã tồn tại, thêm value vào danh sách
                node.children[index].push(value);
            } else {
                // Thêm key mới và giá trị mới
                node.keys.splice(index, 0, key);
                node.children.splice(index, 0, [value]);
            }
        } else {
            // Tìm con phù hợp để chèn
            const index = this.findInsertPosition(node.keys, key);

            if (node.children[index].isFull()) {
                // Nếu con đầy, split trước khi chèn
                this.splitChild(node, index);
                if (key > node.keys[index]) {
                    index++;
                }
            }

            // Đệ quy chèn vào con
            this.insertNonFull(node.children[index], key, value);
        }
    }

    splitChild(parent, index) {
        const nodeToSplit = parent.children[index];
        const midIndex = Math.floor((this.order - 1) / 2);

        // Tạo node mới cho phần bên phải
        const newNode = new BPlusTreeNode(this.order, nodeToSplit.isLeaf);

        // Chuyển key và children sang node mới
        newNode.keys = nodeToSplit.keys.splice(midIndex + 1);
        if (nodeToSplit.isLeaf) {
            newNode.children = nodeToSplit.children.splice(midIndex + 1);
            // Liên kết leaf nodes
            newNode.children[newNode.children.length] = nodeToSplit.children[nodeToSplit.children.length];
            nodeToSplit.children[nodeToSplit.children.length] = newNode;
        } else {
            newNode.children = nodeToSplit.children.splice(midIndex + 1);
        }

        // Thêm key giữa vào parent
        parent.keys.splice(index, 0, nodeToSplit.keys[midIndex]);
        parent.children.splice(index + 1, 0, newNode);

        // Loại bỏ key giữa khỏi node bị split
        nodeToSplit.keys.splice(midIndex);
    }

    findInsertPosition(keys, key) {
        let i = 0;
        while (i < keys.length && keys[i] < key) {
            i++;
        }
        return i;
    }

    search(key) {
        let node = this.root;

        // Traverse until we reach a leaf node
        while (!node.isLeaf) {
            let i = this.findInsertPosition(node.keys, key);
            node = node.children[i];
        }

        // At a leaf node, find the key
        const index = node.keys.findIndex((k) => isEqual(k, key));
        if (index !== -1) {
            return node.children[index]; // Return all values for the key
        }

        return null; // Key not found
    }

    // Hàm in cây (debug)
    print(node = this.root, level = 0) {
        console.log("Level", level, "Keys:", node.keys);
        if (node.isLeaf) {
            console.log("Values:", node.children);
        }
        if (!node.isLeaf) {
            for (let child of node.children) {
                this.print(child, level + 1);
            }
        }
    }
}


module.exports = BPlusTree;