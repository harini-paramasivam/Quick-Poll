const mongoose = require('mongoose');

const connectDB = async (uri) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB Atlas');
};

module.exports = connectDB;
