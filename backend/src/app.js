
import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './modules/auth/auth.routes.js'
import propertyRoutes from './modules/property/property.routes.js'
import unitRoutes from './modules/unit/unit.routes.js'
import tenantRoutes from './modules/tenant/tenant.routes.js'
import rentRoutes from './modules/rent/rent.routes.js'
import { globalLimiter, authLimiter } from './middlewares/rateLimiter.js'
import ownerRoutes from './modules/owner/owner.routes.js'



const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(globalLimiter)
app.use('/auth', authLimiter)

app.use('/auth', authRoutes)
app.use('/properties', propertyRoutes)
app.use('/units', unitRoutes)
app.use('/tenants', tenantRoutes)
app.use('/rent', rentRoutes)
app.use('/owner', ownerRoutes)



app.get('/', (req, res) => {
  res.send('Are you sure ?');
});

export default app;