const { getChecklistService, getChecklistsService } = require('../services/checklists/get-checklist-service');
const { createChecklistService } = require('../services/checklists/create-checklist-service');
const { updateChecklistService } = require('../services/checklists/update-checklist-service');
const { deleteChecklistService } = require('../services/checklists/delete-checklist-service');


class ChecklistController {
  static async getChecklist(req, res, next) {
    const getChecklistParams = {
      include: req.query.include,
      checklistId: +req.params.checklistId
    }
    try {
      const results = await getChecklistService(getChecklistParams)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async getChecklists(req, res, next) {
    const { include, page_limit, page_offset } = req.query
    const getChecklistsParams = {
      include,
      page_limit,
      page_offset
    }
    try {
      const results = await getChecklistsService(getChecklistsParams)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async createChecklist(req, res, next) {
    const { object_domain, object_id, due, urgency, description, items, task_id } = req.body.data.attributes
    const createChecklistParams = {
      object_domain,
      object_id,
      due,
      urgency,
      description,
      items,
      task_id
    }
    try {
      const results = await createChecklistService(createChecklistParams)
      res.status(201).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async updateChecklist(req, res, next) {
    const checklistId = +req.params.checklistId
    const { object_domain, object_id, description, is_completed, completed_at } = req.body.data.attributes
    const updateChecklistParams = {
      checklistId,
      object_domain,
      object_id,
      description,
      is_completed,
      completed_at
    }
    try {
      const results = await updateChecklistService(updateChecklistParams)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async deleteChecklist(req, res, next) {
    const params = {
      checklistId: +req.params.checklistId
    }
    try {
      await deleteChecklistService(params)
      res.status(204).json({})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ChecklistController