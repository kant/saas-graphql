import { ApolloServer } from 'apollo-server'
import mongoose from 'mongoose';
import { projectResolvers, projectTypeDefs } from './resources/project/schema';
import { organizationResolvers, organizationTypeDefs } from './resources/organization/schema';
import { userResolvers, userTypeDefs } from './resources/user/schema';
import jwt from 'jsonwebtoken';
import {rootTypeDefs} from './resources/root';
import config from './config';
import cookie from 'cookie';

mongoose.connect(config.mongodb.uri , { useNewUrlParser: true, useCreateIndex: true })

const server = new ApolloServer({
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  },
  typeDefs: [rootTypeDefs, projectTypeDefs, organizationTypeDefs, userTypeDefs ],
  resolvers: {
    Query: {
      ...userResolvers.Query,
      ...organizationResolvers.Query,
      ...projectResolvers.Query
    },
    Mutation: {
      ...userResolvers.Mutation,
      ...organizationResolvers.Mutation,
      ...projectResolvers.Mutation
    },
  },
  context: async ({ req, res }) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token ? jwt.verify(cookies.token, config.token.secret, { algorithms: ['HS256'] }) : {};
    return { req, res, token }
  },
  introspection: true,
  playground: true
})

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});