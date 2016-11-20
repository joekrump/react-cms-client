import React from 'react';
import TwitterShare from '../../Social/TwitterShare';
import FacebookShare from '../../Social/FacebookShare';

class SocialLinks extends React.PureComponent {
  print(evt) {
    evt.preventDefault();

    if(typeof(window) !== 'indefined') {
      window.print();
    }
  }
  render() {
    return (
      <div id="story-social">
        <TwitterShare url={this.props.url}/>

        <FacebookShare url={this.props.url}/>

        <a href="http://www.printfriendly.com" onClick={this.print} className="svgprint" title="Print this story"><svg width="32px" height="32px" viewBox="0 0 32 32"><desc>Print</desc><path d="M26.238,9.174c-0.513,0-1.194,0-1.707,0V2.349H7.468v6.825c-3.925,0-6.826,0-6.826,0v10.238 c0,2.902,2.218,5.119,5.119,5.119h1.707v5.119h17.063v-5.119h6.826V14.293C31.357,11.393,29.14,9.174,26.238,9.174z M9.174,4.055 h13.652v5.119c-4.267,0-9.386,0-13.652,0V4.055z M22.826,27.945H9.174V17.707h10.238h3.414V27.945z"></path></svg></a>
      </div>
    );
  }
}

export default SocialLinks;    