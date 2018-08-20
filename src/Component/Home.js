import React, { Component } from 'react';
import web3 from '../Util/web3';
import instance from '../Util/web3Helper';
import NavigationMenu from './NavigationMenu';
import { Grid, Header, Dimmer, Loader } from 'semantic-ui-react';



export default class Home extends Component {

    state = {
        name : 'Rob Williams',
        address : '----------------',
        noOfProp : -1,
        isLoading : false
    }

    async componentWillMount(){
        try{
            this.setState({isLoading:true});
            const acc = await web3.eth.getAccounts();
            this.setState({address : acc[0]});
            const noOfProp = await instance.methods.totalNoOfProperty().call();
            this.setState({noOfProp});
        }catch(e){

        }
        this.setState({isLoading:false});
       
    }

    render() {

        return (
            <React.Fragment>
                <NavigationMenu path={this.props.location.pathname} />

                <Dimmer.Dimmable as={Grid} blurring dimmed={this.state.isLoading} style={{ marginTop: '3.7em', marginBottom: '3.7em' }}>
        
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header as='h2' textAlign='center'>
                                Name
                        </Header>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header as='h2' textAlign='center'>
                                {this.state.name}
                        </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header as='h2' textAlign='center'>
                                Eth. Address
                        </Header>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header as='h2' textAlign='center'>
                                {this.state.address}
                        </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header as='h2' textAlign='center'>
                                No. Of Property Owned
                        </Header>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header as='h2' textAlign='center'>
                                {this.state.noOfProp}
                        </Header>
                        </Grid.Column>
                    </Grid.Row>

                    <Dimmer inverted active={this.state.isLoading}>
                        <Loader>Fetching Data...</Loader>
                    </Dimmer>
                </Dimmer.Dimmable>
            </React.Fragment>
        );
    }

} 