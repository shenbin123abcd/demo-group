<template>
	<div>
		about{{data.name}}{{data.age}}
		<mt-button type="primary" size='large'>登录</mt-button>	
	</div>
</template>

<script type='text/babel'>
	export default{
		name:'index',
		data(){
			return{
				data:{
					name:'about',
					age:26
				}
			}
		},
	}
</script>