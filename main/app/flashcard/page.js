"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "../../firebase";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flipped, setFlipped] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  const setName = searchParams.get("id");

  const router = useRouter();

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const falshcards = [];

      docs.forEach((doc) => {
        falshcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(falshcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }
  return (
    <Container maxWidth="100vw">
         <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow: 1}}>
            MindFlip
          </Typography>
          <Button color="inherit" href="/">Home</Button>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        {setName} 
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "250px",
                        backgroundColor: " #f6fcff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      },
                      "& > div > div": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                        boxSizing: "border-box",
                      },
                      "& > div > div:nth-of-type(2)": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}