
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRoutes from './modules/auth/auth.routes.js'
import propertyRoutes from './modules/property/property.routes.js'
import unitRoutes from './modules/unit/unit.routes.js'
import tenantRoutes from './modules/tenant/tenant.routes.js'
import rentRoutes from './modules/rent/rent.routes.js'
import { globalLimiter, authLimiter } from './middlewares/rateLimiter.js'
import ownerRoutes from './modules/owner/owner.routes.js'
import cors from 'cors'
import dashboardRoutes from './modules/dashboard/dashboard.routes.js'
import paymentsRoutes from './modules/payments/payments.routes.js'
import billsRoutes from './modules/bills/bills.routes.js'
import ledgerRoutes from './modules/ledger/ledger.routes.js'
import photoRoutes from './modules/photo/photo.routes.js'
import subscriptionRoutes from './modules/subscription/subscription.routes.js'
import { errorHandler } from './middlewares/error.middleware.js'

import { env } from './config/env.js'


const app = express();

// Trust the reverse proxy (crucial for accurate IP rate limiting behind Cloudflare/Render/AWS)
app.set('trust proxy', 1);
const allowedOrigins = env.FRONTEND_URLS.split(',');

app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

app.use(globalLimiter)
app.use('/auth', authLimiter)

app.use('/auth', authRoutes)
app.use('/properties', propertyRoutes)
app.use('/units', unitRoutes)
app.use('/tenants', tenantRoutes)
app.use('/rent', rentRoutes)
app.use('/owner', ownerRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/payments', paymentsRoutes)
app.use('/bills', billsRoutes)
app.use('/ledger', ledgerRoutes)
app.use('/photos', photoRoutes)
app.use('/subscription', subscriptionRoutes)



app.get('/', (req, res) => {
  res.send('Are you sure ?');
});

app.use(errorHandler);

export default app;