import { gql } from 'apollo-server'

export interface IResolverSet {
  Mutation: {
    [key: string]: (parent: any, args: any, context: any, info: any) => Promise<any>;
  }
  Query: {
    [key: string]:(parent: any, args: any, context: any, info: any) => Promise<any>;
  }
}
export const rootTypeDefs = gql`
  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;