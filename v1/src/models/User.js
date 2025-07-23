// @ts-nocheck
import { randomBytes, createHash } from 'crypto';
import { Schema, model } from 'mongoose';
import isEmail from 'validator';
import * as bcrypt from 'bcryptjs';

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please tell us your name!'],
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			unique: true,
			lowercase: true,
			validate: [isEmail, 'Please provide a valid email'],
		},
		photo: { type: String, default: 'default.jpg' },
		role: {
			type: String,
			enum: ['user', 'guide', 'lead-guide', 'admin'],
			default: 'user',
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Please confirm your password'],
			validate: {
				// This only works on CREATE and SAVE!!!
				validator: function (el) {
					return el === this.password;
				},
				message: 'Passwords do not match!',
			},
		},
		passwordChangedAt: { type: Date, select: false },
		passwordResetToken: String,
		passwordResetExpires: Date,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

// Hash user password before saving to database
userSchema.pre('save', async function (next) {
	// Only run if password was actually modified
	if (!this.isModified('password')) return next();

	// Hash with cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	// Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

// Update passwordChangedAt field when password is changed
userSchema.pre('save', async function (next) {
	// Only run if password was actually modified
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000; // -1s don't forget
	next();
});

// Query for active users only
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

// Compare entered password with hashed password in database
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password changed since last login
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}

	// False means NOT changed
	return false;
};

// Add passwordResetToken and passwordResetExpires fields to user
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = randomBytes(32).toString('hex');

	this.passwordResetToken = createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const User = model('User', userSchema);

export default User;
