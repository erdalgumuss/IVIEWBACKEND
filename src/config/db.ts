import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/iViewNewDB');
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

export default connectDB;
//$2a$10$HSIyfGbA646Nu2jwqs73netJ8Eo8lD04KeEFO4VS5jJkrCCfSlu4q
//"$2b$12$1WnsEhsWZxtzE30kdlG0wOcMRzxa7OGTqvYwWllA4yNw1xEmapAH."
//"$2a$10$bXBkq1jqBOoz2JJuFafAVeqNjx.5iRkBuERkcOEbnnq59BoEQJrey"