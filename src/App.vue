<template>
  <div class="app" id="app">
    <Timeline />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Timeline from "./components/TimeLine.vue";
import { MediaBlock } from "@/store/mediaBlock";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    Timeline,
  },
  setup() {
    const mediaBlocks = ref([] as MediaBlock[]);
    const store = useStore();
    store.dispatch("loadMediaBlocks").then((loadedMediaBlocks: MediaBlock[]) => {
      mediaBlocks.value = loadedMediaBlocks;
    }).catch((error) => {
      console.log(error);
    });

    return {
      mediaBlocks,
    };
  },
});
</script>

<style>
.app {
  height: 100vh;
}
</style>
