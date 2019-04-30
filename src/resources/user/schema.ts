import jwt from 'jsonwebtoken';
import User from './model';
import { gql } from 'apollo-server'
import config from '../../config';

import { IResolverSet } from '../root'

export const userTypeDefs = gql`
  input LoginInput {
    email: String!
    password: String!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    jwt: String
  }

  input UserFilterInput {
    limit: Int
  }

  extend type Query {
    me: User
  }
  input UserInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }
  extend type Mutation {
    createUser(input: UserInput!): User
    editUser(input: UserInput!): User
    deleteUser(id: String!): User
    loginUser(input: LoginInput!): User!
    logOut: Boolean
  }
`;

export const userResolvers: IResolverSet = {
  Query: {
    async me(_, {}, ctx) {
      const user = await User.findById(ctx.token.userId)
      return user ? user.toObject() : null;
    },
  },
  Mutation: {
    async createUser(_, { input }) {
      const user = await User.create(input);
      return user;
    },
    async editUser(_, { input }, ctx) {
      const user = await User.findOneAndUpdate({ _id: ctx.token.userId },input, { new: true})
      return user ? user.toObject() : null;
    },
    async loginUser(_, { input }, { res }) {
      const { email, password } = input;
      const user = await User.findOne({ email })
      const match: boolean = user && user.comparePassword ? await user.comparePassword(password) : false
      if (user && match) {
        const userObject = user.toObject();
        userObject.jwt = jwt.sign({ userId: userObject.id }, config.token.secret, { algorithm: 'HS256' });
        res.cookie('token', userObject.jwt, {
            maxAge: 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            httpOnly: true
          })
        return userObject
      }
      throw new Error('Not Authorised.');
    },
    async logOut(_, {}, { res }) {
      res.clearCookie('token')
      return true
    },
  },
};