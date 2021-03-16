import { AuthInput, User, UserModel } from '../entities/User'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { UserInputError } from 'apollo-server-errors'
import argon2 from 'argon2'

@Resolver()
export class UserResolver {
  @Mutation(_returns => User)
  async register(
    @Arg('registerInput') registerInput: AuthInput
  ): Promise<User> {
    if (registerInput.username.length <= 2) {
      throw new UserInputError('Wrong', {
        incorrectField: 'username',
        message: 'username length must be greater than 2 characters'
      })
    }

    if (registerInput.password.length <= 2) {
      throw new UserInputError('Wrong', {
        incorrectField: 'password',
        message: 'password length must be greater than 2 characters'
      })
    }

    const hashedPassword = await argon2.hash(registerInput.password)
    const newUser = new UserModel({
      username: registerInput.username,
      password: hashedPassword
    })

    await newUser.save()

    return newUser
  }
}
