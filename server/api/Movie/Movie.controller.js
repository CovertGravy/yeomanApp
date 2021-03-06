/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Movies              ->  index
 * POST    /api/Movies              ->  create
 * GET     /api/Movies/:id          ->  show
 * PUT     /api/Movies/:id          ->  update
 * DELETE  /api/Movies/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Movie from './Movie.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Movies
export function index(req, res) {
  return Movie.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Movie from the DB
export function show(req, res) {
  return Movie.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Movie in the DB
export function create(req, res) {
  
      var newMovie = new Movie;
        newMovie.Title =  req.body.title;
        newMovie.Poster =  req.body.poster_path;
        newMovie.Genre =  req.body.genres[0].name;
        newMovie.Duration =  req.body.runtime;
        newMovie.Year =  req.body.release_date;
        newMovie.Overview =  req.body.overview;
        newMovie.imdb_id = req.body.imdb_id;
        newMovie.backdrop = req.body.backdrop_path;
        newMovie.tagline = req.body.tagline;
        newMovie.ratings = req.body.vote_average;
        newMovie.save((err, doc) =>{
          if(err){
//throw err;
            res.json(err);
          }else{
            res.json({success : true, message :'Movie Added Successfully'});
          }
        });
  // }
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
}

// Updates an existing Movie in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Movie.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Movie from the DB
export function destroy(req, res) {
  return Movie.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
