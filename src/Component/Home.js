import React, { Component } from 'react';
import web3 from '../Util/web3';
import instance from '../Util/web3Helper';
import NavigationMenu from './NavigationMenu';
import { Grid, Header, Dimmer, Loader, Input, Button } from 'semantic-ui-react';
import '../style/style.css'


export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: 'Rob Williams',
            address: '----------------',
            noOfProp: -1,
            isLoading: false,
            isUpdatingData : false
        }
    }


    async componentWillMount() {
        try {
            this.setState({ isLoading: true });
            const acc = await web3.eth.getAccounts();
            this.setState({ address: acc[0] });
            const noOfPropArr = await instance.methods.getPropertyCountOfAnyAddress().call({
                from: this.state.address
            });
            const name = await instance.methods.nameOfOwners(this.state.address).call();
            this.setState({ name: name, noOfProp: noOfPropArr[1] });

        } catch (e) {

        }
        this.setState({ isLoading: false });

    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    updateName = async() => {
        this.setState({isUpdatingData : true});
        const name = await instance.methods.setNameOfOwners(this.state.name).send({
            from: this.state.address
        });
        console.log(name)
        this.setState({isUpdatingData : false});
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
                        <Grid.Column width={8} style={{textAlign:'center'}}>
                            <Input
                                className = "textbox"
                                value={this.state.name}
                                onChange={this.handleInputChange}
                                name="name" />
                            <Button 
                                circular 
                                onClick = {this.updateName}
                                icon='undo' />    
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
                    <Dimmer inverted active={this.state.isUpdatingData}>
                        <Loader>Updating Data...</Loader>
                    </Dimmer>
                </Dimmer.Dimmable>
            </React.Fragment>
        );
    }

} 