// Stores and employees
let storesAndEmployeesArray = [[98053,[1,2,3,4]],
                               [98007,[5,6,7,8]],
                               [98077,[9,10,11,12]],
                               [98055,[13,14,15,16]],
                               [98011,[17,18,19,20]],
                               [98046,[21,22,23,24]]];
// CDs
let CdIDArray = [123456, 123654, 321456, 321654, 654123,
                 654321, 543216, 354126, 621453, 623451];

let movieArray = [];                 

function GenerateRandomNumberInRange(min, max)
{
    // min - inclusive | max - exclusive
    min = Math.ceil(min);
    max = Math.floor(max) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CreateRandomOrder()
{
    // Fields
    let randomStore;
    let randomEmployee;
    let randomCD;
    let randomPrice;
    let randomDate;

    // Find a random store then select a random employee from that store
    let randomNumber = GenerateRandomNumberInRange(0, storesAndEmployeesArray.length);
    randomStore = storesAndEmployeesArray[randomNumber][0];
    randomEmployee = storesAndEmployeesArray[randomNumber][1][GenerateRandomNumberInRange(0,storesAndEmployeesArray[randomNumber][1].length)];
    
    // Find a CD in the CDArray between position 0 and 9
    randomCD = CdIDArray[GenerateRandomNumberInRange(0, CdIDArray.length)];

    // Generate a random price between $5 and $15
    randomPrice = GenerateRandomNumberInRange(5,16);

    // Get the current date and time for the sample order
    randomDate = new Date();
    //randomDate.setMinutes(randomDate.getMinutes() + 30);

    let newOrder = new CDOrder(randomStore, randomEmployee, randomCD, randomPrice, randomDate);
    return newOrder;
}

let CDOrder = function (pStore, pEmp, pCD, pPrice, pDate) {
    this.StoreID = pStore;
    this.SalesPersonID = pEmp;
    this.CdID = pCD;
    this.PricePaid = pPrice;
    this.Date = pDate;
}

//let salesArray = [];

document.addEventListener("DOMContentLoaded", function () {

// add button events ************************************************************************
    
// display an order
    document.getElementById("create").addEventListener("click", function ()
    {
        let randomOrder = CreateRandomOrder();

        document.getElementById("storeid").value = randomOrder.StoreID;
        document.getElementById("salespersonid").value = randomOrder.SalesPersonID;
        document.getElementById("cdid").value = randomOrder.CdID;
        document.getElementById("pricepaid").value = randomOrder.PricePaid;
        document.getElementById("date").value = randomOrder.Date;
    });

// Submit an order
    document.getElementById("submit-one").addEventListener("click", function ()
    {
        let randomOrder = CreateRandomOrder();

        fetch('/AddOrder', {
            method: "POST",
            body: JSON.stringify(randomOrder),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json))
            .catch(err => console.log(err));

    });

// Submit 500 orders
    document.getElementById("submit-500").addEventListener("click", function ()
    {
        let minuteOffset = 0;
        for (let i = 0; i < 500; i++){
            // Create order
            let randomOrder = CreateRandomOrder();
            // Add date offset
            randomOrder.Date.setMinutes(randomOrder.Date.getMinutes() + minuteOffset);

            // Save order to file
            fetch('/AddOrder', {
                method: "POST",
                body: JSON.stringify(randomOrder),
                headers: {"Content-type": "application/json; charset=UTF-8"}
                })
                .then(response => response.json()) 
                .then(json => console.log(json))
                .catch(err => console.log(err));

            // Increment the date offset for upcoming orders
            minuteOffset += GenerateRandomNumberInRange(2, 30);
        }
    });

    // Get Top 3 CDs sold and the quantity sold for each
    document.getElementById("top-3").addEventListener("click", function ()
    {
        fetch('/getTopThreeProductSold')
        .then(response => response.json())
        .then(response => fillULTopCDs(response))
        .catch(err => console.log('Request Failed', err));
    });

    // Get store rankings by transactions performed
    document.getElementById("rank-stores").addEventListener("click", function ()
    {
        fetch('/getStoreRanking')
        .then(response => response.json())
        .then(response => fillULStores(response))
        .catch(err => console.log('Request Failed', err));
    });
});  

function fillULTopCDs(data) {
    // clear prior data
    var divMovieList = document.getElementById("top-3-cds-list");
    while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
        divMovieList.removeChild(divMovieList.firstChild);
    };

    var ul = document.createElement('ul');
    movieArray = data;
    movieArray.forEach(function (element) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element._id + ":  &nbsp &nbsp  &nbsp &nbsp " + element.count;
        ul.appendChild(li);
    });
    divMovieList.appendChild(ul)
}

function fillULStores(data) {
    movieArray = data;
    // clear prior data
    var divMovieList = document.getElementById("store-ranking-list");
    while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
        divMovieList.removeChild(divMovieList.firstChild);
    };

    var ul = document.createElement('ul');
    movieArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element._id + ":  &nbsp &nbsp  &nbsp &nbsp " + element.count;
        ul.appendChild(li);
    });
    divMovieList.appendChild(ul)
}



/* 



//let movieArray = [];

// define a constructor to create movie objects
//let MovieObject = function (pTitle, pYear, pGenre, pMan, pWoman, pURL) {
//    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
//    this.Title = pTitle;
//    this.Year = pYear;
//    this.Genre = pGenre;  // action  comedy  drama  horrow scifi  musical  western
//}

//let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    createList();

// add button events ************************************************************************
    
    document.getElementById("buttonAdd").addEventListener("click", function () {
        let newMovie = new MovieObject(document.getElementById("title").value, 
        document.getElementById("year").value, selectedGenre);

        fetch('/AddMovie', {
            method: "POST",
            body: JSON.stringify(newMovie),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json),
            createList()
            )
            .catch(err => console.log(err));
    
        // $.ajax({
        //     url : "/AddMovie",
        //     type: "POST",
        //     data: JSON.stringify(newMovie),
        //     contentType: "application/json; charset=utf-8",
        //      success: function (result) {
        //         console.log(result);
        //         createList();
        //     }
        // });
       
    });

    document.getElementById("buttonGet").addEventListener("click", function () {
        createList();      
    });

    document.getElementById("buttonDelete").addEventListener("click", function () {
        deleteMovie(document.getElementById("deleteID").value);      
    });
    
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("title").value = "";
        document.getElementById("year").value = "";
    });

    $(document).bind("change", "#select-genre", function (event, ui) {
        selectedGenre = $('#select-genre').val();
    });

  

});  
// end of wait until document has loaded event  *************************************************************************


function createList() {
// update local array from server

    fetch('/getAllMovies')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors

    // $.get("/getAllMovies", function(data, status){  // AJAX get
    //     movieArray = data;  // put the returned server json data into our local array
        
    //       // clear prior data
    //     var divMovieList = document.getElementById("divMovieList");
    //     while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
    //         divMovieList.removeChild(divMovieList.firstChild);
    //     };

    //     var ul = document.createElement('ul');

    //     movieArray.forEach(function (element,) {   // use handy array forEach method
    //         var li = document.createElement('li');
    //         li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
    //         element.Title + "  &nbsp &nbsp  &nbsp &nbsp "  
    //         + element.Year + " &nbsp &nbsp  &nbsp &nbsp  " + element.Genre;
    //         ul.appendChild(li);
    //     });
    //     divMovieList.appendChild(ul)

    // });
};

function fillUL(data) {
        // clear prior data
    var divMovieList = document.getElementById("divMovieList");
    while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
        divMovieList.removeChild(divMovieList.firstChild);
    };

    var ul = document.createElement('ul');
    movieArray = data;
    movieArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
        element.Title + "  &nbsp &nbsp  &nbsp &nbsp "  
        + element.Year + " &nbsp &nbsp  &nbsp &nbsp  " + element.Genre;
        ul.appendChild(li);
    });
    divMovieList.appendChild(ul)
}

function deleteMovie(ID) {

    fetch('/DeleteMovie/' + ID, {
        method: "DELETE",
       // body: JSON.stringify(_data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json()) 
      .then(json => console.log(json))
      .catch(err => console.log(err));



    // $.ajax({
    //     type: "DELETE",
    //     url: "/DeleteMovie/" +ID,
    //     success: function(result){
    //         alert(result);
    //         createList();
    //     },
    //     error: function (xhr, textStatus, errorThrown) {  
    //         alert("Server could not delete Movie with ID " + ID)
    //     }  
    // });
   
}


  
 */