import React from 'react';
import Avatar from 'material-ui/Avatar';

import gravatar from 'gravatar';

const Gravatar = (props) => {
  return (
    <Avatar style={{position: 'absolute', top: '8px', left: '18px'}} src={gravatar.url(props.email, {s: props.diameter, r: 'x', d: 'retro'}, true)} />
  )
};

export default Gravatar;
