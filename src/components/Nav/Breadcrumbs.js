import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';

function mapStateToProps(state) {
  return {
    url: state.routing.locationBeforeTransitions.pathname
  };
}

export class Breadcrumbs extends React.Component {

  constructor(props) {
    super(props);
  }

  splitUrl() {
    let urlParts = this.props.url.split( '/' ).splice(1);
    return urlParts;
  }

  renderUrlSections() {
    const urlParts = this.splitUrl();
    const numParts = urlParts.length;
    let fullpath = '';

    if(numParts <= 1) {
      return null;
    }

    return urlParts.map((urlPart, i) => {
      fullpath += `/${urlPart}`;
      if (i === (numParts - 1)) {
        return null;
      } else {
        return (
          <span key={`page-breadcrumb-${i}`} className="breadcrumb-link-container">
            <Link className="breadcrumb-link" to={fullpath}>{urlPart}</Link>
            <span className="breadcrumb-divider">/</span>
          </span>
        );
      }
    })
  }

  render() {
    return (
      <div className="breadcrumb-links">
        <div className="page-container">
          {this.renderUrlSections()}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
// Implement map dispatch to props
)(Breadcrumbs)
