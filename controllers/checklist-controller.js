const { sequelize } = require('../models');
const { addItemsParser, createChecklistParser, updateChecklistParser } = require('./checklist-query-parser');


class ChecklistController {
  static async getChecklist(req, res, next) {
    const checklistId = +req.params.checklistId
    const query = `
      SELECT * FROM "Checklists"
      WHERE id = ${checklistId}
    `
    try {
      const checklist = await sequelize.query(query);
      const dataParams = {
        type: 'checklists',
        id: checklistId,
        attributes: checklist[0],
        links: {
          self: `http://${process.env.SERVER_URL}/checklists/${checklistId}`
        }
      }

      res.status(200).json(dataParams)
    } catch (error) {
      console.log(error)
    }
  }

  static async getChecklists(req, res, next) {
    const query = `
      SELECT * FROM "Checklists"
    `
    try {
      const checklists = await sequelize.query(query);
      const params = {
        meta: {
          count: 10,
          total: 100
        },
        links: {
          first: '',
          last: '',
          next: '',
          prev: '',
        },
        data: checklists[0].map(checklist => {
          return {
            ...checklist, links: {
              self: `http://${process.env.SERVER_URL}/checklists/${checklistId}`
            }
          }
        })
      }
      res.status(200).json(params)
    } catch (error) {
      console.log(error)
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
      console.log(error)
    }
  }

  static async updateChecklist(req, res, next) {
    const checklistId = +req.params.checklistId
    const { object_domain, object_id, description, is_completed, completed_at } = req.body.attributes
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
      const params = {
        data: {
          type: "checklists",
          id: checklistId,
          attributes: updatedChecklist[0]
        }
      }
      res.send(200).json(params)

    } catch (error) {
      console.log(error)
    }
  }

  static async deleteChecklist(req, res, next) {
    const checklistId = +req.params.checklistId
    try {
      const deleteitemsQuery = `
      DELETE FROM "Items"
      WHERE ChecklistId = ${checklistId}
      `
      const deleteChecklistQuery = `
        DELETE FROM "Checklists"
        WHERE id = ${checklistId}
      `
      await sequelize.transaction(async (transaction) => {
        await sequelize.query(deleteitemsQuery, { transaction })
        await sequelize.query(deleteChecklistQuery, { transaction })
        res.status(204)
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = ChecklistController