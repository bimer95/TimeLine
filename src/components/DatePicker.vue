<template>
  <div class="date-picker-wrapper">
    <VuePicDatepicker v-model="modelValue" :placeholder="item" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import VuePicDatepicker from "@vuepic/vue-datepicker";
import '@vuepic/vue-datepicker/dist/main.css'

export default defineComponent({
  name: "DatePicker",
  components: {
    VuePicDatepicker,
  },
  props: {
    placeholder: {
      type: String,
      default: 'Placeholder'
    },
    item: {
      type: String,
      default: ''
    }
  },
  emits: ["update:modelValue", "selectedDate"],
  setup(_, context) {
    const modelValue = ref('');

    watch(modelValue, (newValue) => {
      if (!isNaN(Date.parse(newValue))) {
        context.emit('update:modelValue', newValue);
      }
    });

    return {
      modelValue,
    };
  },
});
</script>
