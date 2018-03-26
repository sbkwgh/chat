module.exports = (sequelize, DataTypes) => {
	let Conversation = sequelize.define('Conversation', {
		name: DataTypes.STRING
	}, {});

	return Conversation;
};