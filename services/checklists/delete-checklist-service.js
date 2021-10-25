const { sequelize } = require("../../models")

async function deleteChecklistService(params) {
  const { checklistId } = params
  const deleteitemsQuery = `
  DELETE FROM "Items"
  WHERE "ChecklistId" = ${checklistId}
  RETURNING *
  `
  const deleteChecklistQuery = `
    DELETE FROM "Checklists"
    WHERE id = ${checklistId}
    RETURNING *
  `
  await sequelize.transaction(async (transaction) => {
    const items = await sequelize.query(deleteitemsQuery, { transaction })
    if (!items[0]?.length) throw { message: 'Data Not Found' }
    const checklist = await sequelize.query(deleteChecklistQuery, { transaction })
    if (!checklist[0]?.length) throw { message: 'Data Not Found' }
    return
  })
}

module.exports = {
  deleteChecklistService
}