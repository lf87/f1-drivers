// Strict Mode is a new feature in ECMAScript 5 that allows you to place a program, or a function, in a 'strict' operating context.
// This strict context prevents certain actions from being taken and throws more exceptions.
// And:

// Strict mode helps out in a couple ways:

// It catches some common coding bloopers, throwing exceptions.
// It prevents, or throws errors, when relatively 'unsafe' actions are taken (such as gaining access to the global object).
// It disables features that are confusing or poorly thought out.

// When the below is set to true, the comment below enables use strict globally

/*jshint strict: false */

(function() {
    'use strict';

    // Globals
    var drivers, jsonDataDrivers;

    // initialize XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Specify details and construct request
    //xhr.open('GET', '//ergast.com/api/f1/drivers.json?limit=3000', true);
    xhr.open('GET', 'http://ergast.com/api/f1/drivers.json?limit=400', true);

    // If above is set to true (asyncrnous) the send method immediately returns
    xhr.send();

    // Event listener that is fired by the XMLHttpRequest object whenever the
    // request hits an important milestone (0:UNSENT, 1:OPENED, 2:HEADERS_RECEIEVED, 3:LOADING, 4:DONE)
    xhr.onreadystatechange = processRequest;
    //xhr.addEventListener('readystatechange', processRequest, false);

    //  event handler code that reads the result that gets returned
    function processRequest() {
        // Only fire when DONE and the request is SUCCESSFUL
        if (xhr.readyState === 4 && xhr.status === 200) {

            // Read and parse the value of responseText
            var response = JSON.parse(xhr.responseText);

            // Get desired JSON data
            jsonDataDrivers = response.MRData.DriverTable.Drivers;
            // Loop through each driver object

            // The default sort order
            sort();

        }
    }

    // Iterate through all objects, push to array and then write to DOM
    function sort() {
        let driveDataArray = Array(),
            jsonDataDriverslength = jsonDataDrivers.length;
        for (let i = 0; i < jsonDataDriverslength; i++) {
            // The current object
            drivers = jsonDataDrivers[i];
            driveDataArray.push(`<li>
                                    <div class="flag" style="background-image: url('/dist/assets/img/svg/flag/${drivers.nationality}.svg');"></div>
                                    <a target="_blank" href="${drivers.url}">
                                        ${drivers.givenName} ${drivers.familyName}
                                    </a>
                                    <span>${drivers.dateOfBirth}</span>
                                </li>`);
        }
        document.getElementById('drivers').innerHTML = driveDataArray.join('');
    }

    // Sorts the properties within the JSON object based on property value (asc/dec)
    function sortResults(prop, asc) {
        jsonDataDrivers = jsonDataDrivers.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        // Clear DOM ready for re-ordering
        document.getElementById('drivers').innerHTML = '';
        sort();
    }

    // Assign even handlers and declare related functions
    document.getElementById('sort-family-name').addEventListener('mouseup', sortFamilyName);

    function sortFamilyName() {
        sortResults('familyName', true);
    }

    document.getElementById('sort-given-name').addEventListener('mouseup', sortGivenName);

    function sortGivenName() {
        sortResults('givenName', true);
    }

    document.getElementById('sort-date-of-birth').addEventListener('mouseup', sortDateOfBirth);

    function sortDateOfBirth() {
        sortResults('dateOfBirth', false);
    }

}());
