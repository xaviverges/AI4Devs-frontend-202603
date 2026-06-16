import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Column } from '../../hooks/usePositionBoard';
import KanbanColumn from './KanbanColumn';

type KanbanBoardProps = {
    columns: Column[];
    onMove: (move: {
        candidateId: number;
        fromStepId: number;
        toStepId: number;
        toIndex: number;
    }) => void;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, onMove }) => {
    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        const fromStepId = Number(source.droppableId);
        const toStepId = Number(destination.droppableId);
        if (fromStepId === toStepId && source.index === destination.index) return;

        onMove({
            candidateId: Number(draggableId),
            fromStepId,
            toStepId,
            toIndex: destination.index,
        });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="d-flex flex-column flex-md-row gap-3 overflow-auto pb-2">
                {columns.map((column) => (
                    <div key={column.step.id} className="flex-md-fill" style={{ minWidth: 260 }}>
                        <KanbanColumn column={column} />
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;
