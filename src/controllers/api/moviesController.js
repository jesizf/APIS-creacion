const path = require('path');
const db = require('../../database/models');

const throwError = (res, error) => {
    console.log(error)
    return res.status(error.status).json({
        meta: {
            status: error.status || 500
        },
        data: error.message
    })
}
module.exports={
    list: async (req, res) => {
        try {
            let movies = await db.Movie.findAll();
            let response = {
                meta: {
                    status: 200,
                    total: movies.length,
                    link: 'api/movies'
                },
                data: movies
            }

            return res.status(200).json(response)

        } catch (error) {

            throwError(res.error)
        }
    },

    detail: async (req, res) => {
        try {

            if (isNaN(req.params.id)) {
                let error = new Error('ID incorrecto');
                error.status = 422;
                throw error
            }

            let movie= await db.Movie.findByPk(req.params.id);


            if (!movie) {
                let error = new Error('ID inexistente');
                error.status = 404;
                throw error
            }

            let response = {
                meta: {
                    status: 200,
                    link: 'api/movies' + req.params.id
                },
                data: movie
            }
            return res.status(200).json(response)

        } catch (error) {

            throwError(res, error)
        }
    }, create: (req, res)=>{
        
    }
}
