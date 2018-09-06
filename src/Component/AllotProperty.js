import React, { Component } from 'react';
import { Button, Form, Radio, TextArea } from 'semantic-ui-react'
import instance from '../Util/web3Helper';
import NavigationMenu from './NavigationMenu'

export default class AllotProperty extends Component {

    state = {
        _ownerAddr: '',
        _ownerName: '',
        _propName: '',
        _purpose: '',
        _aadhar: '',
        _latLon: '',
        _addr: '',
        _isDisputed: false,
        _isInheritable: false
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

    async pushDataToBlockChain(){
        try{

        }catch(e){
            alert('Error in Pushing Data to Blockchain')
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
                                value={this.state._ownerAddr}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Owner Name</label>
                            <input placeholder='Owner Name'
                                value={this.state._ownerName}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Property Name</label>
                            <input placeholder='Property Name'
                                value={this.state._propName}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Purpose</label>
                            <input placeholder='Purpose'
                                value={this.state._purpose}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Aadhar</label>
                            <input placeholder='Aadhar'
                                value={this.state._aadhar}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Latitude / Longitude</label>
                            <input placeholder='Last Name'
                                value={this.state._latLon}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                        <label>Address</label>
                        <TextArea placeholder='Address of the Owner'
                            value={this.state._addr}
                        />
                    </Form.Field>
                    <Form.Group widths={2}>
                        <Form.Field>
                            <label>Is Disputed</label>
                            <Radio
                                label='Yes'
                                name='radioGroup1'
                                value='Yes'
                                data='isDisputed'
                                checked={this.state._isDisputed === true}
                                onChange={this.handleChangeOfRadio}
                                style={{ paddingRight: '1em' }}
                            />
                            <Radio
                                label='No'
                                name='radioGroup1'
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
                                name='radioGroup2'
                                value='Yes'
                                data = 'isInheritable'
                                checked={this.state._isInheritable === true}
                                onChange={this.handleChangeOfRadio}
                                style={{ paddingRight: '1em' }}
                            />
                            <Radio
                                label='No'
                                data = 'isInheritable'
                                name='radioGroup2'
                                value='No'
                                checked={this.state._isInheritable === false}
                                onChange={this.handleChangeOfRadio}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Button basic color='black' >Submit</Button>
                </Form>
            </React.Fragment>
        );
    }

} 