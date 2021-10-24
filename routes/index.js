const router = require('express').Router()
const ChecklistController = require('../controllers/checklist-controller')
const authorization = require('../middlewares/authorization')

router.get('/checklists', ChecklistController.getChecklists)
router.get('/checklists/:checklistId', ChecklistController.getChecklist)
router.use(authorization)
router.post('/checklists', ChecklistController.createChecklist)
router.patch('/checklists/:checklistId', ChecklistController.updateChecklist)
router.delete('/checklists/:checklistId', ChecklistController.deleteChecklist)


module.exports = router