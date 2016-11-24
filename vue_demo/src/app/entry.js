import Index from './components/index';
import About from './components/about';
import App from'./App';
import Detail from './components/detail';

import {Button} from 'mint-ui';
Vue.component(Button.name,Button);


const router=new VueRouter({
	mode:'history',
	routes:[
		{
			name:'index',
			path:'/admin/:id',
			component:Index
		},
		{
			name:'about',
			path:'/admin/about',
			component:About
		},{
			name:'detail',
			path:'/admin/detail/:id',
			component:Detail,
		}

	]
});

const app=new Vue({
	router,
	el:'#root',
	render:h=>h(App)
});
// const app=new Vue({
// 	router
// }).$mount('#root')
