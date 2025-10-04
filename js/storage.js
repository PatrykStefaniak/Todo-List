export class Storage {

    constructor(key) {
        this.key = key;
    }

    get(key) {
        return localStorage.getItem(this.key + '-' + key);
    }

    set(key, value) {
        localStorage.setItem(this.key + '-' + key, value)
    }

    remove(key) {
        localStorage.removeItem(this.key + '-' + key);
    }
}