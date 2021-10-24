function checklistQueryParser(params) {
  const { include, checklistId } = params
  if(include === 'items') {
    return `
      SELECT c.*, i.items
      FROM "Checklists" AS c
      INNER JOIN 
        (
          SELECT 
            "ChecklistId", 
            string_agg(description, ', ') AS items
          FROM "Items"
          GROUP BY "ChecklistId"
        ) AS i
      ON i."ChecklistId" = c.id
      WHERE c.id = ${checklistId}
    `
  }
  return `
    SELECT * FROM "Checklists"
    WHERE id = ${checklistId}
  `
}

function checklistsQueryParser(params) {
  const { include, page_limit, page_offset } = params
  const limitClause = page_limit? `LIMIT ${page_limit}`: ""
  const offsetClause = page_offset? `OFFSET ${page_offset}` : ""

  if(include === 'items') {
    return `
      SELECT c.*, i.items
      FROM "Checklists" AS c
      INNER JOIN 
        (
          SELECT 
            "ChecklistId", 
            string_agg(description, ', ') AS items
          FROM "Items"
          GROUP BY "ChecklistId"
        ) AS i
      ON i."ChecklistId" = c.id
      ${limitClause}
      ${offsetClause}
    `
  }
  return `
    SELECT * FROM "Checklists"
    ${limitClause}
    ${offsetClause}

  `
}

function createChecklistParser(params) {
  const { object_domain, object_id, description, due, urgency } = params
  return `
    INSERT INTO "Checklists"(object_domain, object_id, description, is_completed, due, urgency, "updatedAt", "createdAt")
    VALUES ('${object_domain}', '${object_id}', '${description}', false, '${due}', ${urgency}, CURRENT_DATE, CURRENT_DATE)
    RETURNING *
  `
}

function addItemsParser(params) {
  const { items, task_id, checklistId } = params
  const valuesParser =  items
    .map((item) => {
      return `(${checklistId}, '${item}', false, '${task_id}', CURRENT_DATE, CURRENT_DATE)`
    })
    .join(',')

  return `
    INSERT INTO "Items"("ChecklistId", description, is_completed, task_id, "updatedAt", "createdAt")
    VALUES ${valuesParser}
  `
}

function updateChecklistParser(params) {
  const { checklistId, object_domain, object_id, description, is_completed, completed_at } = params
  return `
    UPDATE "Checklists"
    SET 
    object_domain = '${object_domain}',
    object_id = '${object_id}',
    description = '${description}',
    is_completed = ${is_completed},
    completed_at = ${completed_at}
    WHERE 
    id = ${checklistId}
    RETURNING *
  `
}

module.exports = { 
  addItemsParser, 
  createChecklistParser, 
  updateChecklistParser, 
  checklistQueryParser,
  checklistsQueryParser
}
