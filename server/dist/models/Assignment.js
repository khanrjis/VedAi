import { Schema, model } from 'mongoose';
const questionTypeSchema = new Schema({
    type: { type: String, required: true },
    label: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
    difficulty: { type: String, required: true }
}, { _id: false });
const assignmentSchema = new Schema({
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    instructions: { type: String, default: '' },
    sourceText: { type: String, default: '' },
    uploadedFileName: { type: String, default: '' },
    uploadedFilePath: { type: String, default: '' },
    questionTypes: { type: [questionTypeSchema], default: [] },
    totalQuestions: { type: Number, default: 0, min: 0 },
    totalMarks: { type: Number, default: 0, min: 0 },
    status: {
        type: String,
        enum: ['draft', 'queued', 'processing', 'completed', 'failed'],
        default: 'draft'
    },
    generatedPaperId: { type: Schema.Types.ObjectId, ref: 'GeneratedPaper', default: null },
    lastError: { type: String, default: '' }
}, { timestamps: true });
assignmentSchema.index({ title: 'text', subject: 'text', className: 'text' });
export const Assignment = model('Assignment', assignmentSchema);
