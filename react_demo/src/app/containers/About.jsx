import Test from '../components/test';
import pic1 from '../images/pic1.png';

export default React.createClass({
    componentDidMount(){
        app.index.consolel();
        app.about.about();
    },
    handleClick(){
        app.about.changeImg();
    },
	render() {
    	return (
    		<div>
    			<div>
    				<img src={pic1} onClick={this.handleClick} id="aboutImg"></img>
    			</div>
    			<h1>Hello test</h1>
    			<Test/>	
    		</div>
    	);
  	}
});

