import React from 'react';
import { cn } from '../lib/utils';

const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem'
};

const labelStyle = {
    marginBottom: '0.5rem',
    fontWeight: 'bold'
};

const inputFieldStyle = {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem'
};

const Input = ({ label, value, onChange, type = 'text', placeholder = '', className }) => (
    <div className={cn('input-container', className)} style={inputContainerStyle}>
        {label && <label className="input-label" style={labelStyle}>{label}</label>}
        <input
            className="input-field"
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={inputFieldStyle}
        />
    </div>
);

export {Input};
