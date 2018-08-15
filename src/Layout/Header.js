import React, { Component } from 'react';

import { Header } from 'semantic-ui-react'

export default class AppHeader extends Component {

  state = {
    value: 0,
  };

 
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {

    const {activeItem} = this.state;

    return (
        <Header as='h1' content='Property Transfer DApp' style={{ marginTop: `3em` }} textAlign='center' />
    )
  }

} 