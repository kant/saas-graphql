import { ApolloServer } from 'apollo-server'
import mongoose from 'mongoose';
import { projectResolvers, projectTypeDefs } from './resources/project/schema';
import { organizationResolvers, organizationTypeDefs } from './resources/organization/schema';
import { userResolvers, userTypeDefs } from './resources/user/schema';
import jwt from 'jsonwebtoken';
import {rootTypeDefs} from './resources/root';
import config from './config';

mongoose.connect(config.mongodb.uri , { useNewUrlParser: true, useCreateIndex: true })

const server = new ApolloServer({
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
  context: async ({ req: { headers: { authorization } } }) => {
    const jwtToken = authorization || '';
    const decoded = await jwt.verify(jwtToken, config.token.secret, {algorithms: ['HS256']}, (err, decoded) => decoded);
    return decoded
  },
  introspection: true,
  playground: true
})

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});