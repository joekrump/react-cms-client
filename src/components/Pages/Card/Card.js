import React from 'react';
import s from './Card.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';


class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      target: null,
      startX: 0,
      currentX: 0
    }
    requestAnimationFrame(this.update);
  }
  componentDidMount() {
    this.addEventListeners()
  }

  componentWillUnmount() {

  }

  addEventListeners() {
    document.addEventListener('touchstart', (evt) => this.onStart(evt))
    document.addEventListener('touchmove', (evt) => this.onMove(evt))
    document.addEventListener('touchend', (evt) => this.onEnd(evt))
  }

  removeEventListeners() {

  }

  onStart(evt) {
    if(!evt.target.classList.contains('card')) {
      return;
    }
    let startX = evt.pageX || evt.touches[0].pageX;

    this.setState({
      target: evt.target,
      startX: startX,
      currentX: startX
    })
    evt.preventDefault();
  }

  onMove(evt) {
    if(!this.state.target)
      return;
  }

  onEnd(evt) {
    if(!this.state.target)
      return;
  }

  update(evt) {

  }

  render() {
    return(
      <div className="card" ref="card">
        {this.props.children}
      </div>
    )
  }
}

export default withStyles(s)(Card);