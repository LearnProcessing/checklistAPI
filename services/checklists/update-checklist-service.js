const { sequelize } = require("../../models")
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
  return { data }
}

module.exports = { updateChecklistService }