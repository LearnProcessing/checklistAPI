const { getHistoryService, getHistoriesService } = require("../services/histories")

class HistoryController {
  static async getHistory(req, res, next) {
    const historyId = +req.params.historyId
    const params = { historyId }
    try {
      const results = await getHistoryService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  static async getHistories(req, res, next) {
    const historyId = +req.params.historyId
    const params = { historyId }
    try {
      const results = await getHistoriesService(params)
      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = HistoryController