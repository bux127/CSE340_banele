import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT org_id, organization_name, description, email, logo_name
      FROM organization;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        org_id,
        organization_name,
        description,
        email,
        logo_name
      FROM organization
      WHERE org_id = $1;
    `;

      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Creates a new organization in the database.
 * @param {string} organization_name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} email - The contact email for the organization.
 * @param {string} logo_name - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */
const createOrganization = async (name, description, email, logo_name) => {
    const query = `
      INSERT INTO organization (organization_name, description, email, logo_name)
      VALUES ($1, $2, $3, $4)
      RETURNING org_id
    `;

    const queryParams = [name, description, email, logo_name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].org_id);
    }

    return result.rows[0].org_id;
};

const updateOrganization = async (organizationId, organization_name, description, email, logo_name) => {
  const query = `
    UPDATE organization
    SET organization_name = $1, description = $2, email = $3, logo_name = $4
    WHERE org_id = $5
    RETURNING org_id;
  `;

  const queryParams = [organization_name, description, email, logo_name, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Organization not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated organization with ID:', organizationId);
  }

  return result.rows[0].org_id;
};

export {getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization};  