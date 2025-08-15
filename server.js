const express = require('express');
const cors = require('cors') ;
const db = require('./config/db'); // your db connection
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/order', orderRoutes);


//check db connection
async function testDBConnection() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

testDBConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
