﻿function cleanString(str) {
    // Xóa tất cả các dấu câu
    let cleanedStr = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    // Chuyển đổi chữ thành chữ thường
    cleanedStr = cleanedStr.toLowerCase();
    return cleanedStr;
}

class TrieNode {
    constructor() {
        this.children = {};
        this.sentences = [];
    }
}

class TrieTree {
    constructor() {
        this.root = new TrieNode();
    }

    insert(sentence, transaction) {
        const words = cleanString(sentence).split(' ').filter(word => word.length > 0);
        for (let i = 0; i < words.length; i++) {
            let node = this.root;
            for (let j = i; j < words.length; j++) {
                const word = words[j];
                if (!node.children[word]) {
                    node.children[word] = new TrieNode();
                }
                node = node.children[word];
                node.sentences.push(transaction);
            }
        }
    }

    search(substring) {
        const words = cleanString(substring).split(' ').filter(word => word.length > 0);
        console.log(words);
        let node = this.root;
        for (const word of words) {
            if (!node.children[word]) {
                console.log("Not found word!");
                return [];
            }
            node = node.children[word];
        }
        return node.sentences;
    }
}

module.exports = TrieTree;