module.exports = (sequelize, DataTypes) => {
	let Message = sequelize.define('Message', {
		content: DataTypes.STRING,
		read: DataTypes.BOOLEAN
	}, {});

	Message.associate = function(models) {
		Message.belongsTo(models.User);
		Message.belongsTo(models.Conversation);
	};

	return Message;
};