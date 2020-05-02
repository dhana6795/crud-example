import React, { useState, useEffect } from 'react';
import './App.css';
import { Header, Image, Table } from 'semantic-ui-react'
import { Form, Input, Button, Icon } from 'semantic-ui-react'
import { Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

function App() {
  const [data, setData] = useState(0);

  useEffect(() => {
    fetch('/get').then(res => res.json()).then(data => {
      data = JSON.parse(data.emp);
      setData(data);
    });
  }, []);


  return (
    <div className="App">
      <header className="App-header">

        <p>Example CRUD page</p>
      </header><br/>
      <div className="ui container">
        <div class="ui divided two column grid">
          <div class="column">
            <TableEmployee data={data} />
          </div>
          <div class="column">
            <EmpForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;



export class EmpForm extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = { name: '', desg: '', imageUrl: '' };
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });

  }


  render() {
    return (
      <div>
        <Form action="/save" method="post" >

          <Form.Field
            id='form-input-control-emp-name'
            control={Input}
            label='Employee Name'
            placeholder='Employee Name'
            value={this.state.name}
            onChange={this.onChange}
            name="name"
          />

          <Form.Field
            id='form-input-control-emp-desg'
            control={Input}
            label='Designation'
            placeholder='Designation'
            value={this.state.desg}
            onChange={this.onChange}
            name="desg"
          />
          <Form.Field
            id='form-input-control-img-url'
            control={Input}
            label='Image URL'
            placeholder='Image url'
            value={this.state.imageUrl}
            onChange={this.onChange}
            name="imageUrl"
          />
          <Button type='submit'>Submit</Button>

        </Form>
      </div >
    );
  }
}

export class TableEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editingElement: 0 };
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onEditConfirm = this.onEditConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onEdit(e) {
    let id = e.target.getAttribute('id');
    let data = this.props.data.find(x => x.id == e.target.getAttribute('id'));
    this.setState({ editingElement: id, name: data.name, designation: data.designation, image: data.image });
  }
  delete(id) {
    return fetch('/delete?id=' + id, {
      method: 'delete'
    }).then(response => response.json());
  }
  onDelete(e) {
    let id = e.target.getAttribute('id');
    this.delete(id).then(data => { alert(data['status']) });
  }
  onEditConfirm(e) {
    let id = e.target.getAttribute('id');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'id': id, 'name': this.state.name, 'designation': this.state.designation, 'image': this.state.image })
    };

    (async () => {
      const rawResponse = await fetch('/update', requestOptions);
      const content = await rawResponse.json();

      alert(content['status']);
    })();
    this.setState({ editingElement: 0 });
  }
  onCancel() {
    this.setState({ editingElement: 0 });
  }
  createRow(data) {

    return Object.keys(data).map(key => {

      if (!(this.state.editingElement.toString() === data[key]['id'].toString())) {
        return (<EmpRow data={data[key]} onEdit={this.onEdit} onDelete={this.onDelete} />)

      } else {
        return (<EmpRowEdit data={data[key]} onEdit={this.onEditConfirm} onChange={this.onChange} onCancel={this.onCancel} {...this.state} />)

      }
    })

  }
  render() {                                                                                                                                
    return (

      <Table basic='very' padded  collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Employee</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.createRow(this.props.data)}

        </Table.Body>
      </Table>
    );
  }
}

const EmpRowEdit = props => <Table.Row>
  <Table.Cell>
    <Form.Field
      id='form-input-control-emp-name'
      control={Input}
      placeholder='Employee Name'
      value={props.name}
      onChange={props.onChange}
      name="name"
    />

    <Form.Field
      id='form-input-control-emp-desg'
      control={Input}
      placeholder='Designation'
      value={props.designation}
      onChange={props.onChange}
      name="designation"
    />
    <Form.Field
      id='form-input-control-img-url'
      control={Input}
      placeholder='Image url'
      value={props.image}
      onChange={props.onChange}
      name="image"
    />
  </Table.Cell>
  <Table.Cell>
    <Icon color='green' name=' check circle ' link id={props.data.id} onClick={props.onEdit} /> <span>&nbsp;&nbsp;</span>
    <Icon color='red' name='close icon' link onClick={props.onCancel} id={props.data.id} />
  </Table.Cell>
</Table.Row>
const EmpRow = props => <Table.Row>
  <Table.Cell>
    <Header as='h4' image>
      <Image src={props.data.image} rounded size='mini' />
      <Header.Content>
        {props.data.name}
        <Header.Subheader>{props.data.designation}</Header.Subheader>                                                                                                                                                                                                       
      </Header.Content>
    </Header>
  </Table.Cell>
  <Table.Cell>
    <Icon color='green' name='pencil alternate ' link id={props.data.id} onClick={props.onEdit} />                                                                                                                                                                                                        <span>&nbsp;&nbsp;</span>
    <Icon color='red' name='trash' link id={props.data.id} onClick={props.onDelete} />
  </Table.Cell>

</Table.Row>