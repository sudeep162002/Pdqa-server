import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'
import mongoose from 'mongoose'

export const signin = async (req, res) => {
  const { email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" })

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    )

    if (!isPasswordCorrect)
      return res.status(404).json({ message: 'Invalid credientials' })

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      'test',
      { expiresIn: '1h' },
    )

    res.status(200).json({ result: existingUser, token })
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' })
  }
}

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, confirmpassword } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('user already exist with this email')
      return res
        .status(400)
        .json({ message: 'User already exist with this email' })
    }

    if (password !== confirmpassword) {
      console.log('password not correct')
      return res
        .status(400)
        .json({ message: "password and confirmPassword don't match" })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    })

    const token = jwt.sign({ email: result.email, id: result._id }, 'test', {
      expiresIn: '1h',
    })

    res.status(200).json({ result, token })
  } catch (error) {
    console.log('error occur')
    res.status(500).json({ message: 'something went wrong' })
  }
}
