const { sequelize } = require("../../models");
const { updateItemQuery } = require("./item-query-parser");

async function updateItemService(params) {
  const { checklistId, itemId } = params
  const query = updateItemQuery(params)
  const item = await sequelize.query(query)
  const data= {
    type: 'items',
    id: item[0][0].id,
    attributes: {
      ...item[0][0]
    },
    links: {
      self: `${process.env.SERVER_URL}/checklists/${checklistId}/items/${itemId}`
    }
  }
  return { data }
}

async function updateItemsService(params){
  const { datas, checklistId } = params
  let results = []
  for(const data of datas) {
    const { description, due, urgency, assignee_id } = data.attributes 
    const updateQueryParams = {
      itemId: data.id,
      checklistId,
      description, 
      due, 
      urgency,
      assignee_id
    }
    const query = updateItemQuery(updateQueryParams)
    await sequelize.query(query)

    results.push({
      id: data.id,
      action: 'update',
      status: 200
    })
  }
  return { data: results }
}

module.exports = {
  updateItemService,
  updateItemsService
}