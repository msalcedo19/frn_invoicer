import React from 'react';
import { Typography, Box } from '@mui/material';

const SeparatorWithText = ({ title }: {title: string | undefined}) => {
  return (
    <Box display="flex" alignItems="center">
      <Box flex="1" borderBottom="1px solid gray"></Box>
      {title && <Typography variant="body1" component="span" mx={2} className="post-title">
        {title}
      </Typography>}
      <Box flex="1" borderBottom="1px solid gray"></Box>
    </Box>
  );
};

export default SeparatorWithText;
