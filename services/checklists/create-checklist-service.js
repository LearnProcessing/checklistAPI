const { sequelize } = require("../../models")
const { createChecklistParser, addItemsParser } = require("./checklist-query-parser")

async function createChecklistService(params) {
  const { object_domain, object_id, due, urgency, description, items, task_id } = params
  const createChecklistParserParams = {
    object_domain, object_id, description, due, urgency
  }
  const createChecklistQuery = createChecklistParser(createChecklistParserParams)
  const createdChecklist = await sequelize.query(createChecklistQuery)
  const checklistId = +createdChecklist[0][0].id
  const addItemsParserParams = {
    items, task_id, checklistId
  }
  const createItemsQuery = addItemsParser(addItemsParserParams)
  await sequelize.query(createItemsQuery)
  const data = {
    type: "checklists",
    id: checklistId,
    attributes: createdChecklist[0][0],
    links: {
      self: `${process.env.SERVER_URL}/checklists/${checklistId}`
    }
  }
  return { data }
}

module.exports = {
  createChecklistService
}