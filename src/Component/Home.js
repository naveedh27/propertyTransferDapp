import React,{Component} from 'react';

export default class Home extends Component {

    state = {
        value: 0,
      };
    
     

      
    render(){
        console.log(this.props.location);
        return(
           <p>Body</p>
        );
    }
    
} 