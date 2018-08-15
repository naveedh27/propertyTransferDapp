import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import Layout from './Layout/Layout'
import RouteHandler from './Component/RouteHandler'


class App extends Component {
  render() {
    return (
      <Layout>
        <RouteHandler />
      </Layout>
    );
  }
}

export default App;
