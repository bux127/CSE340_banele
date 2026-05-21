import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT org_id, name, description, email, logo_name
      FROM public.organization;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllOrganizations}  