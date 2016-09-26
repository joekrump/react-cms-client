import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../../../muiTheme';
import IndexItemActions from './IndexItemActions'
import Dragula from 'react-dragula';

// import { VelocityComponent } from 'velocity-react';
// import 'velocity-animate/velocity.ui';

let style = {
  backgroundColor: fade(fullBlack, 0.7)
}

class IndexItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }
  }

  showItem(visible = false) {
    this.setState({visible});
  }


  dragulaDecorator(componentBackingInstance) {
    if (componentBackingInstance) {
      let options = { 
        isContainer: (el) => {
          return this.props.root;
        }
      };
      Dragula([componentBackingInstance]);
    }
  }
  
  getText(){
    return(
      <div className="inner-text" style={{color: muiTheme.palette.textColor}}><strong>{this.props.primary}</strong>{this.props.secondary ? (<span> -&nbsp;{this.props.secondary}</span>) : null}</div>
    )
  }

  render(){
    if(this.state.visible) {
      style.opacity = 1;
      style.height = null;
      // style.padding = '16px 16px 16px 16px'
      // style.marginLeft = (this.props.depth * 30) + 'px'
    } else {
      style.opacity = 0;
      style.height = 0;
      style.padding = 0;
    }

    let queryProps = this.props.extraData

    if(this.props.extraData) {  
      delete queryProps.primary;
    }
    
    return(
      <div className="index-item f-no-select" ref={(componentBackingInstance) => this.dragulaDecorator(componentBackingInstance)}>
        {!this.props.root ?   
          <ListItem
            className={"list-item" + (this.props.depth ? ' depth-' +  this.props.depth : '')}
            disabled
            rightIconButton={
              <IndexItemActions 
                resourceType={this.props.resourceType} 
                id={this.props.id} 
                deleteCallback={ this.props.deletable ? () => this.showItem() : undefined} 
                queryProps={{...queryProps}}
                deletable={this.props.deletable}
              />
            }
            primaryText={this.getText()}
            style={{...style}}
          /> : null
        }
        { this.props.childItems ? 
          this.props.childItems.map((child) => (
            // {primary, secondary, id, deletable, children, ...extraData} = child;
            <IndexItem 
              key={`${this.props.resourceType}-${child.id}`}
              id={child.id}
              primary={child.primary}
              secondary={child.secondary}
              resourceType={this.props.resourceType}
              deletable={child.deletable}
              childItems={child.children}
              depth={child.depth}
              extraData={{...child}}
            />
          )) : null
        }
      </div>
    );
  }
}

export default IndexItem;