const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');

const throwError = (res, error) => {
    console.log(error)
    return res.status(error.status).json({
        meta : {
            status : error.status || 500
        },
        data : error.message
    })
}

module.exports = {
    list: async (req, res) => {
        try {
            let genres = await db.Genre.findAll();
            let response = {
                meta : {
                    status : 200,
                    total : genres.length,
                    link : 'api/genres'
                },
                data : genres
            }

            return res.status(200).json(response)
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                meta : {
                    status : 500,
                    link : 'api/genres'
                },
                data : error
            })
        }
    },
    detail: async (req, res) => {
        try {

            if(isNaN(req.params.id)){
                let error = new Error('ID incorrecto');
                error.status = 422;
                throw error
            }

            let genre = await db.Genre.findByPk(req.params.id);


            if(!genre){
                let error = new Error('ID inexistente');
                error.status = 404;
                throw error
            }

            let response = {
                meta : {
                    status : 200,
                    link : 'api/genres' + req.params.id
                },
                data : genre
            }
            return res.status(200).json(response)

        } catch (error) {      

            throwError(res, error)
        }
    }
}