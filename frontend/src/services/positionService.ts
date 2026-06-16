const API_BASE_URL = 'http://localhost:3010';

export type InterviewStep = {
    id: number;
    interviewFlowId: number;
    interviewTypeId: number;
    name: string;
    orderIndex: number;
};

export type InterviewFlow = {
    positionName: string;
    interviewFlow: {
        id: number;
        description: string;
        interviewSteps: InterviewStep[];
    };
};

export type Candidate = {
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
    id: number;
    applicationId: number;
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
};

// NOTE: the real backend mounts these routes at `/position` (singular) — see
// backend/src/index.ts. The requirements doc says `/positions` (plural); we follow
// the actual implementation so the app integrates with the running server.
export const getInterviewFlow = async (positionId: number): Promise<InterviewFlow> => {
    const response = await fetch(`${API_BASE_URL}/position/${positionId}/interviewflow`);
    const data = await handleResponse(response);
    return data.interviewFlow;
};

export const getCandidates = async (positionId: number): Promise<Candidate[]> => {
    const response = await fetch(`${API_BASE_URL}/position/${positionId}/candidates`);
    return handleResponse(response);
};

export const updateCandidateStage = async (
    candidateId: number,
    applicationId: number,
    newInterviewStepId: number
): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            applicationId,
            currentInterviewStep: newInterviewStepId,
        }),
    });
    await handleResponse(response);
};
