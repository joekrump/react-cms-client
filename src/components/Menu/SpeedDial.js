import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import {Link} from 'react-router'

import FloatingActionButton from 'material-ui/FloatingActionButton'

import AddIcon from 'material-ui/svg-icons/content/add'
import UserIcon from 'material-ui/svg-icons/social/person-add'
import BookIcon from 'material-ui/svg-icons/av/library-books'

import {indigoA700, cyan500} from 'material-ui/styles/colors'

// import routes from '../routes'

import './SpeedDial.css'

const actions = [
  {icon: <UserIcon />, route: '/admin/user/new', tooltipText: 'Create a new User'},
  {icon: <BookIcon />, route: '/admin/book/new', tooltipText: 'Create a new Book'},
]

class SpeedDial extends Component {
  static propTypes = {
    // from redux:
    height: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle() {
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    const actionButtons = actions.map((action, index) => {
      const linkTo = {pathname: action.route}
      if (action.id) {
        linkTo.state = {do: 'new'}
      }
      const link = <Link to={linkTo} />

      const id = action.id || action.route.substr(1).replace(/\//g, '_')

      const delay = (30 * (this.state.open ? (actions.length - index) : index))

      return (
        <div className="action" key={id}>
          <div className='tooltip' style={{transitionDelay: delay + 'ms'}}>
            <span id={id} >{action.tooltipText}</span>
          </div>
          <div className={"button"} style={{transitionDelay: delay + 'ms'}}>
            <FloatingActionButton backgroundColor={cyan500} iconStyle={{fill: "white"}} containerElement={link} mini={true}>
              {action.icon}
            </FloatingActionButton>
          </div>
        </div>
      )
    })

    return (
      <div className={(this.state.open ? "opened" : "closed")}>
        <div className="cover" style={{height: this.state.open ? this.props.height + 'px' : 0}} onTouchTap={this.handleToggle}></div>
        <div className="container">
          <div className={"actions"} style={{top: this.state.open ? `${actions.length * -62}px` : '100px'}}>
            {actionButtons}
          </div>
          <FloatingActionButton onMouseUp={this.handleToggle} className={"main"} backgroundColor={indigoA700}>
            <AddIcon />
          </FloatingActionButton>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  height: 2000,
})

export default connect(mapStateToProps)(SpeedDial)