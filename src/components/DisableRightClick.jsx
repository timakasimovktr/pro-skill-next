// components/DisableRightClick.js
import React, { useEffect } from 'react';

const DisableRightClick = () => {
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault(); // Prevent default right-click behavior
    };

    // Add event listener for right-click
    window.addEventListener('contextmenu', handleContextMenu);

    // Cleanup function
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return null; // This component doesn't render anything
};

export default DisableRightClick;
