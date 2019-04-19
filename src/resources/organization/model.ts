import mongoose, { Document } from 'mongoose';
import { IUser } from '../user/model';

export interface IOrganization extends Document {
  name?: String;
  members?: Array<{
    role: String;
    user: IUser;
  }>
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