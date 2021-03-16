require('dotenv').config()
import {
  AuthInput,
  User,
  UserModel,
  UserMutationResponse
} from '../entities/User'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
// import { UserInputError } from 'apollo-server-errors'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { GraphQLContext, JWTData } from '../types'

@Resolver()
export class UserResolver {
  @Query(_returns => User, { nullable: true })
  async me(@Ctx() { req }: GraphQLContext): Promise<User | null> {
    try {
      const authHeader = req.header('Authorization')
      const token = authHeader && authHeader.split(' ')[1]

      if (!token) return null

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JWTData // if you don't have this, it's gonna show error becuase decoded is typed "string | object". It can't extract userId from it.
      const user = await UserModel.findById(decoded.userId)

      if (!user) return null
      return user
    } catch (error) {
      console.log(error)
      return null
    }
  }
  @Mutation(_returns => UserMutationResponse)
  async register(
    @Arg('registerInput') registerInput: AuthInput
  ): Promise<UserMutationResponse> {
    if (registerInput.username.length <= 2) {
      // Throw new error is fine but not very good
      // throw new UserInputError('Wrong', {
      //   incorrectField: 'username',
      //   message: 'username length must be greater than 2 characters'
      // })

      return {
        code: 400,
        success: false,
        message: 'Invalid username',
        errors: [
          { field: 'username', message: 'Length must be greater than 2' }
        ]
      }
    }

    if (registerInput.password.length <= 2) {
      // Throw new error is fine but not very good
      // throw new UserInputError('Wrong', {
      //   incorrectField: 'password',
      //   message: 'password length must be greater than 2 characters'
      // })
      return {
        code: 400,
        success: false,
        message: 'Invalid password',
        errors: [
          { field: 'password', message: 'Length must be greater than 2' }
        ]
      }
    }

    const hashedPassword = await argon2.hash(registerInput.password)
    try {
      // check if user already exists
      let user = await UserModel.findOne({ username: registerInput.username })
      if (user)
        return {
          code: 400,
          success: false,
          message: 'Duplicated username',
          errors: [{ field: 'username', message: 'Username already exists' }]
        }

      const newUser = new UserModel({
        username: registerInput.username,
        password: hashedPassword
      })

      await newUser.save()

      // return token
      const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.ACCESS_TOKEN_SECRET!, // if not !, error - because it could be undefined
        {
          expiresIn: '1h'
        }
      )

      return {
        code: 200,
        success: true,
        message: 'Created user successfully',
        user: newUser,
        accessToken
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        success: false,
        message: 'Internal server error'
      }
    }
  }

  @Mutation(_returns => UserMutationResponse)
  async login(
    @Arg('loginInput') loginInput: AuthInput
  ): Promise<UserMutationResponse> {
    try {
      const user = await UserModel.findOne({ username: loginInput.username })
      if (!user)
        return {
          code: 400,
          success: false,
          message: 'Cannot find user',
          errors: [{ field: 'username', message: 'Username does not exist' }]
        }

      // username found
      const passwordValid = await argon2.verify(
        user.password,
        loginInput.password
      )
      if (!passwordValid)
        return {
          code: 400,
          success: false,
          message: 'Wrong password',
          errors: [{ field: 'password', message: 'Incorrect password' }]
        }

      // username found and password correct
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET!, // if not !, error - because it could be undefined
        {
          expiresIn: '1h'
        }
      )

      return {
        code: 200,
        success: true,
        message: 'Created user successfully',
        user,
        accessToken
      }
    } catch (error) {
      console.log(error)
      return {
        code: 500,
        success: false,
        message: 'Internal server error'
      }
    }
  }
}
