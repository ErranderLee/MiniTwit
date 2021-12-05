const Sequelize = require('sequelize');

// sequelize는 primary key 기본적으로 생략한다.
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            // id는 primary key라 생략한다.
            email : {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true.valueOf,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true, // 생성 시간, 수정 시간 컬럼을 만들어서 자동으로 만듦.
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // 삭제 시간 컬럼을 만듦, 로우 복구를 위해 완전히 삭제하지 않고 이 컬럼에 표시한다.
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post); // 게시글과 일대다 관계
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        }); // 유저와 유저는 팔로잉과 팔로워 관계로 다대다라고 할 수 있음.
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
    }
}