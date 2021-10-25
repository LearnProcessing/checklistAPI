const { sequelize } = require("../../models");
const { deleteItemQuery } = require("./item-query-parser");

async function deleteItemService(params){
  const { checklistId, itemId } = params
  const query = deleteItemQuery(params)
  const item = await sequelize.query(query)
  const data = {
    type: "items",
    id: itemId,
    attributes: {
      ...item[0][0]
    },
    links: {
      self: `${process.env.SERVER_URL}/checklists/${checklistId}/items/${itemId}`
    }
  }

  return { data }

}

module.exports = {
  deleteItemService
}