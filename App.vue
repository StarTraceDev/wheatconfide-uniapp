<script>
	import lgen_intercept from '@/uni_modules/lgen-intercept/js_sdk/lgen-intercept.js'
	export default {
		onLaunch: function(e) {
			console.log('App Launch')
			lgen_intercept(e)
		},
		onShow: function() {
			console.log('App Show')
		},

		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			httpImageUrl: "https://odd.dzjob.net/profile/upload"
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>