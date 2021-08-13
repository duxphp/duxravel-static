<template>
  <NForm ref="formRef" @submit="submit" :rules="rules">
    <slot :value="value" :submitStatus="submitStatus"></slot>
  </NForm>
</template>
<script>
import { defineComponent, ref, nextTick, getCurrentInstance } from "vue";
import { NForm } from "naive-ui";
import { request } from "../utils/request";
import { getPageContent } from "./table/DataTable";

export default defineComponent({
  components: {
    NForm,
  },
  props: {
    url: {
      type: String,
      default: window.location.href,
    },
    method: {
      default: "POST",
      validator(value) {
        // 这个值必须匹配下列字符串中的一个
        return ["POST", "GET", "post", "get"].includes(value);
      },
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const formRef = ref(null);
    const rules = ref({});
    const that = getCurrentInstance();
    const submitStatus = ref(false);
    const submit = (e) => {
      e.preventDefault();
      if (submitStatus.value) {
        return;
      }
      const page = getPageContent(that.proxy.$parent);
      submitStatus.value = true;
      request({
        url: props.url,
        method: props.method,
        data: props.value,
        successMsg: true,
        header: {
          ...(page ? { "x-dialog": "1" } : {}),
        },
      })
        .then(() => {
          if (page) {
            page.changeRouter(1, "back");
          }
          submitStatus.value = false;
        })
        .catch((err) => {
          submitStatus.value = false;
          if (err.code === 422) {
            const data = err.data.error;
            for (const key in data) {
              if (Object.hasOwnProperty.call(data, key)) {
                const err = data[key][0];
                data[key] = {
                  validator: () => new Error(err),
                };
              }
            }
            rules.value = data;
            nextTick(() => {
              formRef.value.validate();
            });
          }
        });
    };
    return {
      formRef,
      rules,
      submit,
      submitStatus,
    };
  },
});
</script>
