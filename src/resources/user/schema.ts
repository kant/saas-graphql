import jwt from 'jsonwebtoken';
import User, { IUser } from './model';
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
  }
`;

export const userResolvers: IResolverSet = {
  Query: {
    async me(_, {}, context) {
      const user: IUser | null = await User.findById(context.user)
      return user ? user.toObject() : null;
    },
  },
  Mutation: {
    async createUser(_, { input }) {
      const user: IUser | null = await User.create(input);
      return user;
    },
    async editUser(_, { input }, context) {
      const user: IUser | null = await User.findOneAndUpdate({ _id: context.user },input, { new: true})
      return user ? user.toObject() : null;
    },
    async loginUser(_, { input }) {
      const { email, password } = input;
      const user: IUser | null = await User.findOne({ email })
      const match: boolean = user && user.comparePassword ? await user.comparePassword(password) : false
      if (user && match) {
        const userObject = user.toObject();
        userObject.jwt = jwt.sign({ user: userObject.id }, config.token.secret, { algorithm: 'HS256' });
        return userObject
      }
      throw new Error('Not Authorised.');
    },
  },
};