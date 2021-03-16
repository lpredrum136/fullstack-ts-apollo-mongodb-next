import { prop, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { FieldError } from './FieldError'
import { IMutationResponse } from './MutationResponse'

@ObjectType() // GraphQL stuff
export class User {
  @Field(_type => ID)
  // @prop() // no need for this in Model because MongoDB automatically creates one
  _id!: mongoose.Types.ObjectId // string is fine as well

  @Field()
  @prop({ required: true, unique: true })
  username!: string

  @prop({ required: true })
  password!: string

  @Field()
  @prop({ default: Date.now })
  createdAt: Date = new Date()

  @Field()
  @prop({ default: Date.now })
  updatedAt: Date = new Date()
}

@InputType()
export class AuthInput {
  @Field()
  username: string

  @Field()
  password: string
}

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
  code: number
  success: boolean
  message?: string

  @Field({ nullable: true })
  user?: User

  @Field({ nullable: true })
  accessToken?: string

  @Field(_type => [FieldError], { nullable: true })
  errors?: FieldError[]
}

export const UserModel = getModelForClass(User)
