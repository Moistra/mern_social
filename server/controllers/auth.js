import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

// REGISTER USER
export const register = async (req, res) => { 
  try {
    const {
      firstName,
      lastName,
      email, 
      password,
      picturePath,
      friends,
      occupation,
      location
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
      firstName,
      lastName,
      email, 
      password: passwordHash,
      picturePath,
      friends,
      occupation,
      location,
      viewedProfile: 777,
      impressions: 888,
    })

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);

  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}



// LOGGING IN 
export const login = async (req, res) => { 
  try {

    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({ email: email })
    
    if (!user)
      return res.status(400).json({ msg: 'user does not exist or invalid credentials' })
    
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'user does not exist or invalid credentials' })
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    delete user.password;
    res.status(200).json({
      token,
      user
    })
    
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}