const { sequelize } = require('../models');
const { 
  addItemsParser, 
  createChecklistParser, 
  updateChecklistParser, 
  checklistQueryParser,
  checklistsQueryParser
} = require('./checklist-query-parser');


class ChecklistController {
  static async getChecklist(req, res, next) {
    const checklistId = +req.params.checklistId
    const { include } = req.query
    const checklisQueryParams = { include, checklistId}
    try {
      const query = checklistQueryParser(checklisQueryParams)
      const checklist = await sequelize.query(query);
      if (!checklist[0]?.length) {
        throw { message: "Data Not Found" }
      }
      const dataParams = {
        type: 'checklists',
        id: checklistId,
        attributes: checklist[0][0],
        links: {
          self: `http://${process.env.SERVER_URL}/checklists/${checklistId}`
        }
      }
      res.status(200).json({ data: dataParams })
    } catch (error) {
      next(error)
    }
  }

  static async getChecklists(req, res, next) {
    const { include, page_limit, page_offset } = req.query
    const queryParams = {
      include,
      page_limit,
      page_offset
    }
    const query = checklistsQueryParser(queryParams)
    try {
      const checklists = await sequelize.query(query);
      const params = {
        data: checklists[0].map(checklist => {
          const id = +checklist.id
          return {
            ...checklist, links: {
              self: `http://${process.env.SERVER_URL}/checklists/${id}`
            }
          }
        })
      }
      res.status(200).json(params)
    } catch (error) {
      next(error)
    }
  }

  static async createChecklist(req, res, next) {
    const { object_domain, object_id, due, urgency, description, items, task_id } = req.body.data.attributes
    try {
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
      const params = {
        type: "checklists",
        id: checklistId,
        attributes: createdChecklist[0][0],
        links: {
          self: `http://${process.env.SERVER_URL}/checklists/${checklistId}`
        }
      }
      res.status(201).json(params)
    } catch (error) {
      next(error)
    }
  }

  static async updateChecklist(req, res, next) {
    const checklistId = +req.params.checklistId
    const { object_domain, object_id, description, is_completed, completed_at } = req.body.data.attributes
    const params = {
      checklistId,
      object_domain,
      object_id,
      description,
      is_completed,
      completed_at
    }
    const query = updateChecklistParser(params)
    try {
      const updatedChecklist = await sequelize.query(query)
      const id = updatedChecklist[0][0]?.id
      if (!id) {
        throw { message: 'Data Not Found' }
      }
      const params = {
        data: {
          type: "checklists",
          id: checklistId,
          attributes: updatedChecklist[0][0],
          links: {
            self: `http://${process.env.SERVER_URL}/checklists/${id}`
          }
        }
      }
      res.status(200).json(params)

    } catch (error) {
      next(error)
    }
  }

  static async deleteChecklist(req, res, next) {
    const checklistId = +req.params.checklistId
    try {
      const deleteitemsQuery = `
      DELETE FROM "Items"
      WHERE "ChecklistId" = ${checklistId}
      RETURNING *
      `
      const deleteChecklistQuery = `
        DELETE FROM "Checklists"
        WHERE id = ${checklistId}
      `
      await sequelize.transaction(async (transaction) => {
        const items = await sequelize.query(deleteitemsQuery, { transaction })
        if (!items[0]?.length) throw { message: 'Data Not Found' }
        const checklist = await sequelize.query(deleteChecklistQuery, { transaction })
        if (!checklist[0]?.length) throw { message: 'Data Not Found' }
        return
      })
      res.status(204).json({})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ChecklistController