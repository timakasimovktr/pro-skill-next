"use client";
import React from 'react'

const DialogContainer = ({ onClose, children }) => {
  return (
   <div className='dialogConatainer' onClick={onClose}>
        {children}
   </div> 
  )
}

export default DialogContainer;
