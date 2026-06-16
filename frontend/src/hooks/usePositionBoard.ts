import { useCallback, useEffect, useState } from 'react';
import {
    Candidate,
    InterviewStep,
    getCandidates,
    getInterviewFlow,
    updateCandidateStage,
} from '../services/positionService';

export type Column = {
    step: InterviewStep;
    candidates: Candidate[];
};

type Move = {
    candidateId: number;
    fromStepId: number;
    toStepId: number;
    toIndex: number;
};

const buildColumns = (steps: InterviewStep[], candidates: Candidate[]): Column[] => {
    const sortedSteps = [...steps].sort((a, b) => a.orderIndex - b.orderIndex);
    return sortedSteps.map((step) => ({
        step,
        candidates: candidates.filter((c) => c.currentInterviewStep === step.name),
    }));
};

export const usePositionBoard = (positionId: number) => {
    const [positionName, setPositionName] = useState('');
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [flow, candidates] = await Promise.all([
                    getInterviewFlow(positionId),
                    getCandidates(positionId),
                ]);
                if (!active) return;
                setPositionName(flow.positionName);
                setColumns(buildColumns(flow.interviewFlow.interviewSteps, candidates));
            } catch (err) {
                if (active) setError('No se pudo cargar la información de la posición.');
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [positionId]);

    const moveCandidate = useCallback(
        ({ candidateId, fromStepId, toStepId, toIndex }: Move) => {
            const snapshot = columns;
            const fromColumn = columns.find((c) => c.step.id === fromStepId);
            const candidate = fromColumn?.candidates.find((c) => c.id === candidateId);
            if (!candidate) return;

            const toColumn = columns.find((c) => c.step.id === toStepId);
            if (!toColumn) return;

            const updatedCandidate: Candidate = {
                ...candidate,
                currentInterviewStep: toColumn.step.name,
            };

            const next = columns.map((column) => {
                if (column.step.id === fromStepId) {
                    return {
                        ...column,
                        candidates: column.candidates.filter((c) => c.id !== candidateId),
                    };
                }
                return column;
            }).map((column) => {
                if (column.step.id === toStepId) {
                    const candidates = [...column.candidates];
                    candidates.splice(toIndex, 0, updatedCandidate);
                    return { ...column, candidates };
                }
                return column;
            });

            setColumns(next);

            updateCandidateStage(candidateId, candidate.applicationId, toStepId).catch(() => {
                setColumns(snapshot);
                setError('No se pudo actualizar la fase del candidato. Se ha revertido el cambio.');
            });
        },
        [columns]
    );

    return { positionName, columns, loading, error, moveCandidate };
};
