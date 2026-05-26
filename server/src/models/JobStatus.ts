import { Schema, model, type InferSchemaType } from 'mongoose';

const jobStatusSchema = new Schema(
  {
    jobId: { type: String, required: true, index: true },
    queueName: { type: String, required: true },
    referenceType: { type: String, required: true },
    referenceId: { type: String, required: true, index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['waiting', 'active', 'completed', 'failed', 'delayed'],
      default: 'waiting'
    },
    message: { type: String, default: '' },
    error: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export type JobStatusDocument = InferSchemaType<typeof jobStatusSchema> & {
  _id: Schema.Types.ObjectId;
};

export const JobStatus = model('JobStatus', jobStatusSchema);