import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Container, Spinner } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { usePositionBoard } from '../hooks/usePositionBoard';
import KanbanBoard from './kanban/KanbanBoard';

const PositionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const positionId = Number(id);
    const { positionName, columns, loading, error, moveCandidate } = usePositionBoard(positionId);

    return (
        <Container className="mt-4">
            <div className="d-flex align-items-center mb-4">
                <Button
                    variant="link"
                    className="text-dark p-0 me-3"
                    onClick={() => navigate('/positions')}
                    aria-label="Volver al listado de posiciones"
                >
                    <ArrowLeft size={28} />
                </Button>
                <h2 className="mb-0">{positionName || 'Posición'}</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status" />
                </div>
            ) : (
                <KanbanBoard columns={columns} onMove={moveCandidate} />
            )}
        </Container>
    );
};

export default PositionDetail;
