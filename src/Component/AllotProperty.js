import React, { Component } from 'react';

import NavigationMenu from './NavigationMenu'

export default class AllotProperty extends Component {




    // handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {

        return (
            <React.Fragment>
                <NavigationMenu path={this.props.location.pathname} />
                <p>Allot Property</p>
            </React.Fragment>
        );
    }

} 