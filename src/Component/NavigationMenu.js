import React, { Component } from 'react';
import web3 from '../Util/web3';
import instance from '../Util/web3Helper';
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

export default class NavigationMenu extends Component {

    state = {
        isAdmin : false,
        address : ''
    }
    

    async componentWillMount(){

        const acc = await web3.eth.getAccounts();
        this.setState({ address: acc[0] });

        const adminAddress = await instance.methods.DA().call({
            from: this.state.address
        });

        if(adminAddress === this.state.address){
            this.setState({isAdmin : true});
        }

    }
    
    render() {

        return (
            <Menu pointing secondary>
                <Menu.Item name='home'
                    as={NavLink}
                    to="/"
                    exact
                />
                {   
                    this.state.isAdmin &&
                     <Menu.Item
                        name='Allot Property'
                        as={NavLink}
                        to="/allot"
                        exact
                    /> 
                }
                <Menu.Item
                        name='Property Details'
                        as={NavLink}
                        to="/allprops"
                        exact
                    />
            </Menu>
        );
    }

}