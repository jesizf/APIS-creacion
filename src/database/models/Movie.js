module.exports = (sequelize, dataTypes) => {
    let alias = 'Movie'; // esto debería estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        title: {
            type: dataTypes.STRING(500),
            allowNull: false,
            validate: {
                notNull:{msg: "El titulo no puede ser nulo"},
                notEmpty:{msg: "El titulo es obligatorio"}

            }


        },
        rating: {
            type: dataTypes.DECIMAL(3, 1).UNSIGNED,
            allowNull: false,
            validate: {
                notNull:{msg: "El rating no puede ser nulo"},
                notEmpty:{msg: "El rating es obligatorio"},
                notNull:{msg: "El rating no puede ser nulo"},
                isDecimal:{msg: "El rating tiene que ser un valor entre 1 y 99.9"},
                max:{
                    args:99.9,
                    msg:"maximo permitido 99.9"
                }

            }
        },
        awards: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            allowNull: false,
            validate: {
                notNull:{msg: "El awards no puede ser nulo"},
                notEmpty:{msg: "El premio/s es obligatorio"},
                
                isInt:{
                    msg:"solo soporta numeros"

                }
            }
        },
        release_date: {
            type: dataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notNull:{msg: "El release date no puede ser nulo"},
                notEmpty:{msg: "El release es obligatorio"}

            }
        },
        length: dataTypes.BIGINT(10),
        genre_id: dataTypes.BIGINT(10)
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        tableName: 'movies'
    }
    const Movie = sequelize.define(alias, cols, config);

    Movie.associate = function (models) {
        Movie.belongsTo(models.Genre, { // models.Genre -> Genres es el valor de alias en genres.js
            as: "genre",
            foreignKey: "genre_id"
        })

        Movie.belongsToMany(models.Actor, { // models.Actor -> Actors es el valor de alias en actor.js
            as: "actors",
            through: 'actor_movie',
            foreignKey: 'movie_id',
            otherKey: 'actor_id',
            timestamps: false
        })
    }

    return Movie
};