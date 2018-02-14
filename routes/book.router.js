var express = require('express');
var mongoose = require('mongoose');
var appsettings = require('../appsettings');
var book = require('../models/book');
var bodyParser = require('body-parser');


var bookRouter = express.Router();
bookRouter.route('/')
    .get(function(request, response){
        mongoose.connect(appsettings.mongoUrl);
        var filter = {};
        if(request.query.genre){
            filter.genre = request.query.genre;
        }

        book.find(filter, function (error, books) {
            if(error){
                response.status(500).send(error);
            }
            else{
                response.json(books);
            }
          });
    })
    .post(function(request, response){
        mongoose.connect(appsettings.mongoUrl);
        var b = new book(request.body);        
        b.save();
        response.status(201).send(b);
    });

bookRouter.use('/:id', function(request, response, next){
    mongoose.connect(appsettings.mongoUrl);
    book.findById(request.params.id, function(error, book){
        if(error){
            response.status(500).send(error);
        }
        if(book){
            request.book = book;
            next();
        }
        else{
            response.status(404).send(`Book with id ${request.params.id} not found`);
        }
    });
});
bookRouter.route('/:id')
    .get(function(request, response){
        response.json(request.book);
    })
    .put(function(request, response){
        request.book.title = request.body.title;
        request.book.author = request.body.author;
        request.book.genre = request.body.genre;
        request.book.read = request.body.read;
        request.book.save();
        response.status(202).json(request.book);
    })
    .patch(function(request, response){
        if(request.body._id)
            delete request.body._id;

        for(var key in request.body){
            request.book[key] = request.body[key];
        }
        request.book.save(function(err){
            if(err){
                response.status(500).send('Error while saving the book');
            }
            else{
                response.status(202).send(request.book);
            }
        });
    })
    .delete(function(request, response){
      request.book.remove();
      request.book.save(function(err){
            if(err){
                response.status(500).send('Error while saving the book');
            }
            else{
                response.status(204).send('removed');
            }
        });      
    });


module.exports = bookRouter;