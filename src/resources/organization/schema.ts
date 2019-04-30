import mongoose from 'mongoose';
import { gql } from 'apollo-server'
import Organization from './model';
import { IResolverSet } from '../root'
import { membersPermissionFilter, mapOrganizationToInput } from './permissionModule'; 

const ObjectId = mongoose.Types.ObjectId

export const organizationTypeDefs = gql`
  type Organization {
    id: ID!
    name: String!
    members: [Role]!
  }

  type Role {
    role: RoleEnum!
    user: User!
  }

  input RoleInput {
    role: RoleEnum!
    user: String!
  }

  enum RoleEnum {
    OWNER
    ADMIN
    USER
  }

  input OrganizationInput {
    name: String!
  }
  input EditOrganizationInput {
    organization: String!
    name: String!
    members: [RoleInput]!
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
    editOrganization(input: EditOrganizationInput!): Organization
  }
`;

export const organizationResolvers: IResolverSet = {
  Query: {
    async organizations(_, {}, ctx) {
      const orgs = await Organization.find({"members.user": ObjectId(ctx.token.userId)})
        .populate('members.user')
      return orgs.map(org => org.toObject());
    },
    async organization(_, { id }, ctx) {
      const organization = await Organization.findOne({ _id: id, 'members.user': ObjectId(ctx.token.userId)})
      .populate('members.user')
      if(organization) {
        return organization.toObject()
      } else {
        throw new Error('Organization not found')
      }
    },
  },
  Mutation: {
    async addOrganization(_, { input }, ctx) {
      input.members = [{
        role: 'OWNER',
        user: ctx.token.userId
      }]
      const organization = await Organization.create(input);
      return organization.toObject();
    },
    async editOrganization(_, { input }, ctx) {
      const organization = await Organization.findOne({ _id: input.organization, 'members.user': ObjectId(ctx.token.userId)})
        .populate('members.user');
      if (organization) {
        membersPermissionFilter(mapOrganizationToInput(organization as IOrganization), input, ctx.token.userId)
        const newOrganization = await Organization.findOneAndUpdate({ _id: input.organization, 'members.user': ObjectId(ctx.token.userId)}, input, {new: true })
          .populate('members.user')
        return newOrganization;
      } else {
        throw new Error('Organization not found')
      }
    }
  },
};