import React from 'react';
import s from './Card.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';


class Card extends React.Component {

  onStart() {

  }

  onMove() {

  }

  onEnd() {

  }

  update() {

  }

  render() {
    return(
      <div className="card">
        {this.props.children}
      </div>
    )
  }
}

export default withStyles(s)(Card);