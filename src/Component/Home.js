import React, { Component } from 'react';

import NavigationMenu from './NavigationMenu';

export default class Home extends Component {

    render() {


        return (
            <React.Fragment>
                <NavigationMenu path={this.props.location.pathname} />
                <p>Body</p>
            </React.Fragment>
        );
    }

} 