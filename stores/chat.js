// stores/chat.js
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    isChatOpen: false
  }),
  actions: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen
    }
  }
})