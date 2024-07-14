import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { TokenModel } from '../models/token-model.js'


class tokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
			expiresIn: '100m'
		})
		
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
			expiresIn: '60d'
		})

		return { accessToken, refreshToken }
	}

	async validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
			return userData
		} catch (err) {
			return null
		}
	}

	async validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
			return userData
		} catch (err) {
			return null
		}
	}

	async saveToken(userId, refreshToken) {
		const tokenData = await TokenModel.findOne({ user: userId })
		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		}

		const token = await TokenModel.create({ user: userId, refreshToken })
		return token
	}

	async removeToken(refreshToken) {
		if (!refreshToken) throw new Error('token service - no token')
		const tokenData = await TokenModel.deleteOne({ refreshToken })
		return tokenData
	}
}

export default new tokenService()
