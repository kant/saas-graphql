import mongoose, { Document } from 'mongoose';
import { IOrganization } from '../organization/model'

export interface IProject extends Document {
  organization?: IOrganization;
}

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
});

projectSchema.set('toObject', { getters: true, virtuals: true });

export default mongoose.model('Project', projectSchema);