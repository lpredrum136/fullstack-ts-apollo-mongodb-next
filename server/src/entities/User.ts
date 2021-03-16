import { prop, getModelForClass } from '@typegoose/typegoose'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType() // GraphQL stuff
export class User {
  @Field(_type => ID)
  @prop()
  _id!: string

  @Field()
  @prop({ required: true, unique: true })
  username!: string

  @prop({ required: true })
  password!: string

  @Field()
  @prop()
  createdAt: Date = new Date()

  @Field()
  @prop()
  updatedAt: Date = new Date()
}

export const UserModel = getModelForClass(User)
