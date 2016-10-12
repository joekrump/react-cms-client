import React from 'react';
import s from './Card.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';

/**
 *
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const SIDES = {
  FRONT: 1,
  BACK: 2
}
class Card extends React.Component {
  constructor(props) {
    super(props);

    this.flip = this.flip.bind(this);
  }

  flip () {
    if (this._locked) {
      return;
    }

    this._locked = true;

    const scale = (500 + 200) / 500;

    const sideOne = [
      {transform: `translateZ(-200px) rotate${this._axis}(0deg) scale(${scale})`},
      {transform: `translateZ(-100px) rotate${this._axis}(0deg) scale(${scale})`, offset: 0.15},
      {transform: `translateZ(-100px) rotate${this._axis}(180deg) scale(${scale})`, offset: 0.65},
      {transform: `translateZ(-200px) rotate${this._axis}(180deg) scale(${scale})`}
    ];

    const sideTwo = [
      {transform: `translateZ(-200px) rotate${this._axis}(180deg) scale(${scale})`},
      {transform: `translateZ(-100px) rotate${this._axis}(180deg) scale(${scale})`, offset: 0.15},
      {transform: `translateZ(-100px) rotate${this._axis}(360deg) scale(${scale})`, offset: 0.65},
      {transform: `translateZ(-200px) rotate${this._axis}(360deg) scale(${scale})`}
    ];

    const umbra = [
      {opacity: 0.3, transform: `translateY(2px) rotate${this._axis}(0deg)`},
      {opacity: 0.0, transform: `translateY(62px) rotate${this._axis}(0deg)`, offset: 0.15},
      {opacity: 0.0, transform: `translateY(62px) rotate${this._axis}(180deg)`, offset: 0.65},
      {opacity: 0.3, transform: `translateY(2px) rotate${this._axis}(180deg)`}
    ];

    const penumbra = [
      {opacity: 0.0, transform: `translateY(2px) rotate${this._axis}(0deg)`},
      {opacity: 0.5, transform: `translateY(62px) rotate${this._axis}(0deg)`, offset: 0.15},
      {opacity: 0.5, transform: `translateY(62px) rotate${this._axis}(180deg)`, offset: 0.65},
      {opacity: 0.0, transform: `translateY(2px) rotate${this._axis}(180deg)`}
    ];

    const timing = {
      duration: this._duration,
      iterations: 1,
      easing: 'ease-in-out',
      fill: 'forwards'
    };

    switch (this._side) {
      case SIDES.FRONT:
        this.refs.front.animate(sideOne, timing);
        this.refs.back.animate(sideTwo, timing);

        this.refs.back.focus();
        this.refs.front.inert = true;
        this.refs.back.inert = false;
        break;

      case SIDES.BACK:
        this.refs.front.animate(sideTwo, timing);
        this.refs.back.animate(sideOne, timing);

        this.refs.front.focus();
        this.refs.front.inert = false;
        this.refs.back.inert = true;
        break;

      default:
        throw new Error('Unknown side');
    }

    this.refs.umbra.animate(umbra, timing);
    this.refs.penumbra.animate(penumbra, timing)
        .onfinish = _ => {
          this._locked = false;
          this._side = (this._side === SIDES.FRONT) ?
              SIDES.BACK :
              SIDES.FRONT;
        };
  }
  componentWillReceiveProps(nextProps) {
    // if the Card has received a new prop value for side that
    // is not the same as its current value, then flip to that side.
    if(SIDES[nextProps.side] !== this._side) {
      this.flip();
    }
  }

  componentDidMount () {
    this._locked = false;
    this._side = SIDES[this.props.side];

    this.refs.front.inert = false;
    this.refs.back.inert = true;

    this._duration = parseInt(this.props.duration, 10);
    if (isNaN(this._duration)) {
      this._duration = 800;
    }

    this._axis = this.props.axis || 'X';
    if (this._axis.toUpperCase() === 'RANDOM') {
      this._axis = (Math.random() > 0.5 ? 'Y' : 'X');
    }
  }

  render() {

    return(
      <div className="card" ref="card">
        <div className="umbra"    ref="umbra"></div>
        <div className="penumbra" ref="penumbra"></div>
        <div className="front"    ref="front" data-editable data-name="front_content" 
          data-ce-placeholder="Front Content..." 
          dangerouslySetInnerHTML={{__html: this.props.front_content}} 
          onClick={this.props.editContext !== 'edit' ? (evt) => this.flip() : null} />
        <div className="back"     ref="back" data-editable data-name="back_content" 
          data-ce-placeholder="Back Content..." 
          dangerouslySetInnerHTML={{__html: this.props.back_content}} 
          onClick={this.props.editContext !== 'edit' ? (evt) => this.flip() : null} />
      </div>
    )
  }
}


export default withStyles(s)(Card);