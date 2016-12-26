// components/Pages/Templates/Pages/IndexTemplate.js

import React from 'react';
import { connect } from 'react-redux';
import { GridList, GridTile } from 'material-ui/GridList';
import { Link } from 'react-router';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    padding: 10,
  },
  titleStyle: {
    marginRight: 16
  },
  basicGridItemFiller: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.75)',
  }
};

class IndexTemplate extends React.Component {
  // static propTypes = {
  //   childPages: React.PropTypes.required,
  // };

  constructor(props) {
    super(props);
  }

  renderChildPages() {
    return this.props.childPages.map((childPage) => (
      <GridTile
        key={`child-page-${childPage.id}`}
        title={<Link to={childPage.full_path}>{childPage.name}</Link>}
        subtitle={childPage.summary}
        titleStyle={styles.titleStyle}
      >
        {childPage.image_url ? <img src={childPage.image_url} /> : <div style={styles.basicGridItemFiller}></div>}
      </GridTile>
    ))
  }

  render() {
    return (
      <div className="page index">
        <div className="page-container">
          <div data-editable data-name="name" onInput={this.props.handleNameChanged ? this.props.handleNameChanged : undefined}>
            <h1 className="page-title" data-ce-placeholder="Page Title">{this.props.name ? this.props.name : ''}</h1>
          </div>
          <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: this.props.content}} />
        </div>
        <div className="page-container">
          <GridList
            cellHeight={180}
            cols={4}
            style={styles.gridList}
          >
            {this.renderChildPages()}
          </GridList>
        </div>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     childPages: state.page.childPages
//   };
// }
// const connectTemplate = connect(
//   mapStateToProps,
// // Implement map dispatch to props
// )(IndexTemplate);

export {IndexTemplate}

