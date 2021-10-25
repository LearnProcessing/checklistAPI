const { sequelize } = require("../../models")
const { logHistory } = require("../histories")
const { updateChecklistParser } = require("./checklist-query-parser")

async function updateChecklistService(params) {
  const { checklistId } = params
  const query = updateChecklistParser(params)
  const checklist = await sequelize.query(query)
  const id = checklist[0][0]?.id
  if (!id) {
    throw { message: 'Data Not Found' }
  }
  const data = {
    type: "checklists",
    id: checklistId,
    attributes: checklist[0][0],
    links: {
      self: `${process.env.SERVER_URL}/checklists/${id}`
    }
  }

  const loggerParams = {
    loggable_type: 'checklists', 
    loggable_id: checklistId, 
    action: 'update', 
    kwuid: checklistId, 
    value: ''
  }
  await logHistory(loggerParams)

  return { data }
}

module.exports = { updateChecklistService }