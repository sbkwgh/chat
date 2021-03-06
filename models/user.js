let validationError = require('../lib/errors/validationError');
let randomColor = require('randomcolor');
let bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
	let User = sequelize.define('User', {
		username: {
			type: DataTypes.STRING,
			unique: {
				msg: 'This username is already registered - try another',
				fields: ['username']
			},
			validate: {
				maxLength (val) {
					if(val.trim().length > 30) {
						throw new Error('Username can\'t be longer than 30 characters');
					}
				},
				minLength (val) {
					if(val.trim().length < 6) {
						throw new Error('Username must be at least 6 characters');
					}
				},
				containsBlankCharacters (val) {
					if(val.trim().match(/\s/g)) {
						throw new Error('Username can\'t contain blank characters');
					}
				}
			}
		},
		color: {
			type: DataTypes.STRING,
			defaultValue () {
				return randomColor({ luminosity: 'light' });
			}
		},
		hash: {
			type: DataTypes.STRING,
			validate: {
				maxLength (val) {
					if(val.length > 30) {
						throw new Error('Password can\'t be longer than 100 characters');
					}
				},
				minLength (val) {
					if(val.length < 6) {
						throw new Error('Password must be at least 8 characters');
					}
				}
			}
		}
	},
	{
		hooks: {
			async beforeCreate (user) {
				let hash = await bcrypt.hash(user.hash, 12);

				user.username = user.username.trim();
				user.hash = hash;
			}
		}
	}, {});

	User.associate = function (models) {
		User.belongsToMany(models.Conversation, {
			through: models.UserConversation
		});
	};

	return User;
};