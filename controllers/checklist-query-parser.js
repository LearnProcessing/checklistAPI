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
  object_domain = "${object_domain}",
  object_id = "${object_id}",
  description = "${description}",
  is_completed = ${is_completed},
  completed_at = "${completed_at}"
  WHERE 
  id = ${checklistId}
  RETURNING *
`
}

module.exports = { addItemsParser, createChecklistParser, updateChecklistParser }
