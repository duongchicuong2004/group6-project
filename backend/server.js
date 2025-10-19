const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user'); // 👈 route user

dotenv.config();

const app = express();
app.use(express.json());

// 👉 Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Routes
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend server is running...');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
