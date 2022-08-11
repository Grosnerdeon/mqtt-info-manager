class LocalStorageService {
    addDataToLocalStorage (key: any, value: any)  {
        localStorage.setItem(key, value);
    }

    getDataToLocalStorage (key: any): any {
        return localStorage.getItem(key);
    }

    removeDataToLocalStorage (key: any) {
        localStorage.removeItem(key);
    }
}

export default new LocalStorageService();