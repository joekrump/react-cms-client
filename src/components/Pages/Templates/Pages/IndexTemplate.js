// components/Pages/Templates/Pages/IndexTemplate.js

import React from 'react';
import { connect } from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
  basicGridItemFiller: {
    width: 100%;
    height: 100%;
    backgroundColor: 'black';
  }
};

export class IndexTemplate extends React.Component {
  static propTypes = {
    childPages: React.PropTypes.array.required,
  };

  constructor(props) {
    super(props);
  }

  renderChildPages() {
    return childPages.map((childPage) => (
      <GridTile
        key={`child-page-${childPage.id}`}
        title={childPage.title}
        subtitle={<span>{childPage.summary}</span>}
      >
        {childPage.image_url ? <img src={childPage.image_url} /> : <div style={styles.basicGridItemFiller}></div>}
      </GridTile>
    ))
  }

  render() {
    return (
      <div className="page index">
        <div className="page-container">
          <div data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
            <h1 className="page-title" data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
          </div>
          <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: props.content}} />
        </div>
        <GridList
          cellHeight={180}
          style={styles.gridList}
        >

        </GridList>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    childPages: state.page.childPages
  };
}

export default connect(
  mapStateToProps,
// Implement map dispatch to props
)(IndexTemplate)

