<template>
  <view style="padding: 30rpx">
    <rich-text :nodes="content"></rich-text>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { articleByType } from "@/common/api/apis.js";
const type = ref("");
const content = ref("");
onLoad((e) => {
  type.value = e.type;
  getAgreementByType();
});

const getAgreementByType = async () => {
	uni.setNavigationBarTitle({ title: type.value });
  try {
		const queryParams = {
        current: 1,
        size: 10,
        title: type.value,
      }
		let { data } = await articleByType(queryParams);
    content.value = data.records[0].content;
	} catch (error) {
		console.log(error);
	}
};
</script>

<style></style>
