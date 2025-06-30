
   export function setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error( "Ошибка записи в localStorage" ,e);
        }
    }
    export function getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error("Ошибка получения item ", e);
            return null;
        }
    }
    export function removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error("Ошибка удаления item ", e);
        }
    }
    export function clearStorage()  {
        try {
            localStorage.clear();
        } catch (e) {
            console.error("Ошибка удаления localStorage", e);
        }
    }
export function updateItem(key, updateCallback) {
        try {
            const existingItem = storage.getItem(key);
            if (existingItem) {
                const updatedItem = updateCallback(existingItem);
                storage.setItem(key, updatedItem);
            }
        } catch (e) {
            console.error("Ошибка обновления item" ,e);
        }
    }

