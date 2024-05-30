import * as React from 'react';
import Sheet from '@mui/joy/Sheet';
import MessagesPane from './MessagesPane';

export default function MyProfile() {
  return (
    <Sheet
      sx={{
        width: '100%',
        mx: 'auto',
        pt: { xs: 'var(--Header-height)', sm: 0 },
        borderRadius: "15px",
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min(30%, 300px)) 1fr',
        },
      }}
    >
      <MessagesPane />
    </Sheet>
  );
}
