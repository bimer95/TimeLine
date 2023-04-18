<template>
  <div class="timeline">
    <div class="timeline__header">
      <date-picker class="timeline__picker" v-model="selectedDate" :item="formattedSelectedDate" />
      <button class="timeline__button" @click="() => openModal()">Add block</button>
    </div>
    <div class="timeline__content">
      <div class="timeline__start">{{ formattedStartDate }}</div>
      <media-block-list :media-blocks="visibleMediaBlocks" @edit="openModalForEdit"/>
      <div class="timeline__end">{{ formattedEndDate }}</div>
    </div>
    <dialog-modal
      :isOpen="isModalOpen"
      :mediaBlockToEdit="selectedMediaBlock"
      @close="closeModal"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { MediaBlock as IMediaBlock } from "@/store/mediaBlock";
import MediaBlockList from "@/components/MediaBlockList.vue";
import DatePicker from "@/components/DatePicker.vue";
import DialogModal from "@/modals/DialogModal.vue";
import { formatDate } from "@/utils/dateHelpers";

export default defineComponent({
  name: "TimeLine",
  components: {
    DialogModal,
    MediaBlockList,
    DatePicker,
  },
  setup() {
    const store = useStore();
    const selectedDate = ref(new Date());
    const isModalOpen = computed(() => store.getters.isOpen);
    const selectedMediaBlock = ref<IMediaBlock | undefined>(undefined);

    const openModal = (mediaBlockToEdit?: IMediaBlock) => {
      if (mediaBlockToEdit) {
        selectedMediaBlock.value = mediaBlockToEdit;
      } else {
        selectedMediaBlock.value = undefined;
        store.dispatch("resetDialogFields");
      }
      store.dispatch('openModal');
    };
    const openModalForEdit = (mediaBlockToEdit: IMediaBlock) => {
      selectedMediaBlock.value = mediaBlockToEdit;
      openModal(mediaBlockToEdit);
    };

    const closeModal = () => {
      store.dispatch("closeModal");
    };

    const formattedSelectedDate = computed(() => {
      const date = new Date(selectedDate.value).setHours(0, 0, 0, 0);
      return formatDate(new Date(date));
    });

    const visibleMediaBlocks = computed(() => {
      const start = new Date(selectedDate.value).setHours(0, 0, 0, 0);
      const end = new Date(selectedDate.value).setHours(23, 59, 59, 999);
      return store.getters.visibleMediaBlocks(start, end);
    });

    const formattedStartDate = computed(() => {
      const startDate = new Date(selectedDate.value).setHours(0, 0, 0, 0);
      return formatDate(new Date(startDate));
    });

    const formattedEndDate = computed(() => {
      const endDate = new Date(selectedDate.value).setHours(23, 59, 59, 999);
      return formatDate(new Date(endDate));
    });

    return {
      selectedDate,
      visibleMediaBlocks,
      isModalOpen,
      openModal,
      closeModal,
      formattedStartDate,
      formattedEndDate,
      selectedMediaBlock,
      openModalForEdit,
      formattedSelectedDate
    };
  },
});
</script>

<style lang="scss" scoped>
.timeline {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.timeline__header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.timeline__picker {
  margin-right: 10px;
}

.timeline__button {
  background-color: #63adf3;
  color: #ffffff;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.timeline__button:hover {
  background-color: #4093c6;
}

.timeline__content {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  min-height: 40px;
  background-color: #ffffff;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  white-space: nowrap;
}

.timeline__start,
.timeline__end {
  position: absolute;
  top: -20px;
  font-size: 14px;
  color: #333;
}

.timeline__start {
  left: 0;
}

.timeline__end {
  right: 0;
}
</style>
