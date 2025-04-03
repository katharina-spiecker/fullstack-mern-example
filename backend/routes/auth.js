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
      verified: false
    })

    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.RESEND_DEV_EMAIL,
      subject: 'Welcome! Please confirm your email',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #4CAF50;">Welcome to Y!</h1>
        <p>Please confirm your email!</p>
        <a href="http://localhost:5173/verify/${verificationToken}">E-Mail bestätigen<a/>
        <p>Next steps:</p>
        <ol>
          <li>Explore our features</li>
          <li>Set up your profile</li>
          <li>Start using our platform to maximize productivity</li>
        </ol>
        <p>Your Y Team</p>
      </div>
    `
    });

    if (emailResponse.error) {
      return res.status(500).json({error: 'Failed to send verification email'})
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

router.post("/email-verification-resend", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({error: 'email required'});
  }

  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24;

    const response = await User.updateOne({email: email, verified: false}, {
      verificationToken: verificationToken,
      tokenExpiresAt: tokenExpiresAt,
    })

    if (response.matchedCount === 0) {
      return res.status(400).json({error: 'invalid data'});
    }

    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'katharina.spiecker-freelancer@digitalcareerinstitute.org',
      subject: 'Willkommen! Bitte E-Mail bestätigen',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #4CAF50;">Welcome to d01b!</h1>
        <p>Wir freuen uns, dich in unserem Team zu haben.</p>
        <p>Bitte bestätige deine Email!</p>
        <a href="http://localhost:5173/verify/${verificationToken}">E-Mail bestätigen<a/>
        <p>Nächste Schritte:</p>
        <ol>
          <li>Explore our features</li>
          <li>Set up your profile</li>
          <li>Start using our platform to maximize productivity</li>
        </ol>
        <p>Bis bald!</p>
        <p>Das d01b Team</p>
      </div>
    `
    });

    if (emailResponse.error) {
      return res.status(500).json({error: 'Failed to send verification email'})
    }

    res.json({message: "Verification email sent"});
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
      return res.status(403).json({error: "AccountNotVerified"});
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({error: 'Invalid login'});
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

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

router.post("/request/pwd-reset", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({error: 'Input data not valid'});
  }

  try {
    const user = await User.findOne({email: email});
    // if not found, send message
    if (!user) {
      return res.status(400).json({error: 'Input data not valid'});
    }
    // if found, generate reset token valid shortly only
    const pwdResetToken = crypto.randomBytes(32).toString("hex");
    const pwdResetTokenExpiresAt = Date.now() + 1000 * 60 * 60; // valid for one hour
    await User.updateOne({email: email}, {pwdResetToken, pwdResetTokenExpiresAt});
    // send email
    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'katharina.spiecker-freelancer@digitalcareerinstitute.org',
      subject: 'Passwort reset',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>You have requested to reset your password. This reset link will be valid for 1 hour.</p>
        <a href="http://localhost:5173/pwd-reset/${pwdResetToken}">Reset passwort<a/>
        <p>Your Fullstack-MERN Team</p>
      </div>
    `
    });

    if (emailResponse.error) {
      return res.status(500).json({error: 'Failed to send verification email'})
    }
    res.json({message: "email sent"});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
  

})

router.get("/verify/pwd-reset-token/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({pwdResetToken: token});
    // check ob user gefunden und token noch gültig
    if (user && Date.now() < user.pwdResetTokenExpiresAt) {
      res.status(204).send();
    } else {
      res.status(400).json({error: "Invalid or expired token. Please request a new password reset email."})
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.post("/reset-pwd",  async (req, res) => {
  const {password, token} = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({message: "Password is required and must be at least 8 characters long."});
  }
  if (!token) {
    return res.status(400).json({message: "Token is required"});
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // update password and remove fields
    const response = await User.updateOne({pwdResetToken: token, pwdResetTokenExpiresAt: { $gt: Date.now()}}, {
      password: hashedPassword,
      $unset: { pwdResetToken: "", pwdResetTokenExpiresAt: "" }
    });
    if (response.matchedCount === 1) {
      res.json({message: "updated successfully"});
    } else {
      res.status(400).json({error: "Invalid or expired token. Please request a new password reset email."});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

export default router;