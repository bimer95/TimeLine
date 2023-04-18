<template>
  <div v-if="isOpen" class="wrapper">
    <div class="dialog">
      <div class="dialog__header">
        <h2>Error</h2>
      </div>
      <div class="dialog__content">
        <p>{{ errorMessage }}</p>
      </div>
      <div class="dialog__footer">
        <button class="dialog__btn" @click="close">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      required: true,
    },
  },
  emits: ["update:isOpen"],
  methods: {
    close() {
      this.$emit("update:isOpen", false);
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 300px;
  padding: 20px;
}

.dialog__header {
  margin-bottom: 15px;
}

.dialog__header h2 {
  margin: 0;
  font-size: 24px;
  color: #ff4d4d;
}

.dialog__content {
  margin-bottom: 20px;
}

.dialog__content p {
  color: #333;
  font-size: 16px;
  margin: 0;
}

.dialog__footer {
  display: flex;
  justify-content: flex-end;
}

.dialog__btn {
  background-color: #ff4d4d;
  color: #ffffff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.dialog__btn:hover {
  background-color: #cc0000;
}
</style>
