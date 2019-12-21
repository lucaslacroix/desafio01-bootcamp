const express = require('express');

const server = express();

server.use(express.json());

let projects = [];

function checkProjectExists(req, res, next) {
    const { id } = req.params;

    if(!projects.find(val => val.id == id)){
        return res.status(400).json({ error: 'Project does not exists' });
    }

    return next();
}

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.get('/projects/:id', checkProjectExists, (req, res) => {
    const proj = projects.find((val, index) => val.id == req.params.id);

    return res.json(proj);
});

server.post('/projects', (req, res) => {
    const project = req.body;

    projects.push(project);

    return res.json(projects);
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { tasks } = req.body;
    const proj = projects.find((val, index) => val.id == id);

    proj.tasks = [...proj.tasks, ...tasks];

    projects = projects.map((val, index) => val.id == id ? proj : val);

    return res.json(projects);
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const project = req.body;
    const proj = projects.find((val, index) => val.id == id);

    projects = projects.map((val, index) => val.id == id ? { ...proj, ...project } : val);

    return res.json(projects);
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    projects = projects.filter((val, index) => val.id != id);

    return res.json(projects);
})



server.listen(3000);