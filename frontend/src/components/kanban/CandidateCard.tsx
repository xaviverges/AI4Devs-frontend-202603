import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import { Candidate } from '../../services/positionService';

type CandidateCardProps = {
    candidate: Candidate;
    index: number;
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index }) => {
    return (
        <Draggable draggableId={String(candidate.id)} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-2 shadow-sm ${snapshot.isDragging ? 'border-primary' : ''}`}
                >
                    <Card.Body className="p-2">
                        <Card.Title className="fs-6 mb-1">{candidate.fullName}</Card.Title>
                        <div className="d-flex align-items-center text-muted small">
                            <StarFill className="text-warning me-1" />
                            <span>{candidate.averageScore.toFixed(1)}</span>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Draggable>
    );
};

export default CandidateCard;
