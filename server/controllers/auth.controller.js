import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, year, enrollmentNo } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // Only allow admin to create admin/faculty accounts
    const safeRole = (role === 'admin' || role === 'faculty') ? 'student' : (role || 'student');

    const user = await User.create({ name, email, password, role: safeRole, department, year, enrollmentNo });
    // toJSON() already strips password via model method
    res.status(201).json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });
    res.json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};

// POST /api/auth/microsoft
export const microsoftLogin = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    let msUser = null;
    
    const clientID = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const redirectURI = req.body.redirectUri || process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:5173/auth/microsoft/callback';
    const tenantID = process.env.MICROSOFT_TENANT_ID || 'common';

    if (!clientID || !clientSecret) {
      return res.status(500).json({ message: 'Microsoft OAuth is not configured on the server' });
    }

    // Real Microsoft OAuth exchange
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientID,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectURI,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return res.status(tokenResponse.status).json({
        message: 'Microsoft token exchange failed',
        details: errorData
      });
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // 2. Fetch user profile from Microsoft Graph
    const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!profileResponse.ok) {
      return res.status(profileResponse.status).json({ message: 'Failed to fetch Microsoft profile' });
    }

    const profile = await profileResponse.json();
    msUser = {
      email: profile.mail || profile.userPrincipalName,
      displayName: profile.displayName || profile.givenName
    };

    // Validate Microsoft User email
    if (!msUser.email) {
      return res.status(400).json({ message: 'Microsoft account does not have a valid email' });
    }

    // Find or create user in MongoDB
    let user = await User.findOne({ email: msUser.email.toLowerCase() });
    if (!user) {
      // Create new user with default role 'student'
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      user = await User.create({
        name: msUser.displayName,
        email: msUser.email.toLowerCase(),
        password: randomPassword, // Will be hashed automatically by userSchema pre-save hook
        role: 'student',
        department: 'IT',
        year: '1st Year',
        enrollmentNo: 'MS/' + Math.floor(1000 + Math.random() * 9000)
      });
    } else {
      if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }
    }

    res.json({
      token: generateToken(user._id),
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
