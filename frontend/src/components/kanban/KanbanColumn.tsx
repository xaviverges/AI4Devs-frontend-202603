import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Badge } from 'react-bootstrap';
import { Column } from '../../hooks/usePositionBoard';
import CandidateCard from './CandidateCard';

type KanbanColumnProps = {
    column: Column;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
    return (
        <div className="bg-light rounded p-2 h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                <h6 className="mb-0 text-uppercase text-secondary">{column.step.name}</h6>
                <Badge bg="secondary" pill>
                    {column.candidates.length}
                </Badge>
            </div>
            <Droppable droppableId={String(column.step.id)}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-grow-1 rounded p-1 ${snapshot.isDraggingOver ? 'bg-primary bg-opacity-10' : ''}`}
                        style={{ minHeight: 80 }}
                    >
                        {column.candidates.map((candidate, index) => (
                            <CandidateCard key={candidate.id} candidate={candidate} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
