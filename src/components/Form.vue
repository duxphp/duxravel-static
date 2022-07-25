<template>
  <a-form
    ref="formRef"
    @submit="submit"
    @submit-failed="submitError"
    :model="value"
    @submit-success="submitSuccess"
    :rules="rules"
    :layout="layout"
    label-align="left"
  >
    <slot :value="value" :submitStatus="submitStatus"></slot>
  </a-form>
</template>
<script>
import { defineComponent, ref, nextTick, getCurrentInstance, watch } from "vue";
import { getUrl, request } from "../utils/request";
import { getPageContent } from "./table/DataTable";

export default defineComponent({
  components: {},
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
    back: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    layout: {
      type: String,
      default: "horizontal",
    },
  },
  setup(props, context) {
    const formRef = ref(null);
    const rules = ref({});
    const that = getCurrentInstance();
    const submitStatus = ref(false);
    const validatorStatus = ref(true);

    const submitSuccess = () => {
      validatorStatus.value = false;
    };
    const submitError = () => {
      validatorStatus.value = true;
    };
    const submit = (data, e) => {
      if (submitStatus.value || validatorStatus.value) {
        return false;
      }
      submitStatus.value = true;
      const page = getPageContent(that.proxy.$parent);
      request({
        url: getUrl(props.url),
        method: props.method,
        data: props.value,
        successMsg: true,
        header: {
          ...(page ? { "x-dialog": "1" } : {}),
        },
      })
        .then(() => {
          if (page && props.back) {
            page.changeRouter(1, "back");
          }
          submitStatus.value = false;
        })
        .catch((err) => {
          submitStatus.value = false;
          if (err.status === 422) {
            const data = err.data.error;
            const fields = {};
            for (const key in data) {
              if (Object.hasOwnProperty.call(data, key)) {
                fields[key] = {
                  status: "error",
                  message: data[key][0],
                };
              }
            }
            formRef.value.setFields(fields);
          }
        });
    };
    return {
      formRef,
      rules,
      submit,
      submitError,
      submitSuccess,
      submitStatus,
    };
  },
});
</script>
