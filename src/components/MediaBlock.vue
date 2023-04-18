<template>
  <div
    class="media-block"
    @click="selectMediaBlock"
    :style="mediaBlockStyle"
    @mouseover="showTooltip"
    @mouseleave="hideTooltip"
  >
    <div class="media-block__title">{{ truncatedTitle }}</div>
    <div class="media-block__duration">{{ formattedDuration }}</div>
    <div class="media-block__delete-button" @click.stop="openConfirmationModal">
      <span>&times;</span>
    </div>
    <button class="media-block__btn" type="button" @click.stop="editMediaBlock">
      <img
        class="media-block__chang-button"
        src="@/assets/edit.png"
        alt="edit"
      />
    </button>
    <div v-if="isTooltipVisible" class="media-block__tooltip">
      <div class="media-block__tooltip-option">name: {{ mediaBlock.name }}</div>
      <div class="media-block__tooltip-option">duration: {{ mediaBlock.duration }}</div>
      <div class="media-block__tooltip-option">startTime: {{ formattedStartTime }}</div>
    </div>
    <confirmation-modal
        :isOpen="isConfirmationModalOpen"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from "vue";
import { MediaBlock as IMediaBlock } from "../store/mediaBlock";
import ConfirmationModal from "@/modals/ConfirmationModal.vue";

export default defineComponent({
  name: "MediaBlock",
  components: {
    ConfirmationModal,
  },
  props: {
    mediaBlock: {
      type: Object as PropType<IMediaBlock>,
      required: true,
    },
    width: {
      type: String as PropType<string>,
    },
  },
  setup(props, {emit}) {
    const isTooltipVisible = ref(false);
    const isConfirmationModalOpen = ref(false);

    const selectMediaBlock = () => {
      emit("select", props.mediaBlock);
    };

    const mediaBlockStyle = computed(() => ({
      'min-width': props.width,
      backgroundColor: props.mediaBlock.color
    }));

    const showTooltip = () => {
      isTooltipVisible.value = true;
    };

    const hideTooltip = () => {
      isTooltipVisible.value = false;
    };

    const openConfirmationModal = () => {
      isConfirmationModalOpen.value = true;
    };

    const editMediaBlock = () => {
      emit("edit", props.mediaBlock);
    };

    const confirmDelete = () => {
      emit("remove", props.mediaBlock);
      isConfirmationModalOpen.value = false;
    };

    const cancelDelete = () => {
      isConfirmationModalOpen.value = false;
    };

    const truncatedTitle = computed(() => {
      const maxLength = 5;
      if (props.mediaBlock.name.length <= maxLength) {
        return props.mediaBlock.name;
      }
      return props.mediaBlock.name.slice(0, maxLength) + '…';
    });
    const formattedDuration = computed(() => {
      const duration = props.mediaBlock.duration;
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;

      const hourString = hours > 0 ? `${hours}h ` : "";
      const minuteString = `${minutes}m `;
      const secondString = `${seconds}s`;
    return hourString + minuteString + secondString;
  });

    const formattedStartTime = computed(() => {
      const timestamp = props.mediaBlock.startTime;
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    });


return {
      selectMediaBlock,
      mediaBlockStyle,
      showTooltip,
      hideTooltip,
      isTooltipVisible,
      isConfirmationModalOpen,
      openConfirmationModal,
      editMediaBlock,
      confirmDelete,
      cancelDelete,
      truncatedTitle,
      formattedDuration,
      formattedStartTime,
    };
  },
});
</script>

<style lang="scss" scoped>
.media-block {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 42px;
  border-radius: 25px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 2px;
  margin: 3px;
  box-sizing: border-box;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease-in-out;
  &:hover {
    opacity: 0.8;
  }
}

.media-block__duration,.media-block__title {
  font-size: 12px;
  margin-bottom: 5px;
}

.media-block__tooltip {
  position: absolute;
  left: 70px;
  top: 20px;
  transform: translateX(-50%);
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
  z-index: 999;
  display: none;
  opacity: 0.8;
}

.media-block:hover .media-block__tooltip {
  display: block;
}

.media-block__tooltip-option {
  color: black;
  margin-bottom: 5px;
}
.media-block__delete-button {
  position: absolute;
  top: 1px;
  right: 7px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
  line-height: 25px;
  text-align: center;
  color: white;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
}
.media-block__btn {
  display: contents;
}
.media-block__chang-button {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  cursor: pointer;
  border-radius: 20px;
  padding: 3px 3px;
  background-color: white;
  color: white;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: darkgray;
  }
}
</style>
