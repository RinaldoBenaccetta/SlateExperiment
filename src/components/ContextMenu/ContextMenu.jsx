import React from 'react';

const ContextMenu = ({ items, position, onClick }) => {
  const { x, y } = position;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        backgroundColor: 'lightgrey',
        border: '1px solid #ccc',
        color: 'black,'
      }}
    >
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {items.map((item, index) => (
          <li key={index} onClick={() => onClick(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
