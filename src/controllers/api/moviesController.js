const db = require('../../database/models');
const moment = require('moment');

let NaNError= id => {
    if (isNaN(id)) {
        let error = new Error('ID incorrecto')
        error.status = 422; 

        throw error;
    }
}

const throwError = (res, error) => {
    console.log(error);
    return res.status(error.status).json({
        meta: {
            status: error.status || 500
        },
        data: error.message
    })
}

module.exports = {
    list: async (req, res) => {
        try {

            let movies = await db.Movie.findAll();

            let response = {
                meta: {
                    status: 200,
                    total: movies.length,
                    url: 'api/movies'
                },
                data: movies
            }

            return res.status(200).json(response)

        } catch (error) {
            throwError(res, error);
        }

    },
    detail: async (req, res) => {

        try {

            /*if (isNaN(req.params.id)) {
                let error = new Error('ID incorrecto') //crea un nuevo error 
                error.status = 422; 
                throw error; 
            }*/

            NaNError(req.params.id)

            let movie = await db.Movie.findByPk(req.params.id);

            if (!movie) {
                let error = new Error('ID inexistente') //crea un nuevo error en el caso que la condicion no se cumpla
                error.status = 404; 

                throw error; //"tira" el error al catch
            }

            let response = {
                meta: {
                    status: 200,
                    url: 'api/movies/' + req.params.id
                },
                data: movie
            }

            return res.status(200).json(response)

        } catch (error) {
            throwError(res, error);
        }


    },
    create: async (req, res) => {
        try {
            req.body.release_date ? req.body.release_date = moment(req.body.release_date).format('DD-MM-YYYY') : null;
            let movie = await db.Movie.create({
                ...req.body  //le paso toda la informacion de req.body al objeto .create()
            })

            let response = {
                meta: {
                    status: 201,
                    url: 'api/movies/' + movie.id,
                    msg: 'Película creada con exito'
                },
                data: movie
            }

            return res.status(201).json(response)

        } catch (error) {
            return res.status(400).json({
                meta: {
                    status: 400
                },
                data: error.errors.map(error => error.message)
            })
        }
    },
    update: async (req,res) => {
        try {

            NaNError(req.params.id)

            let movie = await db.Movie.update(
                {
                    ...req.body
                },
                {
                    where : {
                        id : req.params.id
                    }
                }
            )

            let response;

            if(movie[0] === 1){
                response = {
                    meta: {
                        status: 201,
                        url: 'api/movies/' + movie.id,
                        msg: 'Película actualizada con exito'
                    }
                }
                return res.status(201).json(response)
            }else{
                response = {
                    meta: {
                        status: 204,
                        url: 'api/movies/' + movie.id,
                        msg: 'No se pudo actualizar la película'
                    }
                }
                return res.status(204).json(response)
            }
            
        } catch (error) {
            return res.status(400).json({
                meta: {
                    status: 400
                },
                data: error.errors.map(error => error.message)
            })
        }
    },
    destroy: async (req,res) => {
        try {

            NaNError(req.params.id)

            let movie = await db.Movie.destroy(
                {
                    where : {
                        id : req.params.id
                    }
                }
            )

            let response;

            if(movie === 1){
                response = {
                    meta: {
                        status: 201,
                        url: 'api/movies/' + movie.id,
                        msg: 'Película eliminada con exito'
                    }
                }
                return res.status(201).json(response)
            }else{
                response = {
                    meta: {
                        status: 204,
                        url: 'api/movies/' + movie.id,
                        msg: 'No se pudo eliminar la película'
                    }
                }
                return res.status(204).json(response)
            }
            
        } catch (error) {
            return res.status(400).json({
                meta: {
                    status: 400
                },
                data: error.errors.map(error => error.message)
            })
        }
    }
}