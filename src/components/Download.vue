<template>
  <div v-if="list.length" class="absolute z-10 download">
    <div
      v-for="item in list"
      :key="item.key"
      class="download-item shadow-sm"
      :class="{ loading: !item.total }"
    >
      <div>{{ item.filename }}</div>
      <icon-check-circle-fill v-if="item.type === 'result'" />
      <icon-close-circle-fill v-else-if="item.type === 'error'" />
      <template v-else>
        <a-progress v-if="item.total" :percent="item.loaded / item.total" />
        <a-spin v-else :size="18" />
      </template>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { event } from "../utils/event";

const Download = defineComponent({
  setup() {
    const list = ref([]);

    let key = 0;

    event.add("download-manage-add", () => {
      const data = {
        key: key++
      };
      event.emit("download-manage-add-callback", data.key);
      list.value.push(data);
    });

    event.add("download-manage-update", (data) => {
      let index = list.value.findIndex((v) => v.key === data.key);
      if (data.result || data.error) {
        list.value[index] = {
          ...list.value[index],
          type: data.result ? "result" : "error",
        };
        setTimeout(() => {
          index = list.value.findIndex((v) => v.key === data.key);
          list.value.splice(index, 1);
        }, 2000);
      } else {
        list.value[index] = {
          ...list.value[index],
          ...data,
        };
      }
    });
    return {
      list,
    };
  },
});

export default Download;
</script>
<style scoped>
.download {
  right: 16px;
  bottom: 16px;
}
.download .download-item {
  background-color: #fff;
  border-radius: 4px;
  width: 300px;
  padding: 10px 20px;
  margin-top: 10px;
}
.download .download-item.loading {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.download .download-item :nth-child(1) {
  margin-top: 0;
}
</style>