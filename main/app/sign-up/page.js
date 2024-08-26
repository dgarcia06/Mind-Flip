import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
    return (
        <Container
          maxWidth="100vw"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >

    <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>
            MindFlip
          </Typography>
            <Button color="inherit" href="sign-in"> Sign In</Button>
            <Button color="inherit" href="/">Home</Button>
        </Toolbar>
      </AppBar>
  
  <Box
        sx={{
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <SignUp routing="hash" />;
      </Box>
    </Container>
  );
}