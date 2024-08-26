import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
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
          <Button color="inherit" href="sign-up"> Sign Up</Button>
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
        <SignIn routing="hash" />;
      </Box>
    </Container>
  );
}