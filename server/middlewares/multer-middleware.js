import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { ApiError } from '../exceptions/api-errors.js'
import userService from '../services/user-service.js'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads')
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const extension = path.extname(file.originalname)

		cb(null, file.fieldname + '-' + uniqueSuffix + extension)
	}
})

export const upload = multer({
	storage: storage,
	limits: { fileSize: 1024 * 1024 * 4, files: 1 },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == 'image/png' ||
			file.mimetype == 'image/jpg' ||
			file.mimetype == 'image/jpeg' ||
			file.mimetype == 'image/webp' ||
			file.mimetype == 'image/gif'
		) {
			cb(null, true)
		} else {
			cb(null, false)
			cb(
				ApiError.BadRequest(
					'Неверный формат'
				)
			)
		}
	}
})

export const deleteFileOnError = (req, res, next) => {
	const prevResponse = res //  не украл а позоимствовал)
	console.log(req.file.path)
	try {
		console.log('Удаляю файл: ', req.file.path)
		fs.unlink(req.file.path, err => {
			if (err) {
				console.error('Ошибка при удалении файла:', err)
				return next(err)
			}
			console.log('Файл успешно удален')
			next(prevResponse)
		})
	} catch (err) {
		console.error('Не удалось удалить файл:', err)
		next(err)
	}
}


