function getItemQuery(params) {
  const { checklistId, itemId } = params
  return `
    SELECT i.*
    FROM "Checklists" AS c
    INNER JOIN 
      (
        SELECT 
        *
        FROM "Items"
        WHERE id = ${itemId}
        GROUP BY "ChecklistId", "Items".id
      ) AS i
    ON i."ChecklistId" = c.id
    WHERE c.id = ${checklistId}
  `
}

function completeItemQuery(params) {
  const { data, isComplete } = params
  const whereClause = data.map(e => {
    return `id = ${e.item_id}`
  }).join('or ')
  const query = `
    UPDATE "Items"
    SET 
      is_completed = ${isComplete}
    WHERE (${whereClause})
    RETURNING *
  `
  return query
}

function createItemQuery(params) {
  const { description, due, urgency, assignee_id, checklistId } = params
  const addItemQuery = `
    INSERT INTO "Items"(description, due, urgency, assignee_id, "ChecklistId", "updatedAt", "createdAt")
    VALUES ('${description}', '${due}', ${urgency}, '${assignee_id}', ${checklistId}, CURRENT_DATE, CURRENT_DATE)
    RETURNING *
  `

  return addItemQuery
}

function updateItemQuery(params) {
  const { description, due, urgency, assignee_id, checklistId, itemId } = params
  const query = `
    UPDATE "Items"
    SET
      description = '${description}',
      due = '${due}',
      urgency = ${urgency}
      ${assignee_id ? `, assignee_id = '${assignee_id}'` : ''}
    WHERE "ChecklistId" = ${checklistId}
      AND id = ${itemId}
    RETURNING *
  `
  return query
}

function deleteItemQuery(params) {
  const { checklistId, itemId } = params
  return `
    DELETE FROM "Items"
    WHERE "ChecklistId" = ${checklistId}
      AND id = ${itemId}
    RETURNING *
  `
}

function getAllItemsQuery(params) {
  const { filter, sort, page } = params
  const filterClause = parseAllItemsFilter(filter)
  const sortClause = parseAllItemsSorter(sort)
  const query = `
    SELECT * FROM "Items"
    ${filterClause}
    ${sortClause}
  `
  return query
}

function parseAllItemsFilter(filter) {
  
  if(!filter) return ''
  let whereClause = 'WHERE '
  if(filter.due){
    const bottomTime = filter.due.between.split(',')[0]
    const upperTime = filter.due.between.split(',')[1]
    whereClause += `due >= '${bottomTime}' AND due < '${upperTime}'`
  } else if(filter.assignee_id) {
    whereClause += `assignee_id = '${filter.assignee_id.is}'`
  } else if(filter.is_completed){
    whereClause += `is_completed = ${filter.is_completed.is === '1'}`
  } else {
    return ''
  }
  
  return whereClause
}

function parseAllItemsSorter(sort){
  if(!sort) return ''
  const sortSign = sort[0]
  const sortField = sort.slice(1)
  return `ORDER BY "${sortField}" ${sortSign === '-' ? 'DESC' : 'ASC'}`
}



module.exports = { 
  getItemQuery,
  completeItemQuery,
  createItemQuery,
  updateItemQuery,
  deleteItemQuery,
  getAllItemsQuery
}