const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user'); // 👈 thêm dòng này

dotenv.config();
const app = express();
app.use(express.json());

// Gắn route user
app.use('/users', userRoutes); // 👈 thêm dòng này

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend server is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
