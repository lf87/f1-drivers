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
    var drivers, jsonDataDrivers, circuits, jsonDataCircuits;

    const circuitId = document.getElementById('circuit'),
        constructorId = document.getElementById('constructor'),
        yearId = document.getElementById('year'),
        statusId = document.getElementById('status');

    // XMLHttpRequest Request foi circuits
    function circuitRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://ergast.com/api/f1/circuits.json`, true);
        xhr.onreadystatechange = function() {
            // Only fire when DONE and the request is SUCCESSFUL
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                jsonDataCircuits = response.MRData.CircuitTable.Circuits;
                circuitData();
            }
        };
        xhr.send();
    }
    circuitRequest();

    // Iterate through all circuit data and push to array
    function circuitData() {
        let circuitDataArray = Array(),
            jsonDataCircuitsLength = jsonDataCircuits.length;
        for (let i = 0; i < jsonDataCircuitsLength; i++) {
            circuits = jsonDataCircuits[i];
            circuitDataArray.push(`<li>
                                    ${circuits.circuitName}
                                </li>`);
        }
        document.getElementById('test').innerHTML = circuitDataArray.join('');
    }

    // XMLHttpRequest Request for drivers
    function filterRequest(circuit, constructor, year, status) {
        console.log('circuit, constructor, year, status', circuit, constructor, year, status);
        // initialize XMLHttpRequest object
        var xhr = new XMLHttpRequest();

        // Specify details and construct request
        //xhr.open('GET', '//ergast.com/api/f1/drivers.json?limit=3000', true);
        xhr.open('GET', `http://ergast.com/api/f1/${year}/constructors/${constructor}/circuits/${circuit}/drivers.json`, true);


        // Event listener that is fired by the XMLHttpRequest object whenever the
        // request hits an important milestone (0:UNSENT, 1:OPENED, 2:HEADERS_RECEIEVED, 3:LOADING, 4:DONE)

        xhr.onreadystatechange = function() {
            // Only fire when DONE and the request is SUCCESSFUL
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("2");

                // Read and parse the value of responseText
                var response = JSON.parse(xhr.responseText);

                // Get desired JSON data
                jsonDataDrivers = response.MRData.DriverTable.Drivers;
                // Loop through each driver object

                // The default sort order
                driverData();

            }
        };
        // If above is set to true (asyncrnous) the send method immediately returns
        xhr.send();
        //xhr.addEventListener('readystatechange', processRequest, false);
    }

    // Iterate through all driver data, push to array and then write to DOM
    function driverData() {
        let driveDataArray = Array(),
            jsonDataDriversLength = jsonDataDrivers.length;
        for (let i = 0; i < jsonDataDriversLength; i++) {
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

    // Filter on click
    function driverFilter() {
        var circuit = circuitId.options[circuitId.selectedIndex].value,
            constructor = constructorId.options[constructorId.selectedIndex].value,
            year = yearId.options[yearId.selectedIndex].value,
            status = statusId.options[statusId.selectedIndex].value;

        filterRequest(circuit, constructor, year, status);
        console.log("in");
    }

    // Assign filter event handler
    document.getElementById('go').addEventListener('mouseup', driverFilter);

    // Sorts the properties within the JSON object based on property value (asc/dec)
    function sortResults(prop, asc) {
        console.log('sortResults', sortResults);
        jsonDataDrivers = jsonDataDrivers.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        // Clear DOM ready for re-ordering
        document.getElementById('drivers').innerHTML = '';
        driverData();
    }

    // Assign even handlers and declare related functions
    document.getElementById('sort-family-name').addEventListener('mouseup', sortFamilyName);

    function sortFamilyName() {
        console.log('sortFamilyName', sortFamilyName);
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
