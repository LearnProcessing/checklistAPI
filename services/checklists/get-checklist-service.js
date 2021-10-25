const { 
  checklistQueryParser, 
  checklistsQueryParser
} = require("./checklist-query-parser");
const { sequelize } = require("../../models");
const { logHistory } = require("../histories");

async function getChecklistService(params) {
  const { checklistId } = params
  const query = checklistQueryParser(params)
  const checklist = await sequelize.query(query);
  const dataInvalid = !checklist[0] || checklist[0].length === 0
  if (dataInvalid) throw { message: "Data Not Found" }
  const data = {
    type: 'checklists',
    id: checklistId,
    attributes: checklist[0][0],
    links: {
      self: `${process.env.SERVER_URL}/checklists/${checklistId}`
    }
  }

  const loggerParams = {
    loggable_type: 'checklists', 
    loggable_id: checklistId, 
    action: 'getChecklist', 
    kwuid: checklistId, 
    value: ''
  }
  await logHistory(loggerParams)
  return { data }
}

async function getChecklistsService(params) {
  const page_limit = +params.page_limit
  const page_offset = +params.page_offset
  const query = checklistsQueryParser(params)
  const { checklists, total } = await sequelize.transaction(async transaction => {
    const checklists = await sequelize.query(query, { transaction });
    const totalChecklistsParams = {
      include: params.include,
      transaction
    }
    const total = await getTotalChecklists(totalChecklistsParams)
    return { checklists, total }
  })
  const usePagination = page_limit && page_offset >= 0
  const pageNumber = usePagination ? Math.floor(total / page_limit) - 1 : undefined 
  const count = checklists[0].length
  const data = checklists[0].map(checklist => {
    const id = +checklist.id
    return {
      ...checklist, links: {
        self: `${process.env.SERVER_URL}/checklists/${id}`
      }
    }
  })
  const results = {
    meta: {
      count,
      total
    },
    links: {
      first: usePagination ? `${process.env.SERVER_URL}/checklists?page_limit=${page_limit}&page_offset=0` : 'null',
      last: usePagination ? `${process.env.SERVER_URL}/checklists?page_limit=${page_limit}&page_offset=${pageNumber * page_limit}` : 'null',
      next: usePagination && (page_offset + page_limit) < total ? 
        `${process.env.SERVER_URL}/checklists?page_limit=${page_limit}&page_offset=${page_offset + page_limit}` : 'null'
      ,
      prev: page_limit && page_offset > 0 ?
      `${process.env.SERVER_URL}/checklists?page_limit=${page_limit}&page_offset=${page_offset - page_limit}` : 'null'
    },
    data
  }

  const loggerParams = {
    loggable_type: 'checklists', 
    loggable_id: null, 
    action: 'getChecklists', 
    kwuid: null, 
    value: ''
  }
  await logHistory(loggerParams)

  return results
}

async function getTotalChecklists(params) {
  const { transaction } = params
  const query = checklistsQueryParser(params)
  const checklists = await sequelize.query(query, { transaction });
  const total = checklists[0].length
  return total
}



module.exports = {
  getChecklistService,
  getChecklistsService,
}