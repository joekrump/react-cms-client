import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '100%',
    overflowY: 'auto',
    marginBottom: 24
  }
};

const tilesData = [
  {
    img: 'images/grid-list/00-52-29-429_640.jpg',
    title: 'Job 1',
    author: 'jill111'
  },
  {
    img: 'images/grid-list/burger-827309_640.jpg',
    title: 'Job 2',
    author: 'pashminu'
  },
  {
    img: 'images/grid-list/camera-813814_640.jpg',
    title: 'Job 3',
    author: 'Danson67'
  },
  {
    img: 'images/grid-list/morning-819362_640.jpg',
    title: 'Job 4',
    author: 'fancycrave1'
  },
  {
    img: 'images/grid-list/hats-829509_640.jpg',
    title: 'Job 5',
    author: 'Hans'
  },
  {
    img: 'images/grid-list/honey-823614_640.jpg',
    title: 'Job 6',
    author: 'fancycravel'
  },
  {
    img: 'images/grid-list/vegetables-790022_640.jpg',
    title: 'Job 7',
    author: 'jill111'
  },
  {
    img: 'images/grid-list/water-plant-821293_640.jpg',
    title: 'Job 8',
    author: 'BkrmadtyaKarki'
  }
];


export default class Jobs extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={200}
          style={styles.gridList}
        >
          {tilesData.map((tile) => (
            <GridTile
              key={tile.img}
              title={tile.title}
              subtitle={<span>by <b>{tile.author}</b></span>}
              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
            >
              <img src={tile.img} />
            </GridTile>
          ))}
        </GridList>
        
      </div>
    );
  }
}