const BASE_URL = "https://ghibliapi.herokuapp.com/";
const selectMenu = document.querySelector("section select");
const movieDetails = document.getElementById("display-info");
const userInputReviewForm = document.querySelector("section form");
const displayReviews = document.querySelector("section ul");
const resetReviewsButton = document.getElementById("reset-reviews");
const showPeopleButton = document.getElementById("show-people");
const displayPeople = document.querySelector("section ol");

generateWebPage(
  BASE_URL,
  selectMenu,
  movieDetails,
  userInputReviewForm,
  displayReviews,
  resetReviewsButton,
  showPeopleButton,
  displayPeople
);

function generateWebPage(
  BASE_URL,
  selectMenu,
  movieDetails,
  userInputReviewForm,
  displayReviews,
  resetReviewsButton
) {
  fetch(`${BASE_URL}films`)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      let moviesData = parseJsonData(json);
      generateSelectMenu(moviesData, selectMenu);
      return moviesData;
    })
    .then((moviesData) => {
      generateMovieDescription(
        moviesData,
        selectMenu,
        movieDetails,
        displayPeople
      );
      addResetReviewsButton(resetReviewsButton, displayReviews);
      generateReviews(
        moviesData,
        selectMenu,
        userInputReviewForm,
        displayReviews
      );
      showPeopleOfTheFilm(
        BASE_URL,
        selectMenu,
        showPeopleButton,
        displayPeople
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

//parse the json data
function parseJsonData(movies) {
  return movies.map((movie) => {
    return {
      title: movie.title,
      id: movie.id,
      release_date: movie.release_date,
      description: movie.description,
    };
  });
}

//generate select menu
function generateSelectMenu(moviesData, selectMenu) {
  moviesData.forEach((movie) => {
    let option = document.createElement("option");
    selectMenu.append(option);
    option.textContent = movie.title;
    option.value = movie.id;
  });
}

//generate movie description
function generateMovieDescription(
  moviesData,
  selectMenu,
  movieDetails,
  displayPeople
) {
  selectMenu.addEventListener("change", (event) => {
    event.preventDefault();
    movieDetails.innerHTML = "";
    displayPeople.innerHTML = "";
    let title = document.createElement("h3");
    let release_year = document.createElement("p");
    let description = document.createElement("p");

    moviesData.forEach((movie) => {
      if (selectMenu.value === movie.id) {
        title.textContent = movie.title;
        release_year.textContent = movie.release_date;
        description.textContent = movie.description;
      }
    });

    movieDetails.append(title, release_year, description);
  });
}

//generate the user reviews
function generateReviews(
  moviesData,
  selectMenu,
  userInputReviewForm,
  displayReviews
) {
  userInputReviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let userReview = userInputReviewForm.querySelector("#review").value;
    if (selectMenu.value === "") {
      alert("Please select a movie first");
    } else {
      userInputReviewForm.querySelector("#review").value = "";
      let movie = moviesData.find((movie) => {
        return movie.id === selectMenu.value;
      });
      let reviewListItem = document.createElement("li");
      reviewListItem.innerHTML = `<strong>${movie.title}:</strong> ${userReview}`;
      displayReviews.append(reviewListItem);
    }
  });
}

//empty reviews when button clicked
function addResetReviewsButton(resetReviewsButton, displayReviews) {
  resetReviewsButton.addEventListener("click", (event) => {
    event.preventDefault();
    displayReviews.innerHTML = "";
  });
}

//show people when the show people button clicked
function showPeopleOfTheFilm(
  BASE_URL,
  selectMenu,
  showPeopleButton,
  displayPeople
) {
  showPeopleButton.addEventListener("click", (event) => {
    event.preventDefault();
    displayPeople.innerHTML = "";
    let movieId = selectMenu.value;
    fetch(BASE_URL + "people")
      .then((response) => {
        return response.json();
      })
      .then((people) => {
        if (movieId !== "") {
          for (let person of people) {
            for (let film of person.films) {
              if (film.includes(movieId)) {
                let peopleListItem = document.createElement("li");
                peopleListItem.textContent = person.name;
                displayPeople.append(peopleListItem);
                break;
              }
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
