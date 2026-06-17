import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT 
        p.project_id, 
            p.title, 
            p.date, 
            p.org_id,
            o.organization_name -- 👈 CRITICAL: Make sure this alias matches exactly!
        FROM projects p
        INNER JOIN organization o ON p.org_id = o.org_id
        ORDER BY p.date ASC;  
    `;

    const result = await db.query(query);

    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          org_id,
          title,
          description,
          location,
          date
        FROM projects
        WHERE org_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async(projects_num) => {
  const query = `
  SELECT
          p.project_id,
          o.org_id,
          p.title,
          p.description,
          p.location,
          p.date,
          o.organization_name
        FROM projects p
        INNER JOIN organization o ON p.org_id = o.org_id
        WHERE p.date >= $1
        ORDER BY p.date ASC
        LIMIT $2;
  `;

  const currentDate = new Date();
  const queryParams = [currentDate, projects_num];
      const result = await db.query(query, queryParams);

      return result.rows;
  }

  async function getProjectDetails(id) {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.org_id,
            o.organization_name
        FROM projects p
        INNER JOIN organization o ON p.org_id = o.org_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

 
        
    return result.rows.length > 0 ? result.rows[0] : null;
  };

 const getProjectsByCategoryId = async (categoryId) => {
     const query = `
         SELECT 
             p.project_id, 
             p.title, 
             p.description, 
             p.date
         FROM projects p
         INNER JOIN project_categories pc ON p.project_id = pc.project_id
         WHERE pc.cart_id = $1
         ORDER BY p.date ASC;
     `;
     const result = await db.query(query, [categoryId]);
     return result.rows;
 };

 const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.cart_id, c.name
        FROM categories c
        INNER JOIN project_categories pc ON c.cart_id = pc.cart_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT cart_id, name 
        FROM categories 
        WHERE cart_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async (projectId, organizationId, title, description, date, location) => {
  const query = `
    UPDATE organization
    SET title = $1, description = $2, date = $3, location = $4
    WHERE project_id = $5
    RETURNING project_id;
  `;

  const queryParams = [title, description, date, location, organizationId, projectId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated project with ID:', projectId);
  }

  return result.rows[0].project_id;
};

const getAllOrganizations = async() => {
    const query = `
        SELECT org_id, organization_name, description, email, logo_name
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
};

// 1. Add a user as a volunteer
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id) 
        VALUES ($1, $2) ON CONFLICT DO NOTHING
    `;
    await db.query(query, [userId, projectId]);
};

// 2. Remove a user as a volunteer
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers 
        WHERE user_id = $1 AND project_id = $2
    `;
    await db.query(query, [userId, projectId]);
};

// 3. Get all projects a specific user volunteered for
const getProjectsByVolunteer = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description 
        FROM projects p
        JOIN project_volunteers pv ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

// 4. Helper to check if a user is ALREADY volunteering for a specific project
const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM project_volunteers 
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};


export {getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getProjectsByCategoryId, getCategoriesByProjectId, getCategoryDetails, createProject, getAllOrganizations, updateProject, addVolunteer, removeVolunteer, getProjectsByVolunteer, isUserVolunteering};