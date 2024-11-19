import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from 'node:crypto';
import { Resend } from 'resend';
import jwt from "jsonwebtoken";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({error: 'Invalid registration'});
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24;

    const user = await User.create({
      email: email,
      password: hashedPassword,
      verificationToken: verificationToken,
      tokenExpiresAt: tokenExpiresAt,
      verified: true // TODO: nur zum Testen, lösch danach wieder
    })

    // const emailResponse = await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: 'katharina.spiecker-freelancer@digitalcareerinstitute.org',
    //   subject: 'Willkommen! Bitte E-Mail bestätigen',
    //   html: `
    //   <div style="font-family: Arial, sans-serif; color: #333;">
    //     <h1 style="color: #4CAF50;">Welcome to d01b!</h1>
    //     <p>Wir freuen uns, dich in unserem Team zu haben.</p>
    //     <p>Bitte bestätige deine Email!</p>
    //     <a href="http://localhost:3000/verify/${verificationToken}">E-Mail bestätigen<a/>
    //     <p>Nächste Schritte:</p>
    //     <ol>
    //       <li>Explore our features</li>
    //       <li>Set up your profile</li>
    //       <li>Start using our platform to maximize productivity</li>
    //     </ol>
    //     <p>Bis bald!</p>
    //     <p>Das d01b Team</p>
    //   </div>
    // `
    // });

    // if (emailResponse.error) {
    //   return res.status(500).json({error: 'Failed to send verification email'})
    // }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
  
})

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({error: 'Invalid login'});
  }

  try {
    // TODO: checke erst ob Email korrekt
    const user = await User.findOne({email: email});
    if (!user) {
      return res.status(401).json({error: 'Invalid login'});
    }

    // check ob verified ist
    if (!user.verified) {
      return res.status(403).json({error: "Account not verified"});
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({error: 'Invalid login'});
    }

    // TODO Erstelle JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    // TODO Antworte mit token und paar Userdaten
    res.json({user: user, token: token});

  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
})

router.get("/verify/:token", async (req, res) => {
  // hole Token aus URL
  // überprüfe ob Token in der users collection existiert
  const token = req.params.token;
  try {
    const user = await User.findOne({verificationToken: token});
    // check ob user gefunden und token noch gültig
    if (user && Date.now() < user.tokenExpiresAt) {
      // verified auf true setzen
      user.verified = true;
      // entferne die anderen Felder (nur benötigt wenn nicht verified)
      user.verificationToken = undefined;
      user.tokenExpiresAt = undefined;
      // speichere verändertes Objekt
      await user.save();
      res.json({"message": "Your account has been successfully verified."});
    } else {
      res.status(400).json({error: "Invalid or expired token. Please request a new verification email."})
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

export default router;