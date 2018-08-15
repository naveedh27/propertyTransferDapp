import React,{Component} from 'react';

export default class Menu extends Component {

    state = {
        value: 0,
      };
    
      handleChange = (event, value) => {
        this.setState({ value });
      };

      
    render(){
        return(
           <p>Footer</p>
        );
    }
    
} 