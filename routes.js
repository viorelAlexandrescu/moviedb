const express = require('express');
const RegisterController = require('./controllers/register');
const AuthController = require('./controllers/authentifcation');
const config = require('./config');
const Movie = require('./models/Movie');
const User = require('./models/User');
const Role = require('./models/Role');
const Review = require('./models/Review');
const Discussion = require('./models/Discussion');
const apiRoutes = express.Router(); 

// route to show a message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'API Works' });
});

apiRoutes.get('/movies', (req, res) => {
    Movie.find((err, movies) => {
        if (err) return console.error(err);
        res.json({
            movies: movies
        });
      });
});

apiRoutes.get('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    Movie.findById(movieId, (err, movie) => {
        if (err) return console.error(err);
        res.json({
            movie: movie
        });
      });
});

apiRoutes.post('/movies', (req, res) => {
    const movie = new Movie(req.body.movie)
    movie.save((err, movie) => {
        if(err) return console.error(err);
        console.log(movie,' has been added');
    });
});

apiRoutes.delete('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    Movie.remove({_id: movieId}, (err, movie) => {
        if (err) return console.error(err);        
        Movie.findById(movieId, (err, movie) => {
            if(movie == null)
                console.log('movie has been removed');
          })
      });
});

apiRoutes.post('/users', (req, res) => {
    const user = new User(req.body.user);
    user.save((err, user) => {
        if(err) return console.error(err);
    });
});

apiRoutes.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if(err) return console.error(err);
        res.json({
            user: user
        });
    })
});

apiRoutes.post('/login', (req, res) => {
    const login = req.body.user;
    User.findOne(login, 'username role', (err, user) => {
        if (err) return console.error(err);
        if (user == {}) {
            console.log(user, 'not found')
            return res.send({
                success: false
            });
        } else {
            return res.send({
                success: true,
                user: user
            });
        }
    })
});

apiRoutes.get('/roles', (req, res) => {
    Role.find((err, roles) => {
        if (err) return console.error(err);
        res.json({
            roles: roles
        });
        res.end();
    });
});

apiRoutes.get('/reviews/:id', (req, res) => {
    const movieId = req.params.id;
    Review.find({ movieId: movieId }, (err, reviews) => {
        if(err) return console.error(err);
        res.json({
            reviews: reviews
        });
    });
});

apiRoutes.post('/reviews', (req, res) => {
    const review = new Review(req.body.review);
    review.save((err, review) => {
        if(err) return console.error(err);
        console.log(review, 'saved in db');
    })
})

apiRoutes.get('/rating/:id', (req, res) => {
    const movieId = req.params.id;
    Review.find({ movieId: movieId }, (err, reviews) => {
        if(err) return console.error(err);
        let rating = 0;
        for(let review of reviews) {
            rating += review.rating;
        }
        rating = rating/reviews.length;
        res.json({
            rating: rating
        });
    });
});

apiRoutes.get('/discussions', (req, res) => {
    Discussion.find((err, discussions) => {
        if (err) return console.error(err);
        res.json({
            discussions: discussions
        });
        res.end();
    });
});

apiRoutes.post('/discussions', (req, res) => {
    const discussion = new Discussion(req.body.discussion);
    discussion.save((err, discussion) => {
        if(err) return console.error(err);
        console.log(discussion, 'saved in db');
    })
});

apiRoutes.get('/discussions/:id', (req, res) => {
    const id = req.params.id;
    Discussion.findById(id, (err, discussion) => {
        if (err) return console.error(err);
        res.json({
            discussion: discussion
        });
        res.end();
    });
});

apiRoutes.post('/discussions/:id', (req, res) => {
    const id = req.params.id;
    const newComment = req.body.comment;
    const username = req.body.username;
    Discussion.findById(id, (err, discussion) => {
        if (err) return console.error(err);
        discussion.comments.push({
            user: username,
            comment: newComment
        });
        discussion.save((err, discussion) => {
            if(err) return console.error(err);
            console.log(discussion, 'saved in db');
        })
    });
});


// authenticate
// apiRoutes.post(config.routes[1], (req, res) => {
//     // AuthController.authenticate(req.body.credentials, (result) => {
//     //     let response = {
//     //         success: true,
//     //         message: 'Token is served'
//     //     };

//     //     if (result != null) {
//     //         // all good
//     //         res.status = 200;
//     //         response.token = result;
//     //     } else {
//     //         // bad auth
//     //         res.status = 401;
//     //         response.success = false;
//     //         response.message = 'fuck off';
//     //     }
//     //     res.json(response);
//     // });
// });

// // register
// apiRoutes.post(config.routes[2], (req, res) => {
//     RegisterController.register(req.body.info, (result) => {
//         throw Error('Register method not implemented');
//     });
// });



// TODO: route middleware to verify a token
module.exports = apiRoutes;