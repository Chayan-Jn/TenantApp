import dotenv from 'dotenv/config'

export const env = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URLS: process.env.FRONTEND_URLS || 'http://localhost:5173',
    NODE_ENV: process.env.NODE_ENV || 'development',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CA_CERT: process.env.CA_CERT,
    S3_ENDPOINT: process.env.BACKBLAZE_ENDPOINT,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    PAYPAL_API_KEY: process.env.PAYPAL_API_KEY,
    PAYPAL_API_SECRET: process.env.PAYPAL_API_SECRET
}
