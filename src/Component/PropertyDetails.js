import React, { Component } from 'react';
import web3 from '../Util/web3';
import { Button, Form, Table, Icon, Modal, List, Grid, Dimmer, Loader, Segment } from 'semantic-ui-react'
import instance from '../Util/web3Helper';
import NavigationMenu from './NavigationMenu'

export default class PropertyDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            tableData: [],
            open: false,
            closeOnEscape: true,
            closeOnDimmerClick: true,
            rawData: [],
            selectedItem: '',
            _toAddr: '',
            isPageLoad: false
        }
    }

    closeModal = () => this.setState({ open: false })

    openModal = () => this.setState({ open: true })

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    transferPropertyOf = (e) => {
        this.setState({ selectedItem: e.currentTarget.getAttribute('data'), open: true });
    }

    transferCallToBC = async () => {

        console.log(this.state._toAddr + ' - ' + this.state.rawData[this.state.selectedItem].propName)

        this.setState({ isPageLoad: true });

        try {
            const transferPropertyData = await instance.methods
                .transferProperty(this.state._toAddr,
                    this.state.rawData[this.state.selectedItem].propName).send({
                        from: this.state.address,
                        gas: 3000000
                    });
            console.log('Transferred Status'+transferPropertyData);
            alert(transferPropertyData.events.PropertyTransferred.returnValues._msg)
            if (transferPropertyData.events.PropertyTransferred.returnValues._msg === "Owner has been changed.") {
                this.getAllPropertyFromBC();
            }

            this.setState({ isPageLoad: false });
            this.closeModal();
        } catch (error) {

        }

    }

    async componentWillMount() {

        const acc = await web3.eth.getAccounts();
        this.setState({ address: acc[0] });

        this.getAllPropertyFromBC();

    }

    getAllPropertyFromBC = async () => {

        let i = 0, tagData = [], isDisputed = false;

        this.setState({ isPageLoad: true });

        let noOfProp = await instance.methods.getPropertyCountOfAnyAddress().call({
            from: this.state.address
        });

        while (i < noOfProp[0]) {

            let holderArr = [];
            const propName = await instance.methods.propertiesOwner(this.state.address, i).call({
                from: this.state.address
            });

            if (propName === "Sold") {
                i++;
                this.setState({ rawData: [...this.state.rawData, holderArr] });
                continue;
            }


            const propertyData = await instance.methods.getPropertyDetails(propName).call({
                from: this.state.address
            });

            console.log(propertyData);

            holderArr["propName"] = propName;
            holderArr["purpose"] = propertyData[0];
            holderArr["aadhar"] = propertyData[1];
            holderArr["latlon"] = propertyData[2];
            holderArr["address"] = propertyData[3];
            holderArr["isdispute"] = propertyData[5];
            holderArr["isinherit"] = propertyData[6];

            this.setState({ rawData: [...this.state.rawData, holderArr] });
            isDisputed = propertyData[5];

            tagData.push(<Table.Row negative={isDisputed ? true : false} key={i} >
                <Table.Cell>{propName}</Table.Cell>
                <Table.Cell>{propertyData[0]}</Table.Cell>
                <Table.Cell>{propertyData[1]}</Table.Cell>
                <Table.Cell>{propertyData[2]}</Table.Cell>
                <Table.Cell>{propertyData[3]}</Table.Cell>
                <Table.Cell>{propertyData[6] ? "Yes" : "No"}</Table.Cell>
                <Table.Cell>{propertyData[5] ? "Yes" : "No"}</Table.Cell>
                <Table.Cell>
                    {
                        !isDisputed &&
                        <Button basic color={isDisputed ? 'red' : 'green'}
                            data={i}
                            onClick={this.transferPropertyOf}
                        >
                            Transfer This Property
                        </Button>
                    }
                    {
                        isDisputed &&
                        <React.Fragment>
                            <Icon name='attention' />On Dispute
                        </React.Fragment>
                    }
                </Table.Cell>
            </Table.Row>);

            i++;
        }

        this.setState({ tableData: tagData, isPageLoad: false });

    }

    getDataOfParticularProperty = (param) => {
        console.log(param)
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <List>
                            <List.Item> Property Name : {param.propName}</List.Item>
                            <List.Item> Purpose : {param.purpose}</List.Item>
                            <List.Item> Aadhar : {param.aadhar}</List.Item>
                            <List.Item> Address : {param.address}</List.Item>
                            <List.Item> LAT / LON : {param.latlon}</List.Item>
                        </List>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Form>
                            <Form.Group>
                                <Form.Input
                                    label='To Address'
                                    placeholder='Address'
                                    onChange={this.handleInputChange}
                                    name="_toAddr"
                                    value={this.state._toAddr}
                                    width={12} />
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }


    render() {

        console.log(this.state.tableData.length);

        return (<React.Fragment>


            <NavigationMenu path={this.props.location.pathname} />
            <p>All Property Details</p>
            
            {   
                this.state.tableData.length > 0
                &&
                <Table inverted celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Property Name</Table.HeaderCell>
                        <Table.HeaderCell>Purpose</Table.HeaderCell>
                        <Table.HeaderCell>Aadhar</Table.HeaderCell>
                        <Table.HeaderCell>LAT / LON</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Is Inheritable?</Table.HeaderCell>
                        <Table.HeaderCell>Is Disputed?</Table.HeaderCell>
                        <Table.HeaderCell>Transfer Request</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.state.tableData}
                </Table.Body>

            </Table>
            }
            {   
                this.state.tableData.length === 0
                &&
                <Segment>
                    No Property Associated
                </Segment>
            }    
           
            <Modal
                open={this.state.open}
                closeOnEscape={this.state.closeOnEscape}
                closeOnDimmerClick={this.state.closeOnDimmerClick}
                onClose={this.close} >

                <Modal.Header>Transfer Your Property</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to transfer the property?</p>
                    {
                        this.state.selectedItem !== '' &&
                        this.getDataOfParticularProperty(this.state.rawData[this.state.selectedItem])
                        /* <ConstructPropertyData
                            dataArr={this.state.rawData[this.state.selectedItem]} /> */

                    }
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close} negative>
                        Cancel
                     </Button>
                    <Button
                        onClick={this.transferCallToBC}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Transfer' />
                </Modal.Actions>
                <Dimmer active={this.state.isPageLoad}>
                    <Loader size='medium'>Loading</Loader>
                </Dimmer>
            </Modal>
            <Dimmer active={this.state.isPageLoad}>
                <Loader size='medium'>Loading</Loader>
            </Dimmer>


        </React.Fragment>);
    }

}