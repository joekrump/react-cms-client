import React from 'react';
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
  gridTile: {
    background: "linear-gradient(to bottom, rgba(50,0,120,0.7) 0%,rgba(50,0,120,0.3) 70%,rgba(0,0,0,0) 100%)"
  }
};

const ListView = (props) => (
  <div style={styles.root}>
    <GridList
      cols={3}
      cellHeight={200}
      padding={1}
      style={styles.gridList}
    >
      {props.childPages.map((page) => (
        <GridTile
          key={page.id}
          title={page.name}
          titlePosition="top"
          titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
          cols={page.featured ? 2 : 1}
          rows={page.featured ? 2 : 1}
        >
          {page.img ? <img src={page.img} /> : null}
        </GridTile>
      ))}
    </GridList>
  </div>
);

export default ListView;