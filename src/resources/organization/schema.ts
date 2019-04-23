import mongoose from 'mongoose';
import { gql } from 'apollo-server'
import Organization, { IOrganization } from './model';
import { IResolverSet } from '../root'
import { membersPermissionFilter } from './permissionModule'; 

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
    async organizations(_, {}, context) {
      const orgs: IOrganization[] = await Organization.find({"members.user": ObjectId(context.user)})
        .populate('members.user')
      return orgs.map(org => org.toObject());
    },
    async organization(_, { id }, context) {
      const organization: IOrganization | null = await Organization.findOne({ _id: id, 'members.user': ObjectId(context.user)})
      .populate('members.user')
      return organization ? organization.toObject() : null;
    },
  },
  Mutation: {
    async addOrganization(_, { input }, context) {
      input.members = [{
        role: 'OWNER',
        user: context.user
      }]
      const organization: IOrganization = await Organization.create(input);
      return organization.toObject();
    },
    async editOrganization(_, { input }, context) {
      const organization: IOrganization | null = await Organization.findOne({ _id: input.organization, 'members.user': ObjectId(context.user)})
        .populate('members.user');
      if (organization) {
        membersPermissionFilter(organization, input, context.user)
        const newOrganization = await Organization.findOneAndUpdate({ _id: input.organization, 'members.user': ObjectId(context.user)}, input, {new: true })
          .populate('members.user')
        return newOrganization;
      } else {
        throw new Error('Organization not found')
      }
    }
  },
};