module.exports = (sequelize, DataTypes) => {
	let User_Conversation = sequelize.define('UserConversation', {}, {});

	User_Conversation.associate = function(models) {
		User_Conversation.belongsTo(models.User);
		User_Conversation.belongsTo(models.Conversation);
	};
	
	return User_Conversation;
};