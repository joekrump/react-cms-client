import React from 'react';
import { connect } from 'react-redux';
import Breadcrumb from './Breadcrumb';

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
    let url = '';

    if(numParts <= 1) {
      return null;
    }

    return urlParts.map((urlPart, i) => {
      url += `/${urlPart}`;
      if (i === (numParts - 1)) {
        return null;
      } else {
        return (
          <Breadcrumb key={`page-breadcrumb-${i}`} url={url} name={urlPart} />
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
