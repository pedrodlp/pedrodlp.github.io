//starting variables empty
let ip = null;
let validIP = false;
//asigning a variable to the spinner class of the html
let loader = document.getElementById('spinner');

//gives the ability to the input box to listen for the enter key (and others) and stores it in a variable
function hit() {
    let press = document.getElementById('IP');
    press.addEventListener('keypress', caller(), false);
}

//just as clicking the submit button, we'll call caller() upon a 'enter' key press
//(press === 'Enter') ? caller() : null;

//main function
async function caller() {
    //catches the ip that the user gave
    ip = document.getElementById('IP').value;
    //hides the indication text
    document.getElementById('indication').style.display = 'none';
    //Show loader
    loader.style.display = 'block';
    //calls the validation for the ip function and stores a boolean response
    validIP = validateIPaddress(ip);
    //calls the funtion that makes the request to shodan and stores the city, state and country from the ip. If we have a valid ip
    if (validIP) {
        ipLocation = await doQuery(ip)
    };
    //creating the elements the answer
    let city = ipLocation.city
    let country = ipLocation.country;
    let region = ipLocation.region;
    const answer = document.getElementById('afterResponse')

    //Hide loader
    loader.style.display = 'none';

    //create the answer and pass it to the html
    answer.innerHTML = `The location is: ${city}, ${region}, ${country}.`;
};

//validate that the input is an ip adress
function validateIPaddress(ipAdress) {
    //regex took from reference
    let ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    //checking if the adress its not empty first and valid after
    if (ipAdress !== null && ipAdress.match(ipformat)) {
        //input is valid
        return true;
    }
    else {
        //letting the user know that the entered string doesn't comply with the format of an ip
        alert("You have entered an invalid IP address!");
        //focus on the input box
        document.form.toSearch.focus();
        //input is NOT valid
        return false;
    }
}

//creates the request, puts the result in a json and from that returns city, state and country from the ip
function doQuery(ip) {
    //creating a constant with the request options, so it can be edited easily after
    const requestOptions = {
        //pulling data from the api
        method: 'GET',
        //in case the api redirects the call the function follows
        redirect: 'follow'
    };

    //doing the request to shodan
    return fetch(`https://api.shodan.io/shodan/host/${ip}?key=ccQLxfpGVQkAX2carMaP5WLi7MTLT9zV`)
        //catching that response into a json object
        .then(response => response.json())
        //from that json, taking with a return the data that we needed from shodan and how the fetch went
        .then(result => {
            return { city: result.city, region: result.region_code, country: result.country_name }
        })
        //in case fetch brings a error (not in a response form)
        .catch(error => console.log('error', error));
}
