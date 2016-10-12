import React from 'react';
import s from './Card.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const cardStyle = {
  transform: 'translateX(0px)',
  willChange: 'transform'
}

class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      target: null,
      startX: 0,
      currentX: 0,
      screenX: 0,
      isDragging: false
    }
    requestAnimationFrame((evt) => this.update(evt));
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
      this.setState({
        target: null
      })
      return;
    }



    let startX = evt.pageX || evt.touches[0].pageX;

    this.setState({
      isDragging: true,
      target: evt.target,
      startX: startX,
      currentX: startX
    })
    evt.preventDefault();
  }

  onMove(evt) {
    if(!this.state.target)
      return;

    this.setState({
      currentX: evt.pageX || evt.touches[0].pageX
    })
  }

  onEnd(evt) {
    if(!this.state.target)
      return;

    this.setState({
      isDragging: false
    })
  }

  update(evt) {

    requestAnimationFrame((evt) => this.update(evt))

    if(!this.state.target)
      return;

    if(this.state.isDragging) {
      let screenX = this.state.currentX - this.state.startX;
      this.setState({
        screenX: screenX
      })
    } else {
      // Ease back to starting point after letting go.
      this.setState({
        screenX: this.state.screenX + ((0 - this.state.screenX) / 10)
      });
    }

    cardStyle.transform = `translateX(${this.state.screenX}px)`;
  }

  render() {
    return(
      <div className="card" ref="card" style={cardStyle}>
        {this.props.children}
      </div>
    )
  }
}

export default withStyles(s)(Card);