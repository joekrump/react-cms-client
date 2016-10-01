import React from 'react'
import IndexItem from './IndexItem'

const ListItems = (props) => {
  let items = props.items.map((item, i) => {
    return( <IndexItem 
              key={`${props.resourceType}-${item.node.id}`}
              modelId={item.node.id}
              primary={item.node.primary}
              secondary={item.node.secondary}
              resourceType={props.resourceType}
              deletable={item.node.deletable}
              childItems={item.node.children}
              depth={item.depth}
              root={true}
              unmovable={item.node.unmovable}
              denyNested={item.node.denyNested}
              editMode={props.editMode}
              extraData={{...item.node}}
              previewPath={item.node.previewPath}
            />)
  })

  return (<div className="root nested" data-parentModelId={-1}>
    {items}
  </div>)
}

export default ListItems;