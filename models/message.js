module.exports = (sequelize, DataTypes) => {
	let Message = sequelize.define('Message', {
		content: {
			type: DataTypes.TEXT('long'),
			validate: {
				isString (val) {
					if(typeof val !== 'string') {
						throw new Error('Message must be a string');
					}
				},
				minLength (val) {
					if(!String(val).trim().length) {
						throw new Error('Message cannot be blank');
					}
				}
			},
			allowNull: false
		},
		read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}, {});

	Message.associate = function(models) {
		Message.belongsTo(models.User);
		Message.belongsTo(models.Conversation);
	};

	return Message;
};