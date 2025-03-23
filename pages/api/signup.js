// pages/api/signup.js
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  await dbConnect();

  const { name, dateOfBirth, phone, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      dateOfBirth,
      phone,
      email,
      password: hashedPassword,
      joined: new Date(), // You can set this explicitly or rely on the default schema value
    });
    
    await newUser.save();
    
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}