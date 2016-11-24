<template>
	<div id='app'>
		<div class="common-header-nav">
			<div class="header-nav-left">
				<div
					v-for="(n,i) in months"
					v-bind:class='{active:n.active,"nav-left-item":true}'
					@click="handleLink({month:n.month,year:n.year})"
				>
					{{n.month}}月
					<div v-if='n.active' class="bottom-line"></div>
				</div>
				<div class="nav-line"></div>
			</div>
			<div class="header-nav-right"><i class="haloIcon haloIcon-user-single"></i></div>
		</div>
		<router-view></router-view>	
	</div>
</template>

<script type="text/babel">
	export default{
		name:'App',
		data(){
			return{
				data:{
					name:'shenbin'
				},
				months:[],
			}
		},
		methods:{
			getMonths(){
				let currentMonth=new Date().getMonth()+1;
				let currentYear=new Date().getFullYear();
				let monthArr=[];
				for(let i=0;i<5;i++){
					monthArr.push({
						month:currentMonth+i,
						year:currentYear,
						active:false,
					});

					if(monthArr[i].month>12){
						monthArr[i].month=monthArr[i].month-12;
						monthArr[i].year=monthArr[i].year+1;
					}

					if(monthArr[i].month<10){
						monthArr[i].month='0'+monthArr[i].month;
					}
					monthArr[0].active=true;
				}
				this.months=monthArr;
			},
			handleLink(e){
				this.months.forEach((n,i)=>{
					if(n.year==e.year && n.month==e.month){
						n.active=true
					}else{
						n.active=false
					}
				});
				this.$router.push({
					name:'index',params:{id:`${e.year}${e.month}`}
				});
			},
			initLink(){
				this.$router.push({
					name:'index',
					params:{id:`${this.months[0].year}${this.months[0].month}`}
				})
			}
		},
		created(){
			var id=this.$route.params.id;
			this.getMonths();
			this.initLink();
		}
	}
</script>

<style>
	.common-header-nav{
		background: #fff;
		position: fixed;
		top:0;
		left:0;
		width:100%;
		box-shadow: 0 2px 5px rgba(255,107,83,.06);
		height:45px;
		justify-content: center;
		align-items: center;
		display:flex;
		z-index:10;
	}
	.header-nav-left{
		flex: 0 0 85%;
		display:flex;
		align-items:center;
		justify-content:center;
		height:45px;
		position:relative;
	}
	.header-nav-right{
		flex:0 0 15%;
		text-align:center;
		color:#fe593f;
	}
	.header-nav-right .haloIcon{
		font-size:20px;
	}
	.nav-left-item{
		width:20%;
		text-align:center;
		height:45px;
		line-height:45px;
		color:rgba(254,89,63,.5);
		position:relative;
	}
	.nav-left-item.active{
		color:#fe593f;
	}
	.bottom-line{
		width:30px;
		height:2px;
		background:#fe593f;
		position:absolute;
		bottom:0;
		left:50%;
		transform:translateX(-50%);
	}
	.nav-line{
		position:absolute;
		right:0;
		top:0;
		height:40%;
		width:1px;
		background:rgba(254,89,63,.5);
		top:50%;
		transform:translateY(-50%);
	}
</style>