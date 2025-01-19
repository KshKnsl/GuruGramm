import Mentor from "../models/Mentor.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendMail } from "../utils/mail.util.js";

async function createMentor(data) {
  try {
    const newMentor = new Mentor({
      name: data.name,
      email: data.email,
      password: data.password,
      dob: data.dob,
      avatar: data.avatar || "https://avatar.iran.liara.run/public/boy",
      bio: data.bio,
      socialLinks: data.socialLinks || [],
      points: data.points || 100,
      badges: data.badges || ["First Steps"],
      interests: data.interests || ["Reading"],
      articles: data.articles || [],
      readArticles: data.readArticles || [],
      lastRead: data.lastRead,
      location: data.location,
      occupation: data.occupation,
      education: data.education,
      skills: data.skills || [],
      specialties: data.specialties || [],
      ranking: data.ranking,
      totalMentees: data.totalMentees,
    });

    await newMentor.save();
    await sendMail(data.name, data.email, 'CreateAccount');
    return { success: true, message: "Mentor created successfully" };
  } 
  catch (error) 
  {
    return { success: false, message: `Error while creating mentor ${error}` };
  }
}

async function findMentor(id) {
  try {
    const mentor = await Mentor.findById(id)
    .populate('articles')
    .populate('readArticles')
    .populate('lastRead');
    return mentor;
  } catch (error) {
    return null;
  }
}

async function updateMentor(data) 
{
  const update = 
  {
    name: data.name,
    dob: data.dob,
    avatar: data.avatar || "https://avatar.iran.liara.run/public",
    bio: data.bio,
    socialLinks: data.socialLinks || [],
    points: data.points,
    badges: data.badges,
    interests: data.interests || [],
    articles: data.articles,
    readArticles: data.readArticles,
    lastRead: data.lastRead,
    location: data.location,
    occupation: data.occupation,
    education: data.education,
    skills: data.skills || [],
    specialties: data.specialties || [],
    ranking: data.ranking,
    totalMentees: data.totalMentees,
  };
  try 
  {
    let result = await Mentor.findByIdAndUpdate(data._id, update);
    return { success: true, message: "Mentor updated successfully" };
  } 
  catch (error) 
  {
    return { success: false, message: `Error while updating mentor ${error}` };
  }
}

async function loginMentor(data) {
  try 
  {
    const { email, password } = data;
    const mentor = await Mentor.findOne({ email }).select("+password");
    if (!mentor) 
    {
      return { success: false, message: "Mentor not found" };
    }
    const isRight = await bcrypt.compare(password, mentor.password);
    if (!isRight) 
    {
      return { success: false, message: "Invalid credentials" };
    }
    const token = jwt.sign({ id: mentor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: pass, ...rest } = mentor;
    
    await sendMail(data.name, data.email, 'Login');
    return { success: true, token, rest};
  }
  catch (error) 
  {
    return { success: false, message: `Error while logging in ${error}` };
  }
}

const client = new OAuth2Client(process.env.client_id);

async function googleLogin(token) 
{
  try 
  {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.client_id,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture;

    let mentor = await Mentor.findOne({ email });
    if (!mentor) 
    {
      mentor = new Mentor({
        name,
        email,
        avatar,
        password: "GooGleAuthAccount",
      });
      await sendMail(name, email, 'CreateAccount');   
      await mentor.save();
    }

    const jwtToken = jwt.sign({ id: mentor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    const { ...mentorWithoutPassword } = mentor.toObject();
    await sendMail(name, email, 'Login');
    return { success: true, token: jwtToken, mentor: mentorWithoutPassword };
  } catch (error) {
    return { success: false, message: "Error during Google login" };
  }
}

function findMentorByEmail(email) 
{
  return Mentor.findOne({ email});
}

export { createMentor, findMentor, updateMentor, loginMentor, googleLogin, findMentorByEmail };