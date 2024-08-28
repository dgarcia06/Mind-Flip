"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/navigation";

export default function FlashcardSets() {
  const { user, isSignedIn } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchFlashcardSets = async () => {
        try {
          const userDocRef = doc(db, "users", user.id);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const sets = data.flashcards || [];
            setFlashcardSets(sets);
          }
        } catch (error) {
          console.error("Error fetching flashcard sets:", error);
          setError("Failed to retrieve flashcard sets. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchFlashcardSets();
    }
  }, [isSignedIn, user]);

  const handleCardClick = (setName) => {
    router.push(`/flashcard?id=${setName}`);
  };

  return (
    <Container maxWidth="100vw">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            MindFlip
          </Typography>
          <Button color="inherit" href="/">Home</Button>
        </Toolbar>
      </AppBar>
      <Typography mt={4} variant="h4" align="center" gutterBottom>
        Your Flashcard Sets
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} mt={4}>
          {flashcardSets.length > 0 ? (
            flashcardSets.map((setName) => (
              <Grid item xs={12} sm={6} md={4} key={setName}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "primary.light",
                      boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
                    },
                    height: "100%",
                  }}
                  onClick={() => handleCardClick(setName)}
                >
                  <Typography variant="h6" align="center">
                    {setName}
                  </Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" align="center">
              You have no flashcard sets saved.
            </Typography>
          )}
        </Grid>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

