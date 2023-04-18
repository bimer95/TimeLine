<template>
  <div v-if="isOpen" class="modal">
    <div class="modal__content">
      <div class="modal__header">
        <slot name="header">Confirmation</slot>
      </div>
      <div class="modal__body">
        <slot name="body">Are you sure you want to delete this media block?</slot>
      </div>
      <div class="modal__footer">
        <button class="modal__button" @click="confirm">Yes</button>
        <button class="modal__button" @click="cancel">No</button>
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
      default: false,
    },
  },
  emits: ["confirm", "cancel"],
  setup(_, { emit }) {
    const confirm = () => {
      emit("confirm");
    };
    const cancel = () => {
      emit("cancel");
    };
    return { confirm, cancel };
  },
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal__content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  color: #333333;
  max-width: 400px;
}
.modal__header,
.modal__body,
.modal__footer {
  margin-bottom: 20px;
}
.modal__button {
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}
.modal__button:hover {
  background-color: #0056b3;
}
</style>
