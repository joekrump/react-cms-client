import React from 'react';
import s from './Card.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';


class Card extends React.Component {
  render() {
    return(
      <div className="card" ref="card">
        {this.props.children}
      </div>
    )
  }
}

export default withStyles(s)(Card);