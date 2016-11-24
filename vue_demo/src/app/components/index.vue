<template>
	<div class='index-page'>
		<div class='index-page-list'>
			<div v-for='(n,i) in data' class="page-list-item" @click='handleLink({id:n.id})'>
				<div class="item-pic">
					<img class='pic' :src='n.cover_url' />
				</div>
				<div class="item-info">
					<div class="info-left">
						<div class="info-left-title">{{n.title}}</div>
						<div class="info-left-subtitle">{{n.start_date}} {{n.city}}</div>
					</div>
					<div class="info-right">
						<div class="info-right-price">¥{{n.price}}／人</div>
						<div class="info-right-num">名额仅剩：{{n.last_num}}</div>
					</div>
				</div>
				<div class="item-avatar">
					<div class="item-avatar-box"
						 v-for="(n2,i2) in n.user"
						 :style='{left:i2*(-5)+"px"}'
					>
						<img :src='n2' v-if='i2<8'/>
						<div v-else class="avatar-num">+{{n.user_legth}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type='text/babel'>
	import {Indicator} from 'mint-ui';
	export default{
		name:'index',
		data(){
			return{
				data:null,
			}
		},
		watch:{
			'$route'(to,from){
				var id=this.$route.params.id;
				this.fetchData(id)
			}
		},
		methods:{
			fetchData(id){
				Indicator.open({
					text:'加载中...',
					spinnerType:'fading-circle'
				})
				this.$http.get(`/api/${id}`).then(res=>{
					if(res.data.iRet==1){
						let result=res.data.data;
						result.forEach((n,i)=>{
							n.user_legth=n.user.length;
							let userArr=[];
							n.user.forEach((n2,i2)=>{
								if(i2<9){
									userArr.push(n2);
								}
							});
							n.user=userArr;
						});
						this.data=result;
					}else{

					}
					Indicator.close();
				},(res)=>{
					Indicator.close();
				})
			},
			handleLink(e){
				this.$router.push({
					name:'detail',
					params:{
						id:e.id
					}
				})
			},
		},
		created(){
			var id=this.$route.params.id;
			this.fetchData(id);
		}
	}
</script>

<style>
	.index-page{
		padding-top:45px;
	}
	.index-page-list{
		padding:10px;
	}
	.page-list-item{
		position:realtive;
		width:100%;
		box-shadow:0 4px 10px rgba(255,107,83,.06);
		margin-bottom:15px;
		border-radius:6px;
	}
	.item-pic{
		padding-bottom:53%;
		height:0;
		overflow:hidden;
	}
	.item-pic img{
		width:100%;
		height:auto;
		border-top-left-radius:6px;
		border-top-right-radius:6px;
	}
	.item-info{
		padding:12px 10px;
		display:flex;
		justify-content:space-between;
	}
	.info-left{
		flex:0 0 72%;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.info-right{
		flex:0 0 28%;
		text-align:right;
	}
	.info-left-title{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		color:#333;
		font-size:13px;
		margin-bottom:5px;
	}
	.info-left-subtitle{
		font-size:12px;
		color:#333;
	}
	.info-right-price{
		color:#fe593f;
		font-size:14px;
		margin-bottom:5px;
	}
	.info-right-num{
		color:#666;
		font-size:9px;
	}
	.item-avatar{
		display:flex;
		width:250px;
		text-align:center;
		align-items:center;
		//justify-content:space-between;
		padding:12px 0;
		padding-left:10px;
	}
	.item-avatar-box{
		width:30px;
		height:30px;
		overflow:hidden;
		position:relative;
		left:-5px;
	}
	.item-avatar-box:first-child{
		left:0;
	}
	.item-avatar-box img{
		width:100%;
		height:100%;
		border-radius:50%;
		border:1px solid #fff;
	}
	.avatar-num{
		width:100%;
		height:100%;
		border-radius:50%;
		border:1px solid #fff;
		background:#16c2af;
		color:#fff;
		text-align:center;
		line-height:30px;
		font-size:12px;
	}
</style>