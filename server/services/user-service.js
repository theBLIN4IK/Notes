import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserDto } from '../dto/user-dto.js';
import { UserModel } from '../models/user-model.js';
import mailService from './mail-service.js';
import tokenService from './token-service.js';
import { ApiError } from '../exceptions/api-errors.js'
import fs from 'fs'



class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) throw ApiError.BadRequest(`Пользователь уже существует`)

    const hashPassword = await bcrypt.hash(password, 10)
    const activationLink = uuidv4()
    const user = await UserModel.create({
	  name: `user${Math.floor(Math.random() * 900000) + 100000}`,
	  avatar: '',
      email,
      password: hashPassword,
      activationLink
    })

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );


    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

	async activate(activationLink) {
		const user = await UserModel.findOne({ activationLink })
		if (!user) throw ApiError.BadRequest('Пользователь не найден')
		user.isActivated = true
		await user.save()
	}
  async login(email, password) {
		const user = await UserModel.findOne({ email })
		if (!user) throw ApiError.BadRequest('Пользователь не найден')

		const isPassEquals = await bcrypt.compare(password, user.password);
		if (!isPassEquals) throw ApiError.BadRequest('Пароль неверный')

		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto } 
	}

	async refresh(refreshToken) {
		if (!refreshToken) throw ApiError.UnauthorizedError()

		const userData = await tokenService.validateRefreshToken(refreshToken)
		const tokenFromDB = await tokenService.findToken(refreshToken)

		if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()

		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}

	async logout(refreshToken) {
		if (!refreshToken) throw ApiError.UnauthorizedError()
		const token = await tokenService.removeToken(refreshToken)
		return token
	}
	async setAvatar(refreshToken, avatarPath) {
		if (!refreshToken) throw ApiError.UnauthorizedError();
		const userData = await tokenService.validateRefreshToken(refreshToken)
		const user = await UserModel.findOne({ email: userData.email })
		if (!userData || !user) throw ApiError.UnauthorizedError()
		if (user.avatar && fs.existsSync(user.avatar)) {
		  fs.unlink(user.avatar, (err) => {
			if (err) {
			  ApiError.BadRequest('Ошибка при удалении файла');
			} else {
			  return;
			}
		  });
		}
	  
		user.avatar = avatarPath
		await user.save()
		return { user: avatarPath }
	  }

	

	async checkAuth(refreshToken) {
		if (!refreshToken) {
		  return { user: null }
		}
		try {
		  const userData = await tokenService.validateRefreshToken(refreshToken)
		  const user = await UserModel.findOne({ email: userData.email })
		  if (!userData || !user) {
			return { user: null }
		  }
		  const userDto = new UserDto(user)
		  return { user: userDto }
		} catch (error) {
		  return { user: null }
		}
	  }

	  
}

export default new UserService()