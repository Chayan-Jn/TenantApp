import * as authService from './auth.service.js'
import {env} from '../../config/env.js'

export const register = async (req, res) => {
  try {

    const owner = await authService.registerOwner(req.body)
    res.status(201).json({ success: true, data: owner })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { token, owner } = await authService.loginOwner(req.body)

    res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

    res.status(200).json({ success: true, data: owner })
  } catch (err) {
    res.status(401).json({ success: false, message: err.message })
  }
}

import jwt from 'jsonwebtoken'

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.token
    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET, { ignoreExpiration: true })
      await authService.revokeTokens(decoded.id);
    }
  } catch (err) {
    console.error("Error revoking tokens on logout", err);
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax'
  })
  res.status(200).json({ success: true, message: 'Logged out' })
}


export const googleLogin = async (req, res) => {
  try {
    const { token, owner } = await authService.loginWithGoogle(req.body.token)

    res.cookie('token', token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ success: true, data: owner })
  } catch (err) {
    res.status(401).json({ success: false, message: err.message })
  }
}