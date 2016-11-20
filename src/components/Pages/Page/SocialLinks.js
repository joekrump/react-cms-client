import React from 'react';
import TwitterShare from '../../Social/TwitterShare';
import FacebookShare from '../../Social/FacebookShare';
import MailShare from '../../Social/MailShare';
import PintrestShare from '../../Social/PintrestShare';
import LinkedInShare from '../../Social/LinkedInShare';
import GoogleShare from '../../Social/GoogleShare';
import PrintPage from '../../Social/Print';

class SocialLinks extends React.PureComponent {

  render() {
    return (
      <div id="story-social">
        <TwitterShare url={this.props.url} />
        <FacebookShare url={this.props.url} />
        <MailShare 
          subject={this.props.title} 
          body={this.props.summary} 
          url={this.props.url} 
        />
        <PintrestShare url={this.props.url} 
          

        />
        <LinkedInShare url={this.props.url}
          title={this.props.title}
          summary={this.props.summary}
          soruce={this.props.baseUrl}
        />
        <GoogleShare url={this.props.url}/>
        <PrintPage />
        
      </div>
    );
  }
}

export default SocialLinks;    