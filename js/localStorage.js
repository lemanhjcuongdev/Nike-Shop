export function setLocalStorage(key, value) {
    const storage = localStorage.setItem(key, JSON.stringify(value));

    return storage;
}

export function getLocalStorage(key) {
    let storage =
        localStorage.getItem(key) === null
            ? []
            : JSON.parse(localStorage.getItem(key));

    return storage;
}

export function clearLocalStorage(key) {
    localStorage.removeItem(key);
}


