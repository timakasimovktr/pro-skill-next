"use client";
import React from 'react'

const DialogPopup = ({ onClose, children }) => {
  return (
   <div className='dialogPopup' onClick={onClose}>
    { children }
   </div> 
  )
}

export default DialogPopup;
