import { prop, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { Field, ID, InputType, ObjectType } from 'type-graphql'

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

export const UserModel = getModelForClass(User)
