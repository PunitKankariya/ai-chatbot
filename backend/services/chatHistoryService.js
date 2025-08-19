class ChatHistoryService {
  constructor() {
    this.store = new Map(); // sessionId → history
  }

  getHistory(id) {
    return this.store.get(id) || [];
  }

  addMessage(id, role, content) {
    const history = this.getHistory(id);
    history.push({ role, content });
    this.store.set(id, history);
  }

  clearHistory(id) {
    this.store.delete(id);
  }
}

export const chatHistoryService = new ChatHistoryService();
