
import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './modules/auth/auth.routes.js'
import propertyRoutes from './modules/property/property.routes.js'
import unitRoutes from './modules/unit/unit.routes.js'
import tenantRoutes from './modules/tenant/tenant.routes.js'



const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRoutes)
app.use('/properties', propertyRoutes)
app.use('/units', unitRoutes)
app.use('/tenants', tenantRoutes)


app.get('/', (req, res) => {
  res.send('Are you sure ?');
});

export default app;