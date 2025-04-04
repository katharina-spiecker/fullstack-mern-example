import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import validator from "validator";

interface AuthRequest extends Request {
  body: {
    email: string;
    password?: string;
    token?: string;
  };
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).json({ error: "Invalid registration" });
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
      verified: false,
    });

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.RESEND_DEV_EMAIL!,
      subject: "Welcome! Please confirm your email",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #4CAF50;">Welcome to Y!</h1>
        <p>Please confirm your email!</p>
        <a href="http://localhost:5173/verify/${verificationToken}">Confirm<a/>
        <p>Next steps:</p>
        <ol>
            <li>Explore our features</li>
            <li>Set up your profile</li>
            <li>Start using our platform to maximize productivity</li>
        </ol>
        <p>Your Y Team</p>
        </div>
    `,
    });

    if (emailResponse.error) {
      return res
        .status(500)
        .json({ error: "Failed to send verification email" });
    }
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password || !validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid login" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "Invalid login" });
    }

    if (!user.verified) {
      return res.status(403).json({ error: "AccountNotVerified" });
    }
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ error: "Invalid login" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
    res.json({ user: user, token: token });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // get token from url and check if exists in users collection
  const token = req.params.token;
  try {
    const user = await User.findOne({ verificationToken: token });
    // was user found and token still valid?
    if (user && user.tokenExpiresAt && Date.now() < user.tokenExpiresAt) {
      // set verified to true
      user.verified = true;
      // remove fields (only needed if not verified)
      user.verificationToken = undefined;
      user.tokenExpiresAt = undefined;
      await user.save();
      return res.json({
        message: "Your account has been successfully verified.",
      });
    } else {
      return res.status(400).json({
        error:
          "Invalid or expired token. Please request a new verification email.",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const resendEmailVerification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: "invalid email" });
  }
  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24;

    const response = await User.updateOne(
      { email: email, verified: false },
      {
        verificationToken: verificationToken,
        tokenExpiresAt: tokenExpiresAt,
      }
    );

    if (response.matchedCount === 0) {
      return res.status(400).json({ error: "invalid data" });
    }
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "katharina.spiecker-freelancer@digitalcareerinstitute.org",
      subject: "Welcome! Please confirm your email",
      html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                  <h1 style="color: #4CAF50;">Welcome to Y!</h1>
                  <p>Please confirm your email!</p>
                  <a href="http://localhost:5173/verify/${verificationToken}">Confirm<a/>
                  <p>Next steps:</p>
                  <ol>
                    <li>Explore our features</li>
                    <li>Set up your profile</li>
                    <li>Start using our platform to maximize productivity</li>
                  </ol>
                  <p>Your Y Team</p>
                </div>
              `,
    });
    if (emailResponse.error) {
      return res
        .status(500)
        .json({ error: "Failed to send verification email" });
    }
    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export const requestPwdReset = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ error: "Input data not valid" });
  }

  try {
    const user = await User.findOne({ email: email });
    // if not found, send message
    if (!user) {
      return res.status(400).json({ error: "Input data not valid" });
    }
    // if found, generate reset token valid shortly only
    const pwdResetToken = crypto.randomBytes(32).toString("hex");
    const pwdResetTokenExpiresAt = Date.now() + 1000 * 60 * 60; // valid for one hour
    await User.updateOne(
      { email: email },
      { pwdResetToken, pwdResetTokenExpiresAt }
    );
    // send email
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.RESEND_DEV_EMAIL!,
      subject: "Password reset",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>You have requested to reset your password. This reset link will be valid for 1 hour.</p>
        <a href="http://localhost:5173/pwd-reset/${pwdResetToken}">Reset passwort<a/>
        <p>Your Y Team</p>
      </div>
    `,
    });

    if (emailResponse.error) {
      return res
        .status(500)
        .json({ error: "Failed to send verification email" });
    }
    res.json({ message: "email sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { password, token } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({
      message: "Password is required and must be at least 8 characters long.",
    });
  }
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // update password and remove fields
    const response = await User.updateOne(
      { pwdResetToken: token, pwdResetTokenExpiresAt: { $gt: Date.now() } },
      {
        password: hashedPassword,
        $unset: { pwdResetToken: "", pwdResetTokenExpiresAt: "" },
      }
    );
    if (response.matchedCount === 1) {
      res.json({ message: "updated successfully" });
    } else {
        res.status(400).json({
            error:
              "Invalid or expired token. Please request a new password reset email.",
        });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyPwdResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ pwdResetToken: token });
    // if user found and token valid
    if (
      user &&
      user.pwdResetTokenExpiresAt &&
      Date.now() < user.pwdResetTokenExpiresAt
    ) {
      res.status(204).send();
    } else {
        res.status(400).json({
          error:
            "Invalid or expired token. Please request a new password reset email.",
        });
    }
  } catch (error) {
    next(error);
  }
};
