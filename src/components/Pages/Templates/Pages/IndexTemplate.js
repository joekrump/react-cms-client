// components/Pages/Templates/Pages/IndexTemplate.js

import React from 'react';
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

  constructor(props) {
    super(props);
    this.state = {
      cols: 4
    }

    this.updateNumColumns = this.updateNumColumns.bind(this);
  }

  renderChildPageTiles() {
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

  componentDidMount() {
    if( typeof window !== 'undefined' ) {
      window.addEventListener('resize', () => this.updateNumColumns(), false);
      this.updateNumColumns();
    }    
  }

  componentWillUnmount () {
    if( typeof window !== 'undefined' ) {
      window.removeEventListener('resize', () => this.updateNumColumns());
    }
  }

  updateNumColumns() {
    if (this.rqf) return

    if(typeof window !== 'undefined') {
      this.rqf = window.requestAnimationFrame(() => {
        let outerWindowWidth = window.outerWidth;
        
        if (outerWindowWidth < 500) {
          this.setState({cols: 1})
        } else if (outerWindowWidth < 900) {
          this.setState({cols: 2})
        } else {
          this.setState({cols: 4});
        }

        this.rqf = null
      })
    }
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
            cols={this.state.cols}
            style={styles.gridList}
          >
            {this.renderChildPageTiles()}
          </GridList>
        </div>
      </div>
    );
  }
}

export {IndexTemplate}

