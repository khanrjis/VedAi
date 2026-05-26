"use client";

import { useEffect } from 'react';
import { useAssignmentStore } from '@/store/assignment-store';

export const useAssessmentSocket = (assignmentId?: string, paperId?: string): void => {
  const connectAssessmentSocket = useAssignmentStore((state) => state.connectAssessmentSocket);
  const hydrateSocketListeners = useAssignmentStore((state) => state.hydrateSocketListeners);
  const attachAssignmentRoom = useAssignmentStore((state) => state.attachAssignmentRoom);
  const attachPaperRoom = useAssignmentStore((state) => state.attachPaperRoom);

  useEffect(() => {
    connectAssessmentSocket();
    hydrateSocketListeners();
  }, [connectAssessmentSocket, hydrateSocketListeners]);

  useEffect(() => {
    if (assignmentId) {
      attachAssignmentRoom(assignmentId);
    }
  }, [assignmentId, attachAssignmentRoom]);

  useEffect(() => {
    if (paperId) {
      attachPaperRoom(paperId);
    }
  }, [paperId, attachPaperRoom]);
};