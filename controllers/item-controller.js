const { deleteItemService } = require("../services/items/delete-item-service")
const { getChecklistItemService, getChecklistItemsService, getAllItemsService } = require("../services/items/get-item-service")
const { completeItemService, createItemService } = require("../services/items/post-item-service")
const { updateItemService, updateItemsService } = require("../services/items/update-item-service")

class ItemController {
  static async completeItem(req, res, next) {
    const { data } = req.body
    const isComplete = req.url.split('/')[2] === 'complete'
    const params = { data, isComplete }
    try {
      const results = await completeItemService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async getAllItems(req, res, next) {
    const { filter, sort, page } = req.query
    const params = {
      filter,
      sort,
      page
    }
    try {
      const results = await getAllItemsService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async getChecklistItem(req, res, next) {
    const checklistId = +req.params.checklistId
    const itemId = +req.params.itemId
    const params = { checklistId, itemId }
    try {
      const results = await getChecklistItemService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async getChecklistItems(req, res, next) {
    const params = {
      checklistId: +req.params.checklistId
    }
    try {
      const results = await getChecklistItemsService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async createItem(req, res, next) {
    const { attribute } = req.body.data
    const params = {
      ...attribute,
      checklistId: +req.params.checklistId
    }
    try {
      const results = await createItemService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async updateChecklistItems(req, res, next) {
    const checklistId = +req.params.checklistId
    const datas = req.body.data
    const params = {
      checklistId,
      datas
    }
    try {
      const results = await updateItemsService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async updateChecklistItem(req, res, next) {
    const checklistId = +req.params.checklistId
    const itemId = +req.params.itemId
    const attributes = req.body.data.attribute
    const params = {
      checklistId,
      itemId,
      ...attributes
    }
    try {
      const results = await updateItemService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async deleteChecklistItem(req, res, next) {
    const checklistId = +req.params.checklistId
    const itemId = +req.params.itemId
    const params = {
      checklistId,
      itemId
    }
    try {
      const results = await deleteItemService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ItemController