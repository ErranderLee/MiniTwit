const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Posts',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User); // 사용자와 게시글의 관계는 일대다 관계.
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // 게시글과 해시태그는 다대다 관계.
        // 다대다 관계는 중간테이블이 생긴다. 중간테이블의 이름을 through를 통해 적어준다.
        // foriegnKey 속성을 지정해주지 않으면 기본적으로 postid와 hashtagid로 설정된다.
    }
};