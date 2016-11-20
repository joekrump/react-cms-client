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

        <a href="https://plus.google.com/share?url=http://catholicphilly.com/2016/08/think-tank/archbishop-chaput-column/a-new-overview-of-a-contested-subject" target="_blank" class="svggp" title="Share on Google +"><svg width="32" height="32" viewBox="0 0 32 32"><desc>Google+</desc><g><path d="M 17.471,2c0,0-6.28,0-8.373,0C 5.344,2, 1.811,4.844, 1.811,8.138c0,3.366, 2.559,6.083, 6.378,6.083 c 0.266,0, 0.524-0.005, 0.776-0.024c-0.248,0.475-0.425,1.009-0.425,1.564c0,0.936, 0.503,1.694, 1.14,2.313 c-0.481,0-0.945,0.014-1.452,0.014C 3.579,18.089,0,21.050,0,24.121c0,3.024, 3.923,4.916, 8.573,4.916 c 5.301,0, 8.228-3.008, 8.228-6.032c0-2.425-0.716-3.877-2.928-5.442c-0.757-0.536-2.204-1.839-2.204-2.604 c0-0.897, 0.256-1.34, 1.607-2.395c 1.385-1.082, 2.365-2.603, 2.365-4.372c0-2.106-0.938-4.159-2.699-4.837l 2.655,0 L 17.471,2z M 14.546,22.483c 0.066,0.28, 0.103,0.569, 0.103,0.863c0,2.444-1.575,4.353-6.093,4.353 c-3.214,0-5.535-2.034-5.535-4.478c0-2.395, 2.879-4.389, 6.093-4.354c 0.75,0.008, 1.449,0.129, 2.083,0.334 C 12.942,20.415, 14.193,21.101, 14.546,22.483z M 9.401,13.368c-2.157-0.065-4.207-2.413-4.58-5.246 c-0.372-2.833, 1.074-5.001, 3.231-4.937c 2.157,0.065, 4.207,2.338, 4.58,5.171 C 13.004,11.189, 11.557,13.433, 9.401,13.368zM 26,8L 26,2L 24,2L 24,8L 18,8L 18,10L 24,10L 24,16L 26,16L 26,10L 32,10L 32,8 z"></path></g></svg></a>

        <a href="http://pinterest.com/pin/create/button/?url=http://catholicphilly.com/2016/08/think-tank/archbishop-chaput-column/a-new-overview-of-a-contested-subject&amp;media=http://catholicphilly.com/media-files/2016/05/Archbishop-Chaput-150-circle.jpg&amp;description=A+new+overview+of+a+contested+subject" target="_blank" class="svgpt" title="Share on Pinterest"><svg width="33" height="33" viewBox="0 0 33 33"><desc>Pinterest</desc><g><path d="M 16.5,0C 7.387,0,0,7.387,0,16.5s 7.387,16.5, 16.5,16.5c 9.113,0, 16.5-7.387, 16.5-16.5S 25.613,0, 16.5,0z M 18.1,22.047 c-1.499-0.116-2.128-0.859-3.303-1.573C 14.15,23.863, 13.36,27.113, 11.021,28.81 c-0.722-5.123, 1.060-8.971, 1.888-13.055c-1.411-2.375, 0.17-7.155, 3.146-5.977 c 3.662,1.449-3.171,8.83, 1.416,9.752c 4.79,0.963, 6.745-8.31, 3.775-11.325 c-4.291-4.354-12.491-0.099-11.483,6.135c 0.245,1.524, 1.82,1.986, 0.629,4.090c-2.746-0.609-3.566-2.775-3.46-5.663 c 0.17-4.727, 4.247-8.036, 8.337-8.494c 5.172-0.579, 10.026,1.898, 10.696,6.764 C 26.719,16.527, 23.63,22.474, 18.1,22.047z"></path></g></svg></a>
        <a href="http://www.linkedin.com/shareArticle?mini=true&amp;url=http://catholicphilly.com/2016/08/think-tank/archbishop-chaput-column/a-new-overview-of-a-contested-subject&amp;title=A+new+overview+of+a+contested+subject&amp;summary=We live in a time when fundamental elements of human identity -- gender and sexuality -- are reimagined, writes Archbishop Charles Chaput. A new report restores some badly needed clarity, scientific substance and prudence to our discussions.&amp;source=http://catholicphilly.com/" target="_blank" class="svgli" title="Share on LinkedIn"><svg width="32px" height="32px" viewBox="0 0 32 32"><desc>LinkedIn</desc><g><path d="M29.625,0H2.36C1.058,0,0,1.033,0,2.305v27.382c0,1.273,1.058,2.308,2.36,2.308h27.265 c1.306,0,2.371-1.034,2.371-2.308V2.305C31.996,1.033,30.931,0,29.625,0z M9.492,27.265h-4.75v-15.27h4.75V27.265z M7.118,9.908 c-1.525,0-2.753-1.233-2.753-2.752c0-1.517,1.229-2.75,2.753-2.75c1.518,0,2.75,1.233,2.75,2.75 C9.869,8.675,8.636,9.908,7.118,9.908z M27.262,27.265h-4.741V19.84c0-1.771-0.032-4.05-2.466-4.05 c-2.47,0-2.846,1.929-2.846,3.922v7.553h-4.74v-15.27h4.549v2.086h0.065c0.632-1.201,2.182-2.466,4.489-2.466 c4.802,0,5.689,3.162,5.689,7.273V27.265z"></path></g></svg></a>

        <a href="mailto:?subject=A+new+overview+of+a+contested+subject&amp;body=From CatholicPhilly: We live in a time when fundamental elements of human identity -- gender and sexuality -- are reimagined, writes Archbishop Charles Chaput. A new report restores some badly needed clarity, scientific substance and prudence to our discussions. - http://catholicphilly.com/2016/08/think-tank/archbishop-chaput-column/a-new-overview-of-a-contested-subject" class="svgem" title="Share via Email"><svg width="32px" height="32px" viewBox="0 0 32 32"><desc>Email</desc><g><path d="M16.734,18.692c-0.193,0.152-0.426,0.228-0.658,0.228c-0.238,0-0.477-0.08-0.672-0.238C15.304,18.603,14.105,17.67,0,6.787 v19.848h32V6.753L16.734,18.692z"></path><path d="M30.318,5.365H1.643c9.66,7.453,13.152,10.15,14.43,11.143L30.318,5.365z"></path></g></svg></a>

        <a href="http://www.printfriendly.com" onClick={this.print} className="svgprint" title="Print this story"><svg width="32px" height="32px" viewBox="0 0 32 32"><desc>Print</desc><path d="M26.238,9.174c-0.513,0-1.194,0-1.707,0V2.349H7.468v6.825c-3.925,0-6.826,0-6.826,0v10.238 c0,2.902,2.218,5.119,5.119,5.119h1.707v5.119h17.063v-5.119h6.826V14.293C31.357,11.393,29.14,9.174,26.238,9.174z M9.174,4.055 h13.652v5.119c-4.267,0-9.386,0-13.652,0V4.055z M22.826,27.945H9.174V17.707h10.238h3.414V27.945z"></path></svg></a>
      </div>
    );
  }
}

export default SocialLinks;    