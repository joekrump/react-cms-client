import React from 'react';
import s from './Card.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const cardStyle = {
  transform: 'translateX(0px)',
  willChange: 'transform',
  opacity: 1
}
const minTravelPct = 0.35;

class SwipableCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      target: null,
      startX: 0,
      currentX: 0,
      screenX: 0,
      targetX: 0,
      isDragging: false,
      boundingClientRect: null
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
      // not getBCR is an expensive function to call, therefore call it once at start only.
      boundingClientRect: evt.target.getBoundingClientRect(),
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

    // set the currentX value so that the next time the card is touched, it won't
    // appear to jump.
    this.setState({
      targetX: 0,
      currentX: evt.pageX || this.state.currentX
    });
    
    let screenX = this.state.currentX - this.state.startX;

    if(Math.abs(screenX) > (this.state.boundingClientRect.width * minTravelPct)) {
      this.setState({
        targetX: (screenX > 0) ? this.state.boundingClientRect.width : -this.state.boundingClientRect.width
      })
    }

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
        screenX: this.state.screenX + ((this.state.targetX - this.state.screenX) / 10)
      });
    }

    const normaizedDragDist = (Math.abs(this.state.screenX) / this.state.boundingClientRect.width);
    // Give the opacity being set a parabolic curve.
    const opacity = 1 - Math.pow(normaizedDragDist, 2);

    cardStyle.transform = `translateX(${this.state.screenX}px)`;
    cardStyle.opacity = opacity;
  }

  render() {
    return(
      <div className="card card-swipable" ref="card" style={cardStyle}>
        {this.props.children}
      </div>
    )
  }
}

export default withStyles(s)(SwipableCard);