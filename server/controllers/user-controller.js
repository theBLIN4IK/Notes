import 'dotenv/config';
import userService from '../services/user-service.js';
import { validationResult } from 'express-validator'
import { UserModel } from '../models/user-model.js';
import { Task } from '../models/tasks-model.js';
import multer from 'multer';
import path from 'path';
import { ApiError } from '../exceptions/api-errors.js'

class UserController {
  async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Некорректные данные', errors.array()))
			}
			const { email, password } = req.body
			const userData = await userService.registration(email, password)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000, 
				httpOnly: true
			})
			const newTask = new Task({
				userId: userData.user.id, 
				tasks: [],
			  })
			  await newTask.save()

			return res.json(userData)
		} catch (err) {
			next(err)
		}
	}

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ ...userData, redirectTo: '/main' });
    } catch (err) {
      next(err);
    }
  }

  async activate(req, res) {
    const activationLink = req.params.link
    try {
      await userService.activate(activationLink)
      return res.redirect(`${process.env.CLIENT_URL}/main`)
    } catch (err) {
      console.log(err);
      return res.status(500).send('Activation failed.')
    }
  }

  async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000, 
				httpOnly: true
			})
			return res.json(userData)
		} catch (err) {
			next(err)
		}
	}

	async getUserByEmail (req, res) {
		try {
		  const { email } = req.params
		  const user = await UserModel.findOne({ email })
		  if (!user) {
			return res.status(404).json({ message: 'User not found' })
		  }
		  res.json(user)
		} catch (error) {
		  res.status(500).json({ message: error.message })
		}
	  }
	//   async setAvatar(req, res, next) {
	// 	try {
	// 		const { file, cookies } = req
	// 		const errors = validationResult(req)
	
	// 		if (!file) {
	// 			return next(new Error('Не передан файл'))
	// 		}
	
	// 		if (!errors.isEmpty()) {
	// 			await deleteFileOnError(req, res, next)
	// 			const error = new Error('Некорректные данные')
	// 			error.details = errors.array()
	// 			return next(error)
	// 		}
	
	// 		const { refreshToken } = cookies
	
	// 		if (!refreshToken) {
	// 			throw new Error('Отсутствует токен обновления')
	// 		}
	
	// 		await deletePreviousFile(req, res, next)
	// 		const avatar = await userService.setAvatar(refreshToken, file.path)
	
	// 		return res.json(avatar)
	// 	} catch (err) {
	// 		next(err)
	// 	}
	// }

	async updateUser(req, res, next) {
		try {
		  const userId = req.params.id
		  const { name } = req.body
	  
		  if (!name) {
			return res.status(400).json({ message: 'Имя не может быть пустым' })
		  }
	  
		  const user = await UserModel.findByIdAndUpdate(userId, { name }, { new: true })
	  
		  if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' })
		  }
	  
		  res.json({ message: 'Ник успешно обновлен', user })
		} catch (error) {
		  console.error('Error updating user:', error)
		  next(error)
		}
	  }
	  async updateUser2(req, res, next) {
		try {
		  const userId = req.params.id
		  const { ava } = req.body

		  if (!ava) {
			return res.status(400).json({ message: 'Имя не может быть пустым' })
		  }

		  const user = await UserModel.findByIdAndUpdate(userId, { ava }, { new: true })

		  if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' })
		  }

		  res.json({ message: 'ава успешно обновлен', user })
		} catch (error) {
		  console.error('Error updating user:', error)
		  next(error)
		}
	  }

	  async logout(req, res, next) {
		try {
		  const { refreshToken } = req.cookies;
		  if (!refreshToken) {
			throw new Error('controller - cookie - no token');
		  }
		  const token = await userService.logout(refreshToken);
	  
		  res.clearCookie('refreshToken');
		  return res.status(200).json(token);
		} catch (err) {
		  next(err);
		}
	  }
	  
	
	  
	  async checkAuth(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.checkAuth(refreshToken)
			return res.json(userData)
		} catch (err) {
			next(err)
		}
	}

}




export default new UserController()

