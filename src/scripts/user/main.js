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

    // ********************************* //
    // RE-USABLE FUNCTIONS AND VARIABLES //
    // ********************************* //

    // Globals
    var drivers, jsonDataDrivers, circuits, jsonDataCircuits, constructors, jsonDataConstructors, status, jsonDataStatus;

    // DOM
    var circuitId = document.getElementById('circuit'),
        constructorId = document.getElementById('constructor'),
        yearId = document.getElementById('year'),
        statusId = document.getElementById('status');

    // Sorts the properties within the JSON object based on property value (asc/dec)
    function sortResults(prop, asc, data, reorder) {
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

    // ********************** //
    // SORTING EVENT HANDLERS //
    // ********************** //

    // Assign even handlers and declare related functions
    document.getElementById('sort-family-name').addEventListener('mouseup', sortFamilyName, true);

    function sortFamilyName() {
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

    // ****************** //
    // STATUS OPTION DATA //
    // ****************** //

    function statusRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `json/status.json`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
        console.log("in");
                jsonDataStatus = response.MRData.StatusTable.Status;
                sortStatusData();
            }
        };
        xhr.send();
    }
    statusRequest();

    function sortStatusData() {
        sortResults('status', true, jsonDataStatus, false);
        statusData();
    }

    function statusData() {
        let statusDataArray = Array(),
            jsonDataStatusLength = jsonDataStatus.length;
            statusDataArray.push(`<option value="any">...</option>`);
            statusDataArray.push(`<option value="any">any status</option>`);
        for (let i = 0; i < jsonDataStatusLength; i++) {
            status = jsonDataStatus[i];
            statusDataArray.push(`<option value="${status.statusId}">${status.status} (${status.count})</option>`);
        }
        statusId.innerHTML = statusDataArray.join('');
        var barq = new Barq(statusId).init();
    }

    // ******************* //
    // CIRCUIT OPTION DATA //
    // ******************* //

    function circuitRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `json/circuits.json`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                jsonDataCircuits = response.MRData.CircuitTable.Circuits;
                sortCircuitData();
            }
        };
        xhr.send();
    }
    circuitRequest();

    function sortCircuitData() {
        sortResults('circuitName', true, jsonDataCircuits, false);
        circuitData();
    }

    function circuitData() {
        let circuitDataArray = Array(),
            jsonDataCircuitsLength = jsonDataCircuits.length;
            circuitDataArray.push(`<option value="any">...</option>`);
            circuitDataArray.push(`<option value="any">any circuit</option>`);
        for (let i = 0; i < jsonDataCircuitsLength; i++) {
            circuits = jsonDataCircuits[i];
            circuitDataArray.push(`<option value="${circuits.circuitId}">${circuits.circuitName} - ${circuits.Location.locality} - ${circuits.Location.country}</option>`);
        }
        circuitId.innerHTML = circuitDataArray.join('');
        var barq = new Barq(circuitId).init();
    }

    // *********************** //
    // CONSTRUCTOR OPTION DATA //
    // *********************** //

    function constructorRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `json/Constructors.json`, true);
        xhr.onreadystatechange = function() {
            // Only fire when DONE and the request is SUCCESSFUL
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                jsonDataConstructors = response.MRData.ConstructorTable.Constructors;
                sortConstructorData();
            }
        };
        xhr.send();
    }
    constructorRequest();

    function sortConstructorData() {
        sortResults('name', true, jsonDataConstructors, false);
        constructorData();
    }

    function constructorData() {
        let constructorDataArray = Array(),
            jsonDataConstructorsLength = jsonDataConstructors.length;
        constructorDataArray.push(`<option value="any">...</option>`);
        constructorDataArray.push(`<option value="any">any constructor</option>`);
        for (let i = 0; i < jsonDataConstructorsLength; i++) {
            constructors = jsonDataConstructors[i];
            constructorDataArray.push(`<option value="${constructors.constructorId}">${constructors.name}</option>`);
        }
        constructorId.innerHTML = constructorDataArray.join('');
         var barq = new Barq(constructorId).init();
    }

    // ********* //
    // FILTERING //
    // ********* //

    // XMLHttpRequest Request for filter
    function filterRequest(circuit, constructor, year, status) {
        // initialize XMLHttpRequest object
        var xhr = new XMLHttpRequest();

        // Specify details and construct request
        //xhr.open('GET', '//ergast.com/api/f1/drivers.json?limit=3000', true);
        xhr.open('GET', `http://ergast.com/api/f1/${year}${constructor}${circuit}${status}drivers.json?limit=50`, true);
        console.log(`http://ergast.com/api/f1/${year}${constructor}${circuit}${status}drivers.json?limit=50`);


        // Event listener that is fired by the XMLHttpRequest object whenever the
        // request hits an important milestone (0:UNSENT, 1:OPENED, 2:HEADERS_RECEIEVED, 3:LOADING, 4:DONE)

        xhr.onreadystatechange = function() {
            // Only fire when DONE and the request is SUCCESSFUL
            if (xhr.readyState === 4 && xhr.status === 200) {

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
        var circuitVal = circuitId.options[circuitId.selectedIndex].value,
            constructorVal = constructorId.options[constructorId.selectedIndex].value,
            yearVal = yearId.options[yearId.selectedIndex].value,
            statusVal = statusId.options[statusId.selectedIndex].value;
        if (circuitVal !='any') {
            var circuit = `circuits/${circuitVal}/`;
            console.log('circuit', circuit);
        }
        else {
            var circuit = '';
        }
        if (yearVal !='any') {
            var year = `${yearVal}/`;
            console.log('year', year);
        }
        else {
            var year = '';
        }
        if (constructorVal !='any') {
            var constructor = `constructors/${constructorVal}/`;
            console.log('constructor', constructor);
        }
        else {
            var constructor = '';
        }
        if (statusVal !='any') {
            var status = `status/${statusVal}/`;
            console.log('status', status);
        }
        else {
            var status = '';
        }
/*        console.log('circuit:', circuit);
            console.log('constructor:', constructor);
            console.log('year:', year);
            console.log('status:', status);*/

        filterRequest(circuit, constructor, year, status);
    }


    // Assign filter event handler
    document.getElementById('go').addEventListener('mouseup', driverFilter);

    // Year autocomplete init
    var barq = new Barq(yearId).init();

}());
