import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RoundSocialLinks.scss';

import {
  ShareButtons,
  ShareCounts,
  generateShareIcon,
} from 'react-share';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
} = ShareButtons;

const {
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount,
  PinterestShareCount,
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const PinterestIcon = generateShareIcon('pinterest');

const RoundSocialLinks = (props) => (
  <div className={`social-container ${props.className}`}>
    <div className="facebook-share inline">
      <FacebookShareButton
        url={props.url}
        title={props.title}
        className="share-button">
        <FacebookIcon
          size={32}
          round />
      </FacebookShareButton>

      <FacebookShareCount
        url={props.url}
        className="share-count">
        {count => count}
      </FacebookShareCount>
    </div>

    <div className="twitter-share inline">
      <TwitterShareButton
        url={props.url}
        title={props.title}
        className="share-button">
        <TwitterIcon
          size={32}
          round />
      </TwitterShareButton>

      <div className="share-count">
        &nbsp;
      </div>
    </div>

    <div className="googleplus-share inline">
      <GooglePlusShareButton
        url={props.url}
        className="share-button">
        <GooglePlusIcon
          size={32}
          round />
      </GooglePlusShareButton>

      <GooglePlusShareCount
        url={props.url}
        className="share-count">
        {count => count}
      </GooglePlusShareCount>
    </div>

    <div className="linkedin-share inline">
      <LinkedinShareButton
        url={props.url}
        title={props.title}
        windowWidth={750}
        windowHeight={600}
        className="share-button">
        <LinkedinIcon
          size={32}
          round />
      </LinkedinShareButton>

      <LinkedinShareCount
        url={props.url}
        className="share-count">
        {count => count}
      </LinkedinShareCount>
    </div>

    <div className="pintrest-share inline">
      <PinterestShareButton
        url={props.url}
        media={props.media}
        windowWidth={1000}
        windowHeight={730}
        className="share-button">
        <PinterestIcon size={32} round />
      </PinterestShareButton>

      <PinterestShareCount url={props.url}
        className="share-count" />
    </div>

  </div>
);

export default withStyles(s)(RoundSocialLinks);