import Project, { IProject }  from './model';
import Organization, { IOrganization } from '../organization/model'
import { gql } from 'apollo-server'
import mongoose from 'mongoose';

import { IResolverSet } from '../root'


const ObjectId = mongoose.Types.ObjectId

export const projectTypeDefs = gql`
  type Project {
    id: ID!
    name: String!
    organization: Organization!
  }
  input ProjectFilterInput {
    organization: String!
    limit: Int
  }
  extend type Query {
    projects(input: ProjectFilterInput): [Project]
    project(id: String!): Project
  }
  input ProjectInput {
    name: String!
    organization: String!
  }
  input EditProjectInput {
    id: String!
    name: String!
    organization: String!
  }
  input DeleteProjectInput {
    id: String!
    organization: String!
  }
  extend type Mutation {
    addProject(input: ProjectInput!): Project
    editProject(input: EditProjectInput!): Project
    deleteProject(input: DeleteProjectInput): Project
  }
`;

export const projectResolvers: IResolverSet = {
  Query: {
    async projects(_, { input }, context) {
      const organization : IOrganization | null = await Organization.findOne({ _id: input.organization, "members.user": ObjectId(context.user )})
      if (organization) {
        const projects: IProject[] = await Project.find({ organization: input.organization})
        return projects.map(project => project.toObject());
      } else {
        return null
      }
    },
    async project(_, { id }, context) {
      const project: IProject | null = await Project.findOne({ _id: id })
      const organization : IOrganization | null = project ? await Organization.findOne({ _id: project.organization, "members.user": ObjectId(context.user )}) : null
      if (organization ) {
        return project
      } else {
        return null
      }
    },
  },
  Mutation: {
    async addProject(_, { input }, context) {
      const organization: IOrganization | null = await Organization.findOne({ _id: input.organization, 'members.user': ObjectId( context.user ) })
      if (organization) {
        const project: IProject | null = await Project.create(input)
        return project.toObject();
      } else {
        return null
      }
    },
    async editProject(_, { input }, context) {
      const organization: IOrganization | null = await Organization.findOne({ _id: input.organization, 'members.user': ObjectId( context.user ) })
      const project: IProject | null = await Project.findOneAndUpdate({_id: input.id , organization: input.organization}, input, {new: true});
        if (organization && project) {
        return project.toObject();
      } else {
        return null
      }
    },
    async deleteProject(_, { input }, context) {
      const organization: IOrganization | null = await Organization.findOne({
        _id: ObjectId( input.organization),
        members: {
          $elemMatch : {
            $or: [{
              user: ObjectId(context.user),
              role: "OWNER"
            },{
              user: ObjectId(context.user),
              role: "ADMIN"
            }]
          }
        }
      })
      if(organization) {
        const project: IProject | null = await Project.findOneAndRemove({_id: input.id, organization: input.organization });
        return project ? project.toObject() : null;
      } else {
        return null
      }
    },
  }
};