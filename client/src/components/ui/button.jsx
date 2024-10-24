import React from 'react';
import { cn } from '../lib/utils';

const buttonStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
};

const hoverStyle = {
    backgroundColor: '#007BFF',
    color: 'white'
};

const disabledStyle = {
    backgroundColor: '#ddd',
    cursor: 'not-allowed'
};

const Button = ({ onClick, children, type = 'button', className = '', disabled = false }) => (
    <button
        className={cn('button', className)}
        style={{
            ...buttonStyle,
            ...(disabled ? disabledStyle : {}),
        }}
        type={type}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={(e) => {
            if (!disabled) Object.assign(e.target.style, hoverStyle);
        }}
        onMouseLeave={(e) => {
            if (!disabled) Object.assign(e.target.style, buttonStyle);
        }}
    >
        {children}
    </button>
);

export { Button };
