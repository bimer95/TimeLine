<template>
  <div class="media-block-list">
    <div class="media-block-list__block">
      <media-block
          v-for="block in mediaBlocksWithWidth"
          :key="block.mediaBlock.id"
          :mediaBlock="block.mediaBlock"
          :width="block.width"
          @remove="deleteMediaBlock"
          @edit="editMediaBlock"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { MediaBlock as IMediaBlock } from "../store/mediaBlock";
import MediaBlock from "./MediaBlock.vue";
import store from "@/store";

export default defineComponent({
  name: "MediaBlockList",
  components: {
    MediaBlock,
  },
  props: {
    mediaBlocks: {
      type: Array as PropType<IMediaBlock[]>,
      required: true,
    },
  },
  emits: ["edit"],
  setup(props, { emit }) {
    const mediaBlocksWithWidth = computed(() => {
      const totalDuration = 24 * 60 * 60;
      const timelineWidth = 100;
      const minWidth = 6;

      return props.mediaBlocks.map((block) => {
        const blockWidthPercentage = Math.max(
            ((block.duration * 3) / totalDuration) * timelineWidth,
            minWidth
        );
        return {
          mediaBlock: block,
          width: `${blockWidthPercentage}%`,
        };
      });
    });

    const deleteMediaBlock = (mediaBlock: IMediaBlock) => {
      store.dispatch("removeMediaBlock", mediaBlock.id);
    };

    const editMediaBlock = (mediaBlock: IMediaBlock) => {
      emit("edit", mediaBlock);
    };

    return {
      mediaBlocksWithWidth,
      deleteMediaBlock,
      editMediaBlock,
    };
  },
});
</script>

<style lang="scss" scoped>
.media-block-list {
  display: flex;
  width: 100%;
  height: 200px;
  background: #f0f0f0;
  overflow-x: scroll;
  &__block {
    display: flex;
    padding-top: 30px;
    padding-bottom: 20px;
    width: 100%;
    height: 70px;
    background-color: white;
    overflow-x: auto;
    overflow-y: unset;
    white-space: nowrap;
  }
}
</style>
