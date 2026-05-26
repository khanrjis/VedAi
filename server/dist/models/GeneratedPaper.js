import { Schema, model } from 'mongoose';
const questionSchema = new Schema({
    question: { type: String, required: true },
    difficulty: { type: String, required: true },
    marks: { type: Number, required: true, min: 1 },
    answer: { type: String, default: '' },
    topic: { type: String, default: '' }
}, { _id: false });
const sectionSchema = new Schema({
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [questionSchema], default: [] }
}, { _id: false });
const generatedPaperSchema = new Schema({
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    duration: { type: String, default: '45 minutes' },
    totalMarks: { type: Number, required: true },
    sections: { type: [sectionSchema], default: [] },
    answerKey: {
        type: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
                explanation: { type: String, default: '' }
            }
        ],
        default: []
    },
    generationPrompt: { type: String, default: '' },
    model: { type: String, default: '' },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing'
    },
    pdfPath: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { timestamps: true });
export const GeneratedPaper = model('GeneratedPaper', generatedPaperSchema);
