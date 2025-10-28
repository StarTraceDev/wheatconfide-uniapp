<template>
	<view style="padding: 30rpx;">
		<rich-text :nodes="content"></rich-text>
	</view>
</template>

<script setup> 
	import { ref } from 'vue';
	import {onLoad} from '@dcloudio/uni-app'
	import {articleByType} from '@/common/api/apis.js'
	const type = ref('')
	const content = ref('')
	onLoad((e)=>{
		type.value = e.type
		getAgreementByType()
	})
	
	const getAgreementByType =async ()=>{
		if(type.value=='隐私政策'){
			uni.setNavigationBarTitle({
				title:"隐私政策"
			})
			let resp = await  articleByType({title:"麦苗倾诉隐私协议"})
			console.log(resp);
			content.value = resp.data.content
		}else{
			uni.setNavigationBarTitle({
				title:"用户协议"
			})
			let resp = await articleByType({title:'麦苗倾诉用户协议'})
			console.log('用户协议',resp);
			content.value = resp.data.content
		}
	}
</script>

<style>

</style>
