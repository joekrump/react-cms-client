import React from 'react';

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
  <div>
    <div className="Demo__some-network">
      <FacebookShareButton
        url={props.url}
        title={props.title}
        className="Demo__some-network__share-button">
        <FacebookIcon
          size={32}
          round />
      </FacebookShareButton>

      <FacebookShareCount
        url={props.url}
        className="Demo__some-network__share-count">
        {count => count}
      </FacebookShareCount>
    </div>

    <div className="Demo__some-network">
      <TwitterShareButton
        url={props.url}
        title={props.title}
        className="Demo__some-network__share-button">
        <TwitterIcon
          size={32}
          round />
      </TwitterShareButton>

      <div className="Demo__some-network__share-count">
        &nbsp;
      </div>
    </div>

    <div className="Demo__some-network">
      <GooglePlusShareButton
        url={props.url}
        className="Demo__some-network__share-button">
        <GooglePlusIcon
          size={32}
          round />
      </GooglePlusShareButton>

      <GooglePlusShareCount
        url={props.url}
        className="Demo__some-network__share-count">
        {count => count}
      </GooglePlusShareCount>
    </div>

    <div className="Demo__some-network">
      <LinkedinShareButton
        url={props.url}
        title={props.title}
        windowWidth={750}
        windowHeight={600}
        className="Demo__some-network__share-button">
        <LinkedinIcon
          size={32}
          round />
      </LinkedinShareButton>

      <LinkedinShareCount
        url={props.url}
        className="Demo__some-network__share-count">
        {count => count}
      </LinkedinShareCount>
    </div>

    <div className="Demo__some-network">
      <PinterestShareButton
        url={props.url}
        media={props.media}
        windowWidth={1000}
        windowHeight={730}
        className="Demo__some-network__share-button">
        <PinterestIcon size={32} round />
      </PinterestShareButton>

      <PinterestShareCount url={props.url}
        className="Demo__some-network__share-count" />
    </div>

  </div>
);

export default RoundSocialLinks;