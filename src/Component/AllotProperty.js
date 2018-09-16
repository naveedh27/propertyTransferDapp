import React, { Component } from 'react';
import web3 from '../Util/web3';
import { Button, Form, Radio, TextArea } from 'semantic-ui-react'
import instance from '../Util/web3Helper';
import NavigationMenu from './NavigationMenu'

export default class AllotProperty extends Component {

    constructor() {
        super();

        this.state = {
            _ownerAddr: '',
            _ownerName: '',
            _propName: '',
            _purpose: '',
            _aadhar: '',
            _latLon: '',
            _addr: '',
            _isDisputed: false,
            _isInheritable: false,
            address: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.clearData = this.clearData.bind(this);
        this.pushDataToBlockChain = this.pushDataToBlockChain.bind(this);
    }


    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    pushDataToBlockChain = async () => {

        try{
            const acc = await web3.eth.getAccounts();
            this.setState({ address: acc[0] });
            const alloted = await instance.methods.allotProperty(this.state._ownerAddr, this.state._ownerName, this.state._propName,
                this.state._purpose, this.state._aadhar, this.state._latLon, this.state._addr, this.state._isDisputed, this.state._isInheritable).send({
                    from: this.state.address
                });
            alert(alloted.events.PropertyAlloted.returnValues['_msg']); 
           // this.setState({_ownerAddr : ''});
            this.clearData();
            //this.setState = ({_ownerAddr: ' '});
        }catch(error){
            console.log(error.message)
            alert('Error in adding data'); 
        }
           
    }

    clearData = () => {
        this.setState({_ownerName: '',_ownerAddr: '',_propName: '',_purpose: '',_aadhar: '',_latLon: '',_addr: '',_isDisputed: false,_isInheritable: false});
    }

    handleChangeOfRadio = (e, { value, data }) => {
        if (data === 'isDisputed') {
            if (value === 'Yes') {
                this.setState({ _isDisputed: true });
            } else if (value === 'No') {
                this.setState({ _isDisputed: false });
            }
        }
        if (data === 'isInheritable') {
            if (value === 'Yes') {
                this.setState({ _isInheritable: true });
            } else if (value === 'No') {
                this.setState({ _isInheritable: false });
            }
        }

    }

    // handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {

        return (
            <React.Fragment>
                <NavigationMenu path={this.props.location.pathname} />
                <Form>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Owner Address</label>
                            <input placeholder='Owner Address'
                                onChange={this.handleInputChange}
                                name="_ownerAddr"
                                value={this.state._ownerAddr}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Owner Name</label>
                            <input placeholder='Owner Name'
                                onChange={this.handleInputChange}
                                name="_ownerName"
                                value={this.state._ownerName}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Property Name</label>
                            <input placeholder='Property Name'
                                onChange={this.handleInputChange}
                                name="_propName"
                                value={this.state._propName}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Purpose</label>
                            <input placeholder='Purpose'
                                onChange={this.handleInputChange}
                                name="_purpose"
                                value={this.state._purpose}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Aadhar</label>
                            <input placeholder='Aadhar'
                                onChange={this.handleInputChange}
                                name="_aadhar"
                                value={this.state._aadhar}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Latitude / Longitude</label>
                            <input placeholder='Last Name'
                                onChange={this.handleInputChange}
                                name="_latLon"
                                value={this.state._latLon}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                        <label>Address</label>
                        <TextArea placeholder='Address of the Owner'
                            onChange={this.handleInputChange}
                            name="_addr"
                            value={this.state._addr}
                        />
                    </Form.Field>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Is Disputed</label>
                            <Radio
                                label='Yes'
                                name='handleChangeOfRadio'
                                value='Yes'
                                data='isDisputed'
                                checked={this.state._isDisputed === true}
                                onChange={this.handleChangeOfRadio}
                                style={{ paddingRight: '1em' }}
                            />
                            <Radio
                                label='No'
                                name='handleChangeOfRadio'
                                value='No'
                                data='isDisputed'
                                onChange={this.handleChangeOfRadio}
                                checked={this.state._isDisputed === false}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Is Inheritable</label>
                            <Radio
                                label='Yes'
                                name='_isInheritable'
                                value='Yes'
                                data='isInheritable'
                                checked={this.state._isInheritable === true}
                                onChange={this.handleChangeOfRadio}
                                style={{ paddingRight: '1em' }}
                            />
                            <Radio
                                label='No'
                                data='isInheritable'
                                name='_isInheritable'
                                value='No'
                                checked={this.state._isInheritable === false}
                                onChange={this.handleChangeOfRadio}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Button basic color='black'
                        onClick={this.pushDataToBlockChain}>Submit</Button>
                    <Button basic color='black'
                        onClick={this.clearData}>Clear</Button>    
                </Form>
            </React.Fragment>
        );
    }

} 