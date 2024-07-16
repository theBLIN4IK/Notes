import { Router } from 'express'
import userController from '../controllers/user-controller.js'
import taskController from '../controllers/task-controller.js'
import { body } from 'express-validator'

const router = Router()
router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 6, max: 20 }),
	userController.registration
)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.put('/updateUser/:id', userController.updateUser)
router.put('/updateUser2/:id', userController.updateUser2)

 router.post('/postTask',taskController.postTask)
 router.delete('/deleteTask/:taskId', taskController.deleteTask)
 router.put('/updateTask/:taskId', taskController.updateTask);
 router.get('/tasks/:userId', taskController.getTasksByUserId)
 
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/getUser/:email', userController.getUserByEmail)
router.get('/checkAuth', userController.checkAuth)

export default router
