/*
 * Dev-only mock server for smoke-testing the "position" kanban page.
 * No dependencies — Node built-in http only. Run: node dev-mock-server.js
 * Serves the same contract as the real backend on http://localhost:3010.
 * Safe to delete; not part of the production app.
 */
const http = require('http');

const PORT = 3010;

const interviewSteps = [
    { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Initial Screening', orderIndex: 1 },
    { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
    { id: 3, interviewFlowId: 1, interviewTypeId: 3, name: 'Manager Interview', orderIndex: 3 },
];

let candidates = [
    { fullName: 'Jane Smith', currentInterviewStep: 'Technical Interview', averageScore: 4, id: 1, applicationId: 1 },
    { fullName: 'Carlos García', currentInterviewStep: 'Initial Screening', averageScore: 0, id: 2, applicationId: 2 },
    { fullName: 'John Doe', currentInterviewStep: 'Manager Interview', averageScore: 5, id: 3, applicationId: 3 },
    { fullName: 'Aisha Khan', currentInterviewStep: 'Initial Screening', averageScore: 3.5, id: 4, applicationId: 4 },
    { fullName: 'Marc Dupont', currentInterviewStep: 'Technical Interview', averageScore: 2.5, id: 5, applicationId: 5 },
];

const send = (res, status, body) => {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(body));
};

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') return send(res, 204, {});

    const url = req.url.split('?')[0];

    if (req.method === 'GET' && /^\/position\/\d+\/interviewflow$/.test(url)) {
        return send(res, 200, {
            interviewFlow: {
                positionName: 'Senior Backend Engineer',
                interviewFlow: { id: 1, description: 'Standard development interview process', interviewSteps },
            },
        });
    }

    if (req.method === 'GET' && /^\/position\/\d+\/candidates$/.test(url)) {
        return send(res, 200, candidates);
    }

    const stageMatch = url.match(/^\/candidates\/(\d+)$/);
    if (req.method === 'PUT' && stageMatch) {
        let raw = '';
        req.on('data', (chunk) => (raw += chunk));
        req.on('end', () => {
            const candidateId = Number(stageMatch[1]);
            const { currentInterviewStep } = JSON.parse(raw || '{}');
            const step = interviewSteps.find((s) => s.id === Number(currentInterviewStep));
            candidates = candidates.map((c) =>
                c.id === candidateId && step ? { ...c, currentInterviewStep: step.name } : c
            );
            send(res, 200, { message: 'Candidate stage updated successfully', data: { id: candidateId } });
        });
        return;
    }

    send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => console.log(`Mock backend running at http://localhost:${PORT}`));
