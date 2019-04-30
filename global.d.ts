import { Document } from 'mongoose'

declare global {
    interface IUser extends Document {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        comparePassword?: (password: string) => boolean;
    }
    
    interface IProject extends Document {
        name: string;
        organization: IOrganization;
    }
    
    interface IMember {
        role: string;
        user: IUser;
    }
    
    interface IOrganization extends Document {
      name: string;
      members: IMember[];
    }
      
}