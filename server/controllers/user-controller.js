import 'dotenv/config';
import validator from 'validator';
import userService from '../services/user-service.js';
import { validationResult } from 'express-validator'
import { UserModel } from '../models/user-model.js';
import { Task } from '../models/tasks-model.js';
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
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      return res.json({ ...userData})
	 
    } catch (err) {
      next(err)
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

	async getUserByEmail(req, res, next) {
		try {
		  const { email } = req.params;
		  const user = await UserModel.findOne({ email });
		  if (!user) {
			return next(ApiError.BadRequest('Пользователь не найден'));
		  }
		  res.json(user);
		} catch (error) {
		  next(ApiError.Internal(error.message));
		}
	  }
	
	  async updateUser(req, res, next) {
		try {
		  const userId = req.params.id;
		  const { name } = req.body;
		  if (!name) {
			return next(ApiError.BadRequest('Имя не может быть пустым'));
		  }
		  const existingUser = await UserModel.findOne({ name, _id: { $ne: userId } });
		  if (existingUser) {
			return next(ApiError.BadRequest('Пользователь с таким именем уже существует'));
		  }
		  const user = await UserModel.findByIdAndUpdate(userId, { name }, { new: true });
		  if (!user) {
			return next(ApiError.NotFound('Пользователь не найден'));
		  }
		  res.json({ message: 'Ник успешно обновлен', user });
		} catch (error) {
		  console.error('Error updating user:', error);
		  next(ApiError.Internal(error.message));
		}
	  }
	
	  async updateUser2(req, res, next) {
		try {
		  const userId = req.params.id
		  const { ava } = req.body
		  if (!ava) {
			return next(ApiError.BadRequest('Ссылка на аватар не может быть пустой'))
		  }
		  if (!validator.isURL(ava)) {
			return next(ApiError.BadRequest('Ссылка на аватар должна быть URL'))
		  }
		  const user = await UserModel.findByIdAndUpdate(userId, { ava }, { new: true })
		  if (!user) {
			return next(ApiError.NotFound('Пользователь не найден'))
		  }
		  res.json({ message: 'Аватар успешно обновлен', user })
		} catch (error) {
		  console.error('Error updating user:', error)
		  next(ApiError.Internal(error.message))
		}
	  }
	
	  async logout(req, res, next) {
		try {
		  const { refreshToken } = req.cookies;
		  if (!refreshToken) {
			return next(ApiError.BadRequest('Нет токена'));
		  }
		  const token = await userService.logout(refreshToken);
		  res.clearCookie('refreshToken');
		  return res.status(200).json(token);
		} catch (err) {
		  next(ApiError.Internal(err.message));
		}
	  }
	
	  async checkAuth(req, res, next) {
		try {
		  const { refreshToken } = req.cookies;
		  const userData = await userService.checkAuth(refreshToken);
		  return res.json(userData);
		} catch (err) {
		  next(ApiError.Internal(err.message));
		}
	  }
	}
	
	export default new UserController();
