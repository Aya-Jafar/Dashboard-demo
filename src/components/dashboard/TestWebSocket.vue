<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { MockWebSocket } from "../../services/WebSocketService";

const message = ref("");
const mockSocket = new MockWebSocket("ws://mocksocket.example");

const sendMessage = () => {
  mockSocket.send("Hello from Vue 3!");
};

onMounted(() => {
  mockSocket.connect();
  mockSocket.onmessage((msg) => {
    message.value = msg;
  });
});

onUnmounted(() => {
  mockSocket.close();
});
</script>

<template>
  <div class="container">
    <button @click="sendMessage">Send Message</button>
    <div>{{ message }}</div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
}
button {
  padding: 10px 15px;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>
