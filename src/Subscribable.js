class Subscribable {
  constructor() {
    this.store = {};
  }

  subscribe(type, callback) {
    if (!this.store[type]) {
      this.store[type] = [];
    }
    this.store[type].push(callback);
    return () => {
      if (!this.store[type]) {
        return;
      }
      for (let i = 0; i < this.store[type].length; i++) {
        if (this.store[type][i] === callback) {
          this.store[type].splice(i, 1);
          i--;
        }
      }
    }
  }

  broadcast(type, payload = {}) {
    if (this.store[type]) {
      for (let i = 0; i < this.store[type].length; i++) {
        if (this.radioFilter(type, payload)) {
          this.store[type][i](payload);
        }
      }
    }
  }

  unSubscribeAll() {
    this.store = {};
  }

  radioFilter(type, payload) {
    return true;
  }
}

export default Subscribable;