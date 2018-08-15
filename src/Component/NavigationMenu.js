import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

export default class NavigationMenu extends Component {

    render() {

        return (
            <Menu pointing secondary>
                <Menu.Item name='home'
                    as={NavLink}
                    to="/"
                    exact
                />
                <Menu.Item
                    name='Allot Property'
                    as={NavLink}
                    to="/allot"
                    exact
                />
            </Menu>
        );
    }

}