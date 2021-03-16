require('dotenv').config()
import 'reflect-metadata'

import express from 'express'
import mongoose from 'mongoose'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import { GraphQLContext } from './types'

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fullstack-lireddit-self.isqte.mongodb.net/fullstack-lireddit-self?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    )
    console.log('MongoDB connected yay')
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}

connectDB()

const main = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }: GraphQLContext) => ({ req, res })
  })

  const app = express()
  server.applyMiddleware({ app })

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () =>
    console.log(
      `Server started on port ${PORT}. Apollo Server started at localhost:${PORT}${server.graphqlPath}`
    )
  )
}

main().catch(error => console.log(error))
