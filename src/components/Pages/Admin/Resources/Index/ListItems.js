import React from 'react'
import IndexItem from './IndexItem'

class ListItems extends React.Component {
  constructor(props){
    super(props);
    this.calcIndex = this.calcIndex.bind(this);
  }

  render () {
    let index;

    let items = this.props.items.map((item, i) => {

      return( <IndexItem 
                key={`${this.props.resourceType}-${item.id}`}
                modelId={item.id}
                index={index}
                primary={item.primary}
                secondary={item.secondary}
                resourceType={this.props.resourceType}
                deletable={item.deletable}
                childItems={item.children}
                depth={0}
                root={true}
                extraData={{...item}}
                editMode={this.props.editMode}
              />)
    })
    return (<div className="nested" data-parentModelId={-1}>{items}</div>)
  }
}

export default ListItems;