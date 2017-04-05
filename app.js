var express = require('express')
var bodyParser = require('body-parser')
var sqlite3 = require('sqlite3')

var db = new sqlite3.Database("./db/movie-friends.db")

var app = express()

// This middleware enables us to use request.body to read data from forms with
// method="POST".
app.use(bodyParser.urlencoded({extended: false}))

// This setting tells express that we use handlebars as our view engine.
app.set('view engine', 'hbs')

var db = new sqlite3.Database("./db/movie-friends.db")

var movies = [
    {id: 0, year: 2001, title: "Shrek"},
    {id: 1, year: 1995, title: "Dumb & Dumber"},
    {id: 2, year: 1994, title: "The Lion King"}
]

var ratings = [
    {movie_id: 0, rating: 5},
    {movie_id: 0, rating: 4},
    {movie_id: 2, rating: 3},
    {movie_id: 1, rating: 0}
]


app.get("/", function(request, response){
    // push un truc de la db ici
      db.all("select * from movie", function(err, rows){

	   response.render('movies', {rows: rows})
      })
	
})

app.get("/movies/:id", function(request, response){
	var id = parseInt(request.params.id)
//	var rating = []
    
    db.all("select * from movie where movie.id = ?", id, function(err, movieRows){     
        db.all("select rating from rating where rating.movie_id = ?", id, function(err, rows){
            console.log(movieRows)
            response.render('movie', {movie: movieRows[0], rows: rows})
        })
    })
})

app.get("/create-movie", function(request, response){
	response.render('create-movie', {})
})

app.post("/create-movie", function(request, response){
    
    
    db.all("select * from movie", function(err, rows){
        
        var flag = 0
    
        newMovie = {
	   	id: rows.length,
	   	year: parseInt(request.body.year),
	   	title: request.body.title
	   }
        
        for (i=0; i < rows.length ; i++) {
            if (rows[i].title.toLowerCase() == newMovie.title.toLowerCase() && rows[i].year == newMovie.year) {
                newMovie.id = rows[i].id
                flag = 1
            }        
        }
        console.log(newMovie, flag)
        
        var newRating = {
            movie_id: newMovie.id,
            rating: parseInt(request.body.rating)
        }
	   
	   // Store the human.
        if (flag == 0)
            db.run("INSERT INTO movie(id,year,title) VALUES (?,?,?)", newMovie.id, newMovie.year, newMovie.title)
	   
        // db push that shiet
        db.run("INSERT INTO rating(movie_id, rating) VALUES (?,?)", newRating.movie_id, newRating.rating)

        response.redirect("/movies/"+newMovie.id)
            
    })
	
})

app.get("/create-user", function(request, response){
	response.render('create-movie', {})
})

app.post("/create-user", function(request, response){
    
    
    db.all("select * from movie", function(err, rows){        
        var flag = 0
    
        newMovie = {
	   	id: rows.length,
	   	year: parseInt(request.body.year),
	   	title: request.body.title
	   }
        
        for (i=0; i < rows.length ; i++) {
            if (rows[i].title.toLowerCase() == newMovie.title.toLowerCase() && rows[i].year == newMovie.year) {
                newMovie.id = rows[i].id
                flag = 1
            }        
        }
        console.log(newMovie, flag)
        
        var newRating = {
            movie_id: newMovie.id,
            rating: parseInt(request.body.rating)
        }
	   
	   // Store the human.
        if (flag == 0)
            db.run("INSERT INTO movie(id,year,title) VALUES (?,?,?)", newMovie.id, newMovie.year, newMovie.title)
	   
        // db push that shiet
        db.run("INSERT INTO rating(movie_id, rating) VALUES (?,?)", newRating.movie_id, newRating.rating)

        response.redirect("/movies/"+newMovie.id)
            
    })
	
})



app.listen(8000)
