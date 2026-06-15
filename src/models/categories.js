import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT cart_id, name
      FROM categories;
    `;
    const result = await db.query(query); 
    return result.rows;
    
}

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


const getCategoryDetails = async (id) => {
    const query = `
      SELECT cart_id, name 
      FROM categories 
      WHERE cart_id = $1;`;
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};


const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.date, p.location
        FROM projects p
        INNER JOIN project_categories pc ON p.project_id = pc.project_id
        WHERE pc.cart_id = $1
        ORDER BY p.date ASC;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

async function getProjectDetails(id) {
    const query = `
        SELECT 
            project_id,
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

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

const createCategory = async (name) => {
    const query = `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING cart_id;
    `;

    const queryParams = [name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].cart_id);
    }

    return result.rows[0].cart_id;
}

const updateCategory = async (name, categoryId) => {
  const query = `
    UPDATE categories
    SET name = $1 
    WHERE cart_id = $2
    RETURNING cart_id;
  `;

  const queryParams = [name, categoryId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated category with ID:', categoryId);
  }

  return result.rows[0].cart_id;
};


export {getAllCategories, getCategoryDetails, getCategoriesByProjectId, getProjectDetails,
     getProjectsByCategoryId, updateCategoryAssignments, createCategory, updateCategory };
