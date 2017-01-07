import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';

export default class Loader extends React.PureComponent {
  render() {
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%'}}>
        <RefreshIndicator 
          size={50}
          left={-25}
          top={0}
          status="loading"
          style={{display:'inline-block', position: 'relative'}}
        />
      </div>
    );
  }
}
