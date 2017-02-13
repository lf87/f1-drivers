/*!
 * @license MIT
 * @preserve
 *
 * Barq: client-side autocomplete
 * https://github.com/joaocunha/barq/
 *
 * @author João Cunha - joao@joaocunha.net - twitter.com/@joaocunha
 *
 * Thanks to all contributors, specially @bhappyz, @ghostavio, @kumailht and @gxx
 */
!function(t,e){"use strict";t.Barq=function(i,n){var s=this,r=n||{};s.baseField=i,s.options={removeFirstOptionFromSearch:r.removeFirstOptionFromSearch||!0,useFirstOptionTextAsPlaceholder:r.useFirstOptionTextAsPlaceholder||!0,placeholderText:r.placeholderText||null,noResultsMessage:r.noResultsMessage||"No results found.",isRTL:r.isRTL||!1,onload:r.onload||function(){},onchange:r.onchange||function(){}};var a={dropdownList:"barq-list",textInput:"barq-text-input",textInputWithList:"barq-input-text-expanded",hidden:"barq-hidden",visible:"barq-visible",activeItem:"barq-active-item",noResults:"barq-no-results",match:"barq-match"},l={TAB:9,ENTER:13,SHIFT:16,ESC:27,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,CMD:91},o={E_OPTION_NOT_FOUND:"No <option> elements found.",E_BASE_FIELD_NOT_FOUND:"Missing <select> element on instantiation.",E_ALREADY_INSTANTIATED:"Instance already exists."},c={addEventListener:function(t,e,i){t.addEventListener?t.addEventListener(e,i):t.attachEvent("on"+e,i)},addClass:function(t,e){t.classList?t.classList.add(e):t.className+=" "+e},removeClass:function(t,e){if(t.classList)t.classList.remove(e);else{var i=new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi");t.className=t.className.replace(i," ")}},getTextNode:function(t){return t&&(t.innerText||t.textContent||t.innerHTML)},escapeString:function(t){return t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}};s.init=function(){if("SELECT"!==i.tagName.toUpperCase())throw new p(o.E_BASE_FIELD_NOT_FOUND);if(i.getAttribute("data-barq-instantiated"))throw new p(o.E_ALREADY_INSTANTIATED);return i.setAttribute("data-barq-instantiated","true"),c.addClass(s.baseField,a.hidden),s.textInput=u(),s.list=f(),s.itemsHTML=v(),h(s.itemsHTML),s.items=s.list.childNodes,T(),d(),s.options.onload.call(s),s};var u=function(){var t=e.createElement("input");if(t.setAttribute("class",a.textInput),t.setAttribute("autocapitalize","off"),t.setAttribute("autocomplete","off"),t.setAttribute("autocorrect","off"),t.setAttribute("spellcheck","false"),s.options.isRTL&&t.setAttribute("dir","rtl"),t.setAttribute("tabindex",s.baseField.tabIndex),s.baseField.setAttribute("tabindex","-1"),s.options.placeholderText)t.setAttribute("placeholder",s.options.placeholderText);else if(s.options.useFirstOptionTextAsPlaceholder)try{var i=c.getTextNode(s.baseField.options[0]);t.setAttribute("placeholder",i)}catch(n){throw new p(o.E_OPTION_NOT_FOUND)}return s.baseField.insertAdjacentHTML("afterend",t.outerHTML),s.baseField.nextElementSibling},d=function(){var t=s.baseField.querySelector("[selected]");return t&&s.selectItem(t),t},p=function(t){this.message=t,this.name="BarqException"};p.prototype=new Error;var v=function(){if(s.options.removeFirstOptionFromSearch)try{s.baseField.removeChild(s.baseField.options[0])}catch(t){throw new p(o.E_OPTION_NOT_FOUND)}var e=s.baseField.innerHTML.replace(/<!--([^\[|(<!)].*)/g,"").replace(/\s{2,}/g,"").replace(/(\r?\n)/g,""),i=/<option(?:[^>]*?value="([^"]*?)"|)[^>]*?>(.*?)<\/option>\n?/gi,n='<li data-value="$1">$2</li>';return e=e.replace(i,n)};s.showList=function(){c.addClass(s.list,a.visible),s.repositionList(),c.addClass(s.textInput,a.textInputWithList),s.list.firstChild.className!==a.noResults&&c.addClass(s.list.firstChild,a.activeItem)},s.hideList=function(){c.removeClass(s.list,a.visible),c.removeClass(s.textInput,a.textInputWithList)},s.selectItem=function(t){var e=c.getTextNode(t);s.textInput.value=e,s.text=e,s.hideList();var i=t.getAttribute("data-value")?t.getAttribute("data-value"):t.value;s.baseField.value=i,s.value=i,s.options.onchange.call(s)};var f=function(){var t=e.createElement("ul");return t.setAttribute("class",a.dropdownList),s.options.isRTL&&t.setAttribute("dir","rtl"),s.textInput.insertAdjacentHTML("afterend",t.outerHTML),s.textInput.nextElementSibling},h=function(t){s.list.innerHTML=t,s.currentItemsDOM=s.list.childNodes};s.repositionList=function(){var i=s.textInput.offsetTop,n=Math.floor(s.textInput.offsetTop+parseInt(s.textInput.offsetHeight,10)),r=t.innerHeight||e.documentElement.clientHeight,a=0;a=n+s.list.offsetHeight>r?i-s.list.offsetHeight:n,s.list.style.top=a+"px",s.list.style.left=s.textInput.offsetLeft+"px",s.list.style.width=s.textInput.offsetWidth+"px"},s.search=function(t){var e="";""!==t?(t=c.escapeString(t),e=new RegExp("<li[^>]*>[^<]*"+t+"[^<]*</li>","gi")):e=/<li[^<]*<\/li>/gi;var i=s.itemsHTML.match(e)||[];return i.length&&(i=i.join(""),t&&(i=m(t,i)),h(i),c.addClass(s.list.firstChild,a.activeItem)),i};var m=function(t,e){t=c.escapeString(t);var i=new RegExp("(<li[^>]*>[^<]*)("+t+")([^<]*</li>)","gi"),n='$1<em class="'+a.match+'">$2</em>$3';return e.replace(i,n)},g=function(){var t='<li class="0">1</li>',e=t.replace("0",a.noResults).replace("1",s.options.noResultsMessage);h(e)};s.getActiveListItem=function(){return s.list.querySelector("."+a.activeItem)};var I=function(t){var e=s.currentItemsDOM;if(!(e.length<=1)){var i,n=s.getActiveListItem();t===l.UP?n.previousElementSibling&&(i=n.previousElementSibling):n.nextElementSibling&&(i=n.nextElementSibling),i&&(c.removeClass(n,a.activeItem),c.addClass(i,a.activeItem),s.scrollListItemIntoView(i))}};s.scrollListItemIntoView=function(t){var e=t.offsetTop,i=t.offsetHeight,n=s.list.offsetHeight,r=s.list.scrollTop,a=r>=e,l=e>=r+n-i;a?s.list.scrollTop=e:l&&(s.list.scrollTop=e-n+i)};var T=function(){c.addEventListener(s.textInput,"keyup",function(e){e=e||t.event;var i=e.keyCode||e.which,n=!1;for(var r in l)if(i===l[r]){n=!0;break}if(!n){s.list.scrollTop=0;var a=s.search(this.value);return a.length<1&&(g(),s.currentItemsDOM=null),void s.showList()}if(i===l.ENTER){var o=s.getActiveListItem();return void(o&&s.selectItem(o))}return i===l.ESC?void s.hideList():void 0}),c.addEventListener(s.textInput,"keydown",function(e){e=e||t.event;var i=e.keyCode||e.which;(i===l.UP||i===l.DOWN)&&s.currentItemsDOM&&I(i)}),c.addEventListener(s.textInput,"focus",function(){var t=s.search(this.value);t.length<1&&(g(),s.currentItemsDOM=null),s.showList()}),c.addEventListener(s.textInput,"blur",function(){!s.preventBlurTrigger&&s.getActiveListItem()&&s.selectItem(s.getActiveListItem())}),c.addEventListener(s.list,"mousedown",function(e){s.preventBlurTrigger=!0,t.setTimeout(function(){s.preventBlurTrigger=!1},1);var i=e.target.className===a.match?e.target.parentNode:e.target;i!==s.list&&i.className!==a.noResults&&s.selectItem(i)}),c.addEventListener(t,"resize",function(){s.repositionList()})}},function(){var i=e.querySelectorAll("[data-barq]");[].forEach.call(i,function(e){new t.Barq(e).init()})}()}(window,document);
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
    const circuitId = document.getElementById('circuit'),
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
        statusDataArray.push(`<option value="">any status</option>`);
        for (let i = 0; i < jsonDataStatusLength; i++) {
            status = jsonDataStatus[i];
            statusDataArray.push(`<option value="${status.statusId}">${status.status} (${status.count})</option>`);
        }
        statusId.innerHTML = statusDataArray.join('');
        var barq = new Barq(statusId, {
            useFirstOptionTextAsPlaceholder: true
        }).init();
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
        circuitDataArray.push(`<option value="">any circuit</option>`);
        for (let i = 0; i < jsonDataCircuitsLength; i++) {
            circuits = jsonDataCircuits[i];
            circuitDataArray.push(`<option value="${circuits.circuitId}">${circuits.circuitName} - ${circuits.Location.locality} - ${circuits.Location.country}</option>`);
        }
        circuitId.innerHTML = circuitDataArray.join('');
        var barq = new Barq(circuitId, {
            useFirstOptionTextAsPlaceholder: true
        }).init();
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
        constructorDataArray.push(`<option value="">any constructor</option>`);
        for (let i = 0; i < jsonDataConstructorsLength; i++) {
            constructors = jsonDataConstructors[i];
            constructorDataArray.push(`<option value="${constructors.constructorId}">${constructors.name}</option>`);
        }
        constructorId.innerHTML = constructorDataArray.join('');
        var barq = new Barq(constructorId, {
            useFirstOptionTextAsPlaceholder: true
        }).init();
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
        if (circuitVal) {
            var circuit = `circuits/${circuitVal}/`;
        } else {
            var circuit = '';
        }
        if (yearVal) {
            console.log("in");
            var year = `${yearVal}/`;
        } else {
            console.log("else");
            var year = '';
        }
        if (constructorVal) {
            var constructor = `constructors/${constructorVal}/`;
        } else {
            var constructor = '';
        }
        if (statusVal) {
            var status = `status/${statusVal}/`;
        } else {
            var status = '';
        }

        filterRequest(circuit, constructor, year, status);
    }


    // Assign filter event handler
    document.getElementById('go').addEventListener('mouseup', driverFilter);

    // Year autocomplete init
    var barq = new Barq(yearId, {
        useFirstOptionTextAsPlaceholder: true
    }).init();

}());
