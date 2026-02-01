// hash_table.js
class HashTable {
    constructor(size = 10) {
        this.size = size;
        this.table = Array.from({ length: size }, () => []);
        this.count = 0;
        this.MAX_LOAD_FACTOR = 0.7;
    }

    _hash(key) {
        // Hash function mai bună
        let hash = 0;
        const prime = 31;
        
        for (let i = 0; i < Math.min(key.length, 100); i++) {
            hash = (hash * prime + key.charCodeAt(i)) % this.size;
        }
        return hash;
    }

    // Hash function alternativă (pentru comparație)
    _hash2(key) {
        let hash = 5381;
        for (let i = 0; i < key.length; i++) {
            hash = (hash * 33) ^ key.charCodeAt(i);
        }
        return Math.abs(hash % this.size);
    }

    insert(key, value) {
        const index = this._hash(key);
        
        // Verifică dacă cheia există
        for (let i = 0; i < this.table[index].length; i++) {
            if (this.table[index][i].key === key) {
                this.table[index][i].value = value;
                return { index, status: 'updated' };
            }
        }

        // Inserare nouă
        this.table[index].push({ key, value });
        this.count++;

        // Rehash dacă e necesar
        if (this.loadFactor() > this.MAX_LOAD_FACTOR) {
            const oldSize = this.size;
            this._rehash();
            return { index, status: 'inserted', rehashed: true, oldSize, newSize: this.size };
        }

        return { index, status: 'inserted' };
    }

    get(key) {
        const index = this._hash(key);
        const bucket = this.table[index];
        
        for (const pair of bucket) {
            if (pair.key === key) {
                return { value: pair.value, index };
            }
        }
        
        throw new Error(`Key '${key}' not found`);
    }

    remove(key) {
        const index = this._hash(key);
        const bucket = this.table[index];
        
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                bucket.splice(i, 1);
                this.count--;
                return { success: true, index };
            }
        }
        
        return { success: false };
    }

    loadFactor() {
        return this.count / this.size;
    }

    _rehash() {
        const oldTable = this.table;
        this.size *= 2;
        this.table = Array.from({ length: this.size }, () => []);
        this.count = 0;

        for (const bucket of oldTable) {
            for (const pair of bucket) {
                this.insert(pair.key, pair.value);
            }
        }
    }

    getAllEntries() {
        const entries = [];
        for (let i = 0; i < this.size; i++) {
            if (this.table[i].length > 0) {
                entries.push({
                    index: i,
                    bucket: [...this.table[i]],
                    chainLength: this.table[i].length
                });
            }
        }
        return entries;
    }

    getStats() {
        const chainLengths = [];
        let collisions = 0;
        
        for (const bucket of this.table) {
            chainLengths.push(bucket.length);
            if (bucket.length > 1) {
                collisions += bucket.length - 1;
            }
        }

        return {
            size: this.size,
            count: this.count,
            loadFactor: this.loadFactor(),
            collisions,
            maxChainLength: Math.max(...chainLengths),
            emptyBuckets: chainLengths.filter(len => len === 0).length
        };
    }

    clear() {
        this.table = Array.from({ length: this.size }, () => []);
        this.count = 0;
    }
}

// Export pentru Node.js sau browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HashTable;
}