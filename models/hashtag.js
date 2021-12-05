const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title : {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: true, // 생성 시간, 수정 시간 컬럼을 만들어서 자동으로 만듦.
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'Hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
       db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    }
}