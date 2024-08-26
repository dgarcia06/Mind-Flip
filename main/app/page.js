"use client";

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Container, AppBar, Toolbar, Typography, Button, Box, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { School, FlashOn, Search, Tune, Feedback } from '@mui/icons-material';
import Head from "next/head";

export default function Home() {
  const { isSignedIn } = useUser();

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();
  
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
  
    if (error) {
      console.warn(error.message);
    } else {
      // Assume userId and subscriptionStatus are available
      const userId = 'USER_ID';  // Replace with actual user ID
      const subscriptionStatus = 'active';  // or 'canceled' based on your logic
      
      await fetch('/api/update_subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, subscriptionStatus }),
      });
    }
  };  

  const features = [
    {
      icon: <School fontSize="large" />,
      title: "Generative AI Integration",
      description: "Automatically generate flashcards with AI to streamline your study process."
    },
    {
      icon: <Tune fontSize="large" />,
      title: "Interactive UI",
      description: "Clean and responsive interface for easy flashcard management."
    },
    {
      icon: <Feedback fontSize="large" />,
      title: "Real-time Feedback",
      description: "Instantly generate and display flashcards as you input data."
    },
  ];

  const pricingPlans = [
    {
      title: "Basic",
      description: "Free access to core features. Generate up to 100 flashcards per day.",
      buttonText: "Create Account",
      price: "Free",
      onClick: () => window.location.href = '/sign-up'
    },
    {
      title: "Pro",
      description: "Generate unlimited flashcards and remove all ads.",
      buttonText: "Choose Pro",
      price: "$4.99 / month",
      onClick: handleSubmit
    }
  ];

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard Creator</title>
        <meta name="description" content="Create flashcards from text" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            MindFlip
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to MindFlip
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Improve your study habits with our flashcard generator.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/generate">
          Create Flashcards
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }} href="/flashcards">
          My Flashcards Sets
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ display: 'flex', alignItems: 'center' }}>
                <CardMedia>
                  {feature.icon}
                </CardMedia>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ padding: 3, textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {plan.title}
                  </Typography>
                  <Typography variant="h6" component="div" color="text.primary">
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {plan.description}
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={plan.onClick}>
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

