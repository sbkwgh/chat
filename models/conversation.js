module.exports = (sequelize, DataTypes) => {
	let Conversation = sequelize.define('Conversation', {
		name: DataTypes.STRING
	}, {});

	Conversation.associate = function(models) {
		Conversation.hasMany(models.User, {
			through: models.UserConversation
		});
	};

	return Conversation;
};