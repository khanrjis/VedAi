import { create } from 'zustand';
import { api, ApiError } from '@/services/api';
import {
  connectSocket,
  getSocket,
  joinAssignmentRoom,
  joinPaperRoom
} from '@/services/socket';
import type {
  AssignmentSummary,
  AssignmentsListResponse,
  CreateAssignmentFormValues,
  GeneratedPaperSummary,
  SocketStatus
} from '@/types';

interface AssignmentStoreState {
  assignments: AssignmentSummary[];
  currentAssignment: AssignmentSummary | null;
  currentPaper: GeneratedPaperSummary | null;
  loading: boolean;
  loadingAssignment: boolean;
  loadingPaper: boolean;
  creating: boolean;
  generationProgress: number;
  socketStatus: SocketStatus;
  totalPages: number;
  totalAssignments: number;
  error: string | null;
  setSocketStatus: (status: SocketStatus) => void;
  setGenerationProgress: (progress: number) => void;
  connectAssessmentSocket: () => void;
  loadAssignments: (params?: { search?: string; status?: string; page?: number; limit?: number }) => Promise<void>;
  loadAssignment: (assignmentId: string) => Promise<void>;
  loadPaper: (paperId: string) => Promise<void>;
  createAssignment: (values: CreateAssignmentFormValues) => Promise<AssignmentSummary>;
  generateAssignment: (assignmentId: string) => Promise<void>;
  regeneratePaper: (paperId: string) => Promise<void>;
  attachAssignmentRoom: (assignmentId: string) => void;
  attachPaperRoom: (paperId: string) => void;
  hydrateSocketListeners: () => void;
}

const initialState = {
  assignments: [],
  currentAssignment: null,
  currentPaper: null,
  loading: false,
  loadingAssignment: false,
  loadingPaper: false,
  creating: false,
  generationProgress: 0,
  socketStatus: 'disconnected' as SocketStatus,
  totalPages: 0,
  totalAssignments: 0,
  error: null as string | null
};

let listenersAttached = false;

export const useAssignmentStore = create<AssignmentStoreState>((set, get) => ({
  ...initialState,
  setSocketStatus: (status) => set({ socketStatus: status }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  connectAssessmentSocket: () => {
    const socket = connectSocket();
    set({ socketStatus: socket.connected ? 'connected' : 'connecting' });

    socket.on('connect', () => set({ socketStatus: 'connected' }));
    socket.on('disconnect', () => set({ socketStatus: 'disconnected' }));
  },
  hydrateSocketListeners: () => {
    if (listenersAttached) {
      return;
    }

    const socket = getSocket();
    socket.on('generation_started', (payload: { assignmentId: string }) => {
      set((state) => ({
        generationProgress: 10,
        assignments: state.assignments.map((assignment) =>
          assignment._id === payload.assignmentId ? { ...assignment, status: 'processing' } : assignment
        )
      }));
    });

    socket.on('generation_progress', (payload: { assignmentId: string; progress: number }) => {
      set((state) => ({
        generationProgress: payload.progress,
        assignments: state.assignments.map((assignment) =>
          assignment._id === payload.assignmentId ? { ...assignment, status: 'processing' } : assignment
        )
      }));
    });

    socket.on('generation_completed', async (payload: { assignmentId: string; paperId: string }) => {
      set({ generationProgress: 100 });
      await get().loadAssignment(payload.assignmentId);
      await get().loadPaper(payload.paperId);
      await get().loadAssignments();
    });

    socket.on('generation_failed', (payload: { assignmentId: string; message: string }) => {
      set((state) => ({
        generationProgress: 0,
        error: payload.message,
        assignments: state.assignments.map((assignment) =>
          assignment._id === payload.assignmentId ? { ...assignment, status: 'failed' } : assignment
        )
      }));
    });

    socket.on('pdf_ready', async (payload: { paperId: string }) => {
      await get().loadPaper(payload.paperId);
    });

    listenersAttached = true;
  },
  attachAssignmentRoom: (assignmentId) => joinAssignmentRoom(assignmentId),
  attachPaperRoom: (paperId) => joinPaperRoom(paperId),
  loadAssignments: async (params) => {
    set({ loading: true, error: null });

    try {
      const response = await api.get<AssignmentsListResponse>('/assignments', params);
      set({ assignments: response.items, totalPages: response.totalPages, totalAssignments: response.total, loading: false });
    } catch (error) {
      set({ loading: false, error: error instanceof ApiError ? error.message : 'Failed to load assignments' });
    }
  },
  loadAssignment: async (assignmentId) => {
    set({ loadingAssignment: true, error: null });

    try {
      const response = await api.get<AssignmentSummary>(`/assignments/${assignmentId}`);
      set({ currentAssignment: response, loadingAssignment: false });
    } catch (error) {
      set({ loadingAssignment: false, error: error instanceof ApiError ? error.message : 'Failed to load assignment' });
    }
  },
  loadPaper: async (paperId) => {
    set({ loadingPaper: true, error: null });

    try {
      const response = await api.get<GeneratedPaperSummary>(`/papers/${paperId}`);
      set({ currentPaper: response, loadingPaper: false });
    } catch (error) {
      set({ loadingPaper: false, error: error instanceof ApiError ? error.message : 'Failed to load paper' });
    }
  },
  createAssignment: async (values) => {
    set({ creating: true, error: null });

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('subject', values.subject);
      formData.append('className', values.className);
      formData.append('dueDate', values.dueDate);
      formData.append('instructions', values.instructions);
      formData.append('sourceText', values.sourceText);
      formData.append('questionTypes', JSON.stringify(values.questionTypes));
      formData.append('totalQuestions', String(values.totalQuestions));
      formData.append('totalMarks', String(values.totalMarks));

      const file = values.file?.[0];
      if (file) {
        formData.append('file', file);
      }

      const response = await api.postForm<AssignmentSummary>('/assignments/create', formData);
      set((state) => ({ assignments: [response, ...state.assignments], creating: false }));
      return response;
    } catch (error) {
      set({ creating: false, error: error instanceof ApiError ? error.message : 'Failed to create assignment' });
      throw error;
    }
  },
  generateAssignment: async (assignmentId) => {
    set({ loadingAssignment: true, error: null, generationProgress: 0 });

    try {
      await api.postJson(`/assignments/${assignmentId}/generate`, {});
      await get().loadAssignment(assignmentId);
      set({ loadingAssignment: false });
    } catch (error) {
      set({ loadingAssignment: false, error: error instanceof ApiError ? error.message : 'Failed to generate paper' });
    }
  },
  regeneratePaper: async (paperId) => {
    set({ loadingPaper: true, error: null });

    try {
      await api.postJson(`/papers/${paperId}/regenerate`, {});
      set({ loadingPaper: false });
    } catch (error) {
      set({ loadingPaper: false, error: error instanceof ApiError ? error.message : 'Failed to regenerate paper' });
    }
  }
}));