import React, { Component } from 'react';
import web3 from '../Util/web3';
import { Button, Form, Radio, TextArea, Table, Icon,Modal,List } from 'semantic-ui-react'
import instance from '../Util/web3Helper';
import NavigationMenu from './NavigationMenu'

export default class PropertyDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            tableData: [],
            open: false ,
            closeOnEscape : true, 
            closeOnDimmerClick : true,
            rawData : [],
            selectedItem : ''
        }
    }

    close = () => this.setState({ open: false })

    openModal = () => this.setState({ open: true })

    transferPropertyOf = (e) => {

        this.setState({selectedItem : e.currentTarget.getAttribute('data'), open : true});
        console.log(this.state.rawData[e.currentTarget.getAttribute('data')]);

    }

    async componentWillMount() {

        let i = 0, tagData = [], isDisputed = false;
        const acc = await web3.eth.getAccounts();
        this.setState({ address: acc[0] });

        const noOfProp = await instance.methods.getPropertyCountOfAnyAddress().call({
            from: this.state.address
        });

        while (i < noOfProp) {

            let holderArr = [];
            const propName = await instance.methods.propertiesOwner(this.state.address, i).call({
                from: this.state.address
            });

            const propertyData = await instance.methods.getPropertyDetails(propName).call({
                from: this.state.address
            });

            holderArr["propName"] = propName;
            holderArr["purpose"] = propertyData[0];
            holderArr["aadhar"] = propertyData[1];
            holderArr["latlon"] = propertyData[2];
            holderArr["address"] = propertyData[3];
            holderArr["isdispute"] = propertyData[5];
            holderArr["isinherit"] = propertyData[6];

            this.setState({rawData : [...this.state.rawData,holderArr ] });
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
                        onClick = {this.transferPropertyOf}
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

        this.setState({ tableData: tagData });

    }

    getDataAboutEachProperty = () => {

    }


    render() {
        return (<React.Fragment>
            <NavigationMenu path={this.props.location.pathname} />
            <p>All Property Details</p>

            <Table inverted>
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
            
            <Button onClick = {this.openModal}>No Close on Escape</Button>

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
                       <ConstructPropertyData
                                dataArr = {this.state.rawData[this.state.selectedItem]} />

                   }
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close} negative>
                        Cancel
                     </Button>
                    <Button
                        onClick={this.close}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Transfer'/>
                </Modal.Actions>
            </Modal>
        </React.Fragment>);
    }

}

const ConstructPropertyData = (props) => {

    return(
        <List>
          <List.Item>{props.dataArr.propName}</List.Item>
          <List.Item>Pears</List.Item>
          <List.Item>Oranges</List.Item>
        </List>
    );

}
