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
    var drivers;

    // initialize XMLHttpRequest object
    var xhr = new XMLHttpRequest();

    // Specify details and construct request
    xhr.open('GET', '//ergast.com/api/f1/drivers.json?limit=3000', true);

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
            var jsonData = response.MRData.DriverTable.Drivers;
            // Loop through each driver object

            // Sorts the properties within the JSON object based on property value (asc/dec)
            function sortResults(prop, asc) {
                jsonData = jsonData.sort(function(a, b) {
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

            // The default sort order
            sortResults('dateOfBirth', true);

            // Iterate through all objects and append to DOM
            function sort() {
                for (var i = 0; i < jsonData.length; i++) {
                    // The current object
                    drivers = jsonData[i];

                    document.getElementById('drivers').innerHTML += '<li>' + drivers.givenName + ' ' + drivers.familyName + '</li>';
                }
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

        }
    }




}());
