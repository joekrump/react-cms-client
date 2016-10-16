import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import AddIcon from 'material-ui/svg-icons/content/add'
import CustomFAB from './CustomFAB'
import AddPageIcon from 'material-ui/svg-icons/action/note-add'
import UserIcon from 'material-ui/svg-icons/social/person-add'
import BookIcon from 'material-ui/svg-icons/av/library-books'
import RoleIcon from 'material-ui/svg-icons/social/group-add'
import AddNoteIcon from 'material-ui/svg-icons/image/add-to-photos'
import PermissionIcon from 'material-ui/svg-icons/hardware/security'
import { push } from 'react-router-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SpeedDial.scss'

const actions = {
  pages: {icon: <AddPageIcon />, route: '/admin/pages/new', tooltipText: 'Create a new Page'},
  cards: {icon: <AddNoteIcon />, route: '/admin/cards/new', tooltipText: 'Create a new Card'},
  users: {icon: <UserIcon />, route: '/admin/users/new', tooltipText: 'Create a new User'},
  books: {icon: <BookIcon />, route: '/admin/books/new', tooltipText: 'Create a new Book'},
  roles: {icon: <RoleIcon />, route: '/admin/roles/new', tooltipText: 'Create a new User Role'},
  permission: {icon: <PermissionIcon />, route: '/admin/permissions/new', tooltipText: 'Create a new Role Permission'}
}

function makeActionList(menuList) {
  return menuList.map((permission) => (actions[permission]));
}

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
    this.handleOpenSpeedDial  = this.handleOpenSpeedDial.bind(this)
    this.handleToggle         = this.handleToggle.bind(this)
    this.handleCloseSpeedDial = this.handleCloseSpeedDial.bind(this)
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

  handleOpenSpeedDial(e) {
    if(this.state.open) {
      return;
    }
    this.handleToggle(e);
  }

  handleCloseSpeedDial(e) {
    if(!this.state.open) {
      return;
    }
    this.handleToggle(e);
  }

  render() {
    let mouseOutAreaHeight = 80;
    let actionItems = makeActionList(this.props.menuList);
    const actionButtons = actionItems.map((action, index) => {
      mouseOutAreaHeight += 58;
      
      return (
        <CustomFAB 
          key={`speedial-item-${index}`}
          delay={(30 * index)}
          iconStyle={{fill: "white"}} 
          mini={true} 
          onTouchTap={(e) => this.handleActionClick(e, action.route)} 
          secondary={true}
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
            onMouseLeave={this.handleCloseSpeedDial}
            onMouseEnter={this.handleOpenSpeedDial}
          >
            <div className="actions">
              {actionButtons}
            </div>
            <CustomFAB
              className="fab" 
              iconStyle={{fill: "white"}} 
              onTouchTap={this.handleToggle} 
              tooltipText='Actions'
              icon={<AddIcon />}
              toolTypeStyles={{marginTop: '-8px', marginBottom: '34px', top: '42px'}}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  height: 2000,
  menuList: state.auth.user.menuList
})

export default withStyles(s)(connect(mapStateToProps)(SpeedDial));