require('dotenv').config()
import { AuthInput, UserModel, UserMutationResponse } from '../entities/User'
import { Arg, Mutation, Resolver } from 'type-graphql'
// import { UserInputError } from 'apollo-server-errors'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

@Resolver()
export class UserResolver {
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
}
