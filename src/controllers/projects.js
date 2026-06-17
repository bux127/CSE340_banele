import {getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId, getCategoriesByProjectId, createProject, getAllOrganizations, updateProject, isUserVolunteering, addVolunteer, removeVolunteer, getProjectsByVolunteer } from '../models/projects.js'
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
    let isVolunteering = false;
    
    // Check if a user session exists
    if (req.session && req.session.user) {
        isVolunteering = await isUserVolunteering(req.session.user.user_id, projectId);
    }
    const title = 'Project Details';
    res.render('project', { project, isVolunteering, title, cart, user: req.session.user || null});
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


// Handle submission to volunteer
const processVolunteerSignUp = async (req, res) => {
    const projectId = req.body.projectId;
    const userId = req.session.user.user_id;

    await addVolunteer(userId, projectId);
    req.flash('success', 'Thank you for volunteering!');
    res.redirect(`/projects/${projectId}`);
};

const processRemoveVolunteer = async (req, res) => {
    try {
        // 1. Grab the project ID from the hidden form input (<input name="projectId">)
        const projectId = req.body.projectId;
        
        // 2. Grab the logged-in user's ID securely from their session
        const userId = req.session.user.user_id;

        // 3. Call your model function to delete the database record
        await removeVolunteer(userId, projectId);
        
        // 4. Send a success message
        req.flash('success', 'You have been removed from the volunteer list.');
        
        // 5. Smart redirect: If they clicked remove from the dashboard, send them back to the dashboard. 
        // Otherwise, send them back to the project detail page.
        if (req.headers.referer && req.headers.referer.includes('dashboard')) {
            return res.redirect('/dashboard');
        }
        res.redirect(`/projects/${projectId}`);

    } catch (error) {
        console.error("Error removing volunteer:", error);
        req.flash('error', 'An error occurred while trying to cancel your sign-up.');
        res.redirect('/dashboard');
    }
};


export {projectsPage, showProjectsPage, showProjectDetailsPage, showNewProjectForm,processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm, processVolunteerSignUp, processRemoveVolunteer};
