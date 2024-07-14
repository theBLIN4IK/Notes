import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
	name: { type: String },
	ava: { type: String },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String }
})

export const UserModel = model('User', UserSchema)
