import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import Layout from './Layout/Layout'
import Body from './Component/Body'


class App extends Component {
  render() {
    return (
      <Layout>
        <Body />
      </Layout>
    );
  }
}

export default App;
