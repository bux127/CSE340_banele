import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT cart_id, name
      FROM public.categories;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllCategories}  