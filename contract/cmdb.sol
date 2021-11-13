// SPDX-License-Identifier: Apache 2.0

pragma solidity >=0.7.0 <0.9.0;

contract CMDb {

    struct Movie {
        bool exists; // To check if the movie already exists. Set to true when the movie is created
        string title; // The movie title
        string image; // A link to an image to the movie poster
        string plot; // The movie plot, a small description
        mapping (address => uint) ratings; // Mapping all the users to their rating
        mapping (uint => address) users;  // All the users that rated the movie, redundant but necessary for the readMovie function 
        uint ratingCount; // Size of the users mapping
    }

    // Mapping of all the movies created, accessible by their title
    mapping (string => Movie) internal movies; 
    
    // Mapping each movie title to an index
    // We'll use this in the front-end to display all movies on the front page
    mapping (uint => string) internal movieTitles;
    
    // The movie count. The size of movieTitles mapping
    uint internal movieCount; 
    
    // Add a rating on a movie
    // Parameters: the movie title, the user's rating
    function addRating(string memory _title, uint _rating) public {
        // if(!movies[_title].exists) return; // If the movie doesn't exist, do nothing
        require(movies[_title].exists, "This movie does not exist");
        // if(_rating < 0 || _rating > 10) return; // If the rating isn't on a scale of 1 to 10, do nothing
        require(_rating >= 0 && _rating <= 10, "Please enter a valid rating");
        
        // If it's the user's first time rating that movie, add to the users mapping
        // If the user already rated the movie, replace his old rating with the new one
        if (movies[_title].ratings[msg.sender] == 0)   { 
            movies[_title].ratings[msg.sender] = _rating;
            movies[_title].users[movies[_title].ratingCount] = msg.sender;
            movies[_title].ratingCount++;
        }
        movies[_title].ratings[msg.sender] = _rating;
    }
    
    // Returns the numbers of ratings on a movie, useful to compute the average rating on the front-end
    // Parameters: the movie title
    function getRatingCount(string memory _title) public view returns (uint) {
        return movies[_title].ratingCount;
    }

    // Create a movie. If the movie exists, update the properties
    // Parameters: movie title, url to image, the movie plot
    function addMovie(
        string memory _title,
        string memory _image,
        string memory _plot ) public {
            
        require(bytes(_title).length > 0, "Enter a valid movie title");
        require(bytes(_image).length > 0, "Enter a valid movie title");
        require(bytes(_plot).length > 0, "Enter a valid movie title");

        movies[_title].title = _title;
        movies[_title].image = _image;
        movies[_title].plot = _plot;    
         
        if(!movies[_title].exists){
            movies[_title].exists = true;
            movieTitles[movieCount] = _title;
            movieCount++;
        }
    }

    // Get the movie's plot, image, and all the ratings
    // Parameters: the movie title
    function readMovie(string memory _title) public view returns (
        string memory, 
        string memory, 
        uint[] memory
    ) {
       
       // Convert the ratings mapping inside the movie struct to an integer array since we cannot return a Solidity mapping
        uint[] memory ratingsRet = new uint[](movies[_title].ratingCount);
        if(movies[_title].exists) {
        for (uint i = 0; i < movies[_title].ratingCount; i++) {
            ratingsRet[i] = movies[_title].ratings[movies[_title].users[i]];
        }
       }
        
        return (
            movies[_title].image,
            movies[_title].plot,
            ratingsRet
        );
    }
    
    // Returns current user rating to the movie
    function getUserRating(string memory _title, address user) public view returns (uint) {
        return movies[_title].ratings[user];
        
    }
    
    // Get movie title from index. Useful to display movies on the front-end
    function getMovieTitle(uint index) public view returns (string memory) {
        return movieTitles[index];
    }
    
    function getMoviesLength() public view returns (uint) {
        return (movieCount);
    }
}
