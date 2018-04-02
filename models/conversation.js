module.exports = (sequelize, DataTypes) => {
	let Conversation = sequelize.define('Conversation', {
		name: {
			type: DataTypes.STRING,
			required: true,
			validate: {
				isString (val) {
					if(typeof val !== 'string') {
						throw new sequelize.ValidationError('Name must be of type string');
					}
				},
				maxLength (val) {
					if(val.toString().trim().length > 1000) {
						throw new sequelize.ValidationError('Name must be 1000 characters or less')
					}
				}
			}
		}
	}, {});

	Conversation.associate = function(models) {
		Conversation.belongsToMany(models.User, {
			through: models.UserConversation
		});
		Conversation.hasMany(models.Message);
	};

	return Conversation;
};