module.exports = (sequelize, DataTypes) => {
	let Conversation = sequelize.define('Conversation', {
		name: {
			type: DataTypes.STRING,
			validate: {
				isString (val) {
					if(typeof val !== 'string') {
						throw new Error('Name must be of type string');
					}
				},
				maxLength (val) {
					if(val.toString().trim().length > 1000) {
						throw new Error('Name must be 1000 characters or less')
					}
				}
			}
		},
		groupUsers: DataTypes.STRING
	});

	Conversation.prototype.setName = async function (userId) {
		let json = this.toJSON();

		if(!this.Users || this.Users.length < 2) {
			let users = await sequelize.models.User.findAll({
				attributes: { exclude: ['hash'] },
				include: [{
					model: sequelize.models.Conversation,
					where: { id: this.id  }
				}]
			});

			json.Users = users.map(u => u.toJSON());
		}

		if(this.name) { 
			return json;
		} else if(json.Users.length === 2) {
			json.name = json.Users.find(u => u.id !== userId).username;
		} else {
			json.name = json.Users.map(u => u.username).join(', ');
		}

		return json;
	};

	Conversation.associate = function(models) {
		Conversation.belongsToMany(models.User, {
			through: models.UserConversation
		});
		Conversation.hasMany(models.Message);
	};

	return Conversation;
};