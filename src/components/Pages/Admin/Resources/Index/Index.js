import React from 'react';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import IndexItem from './IndexItem'
import AdminLayout from '../../Layout/AdminLayout'
import { capitalize } from '../../../../../helpers/StringHelper'
import APIClient from '../../../../../http/requests';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './index.scss';
import Dragula from 'react-dragula';
import ListItems from './ListItems';

class Index extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      dragulaDrake: null,
      editMode: false
    }
  }
  handleDrop(el, target, source, sibling){
    try {
      console.log('DROPPED!')
      console.log(el);
      console.log(target);
      console.log(source);
      console.log(sibling);
    } catch (e) {
      console.warn('ERROR: ', e)
    } 
  }
  handleOver(el, container, source){
    // Nesting
  }
  setItems(resourceNamePlural){
    this.setState({loading: true})
    let client = new APIClient(this.context.store);

    client.get(resourceNamePlural).then((res) => {
      this.setState({loading: false})

      if(res.statusCode !== 200) {
        this.setState({items: []}) // Reset Items
        console.log('Bad Response: ', res)

      } else {
        this.setState({items: res.body.data})
        client.updateToken(res.header.authorization)
        if(typeof document !== 'undefined'){
          let drake = Dragula({
            containers: [].slice.apply(document.querySelectorAll('.nested')),
            moves: (el, source, handle, sibling) => {
              // should not be able to go to a depth beyond 3 (depths start at 0)
              console.log((el).classList);
              return (el).classList.contains('index-item')
              // console.log('el ', el)
              // console.log('handle ', handle)
              // return false;
            }
          });
          drake.on('drop', (el, target, source, sibling) => this.handleDrop(el, target, source, sibling));
          drake.on('over', (el, container, source) => this.handleOver(el, container, source));
          // drake.canMove((item) => {

          // })
          this.setState({
            dragulaDrake: drake
          });
        }
      }
    }).catch((res) => {
      this.setState({loading: false})
      console.warn('Error: ', res)
      this.setState({items: []}) // Reset Items
    })
  }

  componentDidMount() {
    this.setItems(this.props.params.resourceNamePlural.toLowerCase());
  }
  componentWillUnmount() {
    this.state.dragulaDrake.destroy();
    this.state.dragulaDrake.setState({
      dragulaDrake: null
    })
  }
  componentWillReceiveProps(nextProps){
    // TODO: update how this works by tying into redux
    if(nextProps.params.resourceNamePlural !== this.props.params.resourceNamePlural) {
      this.setItems(nextProps.params.resourceNamePlural);
    }
  }
  toggleEditMode(event) {
    event.preventDefault();
    this.setState({
      editMode: !this.state.editMode
    })
  }
  render() {
    let content = null;

    if(!this.state.loading){
      if(this.state.items.length > 0) {
        content = (<ListItems items={this.state.items} resourceType={this.props.params.resourceNamePlural} />)
      } else {
        content = (<div className="empty"><h3>No {this.props.params.resourceNamePlural} yet</h3></div>);
      }
    }
    return (
      <AdminLayout>
        <div className={"admin-index" + (this.state.editMode ? ' index-edit' : '')}>
          <h1>{capitalize(this.props.params.resourceNamePlural)}</h1>
          <button onClick={(event) => this.toggleEditMode(event)}>Adjust Nesting</button>
          {this.state.loading ? (<CircularProgress />) : null}
          <List className="item-list">
            {content}
          </List>
        { this.props.children }
        </div>
      </AdminLayout>
    );
  }
}

Index.contextTypes = {
  store: React.PropTypes.object
}

export default withStyles(s)(Index);