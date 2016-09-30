import React from 'react'
import IndexItem from './IndexItem'

const ListItems = (props) => {
  let items = props.items.map((item, i) => {
    return( <IndexItem 
              key={`${props.resourceType}-${item.id}`}
              modelId={item.id}
              primary={item.primary}
              secondary={item.secondary}
              resourceType={props.resourceType}
              deletable={item.deletable}
              childItems={item.children}
              depth={0}
              root={true}
              unmovable={item.unmovable}
              denyNested={item.denyNested}
              editMode={props.editMode}
              extraData={{...item}}
              previewPath={item.previewPath}
            />)
  })

  return (<div className="root nested" data-parentModelId={-1}>
    {items}
  </div>)
}

export default ListItems;