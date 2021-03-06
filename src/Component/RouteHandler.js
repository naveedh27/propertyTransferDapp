import React, { Component } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import Home from './Home'
import AllotProperty from './AllotProperty';
import PropertyDetails from './PropertyDetails';


export default class RouteHandler extends Component {

    render() {

        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/allot" component={AllotProperty} exact />
                    <Route path="/allprops" component={PropertyDetails} exact />
                </Switch>
            </BrowserRouter>
        );
    }
}