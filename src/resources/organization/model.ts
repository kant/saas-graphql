import mongoose, { Document } from 'mongoose';

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

export default mongoose.model<IOrganization>('Organization', organizationSchema);