const { sequelize } = require("../../models");
const { getItemQuery, getAllItemsQuery } = require("./item-query-parser");

async function getChecklistItemService(params) {
  const query = getItemQuery(params)
  const item = await sequelize.query(query)
  const { 
    id,
    description, 
    is_completed, 
    completed_at, 
    due, urgency, 
    updated_by, 
    ChecklistId, 
    assignee_id, 
    task_id, 
    createdAt, 
    updatedAt 
  } = item[0][0]
  const data = {
    type: 'checklists',
    id,
    attributes: {
      description,
      is_completed,
      completed_at,
      due,
      urgency,
      updated_by,
      checklist_id: ChecklistId,
      assignee_id, 
      task_id,
      created_at: createdAt,
      updated_at: updatedAt
    },
    links: {
      self: `${process.env.SERVER_URL}/checklists/${ChecklistId}/items/${id}`
    }
  }
  return { data }
}

async function getChecklistItemsService(params) {
  const checklistId = +params.checklistId
  const itemsQuery = `
    SELECT * FROM "Items"
    WHERE "ChecklistId" = ${checklistId}
  `
  const checklistQuery = `
    SELECT * FROM "Checklists"
    WHERE id = ${checklistId}
  `
  const { items, checklist } = await sequelize.transaction(async transaction => {
    const items = await sequelize.query(itemsQuery, { transaction })
    const checklist = await sequelize.query(checklistQuery, { transaction })
    return { items, checklist }
  })
  const data = {
    type: 'checklists',
    id: checklist[0][0].id,
    attributes: {
      ...checklist[0][0],
      items: items[0]
    },
    links: {
      self: `${process.env.SERVER_URL}/checklists/${checklistId}/items/`
    }
  }
  return { data }
}

async function getAllItemsService(params){
  const query = getAllItemsQuery(params)
  const items = await sequelize.query(query)
  const data = items[0].map(item => {
    return {
      type: 'items', 
      id: item.id, 
      attributes: item,
      links: {
        self: `${process.env.SERVER_URL}/checklists/items/${item.id}`
      }
    }
  })
  const results = {
    data
  }
  return results

}



module.exports = {
  getChecklistItemService,
  getChecklistItemsService,
  getAllItemsService
}