import React from 'react';
import './Comment.css';

const Comment = (props) => {
  return (
    <div>
      <div className={`Comment ${props.type}`} type={props.type}>
        {props.message}
      </div>
    </div>
  );
}

export default Comment;
