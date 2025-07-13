class Timers {
  #timersMap = new Map();

  startTimer(callback, time) {
    const id = setInterval(callback, time * 1000 * 60);

    this.#timersMap.set(id, id);
  }

  clearTimerById(id) {
    const timer = this.#timersMap.get(id);

    clearInterval(id);

    this.#timersMap.delete(id);
  }

  clearAllTimers() {
    Object.values(this.#timersMap).forEach((id) => {
      clearInterval(id);
    });
    this.#timersMap.clear();
  }
}
