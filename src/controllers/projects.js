import {getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId, getCategoriesByProjectId, createProject, getAllOrganizations, updateProject} from '../models/projects.js'
import { body, validationResult } from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const number_of_upcoming = 5;

const projectsPage = async (req, res) => {
    const projects = await getAllProjects();
    const title = 'Projects';
    res.render('projects', { title, projects});
};

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(number_of_upcoming);
    const title = 'Upcoming Projects';

    res.render('projects', {title, projects});
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const cart = await getCategoriesByProjectId(projectId);
    const title = 'Project Details';
    res.render('project', { project, title, cart});
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }
}

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizationList = await getAllOrganizations(projectId);
    const title = 'Edit Project';
    res.render('edit-project', { title, project, organizationList });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, date, location } = req.body;

    await updateProject(projectId, description, date, location);
    
    // Set a success flash message
    req.flash('success', 'Project updated successfully!');

    res.redirect(`/project/${projectId}`);
    // Check for validation errors
const results = validationResult(req);
if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
        req.flash('error', error.msg);
    });

    // Redirect back to the edit organization form
    return res.redirect('/edit-project/' + req.params.id);
}
}


export {projectsPage, showProjectsPage, showProjectDetailsPage, showNewProjectForm,processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm};
