import mongoose, { Document } from 'mongoose';
import { gql } from 'apollo-server'
import Organization from './model';
import { IResolverSet } from '../root'

const ObjectId = mongoose.Types.ObjectId

export const organizationTypeDefs = gql`
  type Organization {
    id: ID!
    name: String!
    members: [User]!
  }

  enum RoleEnum {
    OWNER
    ADMIN
    USER
  }

  input OrganizationInput {
    name: String!
  }
  input OrganizationFilterInput {
    limit: Int
  }
  extend type Query {
    organizations(filter: OrganizationFilterInput): [Organization]
    organization(id: String!): Organization
  }
  extend type Mutation {
    addOrganization(input: OrganizationInput!): Organization
  }
`;

export const organizationResolvers: IResolverSet = {
  Query: {
    async organizations(_, {}, context) {
      const orgs: Document[] = await Organization.find({"members.user": ObjectId(context.user)})
      return orgs.map(org => org.toObject());
    },
    async organization(_, { id }, context) {
      const organization: Document | null = await Organization.findOne({ _id: id, 'members.user': ObjectId(context.user)});
      return organization ? organization.toObject() : null;
    },
  },
  Mutation: {
    async addOrganization(_, { input }, context) {
      input.members = [{
        role: 'OWNER',
        user: context.user
      }]
      const organization: Document = await Organization.create(input);
      return organization.toObject();
    },
  },
};