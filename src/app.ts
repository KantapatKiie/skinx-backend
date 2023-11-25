// src/app.ts
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Post from "./posts/post.model";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const port = 3001;
const secretKey = "secret-key-27017-service"; // Replace with a strong secret key

app.use(cors());
app.use(express.json());
app.options("*", cors());

mongoose.connect("mongodb://localhost:27017/service");

// Middleware for JWT Authentication
const authenticateJWT = (req: any, res: any, next: any) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Forbidden" });
  }

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route to login and get JWT token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hardcodedUser = {
      username: username,
      passwordHash:
        "$2y$10$.douIN7RFzz1t1DLxKIdUOjWkom6RB/gwpeKwZMxBgGE7ybsA4veS", // Hashed password 'password'
    };

    const passwordMatch = bcrypt.compare(password, hardcodedUser.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Create JWT and return token
    const token = jwt.sign({ username: username, password: password }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to intregate data from posts.json to the database
app.get("/seed/data/all", async (req, res) => {
  try {
    // Read data from posts.json
    const filePath = "posts.json";
    const data = await fs.readFile(filePath, "utf8");
    const posts = JSON.parse(data);

    // Seed data to the database
    await Post.insertMany(posts);
    res.json({ message: "Data seeded successfully" });
    console.log("Data seeded successfully >> 200");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all posts (requires authentication)
app.get("/posts", authenticateJWT, async (req, res) => {
  try {
    const { offset, limit } = req.body;
    const posts = await Post.find()
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/posts/search", authenticateJWT, async (req, res) => {
  try {
    const { titleSearch, tagSearch, skip, limit } = req.body;
    const { page = 1 } = skip;
    const offset = page ? (+page != 1 ? (+page - 1) * +limit : 0) : 0;

    if (titleSearch !== "" || tagSearch !== "") {
      const postsSearch = await Post.find();
      const checkSearch = postsSearch.filter((itemMain) => {
        if (titleSearch !== "" && tagSearch !== "") {
          if (
            itemMain.title.toLowerCase().includes(titleSearch.toLowerCase()) &&
            itemMain.tags.includes(tagSearch)
          ) {
            return itemMain;
          }
        } else {
          if (titleSearch !== "") {
            if (
              itemMain.title.toLowerCase().includes(titleSearch.toLowerCase())
            ) {
              return itemMain;
            }
          } else if (tagSearch !== "") {
            if (itemMain.tags.includes(tagSearch)) {
              return itemMain;
            }
          }
        }
      });

      res.json(checkSearch);
    } else {
      const posts = await Post.find()
        .skip(offset ? offset : 0)
        .limit(limit ? limit : 100);
      res.json(posts);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
