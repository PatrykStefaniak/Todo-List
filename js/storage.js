export class Storage {

    constructor(key) {
        this.key = key;
    }

    get(key) {
        return localStorage.getItem(this.key + '-' + key);
    }

    getObject(key) {
        return JSON.parse(this.get(key));
    }

    set(key, value) {
        localStorage.setItem(this.key + '-' + key, value)
    }

    setObject(key, value) {
        this.set(key, JSON.stringify(value));
    }

    remove(key) {
        localStorage.removeItem(this.key + '-' + key);
    }

    getAll() {
        const results = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            key.startsWith(this.key + '-') && results.push(localStorage.getItem(key));
        }

        return results;
    }
}