const { sequelize } = require("../../models")

async function logHistory(params) {
  const { loggable_type, loggable_id, action, kwuid, value } = params
  const query = `
    INSERT INTO "Histories"(loggable_type, loggable_id, action, kwuid, value, "createdAt", "updatedAt")
    VALUES ('${loggable_type}', ${loggable_id}, '${action}', ${kwuid}, '${value}', CURRENT_DATE, CURRENT_DATE)
  `
  await sequelize.query(query)
}

async function getHistoryService(params) {
  const { historyId } = params
  const query = `
    SELECT * FROM "Histories"
    WHERE id = ${historyId}
  `
  const history = await sequelize.query(query)
  const data = {
    type: 'history',
    id: historyId,
    attributes: {
      ...history[0][0]
    },
    links: {
      self: `${process.env.SERVER_URL}/checklists/history/${historyId}`
    }
  }

  return { data }
}

async function getHistoriesService() {
  const query = `
    SELECT * FROM "Histories"
  `
  const histories = await sequelize.query(query)
  const data = histories[0].map(history => {
    return {
      type: 'history',
      id: history.id,
      attributes: {
        ...history
      },
      links: {
        self: `${process.env.SERVER_URL}/checklists/history/${history.id}`
      }
    }
  })
  
  const results = {
    data
  }

  return results
}

module.exports = {
  logHistory,
  getHistoryService,
  getHistoriesService
}