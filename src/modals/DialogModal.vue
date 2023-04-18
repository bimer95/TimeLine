<template>
  <div v-if="isOpen" class="wrapper">
    <div class="dialog">
      <div class="dialog__header">
        <h2>{{ mediaBlockToEdit ? "Edit Media Block" : "Add Media Block" }}</h2>
      </div>
      <div class="dialog__content">
        <div class="dialog__field">
          <label for="name">Name:</label>
          <input id="name" class="dialog__input" type="text" v-model="dialogModel.name">
        </div>
        <div class="dialog__field">
          <label for="duration">Duration (seconds):</label>
          <input id="duration" class="dialog__input" type="number" ref="durationInput" min="1" max="7200" v-model="dialogModel.duration">
        </div>
        <div class="dialog__field">
          <label for="startTime">Start Time:</label>
          <date-picker class="timeline-header__picker" v-model="dialogModel.startTime" :item="datePlaceholder" />
        </div>
        <div class="dialog__field">
          <label for="color">Media Block Color:</label>
          <input id="color" class="dialog__input" type="color" v-model="dialogModel.color">
        </div>
      </div>
      <div class="dialog__footer">
        <button class="dialog__btn" @click="close">Close</button>
        <button class="dialog__btn" @click="add">{{ mediaBlockToEdit ? "Update" : "Add" }}</button>
      </div>
    </div>
    <error-modal
      v-model:isOpen="isErrorModalOpen"
      :errorMessage="errorModalMessage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from "vue";
import DatePicker from "@/components/DatePicker.vue";
import store from "@/store";
import { MediaBlock as IMediaBlock } from "../store/mediaBlock";
import ErrorModal from "@/modals/ErrorModal.vue";
import { formatDate } from "@/utils/dateHelpers";

export default defineComponent({
  components: {
    DatePicker,
    ErrorModal,
  },
  props: {
    isOpen: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    mediaBlockToEdit: {
      type: Object as PropType<IMediaBlock | null>,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      dialogModel: {
        name: "",
        duration: 0,
        startTime: 0,
        color: "",
      },
      isErrorModalOpen: false,
      errorModalMessage: "",
    };
  },
  emits: ["update:isOpen", "updated"],
  mounted() {
    watch(
        () => this.mediaBlockToEdit,
        (newVal) => {
          if (newVal) {
            this.dialogModel = {
              ...newVal,
              name: newVal.name || "",
              duration: newVal.duration || 0,
              startTime: newVal.startTime || 0,
              color: newVal.color || "",
            };
          }
        },
        { immediate: true }
    );
  },
  computed: {
    datePlaceholder(): string {
      const date = new Date(this.dialogModel.startTime).setHours(0, 0, 0, 0);
      return formatDate(new Date(date));
    },
  },
  methods: {
    add() {
      if (this.dialogModel.duration > 7200) {
        this.isErrorModalOpen = true;
        this.errorModalMessage = "Duration cannot be more than 7200 seconds";
        return;
      }

      this.dialogModel.startTime = new Date(this.dialogModel.startTime).getTime();
      const endTime = this.dialogModel.startTime + this.dialogModel.duration * 1000;

      if (!this.mediaBlockToEdit && this.isTimeOverlap(this.dialogModel.startTime, this.dialogModel.startTime, endTime)) {
        this.isErrorModalOpen = true;
        this.errorModalMessage = "Time is busy";
        return;
      }

      if (this.mediaBlockToEdit) {
        store.dispatch("updateMediaBlock", this.dialogModel);
      } else {
        store.dispatch("addMediaBlock", this.dialogModel);
      }
      this.$emit("updated");
      store.dispatch("closeModal");
      this.dialogModel = {
        name: "",
        duration: 0,
        startTime: 0,
        color: "",
      };
    },
    close() {
      store.dispatch("closeModal");
    },
    isTimeOverlap(newBlockStartTime: number, start: number, end: number) {
      const visibleMediaBlocks = store.getters.visibleMediaBlocks(start, end);
      return visibleMediaBlocks.some((block: IMediaBlock) => {
        const blockEndTime = block.startTime + block.duration * 1000;
        return (newBlockStartTime >= block.startTime && newBlockStartTime < blockEndTime) ||
            (end > block.startTime && end <= blockEndTime);
      });
    }
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
  max-width: 500px;
  padding: 20px;
}

.dialog__header {
  margin-bottom: 15px;
}

.dialog__input {
  border-radius: 10px;
  padding: 5px 5px;
  border: 2px solid #63adf3;

}

.dialog__header h2 {
  margin: 0;
  font-size: 24px;
}

.dialog__content {
  margin-bottom: 20px;
}

.dialog__field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.dialog__field label {
  font-weight: 600;
}

.dialog__footer {
  display: flex;
  justify-content: space-between;
}

.dialog__btn {
  background-color: #63adf3;
  color: #ffffff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.dialog__btn:hover {
  background-color: #4093c6;
}
</style>
