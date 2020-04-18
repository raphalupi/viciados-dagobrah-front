class LocalStorageHelper {
  constructor() {
    if (!LocalStorageHelper.instance) {
      this.localStorage = window.localStorage;
      this.isLocalStorageAvailable = this._checkIfLocalStorageAvailable();
      if (!this.isLocalStorageAvailable) {
        console.error("Local Storage not available. App won't work properly!");
      }
      LocalStorageHelper.instance = this;
    }

    return LocalStorageHelper.instance;
  }

  clear() {
    if (this.isLocalStorageAvailable) {
      this.localStorage.clear();
    }
  }

  delete(key) {
    if (this.isLocalStorageAvailable) {
      this.localStorage.removeItem(key);
    }
  }

  get(key) {
    let returnValue = null;
    if (this.isLocalStorageAvailable) {
      returnValue = this.localStorage.getItem(key);
    }
    return returnValue;
  }

  has(key) {
    let hasKey = false;
    if (this.isLocalStorageAvailable) {
      hasKey = this.localStorage.getItem(key) !== null;
    }
    return hasKey;
  }

  isAvailable() {
    return this.isLocalStorageAvailable;
  }

  set(key, value) {
    if (this.isLocalStorageAvailable) {
      let valueToStore = value;
      if (typeof value !== "string") {
        valueToStore = JSON.stringify(value);
      }
      this.localStorage.setItem(key, valueToStore);
    }
  }

  _checkIfLocalStorageAvailable() {
    try {
      const x = "__storage_test__";
      this.localStorage.setItem(x, x);
      this.localStorage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === "QuotaExceededError" ||
          // Firefox
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        (this.localStorage && this.localStorage.length !== 0)
      );
    }
  }
}

const instance = new LocalStorageHelper();
Object.freeze(instance);

export default instance;
