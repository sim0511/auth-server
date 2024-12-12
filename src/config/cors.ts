export const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5000",
        "https://accounts.google.com", "https://www.google.com", "https://www.googleapis.com",
        "https://www.simrandev.com"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  };
  