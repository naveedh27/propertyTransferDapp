import React, { Component } from 'react';

import { Menu } from 'semantic-ui-react'
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'
import Home from './Home'
import AllotProperty from './AllotProperty';


export default class Body extends Component {

    state = {
        toBeRendered: 0,
        activeItem: 'home'
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })


    render() {

            console.log(this.props)

        const { activeItem } = this.state;

        return (
            <React.Fragment>
                <Menu pointing secondary>
                    <Menu.Item name='home'
                        active={activeItem === 'home'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='messages'
                        active={activeItem === 'messages'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='friends'
                        active={activeItem === 'friends'}
                        onClick={this.handleItemClick}
                    />
                </Menu>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/allot" component={AllotProperty} exact />
                    </Switch>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}