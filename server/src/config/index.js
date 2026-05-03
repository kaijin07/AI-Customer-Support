import dotenv from 'dotenv';

dotenv.config();

if(!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is required');
}

if(!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

if(!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is required');
}

if(process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL) {
  throw new Error('CLIENT_URL is required in production');
}

if(process.env.NODE_ENV === 'production' && !process.env.JWT_COOKIE_EXPIRE) {
  throw new Error('JWT_COOKIE_EXPIRE is required in production');
}

if(process.env.NODE_ENV === 'production' && !process.env.JWT_EXPIRE) {
  throw new Error('JWT_EXPIRE is required in production');
} 

if(process.env.NODE_ENV === 'production' && !process.env.PORT) {
  throw new Error('PORT is required in production');
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  jwtCookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 30,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:5000',
  groqApiKey: process.env.GROQ_API_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  gmailUser: process.env.GMAIL_USER,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
};

export default config;
