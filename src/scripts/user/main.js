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

    // DOM
    const circuitId = document.getElementById('circuit'),
        constructorId = document.getElementById('constructor'),
        yearId = document.getElementById('year'),
        statusId = document.getElementById('status');

    // Sorts the properties within the JSON object based on property value (asc/dec)
    function sortResults(prop, asc, data, reorder) {
            console.log('data', data);
        data = data.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        // Clear DOM ready for re-ordering
        if (reorder) {
            document.getElementById('drivers').innerHTML = '';
            driverData();
        }
    }

    // XMLHttpRequest Request for circuits
    function circuitRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `http://ergast.com/api/f1/circuits.json?limit=100`, true);
        xhr.onreadystatechange = function() {
            // Only fire when DONE and the request is SUCCESSFUL
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                jsonDataCircuits = response.MRData.CircuitTable.Circuits;
                sortCircuitData();
            }
        };
        xhr.send();
    }
    circuitRequest();

    // Sort circuit data
    function sortCircuitData() {
        sortResults('circuitName', true, jsonDataCircuits, false);
        circuitData();
    }

    // Iterate through all circuit data and push to array
    function circuitData() {
        console.log("test");
        let circuitDataArray = Array(),
            jsonDataCircuitsLength = jsonDataCircuits.length;
        for (let i = 0; i < jsonDataCircuitsLength; i++) {
            circuits = jsonDataCircuits[i];
            circuitDataArray.push(`<option value="${circuits.circuitId}">${circuits.Location.country} - ${circuits.Location.locality} - ${circuits.circuitName}</option>`);
        }
        circuitId.innerHTML = circuitDataArray.join('');
    }

    // XMLHttpRequest Request for drivers
    function filterRequest(circuit, constructor, year, status) {
        console.log('circuit, constructor, year, status', circuit, constructor, year, status);
        // initialize XMLHttpRequest object
        var xhr = new XMLHttpRequest();

        // Specify details and construct request
        //xhr.open('GET', '//ergast.com/api/f1/drivers.json?limit=3000', true);
        xhr.open('GET', `http://ergast.com/api/f1/${year}/constructors/${constructor}/circuits/${circuit}/drivers.json`, true);
        console.log('`http://ergast.com/api/f1/${year}/constructors/${constructor}/circuits/${circuit}/drivers.json`', `http://ergast.com/api/f1/${year}/constructors/${constructor}/circuits/${circuit}/drivers.json`);


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
        let circuit = circuitId.options[circuitId.selectedIndex].value,
            constructor = constructorId.options[constructorId.selectedIndex].value,
            year = yearId.options[yearId.selectedIndex].value,
            status = statusId.options[statusId.selectedIndex].value;

        filterRequest(circuit, constructor, year, status);
        console.log("in");
    }

    // Assign filter event handler
    document.getElementById('go').addEventListener('mouseup', driverFilter);

    // Assign even handlers and declare related functions
    document.getElementById('sort-family-name').addEventListener('mouseup', sortFamilyName, true);

    function sortFamilyName() {
        console.log('sortFamilyName', sortFamilyName);
        // json object prop, ascending order, data set, clear and re-order driver data
        sortResults('familyName', true, jsonDataDrivers, true);
    }

    document.getElementById('sort-given-name').addEventListener('mouseup', sortGivenName);

    function sortGivenName() {
        sortResults('givenName', true, jsonDataDrivers, true);
    }

    document.getElementById('sort-date-of-birth').addEventListener('mouseup', sortDateOfBirth);

    function sortDateOfBirth() {
        sortResults('dateOfBirth', false, jsonDataDrivers, true);
    }

}());
