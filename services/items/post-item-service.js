const { sequelize } = require("../../models")
const { completeItemQuery, createItemQuery } = require("./item-query-parser")

async function completeItemService(params) {
  const query = completeItemQuery(params)
  const items = await sequelize.query(query)
  const results = items[0].map(item => {
    const { id, is_completed, ChecklistId } = item
    const result = {
      id: id,
      item_id: id,
      is_completed,
      checklist_id: ChecklistId
    }
    return result
  })
  return { data: results }
}

async function createItemService(params) {
  const checklistId = params.checklistId
  const createItemParams = {
    ...params,
    checklistId
  }
  const addItemQuery = createItemQuery(createItemParams)

  const item = await sequelize.query(addItemQuery)
  const data = {
    type: 'items',
    id: item[0][0].id,
    attributes: item[0][0],
    links: {
      self: `${process.env.SERVER_URL}/checklists/${checklistId}/items/`
    }
  }

  return { data }
}

module.exports = {
  completeItemService,
  createItemService
}