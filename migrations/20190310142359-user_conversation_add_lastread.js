'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'UserConversations',
			'lastRead',
			{
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: new Date(0)
			}
		);
	},

	down: (queryInterface, Sequelize) => {
		queryInterface.removeColumn('UserConversations', 'lastRead');
	}
};
