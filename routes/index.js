const router = require('express').Router()
const ChecklistController = require('../controllers/checklist-controller')
const ItemController = require('../controllers/item-controller')
const authorization = require('../middlewares/authorization')

router.use(authorization)
router.get('/checklists', ChecklistController.getChecklists)
router.get('/checklists/items', ItemController.getAllItems)
router.get('/checklists/:checklistId', ChecklistController.getChecklist)
router.get('/checklists/:checklistId/items/:itemId', ItemController.getChecklistItem)
router.patch('/checklists/:checklistId/items/_bulk', ItemController.updateChecklistItems)
router.patch('/checklists/:checklistId/items/:itemId', ItemController.updateChecklistItem)
router.delete('/checklists/:checklistId/items/:itemId', ItemController.deleteChecklistItem)
router.get('/checklists/:checklistId/items', ItemController.getChecklistItems)
router.post('/checklists/:checklistId/items', ItemController.createItem)
router.post('/checklists', ChecklistController.createChecklist)
router.post('/checklists/complete', ItemController.completeItem)
router.post('/checklists/incomplete', ItemController.completeItem)
router.patch('/checklists/:checklistId', ChecklistController.updateChecklist)
router.delete('/checklists/:checklistId', ChecklistController.deleteChecklist)


module.exports = router