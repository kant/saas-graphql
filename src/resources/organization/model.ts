import mongoose, { Document } from 'mongoose';
import { IUser } from '../user/model';

export interface IMember {
    role: String;
    user: IUser;
}

export interface IOrganization extends Document {
  name: String;
  members: IMember[];
}

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{
    role: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  }]
});

organizationSchema.set('toObject', { getters: true, virtuals: true });

export default mongoose.model('Organization', organizationSchema);