import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
// import {FormattedMessage} from 'react-intl'
import {Link} from 'react-router'

import FloatingActionButton from 'material-ui/FloatingActionButton'

import AddIcon from 'material-ui/svg-icons/content/add'
import CartIcon from 'material-ui/svg-icons/action/shopping-cart'
import EventIcon from 'material-ui/svg-icons/action/event'
import CheckIcon from 'material-ui/svg-icons/action/assignment-turned-in'
import PasteIcon from 'material-ui/svg-icons/content/content-paste'
import PollIcon from 'material-ui/svg-icons/social/poll'

// import routes from '../routes'

import './SpeedDial.css'
const color = 'rgb(95,193,178)'

const actions = [
  {icon: <PollIcon />, route: '/a'},
  {icon: <PasteIcon />, route: '/b'},
  {icon: <CheckIcon />, route: '/c'},
  {icon: <EventIcon />, route: '/d'},
  {icon: <CartIcon />, route: '/e'},
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
            <div id={id} />
          </div>
          <div className={"button"} style={{transitionDelay: delay + 'ms'}}>
            <FloatingActionButton backgroundColor="white" iconStyle={{fill: color}} containerElement={link}>
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
          <div className={"actions"} style={{top: this.state.open ? `${actions.length * -76}px` : '100px'}}>
            {actionButtons}
          </div>
          <FloatingActionButton onMouseUp={this.handleToggle} className={"main"} backgroundColor={color}>
            <AddIcon />
          </FloatingActionButton>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  height: 0,
})

export default connect(mapStateToProps)(SpeedDial)