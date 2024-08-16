import express from 'express';
import { connection } from './database/database';
import routes from './routes/taskRoutes';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

routes(app);

connection.getConnection((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

export default app;