"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPlugin = void 0;
/**
 * Plugin che utilizza come Cache una variabile salvata in memoria.
 */
class InMemoryPlugin {
    constructor() {
        this.memory = new Map();
    }
    has(key) {
        return this.memory.has(key);
    }
    get(key) {
        return this.memory.get(key);
    }
    add(key, value) {
        try {
            this.memory.set(key, value);
            return true;
        }
        catch (er) {
            return false;
        }
    }
    remove(key) {
        try {
            this.memory.delete(key);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    flush() {
        this.memory.clear();
        return true;
    }
}
exports.InMemoryPlugin = InMemoryPlugin;
