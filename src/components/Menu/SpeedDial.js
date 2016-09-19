import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import Tooltip from 'material-ui/internal/Tooltip'
import CustomFAB from './CustomFAB'
import AddPageIcon from 'material-ui/svg-icons/action/note-add'
import UserIcon from 'material-ui/svg-icons/social/person-add'
import BookIcon from 'material-ui/svg-icons/av/library-books'
import RoleIcon from 'material-ui/svg-icons/social/group-add'
import PermissionIcon from 'material-ui/svg-icons/hardware/security'
import { push } from 'react-router-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SpeedDial.scss'

const actions = [
  {icon: <AddPageIcon />, route: '/admin/pages/new', tooltipText: 'Create a new Page'},
  {icon: <UserIcon />, route: '/admin/users/new', tooltipText: 'Create a new User'},
  {icon: <BookIcon />, route: '/admin/books/new', tooltipText: 'Create a new Book'},
  {icon: <RoleIcon />, route: '/admin/roles/new', tooltipText: 'Create a new User Role'},
  {icon: <PermissionIcon />, route: '/admin/permissions/new', tooltipText: 'Create a new Role Permission'}
]

class SpeedDial extends React.Component {
  static propTypes = {
    // from redux:
    height: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      hoveredTooltip: false
    }
    this.openSpeedDial = this.openSpeedDial.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.closeSpeedDial = this.closeSpeedDial.bind(this)
  }

  handleActionClick(e, actionRoute) {
    e.preventDefault();
    this.props.dispatch(push(actionRoute));
    this.setState({open: false});
  }

  handleToggle(e) {
    this.setState({
      open: !this.state.open,
    })
  }

  openSpeedDial(e) {
    if(this.state.open) {
      return;
    }
    this.handleToggle(e);
  }

  closeSpeedDial(e) {
    if(!this.state.open) {
      return;
    }
    console.log((e.target.parentNode));
    this.handleToggle(e);
  }

  render() {
    let mouseOutAreaHeight = 80;

    const actionButtons = actions.map((action, index) => {

      const id = action.id || action.route.substr(1).replace(/\//g, '_')
      
      mouseOutAreaHeight += 58;

      const delay = (30 * (this.state.open ? (actions.length - index) : index))
      return (
        <CustomFAB 
          key={id}
          delay={delay}
          iconStyle={{fill: "white"}} 
          mini={true} 
          onTouchTap={(e) => this.handleActionClick(e, action.route)} 
          secondary
          tooltipText={action.tooltipText}
          icon={action.icon}
        />
      )
    })

    return (
      <div className={(this.state.open ? "opened" : "closed")}>
        <div className="cover" style={{height: this.state.open ? this.props.height + 'px' : 0}} onTouchTap={this.handleToggle}></div>
        <div className="container">
          <div className="dial-control-area" style={{height: (this.state.open ? mouseOutAreaHeight + 'px' : 0)}}
            onMouseLeave={this.closeSpeedDial}
            onMouseEnter={this.openSpeedDial}
          >
            <div className="actions">
              {actionButtons}
            </div>
            <CustomFAB
              className="fab" 
              iconStyle={{fill: "white"}} 
              onMouseEnter={this.openSpeedDial} 
              onTouchTap={this.handleToggle} 
              primary
              tooltipText='Actions'
              icon={<AddIcon />}
              toolTypeStyles={{marginTop: '-16px', marginBottom: '24px'}}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  height: 2000,
})

export default withStyles(s)(connect(mapStateToProps)(SpeedDial));