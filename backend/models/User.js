// Import Mongoose
import mongoose from 'mongoose';

// Define the user schema
const UserSchema = new mongoose.Schema({
  lecturerID: {
    type: String,
    required: true,
    unique: true // Assuming each lecturer has a unique ID
  },
  courses: {
    type: [String],
    required: true,
  }
});

// Create the User model
const UserModel = mongoose.model('User', UserSchema);
// Export the User model
export {UserModel as User};
