export const buildQuestionPaperPrompt = (assignment, context) => {
    const questionPlan = assignment.questionTypes
        .map((questionType, index) => {
        return `${index + 1}. ${questionType.label} - ${questionType.count} questions, ${questionType.marks} marks each, difficulty ${questionType.difficulty}`;
    })
        .join('\n');
    return [
        'You are an expert educational assessment designer.',
        'Create a complete printable question paper in strict JSON only. No markdown, no code fences, no commentary.',
        'Follow Bloom taxonomy balancing and ensure a realistic distribution of difficulty, marks, and sectioning.',
        'Return this exact JSON shape:',
        '{"title":"","subject":"","class":"","duration":"","totalMarks":0,"sections":[{"title":"Section A","instruction":"","questions":[{"question":"","difficulty":"easy","marks":2}]}],"answerKey":[{"question":"","answer":"","explanation":""}]}',
        '',
        `Assignment title: ${assignment.title}`,
        `Subject: ${assignment.subject}`,
        `Class: ${assignment.className}`,
        `Due date: ${assignment.dueDate}`,
        `Instructions: ${assignment.instructions || 'None provided.'}`,
        `Total questions: ${assignment.totalQuestions}`,
        `Total marks: ${assignment.totalMarks}`,
        'Question distribution:',
        questionPlan,
        context.fileName ? `Uploaded file name: ${context.fileName}` : 'Uploaded file name: none',
        context.extractedText ? `Extracted source text: ${context.extractedText}` : 'Extracted source text: none',
        'Rules:',
        '- Use concise, original, classroom-ready questions.',
        '- Ensure marks add up to the total marks.',
        '- Include answer key entries for every question.',
        '- Keep the JSON valid and parsable.'
    ].join('\n');
};
