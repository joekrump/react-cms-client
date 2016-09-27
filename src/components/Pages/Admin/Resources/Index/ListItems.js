import React from 'react'
import IndexItem from './IndexItem'

const ListItems = (props) => {
  let items = props.items.map((item) => (
    <IndexItem 
      key={`${props.resourceType}-${item.id}`}
      id={item.id}
      primary={item.primary}
      secondary={item.secondary}
      resourceType={props.resourceType}
      deletable={item.deletable}
      childItems={item.children}
      depth={item.depth}
      root={!item.depth || item.depth === 0}
      extraData={{...item}}
    />
  ))
  return (<div className="nested">{items}</div>)
}

export default ListItems;