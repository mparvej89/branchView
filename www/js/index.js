//if (typeof builder == 'undefined') {
//	if ( typeof defaultJSONObject != 'object' ) {
//		require("js/defaultJSON.js"); // Some default screens.
//	}
//}
// Listen to document.readyState and then start app.initialize();
// Needed when .js has been obfuscated and function names have been renamed ;-)

var iLoading = 0;
var readyStateCheckInterval = setInterval(function() {
    app.debug('FUNCTION: readyStateCheckInterval');

    if (iLoading == 0) {
        app.startLoading('START_APP');
        iLoading = 1;
    }

    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        setTimeout(function() {
            app.initialize();
           // app.debug('Initialize APP');
        }, 100);

        FCM.hasPermission(function(doesIt){
            console.log('hasPermission', doesIt);
            // doesIt === true => yes, push was allowed
            // doesIt === false => nope, push will not be available
            // doesIt === null => still not answered, recommended checking again later
            if(doesIt) {
               
            }
        });

        FCM.requestPushPermission(function(doesIt){
           console.log('request permission', doesIt);
            if(doesIt) {
               
            }
        });

        /* FCM.onTokenRefresh(function(token){
            alert( token );
        });

        FCM.getToken(function(token){
            console.log('token', token);
            alert(token);
        }); */
        FCM.subscribeToTopic('beda75fe-3816-11ed-a261-0242ac120002_R20084315020571');
    }

}, 100);

function reloadIndexJs() {
    if (app.includeJs) {
        require(app.includeJs);
    }
    return true;
}

function showVersion() {
    alert(app.versionBuild);
}

function require(script, callbackfunc) {
    jQuery.ajax({
        url: script,
        dataType: "script",
        async: false, // <-- This is the key
        success: function() {
            // all good...
            if (jQuery.isFunction(callbackfunc)) { callbackfunc(); }
        },
        error: function() {
            // throw new Error("Could not load script " + script);
            // Do not show any error, just skip!!
        }
    });
}

function genIconClassName(buttonObj, addClass) {
    app.debug('FUNCTION: genIconClassName, addclass:' + addClass);

    var newClass = ' ui-btn ui-corner-all ';
    if (addClass != 'undefined' && addClass != '') {
        newClass += ' ' + addClass + ' ';
    }
    if (buttonObj.icon != 'undefined' && buttonObj.icon != '') {
        newClass += ' ui-icon-' + buttonObj.icon + ' ui-btn-icon-notext ';
    }
    return newClass;
}
// -----------------------------------------------------------------------------------------------

function resetApplication() {
    app.debug('FUNCTION: resetApplication');
    var message = app.translateMessage('RESET_APP');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                // if (app.isdemo || app.logintype == 'loginFidesque') {
                if (app.isdemo) {
                    resetApp();
                } else
                if (app.logintype == 'loginFidesque') {
                    if (app.checkmultiuser()) {
                        BRVDatabase.successCallBack = function() { startApplication('activateduserlogin'); };
                        removeUserActivation(app.activeusername);
                    } else {
                        resetApp();
                    }
                } else {
                    resetApplication_step2();
                }
            },
            nee: function() {}
        }
    });
}

function resetApplication_step2() {
    app.debug('FUNCTION: resetApplication');
    var message = app.translateMessage('RESET_APP_CHK');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                // Check if we are in multiusermode, then only remove current user!
                if (app.checkmultiuser()) {
                    BRVDatabase.successCallBack = function() { startApplication('activateduserlogin'); };
                    removeUserActivation(app.activeusername);
                } else {
                    resetApp();
                }
            },
            annuleren: function() {}
        }
    });
}

function resetApp() {
    // Reset all registration data
    resetRegistrationData();
    if (BRVUtil.isBrowser()) {
        var restartUrl = window.location.href;
        restartUrl = BRVUtil.strExtract(restartUrl, 'http', '.html');
        restartUrl = 'http' + restartUrl + '.html';
        window.location.href = restartUrl;
    } else {
        startApplication('init');
    }
}


function reactivateApplication() {
    app.debug('FUNCTION: resetApplication');
    var message = app.translateMessage('REACTIVATE_APP');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                // Reset all registration data
                resetRegistrationData();

                app.AddToPhoneStorage('resetByUser', false);

                startApplication('init');
            },
            nee: function() {}
        }
    });
}


function logOutAndReset(message, timeout) {
    if (BRVUtil.checkValue(message)) {
        app.showMessage(message);
    }

    setTimeout(function() {
        // Reset all registration data
        resetRegistrationData();

        // startApplication();
        startApplication('init');
    }, (timeout) ? timeout : 100);

}


function resetRegistrationData() {

    // Remember old deviceID and set after clear!!!
    var CurdeviceID = app.GetFromPhoneStorage('deviceID');
    //

    app.ClearPhoneStorage();

    // Restore old deviceID
    app.AddToPhoneStorage('deviceID', CurdeviceID);
    //

    // App reset by user
    app.AddToPhoneStorage('resetByUser', true);
    //


    app.deviceid = app.getDeviceID();
    app.activated = false;
    app.multiuser = false;
    app.deviceloggedin = false;
    app.wsurl = '';
    app.wsuser = '';
    app.wspwd = '';
    app.avserial = '';
    app.apikey = '';
    app.subscription = '';
    app.YOBsubscription = '';
    app.adm_code = '';
    app.deviceStatus = 9;

    BRVUtil.checkValue(themedconfig.productcode) ? app.productcode = themedconfig.productcode.toUpperCase() : 'MOBILE';

    // Also clear AppJSON vars
    app.appJSON = '';
    app.jsonVersion = '';
    app.jsonStatus = '';
    // more vars to be cleared ?		

    app.wsErrorCode = '';
    app.lastErrorMsg = '';
    app.lastdoRequestWS = new Object();

    BRVDatabase.successCallBack = null;
    BRVDatabase.deleteUserActivations();
}

function resetExternal() {
    app.debug('FUNCTION: resetExternal');
    var message = app.translateMessage('RESET_EXT');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                app.ClearExternal();
            },
            nee: function() {}
        }
    });
}

function resetDizzyData() {
    app.debug('FUNCTION: resetDizzyData');
    var message = app.translateMessage('RESET_DIZZYDATA');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                app.ClearDizzyData();
            },
            nee: function() {}
        }
    });
}

function resetUserView() {
    app.debug('FUNCTION: resetUserView');
    var message = app.translateMessage('RESET_USERVIEW');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                if (clearUserView(app.activeusername, true, true, true)) {
                    startApplication('init');
                }
            },
            nee: function() {}
        }
    });
}

// function startApplication(action) {
// 	// First check if we need to build the SWL database!
// 	BRVDatabase.successCallBack = function() {startApplication2(action) };
// 	BRVDatabase.init();
// 	BRVDatabase.createTableUserActivations();
// }
// function startApplication2(action) {
// 	if (app.userActivationInit) {
// 		app.userActivationInit = false;
// 		// Get current userActivations from localstorage
// 		var userActivations = app.GetFromPhoneStorage('userActivations');
// 		if ( BRVUtil.checkValue(userActivations) ) {
// 			BRVDatabase.successCallBack = function() {startApplication3(action) };
// 			BRVDatabase.updateUserActivations(userActivations);
// 		} else {
// 			startApplication3(action);
// 		}
// 	} else {
// 		startApplication3(action);
// 	}
// }
// function startApplication3(action) {
// 	startApplicationNow(action);
// }




function startApplication(action) {
    app.stopLoading();

    app.debug('FUNCTION: Start application,  Action:' + action);

    action = (BRVUtil.checkValue(action)) ? action : 'init';

    if (action == 'init') {

        // Reset devicename
        app.devicename = app.getDeviceName();

        // Get timeout(ms) for select input fields!
        var selectinputtimeout = app.GetFromPhoneStorage('selectinputtimeout');
        app.selectInputTimeout = (selectinputtimeout > 0) ? selectinputtimeout : app.selectInputTimeout;

        // Browser: Check userActivations and remove user(s) if 'delUserOnStartup' is true
        // *********
        // ToDo: Check if claimed Fidesque userid is different as Fidesque id in storage useractivation then remove user and reactivate!!
        // *********
        if (BRVUtil.isBrowser()) {
            var userActivations = app.GetFromPhoneStorage('userActivations');
            if (BRVUtil.checkValue(userActivations)) {
                userActivations = BRVUtil.parseJSON(userActivations);
                var registrationCnt = userActivations.activations.length;
                if (registrationCnt > 0) {
                    for (var i = 0; i < userActivations.activations.length; i++) {
                        var curRecord = userActivations.activations[i];
                        if (curRecord.delUserOnStartup) {
                            resetRegistrationData();
                            break;
                        }
                    }
                }
            }
        }
        //

        app.activeRequestCount = 0; // Reset activeRequestCount!!

        if (!app.isBuilder) {
            app.getAppConfig();
        } else {
            startApplication_step2(action);
        }
    } else {
        startApplication_step2(action);
    }
}


function startApplication_step2(action) {
    app.stopLoading();

    // function startApplicationNow(action) {
    app.debug('FUNCTION: Start application,  Action:' + action);

    action = (BRVUtil.checkValue(action)) ? action : 'init';

    if (action == 'init') { app.activeRequestCount = 0; } // Reset activeRequestCount!!

    // action = (app.multiuser) ? 'activateduserlogin' : action;
    // var multiuser = BRVUtil.isBool( app.GetFromPhoneStorage('multiuser') )?true:false;
    // action = ((app.multiuser || multiuser) && action=='activateduserlogin') ? 'activateduserlogin' : action;
    action = (app.checkmultiuser() && action == 'activateduserlogin') ? 'activateduserlogin' : action;

    // If not multiuser and no current activeuser, then get first username from userActivations
    if (!app.checkmultiuser() && app.activeusername == '') {
        var userActivations = app.GetFromPhoneStorage('userActivations');
        if (BRVUtil.checkValue(userActivations)) {
            // userActivations = JSON.parse(userActivations);
            userActivations = BRVUtil.parseJSON(userActivations);
            app.activeusername = userActivations.activations[0].username;
            app.logintype = userActivations.activations[0].logintype;
        }
    }

    BVW_Cryptor.setKey(app.GetFromPhoneStorage('avkey'));

    var appJSONDefault = app.appJSONDefault;
    if (BRVUtil.checkValue(appJSONDefault)) {
        app.debug('Default JSON  loaded');
        app.JSONObjectDefault['app'] = appJSONDefault.app;
        app.JSONObjectDefault['screens'] = appJSONDefault.screens;
    } else {
        app.debug('Default JSON not loaded');
        app.showError('ERROR_DEFAULTDEF_LOAD', 'function: startApplication');
        return;
    }

    if (action == 'activateduserlogin') {
        app.debug('activateduserlogin');
        getScreenFromJSONDefault('activateduserlogin');
    }

    if (action == 'newactivation') {
        app.debug('newactivation');
        getScreenFromJSONDefault('activatedevice');
    }

    // Check for activation
    if (action == 'init' && (!app.activated)) {
        app.debug('Check activation: Not activated');
        getScreenFromJSONDefault('activatedevice');
    } else {
        (action == 'init') ? action = 'activatedTrue': '';
    }

    // If activated then get deviceinfo
    if (action == 'activatedTrue') {
        //app.debug('Get Deviceinfo');
        // GetDeviceInfo();
        // GetDeviceInfoV2();
        renewOasUrl(); // Todo: fix this one.. On each start we need to check for new oasurl, after that call GetDeviceInfoV2()
    } else if (action == 'activatedFalse') {
        app.debug('Check activation: FAILED');
        getScreenFromJSONDefault('errorscreen');
    }

    // If Deviceinfo then get app JSON
    if (action == 'getdeviceinfoTrue') {

        if (app.LoadLocalDefinition) { // When loading local definition, first clear old saved definition.
            app.appJSON = "";
        }

        if (app.appJSON == '' || app.updateJSON) {
            if (app.LoadLocalDefinition) {
                app.appJSON = '';
                app.versionJSON = 0;
                app.versionJSONStatus = 0;

                app.AddToPhoneStorage('appjson', '');
                app.AddToPhoneStorage('appjsonversion', 0);
                app.AddToPhoneStorage('appjsonversionstatus', 0);

                app.debug('Get appJSON: local');

                GetLocalAppDefinition();
            } else {
                // There's a new definition, ask user to load the new definition.
                if (app.updateJSON) {
                    if (app.askForDefinitionUpdate) {
                        var message = app.translateMessage('UPDATE_DEFINITION');
                        jQuery.confirm({
                            title: '&nbsp;',
                            content: message,
                            buttons: {
                                ja: function() {
                                    // Clear old settings and get last definition
                                    app.appJSON = '';
                                    app.versionJSON = 0;
                                    app.versionJSONStatus = 0;

                                    app.AddToPhoneStorage('appjson', '');
                                    app.AddToPhoneStorage('appjsonversion', 0);
                                    app.AddToPhoneStorage('appjsonversionstatus', 0);

                                    app.debug('Get appJSON: cloud');

                                    GetAppDefinition();
                                },
                                nee: function() {
                                    // Keep current definition!
                                    action = 'getappdefinitionTrue';
                                    app.updateJSON = false;
                                }
                            }
                        });
                    } else {
                        // Clear old settings and get last definition
                        app.appJSON = '';
                        app.versionJSON = 0;
                        app.versionJSONStatus = 0;

                        app.AddToPhoneStorage('appjson', '');
                        app.AddToPhoneStorage('appjsonversion', 0);
                        app.AddToPhoneStorage('appjsonversionstatus', 0);

                        app.debug('Get appJSON: cloud');

                        GetAppDefinition();
                    }
                } else {
                    // There's no definition so get the last one.
                    GetAppDefinition();
                }
            }
        } else {
            action = 'getappdefinitionTrue';
            GetLastAppVersion();
        }
    } else if (action == 'getdeviceinfoFalse') {
        app.debug('Get Deviceinfo: FAILED');
        getScreenFromJSONDefault('errorscreen');
    }

    // If Appdefinition then get app JSON
    if (action == 'getappdefinitionTrue') {
        app.debug('Get AppDefinition: Loaded');
        checkValidAppJSON();
    } else if (action == 'getappdefinitionFalse') {
        app.debug('Get AppDefinition: FAILED');
        getScreenFromJSONDefault('errorscreen');
    }
}


function ActivateDevice(activationuser, activationcode) {
    app.debug('FUNCTION: ActivateDevice');
    // First get OAS settings, then goto ActivateDevice_step2();

    $("*:focus").blur();

    // Get credentials from screen
    // app.activationuser = $('#activationuser').val();
    // app.activationcode = $('#activationcode').val();
    app.activationuser = (activationuser) ? activationuser : $('#activationuser').val();
    app.activationcode = (activationcode) ? activationcode : $('#activationcode').val();

    // Check loginMethod
    // var selectedMethod = $('#loginmethods').val();
    var selectedMethod = app.loginMethod;
    // var selectedMethod = (selectedMethod) ? selectedMethod: app.loginMethod;

    switch (selectedMethod) {
        case "loginFidesqueSSO":
            // Set logintype
            app.logintype = "loginFidesqueSSO";
            // app.AddToPhoneStorage('isdemo', 'false');
            app.isdemo = false;
            break;

        case "loginFidesqueSSOdirect":
            // Set logintype
            app.logintype = "loginFidesqueSSOdirect";

            // app.AddToPhoneStorage('isdemo', 'false');
            app.isdemo = false;
            break;

        case "loginFidesque":
            // Set logintype
            app.logintype = "loginFidesque";

            // app.AddToPhoneStorage('isdemo', 'false');
            app.isdemo = false;
            app.checkValidFidesqueLogin();
            break;

        case "loginDemo":
            // Set logintype
            app.logintype = "loginDemo";

            // app.AddToPhoneStorage('isdemo', 'true');
            app.isdemo = true;
            setTimeout(function() {
                // GetOASSettings();
                // getOasUrl();

                // Check if there are more products.
                // getUserProducts();
                // Only when officode and clientcode are empty!!!
                if (BRVUtil.checkValue(themedconfig.officecode) || BRVUtil.checkValue(themedconfig.clientcode)) {
                    // getOasUrl();

                    if (getProductDemoActivation('DEFAULT', false)) {
                        getOasUrl();
                    } else {
                        message = 'Demo is momenteel niet beschikbaar!';
                        app.showMessage(message, 0, false);
                    }

                } else {
                    getUserProducts();
                }

            }, 500);
            break;

        case "loginActivationCode":
        case "loginOasUserCode":
        case "loginQrCode":
            // Set logintype
            app.logintype = "loginActivation";

            // app.AddToPhoneStorage('isdemo', 'false');
            app.isdemo = false;
            setTimeout(function() {
                // GetOASSettings();
                getOasUrl();
            }, 500);
            break;
    }

    // setTimeout(function () {
    // 	GetOASSettings();
    // }, 500);

}

function ActivateDevice_step2() {
    app.debug('FUNCTION: ActivateDevice');
    app.loadMessage = 'ACTIVATE_DEVICE';

    //			activationServiceResponse registerDevice (
    //				@WebParam(name = "apiKey") String apiKey,
    //				@WebParam(name = "productCode") String productCode,
    //				@WebParam(name = "activationCode") String activationCode,
    //				@WebParam(name = "userName") String activationCode,
    //				@WebParam(name = "password") String activationCode,
    //				@WebParam(name = "deviceId") String deviceId,
    //				@WebParam(name = "deviceName") String deviceName)
    // var activationcode	= $('#activationcode').val();
    // var deviceid			= $('#deviceid').val();
    // var devicename		= $('#devicename').val();

    //Set new deviceID
    // var TimeStamp = BRVUtil.strTimeStamp();
    // deviceID = app.getDeviceID();
    // app.deviceid = (deviceID.indexOf("_"+TimeStamp)>-1) ? deviceID : deviceID+"_"+BRVUtil.strTimeStamp(); 
    // app.AddToPhoneStorage('deviceID', app.deviceid);
    // app.deviceid = app.getDeviceID('new');


    // app.deviceid = app.getDeviceID();
    // Check for new user activation
    if (app.isnewactivation) {
        // New DeviceID
        app.deviceid = app.getDeviceID('new');
    } else {
        app.deviceid = app.getDeviceID();
    }

    // var xmlRequest = '<productCode>'+app.productcode+'</productCode><apiKey>' + app.apikeyOAS + '</apiKey><userName>' + app.activationuser + '</userName><password>' + app.activationcode + '</password><deviceId>' + app.deviceid + '</deviceId><deviceName>' + app.devicename + '</deviceName>';
    // var xmlRequest = '<productCode>'+app.productcode+'</productCode><apiKey>' + app.apikeyOAS + '</apiKey><userName>' + app.activationuser + '</userName><password>' + app.activationcode + '</password><deviceId>' + app.deviceid + '</deviceId><deviceName>' + app.devicename + '</deviceName><officeCode>'+app.officecode+'</officeCode><clientCode>'+app.clientcode+'</clientCode>';
    var xmlRequest = '<productCode>' + app.productcode + '</productCode><apiKey>' + app.apikeyOAS + '</apiKey><userName>' + app.activationuser + '</userName><password>' + app.activationcode + '</password><deviceId>' + app.deviceid + '</deviceId><deviceName>' + app.devicename + '</deviceName><officeCode>' + app.officecode + '</officeCode><clientCode>' + app.clientcode + '</clientCode><devicePrefix>' + ((BRVUtil.isBrowser()) ? 'BROWSER' : 'APP') + '</devicePrefix><deviceStatus>' + app.deviceStatus + '</deviceStatus>';

    if (BRVUtil.checkValue(app.activationcode)) {
        app.wsErrorCode = 'OAS001';
        app.doRequestWS('OAS', 'ActivationService', 'registerUserDevice', xmlRequest, showActivateDevice_step2Result, showWSError);
    } else {
        app.showMessage('ENTER_ACTIVATION_CODE');
    }
}

function showActivateDevice_step2Result(xhttp) {
    app.debug('FUNCTION: showActivateDevice_step2Result');

    // CheckWSError(xhttp);

    // Get app JSON from app vars
    // var JSONObject = app.JSONObject['app'];

    // ** Error **
    //<code>F</code>
    //<message>RELATION_NOT_FOUND</message>
    //<jsonData></jsonData>

    // ** Succes **
    // <code>S</code>
    // <message>DEVICE_REGISTERD</message>
    // <jsonData>
    // {
    // "deviceId": "e0101010d38bde8e6740011221af335301010333",
    // "deviceName": "iOS",
    // "companyName": "ATY Test",
    // "city": "Plaats",
    // "startDate": "20160914",
    // "subscriptionNumber": "0995862722",
    // "subscribedQty": 5,
    // "usedQty": 1,
    // "apiKey": "6db384786f71d30b56d0fd12112fbc95"
    // "avkey": "084122087102052099079109075089076083056053106111068100101048119120098080047057049088077066074072067085112065118121117071110069054082050081115055070113090114107097043105104078108086051073103116"
    // }
    // </jsonData>

    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');
    var resultJSON = BRVUtil.parseJSON(jsondata);

    if (succes.toUpperCase() == 'S') { // Succes
        app.showMessage(message);

        // var resultJSON = JSON.parse(jsondata);
        // var resultJSON = BRVUtil.parseJSON(jsondata);

        app.AddToPhoneStorage('activated', 'true');

        app.AddToPhoneStorage('subscription', resultJSON.subscriptionNumber);
        app.subscription = resultJSON.subscriptionNumber;

        app.AddToPhoneStorage('YOBsubscription', resultJSON.yobSubscriptionNumber);
        app.YOBsubscription = resultJSON.yobSubscriptionNumber;

        app.AddToPhoneStorage('productcode', resultJSON.productCode);
        app.productcode = resultJSON.productCode;

        app.AddToPhoneStorage('deviceID', resultJSON.deviceId);
        app.deviceid = resultJSON.deviceId;

        app.deviceStatus = resultJSON.deviceStatus;

        if (BRVUtil.checkValue(resultJSON.avkey)) {
            app.AddToPhoneStorage('avkey', resultJSON.avkey);
            BVW_Cryptor.setKey(resultJSON.avkey);
            app.encryptrequest = true;
        } else {
            app.AddToPhoneStorage('avkey', '');
            BVW_Cryptor.setKey(0);
            app.encryptrequest = false;
        }

        app.activated = true;

        // Save current activation
        saveUserActivation(resultJSON);

        startApplication('activatedTrue');

    } else
    if (succes.toUpperCase() == 'F') { // Succes
        // var resultJSON = BRVUtil.parseJSON(jsondata);
        // Check for errorCode == BLOCKED_OR_MAINTENANCE
        // Then show messageCode, if empty show default maintenance message
        // Otherwise do default: app.showMessage(message, 0, false);
        if (BRVUtil.checkValue(resultJSON.errorInfo)) {
            app.appBlockedMsg = BRVUtil.checkValue(resultJSON.errorInfo.base64message) ? b64_to_str(resultJSON.errorInfo.base64message) : '';
            if (resultJSON.errorInfo.errorCode == 'BLOCKED_OR_MAINTENANCE') {
                app.appBlockedMsg = BRVUtil.checkValue(app.appBlockedMsg) ? app.appBlockedMsg : app.translateMessage('MAINTENANCE');
                getScreenFromJSONDefault('maintenancescreen', true);
            } else {
                app.showMessage(message, 0, false);
            }
        } else {
            app.showMessage(message, 0, false);
        }
        // app.newactivation = false;
        // app.showMessage(message, 0, false);
    } else { // Failed
        // ERROR: class java.io.IOException: Server returned HTTP response code: 500 for URL: http://40.68.250.191/YSSSOAP/ActivationService?wsdl
        app.showError(message, 'function: showActivateDevice_step2Result');
    }

}



/****************************/
function registerDeviceUserId(activationsObj, OasApiKey, OasUrl) {
    app.debug('FUNCTION: registerDeviceUserId');
    app.loadMessage = 'ACTIVATE_DEVICE';

    if (BRVUtil.Left(activationsObj, 4) == 'b64|') { // If encoded params, then decode add new params and encode again!
        activationsObj = activationsObj.replace('b64|', '');
        activationsObj = b64_to_str(activationsObj);
        activationsObj = JSON.parse(activationsObj);
    }

    // {
    // 	"subscriptionNumber": "0995862722",
    // 	"productCode": "MOBILE",
    // 	"productName": "Mobile app",
    // 	"clientName": "ATY Test",
    // 	"activationCode": "STy2juodu11kw3",
    // 	"email": "tijssena@gmail.com",
    // 	"deviceId": "ODAwMTgwNA",
    // 	"deviceName": "AppBuilder",
    // 	"deviceStatus": 9
    // }

    app.apikeyOAS = OasApiKey;
    app.oasurl = OasUrl;
    app.activationcode = activationsObj.activationCode;
    app.AddToPhoneStorage('oaswsurl', app.oasurl);
    app.AddToPhoneStorage('apikeyoas', app.apikeyOAS);

    var xmlRequest = '<apiKey>' + app.apikeyOAS + '</apiKey>';
    xmlRequest += '<productCode>' + activationsObj.productCode + '</productCode>';
    xmlRequest += '<activationCode>' + activationsObj.activationCode + '</activationCode>';
    xmlRequest += '<userToken>' + app.userToken + '</userToken>';

    xmlRequest += '<devicePrefix>' + ((BRVUtil.isBrowser()) ? 'BROWSER' : 'APP') + '</devicePrefix>';

    xmlRequest += '<deviceStatus>' + activationsObj.deviceStatus + '</deviceStatus>';

    xmlRequest += '<deviceId>' + ((activationsObj.deviceId) ? activationsObj.deviceId : app.deviceid) + '</deviceId>';
    xmlRequest += '<deviceName>' + ((activationsObj.deviceName) ? activationsObj.deviceName : app.devicename) + '</deviceName>';

    xmlRequest += '<officeCode>' + app.officecode + '</officeCode>';
    xmlRequest += '<clientCode>' + app.clientcode + '</clientCode>';

    app.wsErrorCode = 'OAS007';
    app.doRequestWS('OAS', 'ActivationService', 'registerDeviceUserId', xmlRequest, registerDeviceUserIdResult, showWSError);

}

function registerDeviceUserIdResult(xhttp) {
    app.debug('FUNCTION: registerDeviceUserIdResult');

    // CheckWSError(xhttp);

    // ** Succes **
    // <code>S</code>
    // <message>DEVICE_REGISTERD</message>
    // <jsonData>
    // {
    // 	"userName": "Antoine Tijssen",
    // 	"deviceId": "BROWSER-ODAwMTgwNA_1561122970977",
    // 	"deviceName": "AppBuilder",
    // 	"deviceStatus": 9,
    // 	"companyName": "ATY Test",
    // 	"city": "Plaats",
    // 	"startDate": "20160914",
    // 	"subscriptionNumber": "0995862722",
    // 	"subscribedQty": 10,
    // 	"usedQty": 6,
    // 	"productCode": "MOBILE",
    // 	"activationCode": "ST5xoji1edn64",
    // 	"isDemo": false,
    // 	"avkey": "120105073084103097112089108072119047121071083088110082077076074070117102115081057079098113106050054056048100109087111051114075043122101053080066069104107052090085086099068116118078049065055067"
    // }
    // </jsonData>

    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        app.showMessage(message);

        // var resultJSON = JSON.parse(jsondata);
        var resultJSON = BRVUtil.parseJSON(jsondata);
        app.AddToPhoneStorage('activated', 'true');
        app.AddToPhoneStorage('subscription', resultJSON.subscriptionNumber);
        app.subscription = resultJSON.subscriptionNumber;

        app.AddToPhoneStorage('YOBsubscription', resultJSON.yobSubscriptionNumber);
        app.YOBsubscription = resultJSON.yobSubscriptionNumber;

        app.AddToPhoneStorage('productcode', resultJSON.productCode);
        app.productcode = resultJSON.productCode;

        app.AddToPhoneStorage('deviceID', resultJSON.deviceId);
        app.deviceid = resultJSON.deviceId;
        app.deviceStatus = resultJSON.deviceStatus;

        if (BRVUtil.checkValue(resultJSON.avkey)) {
            app.AddToPhoneStorage('avkey', resultJSON.avkey);
            BVW_Cryptor.setKey(resultJSON.avkey);
            app.encryptrequest = true;
        } else {
            app.AddToPhoneStorage('avkey', '');
            BVW_Cryptor.setKey(0);
            app.encryptrequest = false;
        }

        app.activated = true;

        // Save current activation
        saveUserActivation(resultJSON);

        startApplication('activatedTrue');

    } else
    if (succes.toUpperCase() == 'F') { // Succes
        // app.newactivation = false;
        app.showMessage(message, 0, false);
    } else { // Failed
        // ERROR: class java.io.IOException: Server returned HTTP response code: 500 for URL: http://40.68.250.191/YSSSOAP/ActivationService?wsdl
        app.showError(message, 'function: registerDeviceUserIdResult');
    }
}

/****************************/


function GetDeviceAdminUsers() {
    app.debug('FUNCTION: impersonationGrid');

    // First remove old popup!
    $("#popupLiveGrid").remove(); // Remve sensormenu first!

    if (!BRVUtil.checkValue(app.adm_code)) {
        app.showMessage('OPEN_ADMIN_FIRST', 0, false);
    } else {
        // Create popup!
        setTimeout(function() {
            var popuptest = '';
            if (app.isBuilder) {
                popuptest += '<div data-role="popup" data-dialog="true" id="popupLiveGrid">';
            } else {
                popuptest += '<div data-role="popup" data-dialog="true" id="popupLiveGrid" data-dismissible="false" data-tolerance="0">';
            }
            popuptest += '    <div data-role="header">';
            popuptest += '    	<h1>Selecteer gebruiker</h1>';
            popuptest += '    	<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-left">Close</a>';
            popuptest += '    </div>';
            popuptest += '	<div id="searchdiv">';
            popuptest += '		<input type="search" id="impersonationlist_search" name="impersonationlist_search" value="" data-mini="true" class="ui-shadow">';
            popuptest += '	</div>';
            popuptest += '    <div role="content" id="contentlist">';
            popuptest += '		<ul data-role="listview" id="impersonationlist_result" name="impersonationlist_result" data-scroll="true" data-autodividers="false">';
            popuptest += '		</ul>';
            popuptest += '    </div>';
            popuptest += '</div>';

            $('#page-home').append(popuptest);

            $('#popupLiveGrid').trigger("create"); // Just create of trigger 'maps_popup'! 

            $("[data-role=popup]").on("popupafterclose", function() {
                $(this).remove();
            }).on("popupafteropen", function() {}).popup({
                beforeposition: function() {
                    if (app.isBuilder) {
                        $(this).css({
                            width: $("#page-home").innerWidth() - 50,
                            height: $("#page-home").innerHeight() - 50,
                            maxheight: $("#page-home").innerHeight() - 50,
                            top: $("#toolbar").height()
                        });
                    } else {
                        var horizSpacing = 15;
                        var vertSpacing = 15;
                        var horizPaddingBorderSize = $(this).outerWidth() - $(this).width();
                        var vertPaddingBorderSize = $(this).outerHeight() - $(this).height();

                        $(this).css({
                            left: horizSpacing,
                            top: vertSpacing,
                            width: window.innerWidth - (horizSpacing * 2) - horizPaddingBorderSize,
                            height: window.innerHeight - (vertSpacing * 2) - vertPaddingBorderSize
                        });
                    }
                },
                x: 0,
                y: 0,
                // positionTo: "window",
                dismissible: false,
                history: false,
                transition: "slide",
                modal: true
                    // }).popup("open");
            }).popup(); // Do not open at this time, let's open it when some data has been loaded!

            // Load first set of data
            setTimeout(function(obj) {
                var page = (app.isBuilder) ? $("#page-home").height() : jQuery.mobile.getScreenHeight();
                var header = $(".ui-header").outerHeight();
                var search = $(".ui-input-search").outerHeight();

                page = (page / 100) * 95;
                var maxHeight = page - header - search;

                $('#contentlist').css('min-height', maxHeight + 'px');
                $('#contentlist').css('max-height', maxHeight + 'px');
                $('#contentlist').css('overflow-y', 'scroll');

                GetDeviceAdminUsers_step2(app.adm_code, '');

                //Bind event on search box
                var srcField = "impersonationlist_search";
                $('#' + srcField).bind("change", function(event, ui) {
                    // Clear grid
                    $('#impersonationlist_result').html('');

                    var srcFieldValue = $('#' + srcField).val();
                    // Get new grid data
                    GetDeviceAdminUsers_step2(app.adm_code, srcFieldValue);

                    setTimeout(function(srcField) {
                        $("#" + srcField).blur(); // To hide the keyboard.
                    }, 100, srcField);
                });

            }, 100);

        }, 250);
    }
}

function GetDeviceAdminUsers_step2(adm_code, filter) {
    app.debug('FUNCTION: GetDeviceAdminUsers');
    app.loadMessage = 'LOAD_ADMIN_USERS';
    // 		activationServiceResponse getDeviceAdminUsers(
    // 			@WebParam(name = "apiKey") String apiKey,
    // 			@WebParam(name = "productCode") String productCode,
    // 			@WebParam(name = "deviceId") String deviceId,
    // 			@WebParam(name = "admCode") String admCode),
    // 			@WebParam(name = "filter") String filter)
    var xmlRequest = '<productCode>' + app.productcode + '</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId><admCode>' + BRVUtil.escapeHtmlEntities(adm_code) + '</admCode><filter>' + filter + '</filter>';
    app.wsErrorCode = 'OAS009';
    app.doRequestWS('OAS', 'ActivationService', 'getDeviceAdminUsers', xmlRequest, showGetDeviceAdminUsersResult, showWSError);
}

function showGetDeviceAdminUsersResult(xhttp) {
    app.debug('FUNCTION: showGetDeviceAdminUsersResult');

    CheckWSError(xhttp);

    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        var resultJSON = BRVUtil.parseJSON(jsondata);

        // {
        // 	"userCount": 4,
        // 	"users": [
        // 		{
        // 			"userId": 914,
        // 			"name": "Antoine Tijssen"
        // 		},
        // 		{
        // 			"userId": 1012,
        // 			"name": "Antoine Tijssen"
        // 		},
        // 		{
        // 			"userId": 1000,
        // 			"name": "Demo Demo"
        // 		},
        // 		{
        // 			"userId": 916,
        // 			"name": "Gert van Lijssel"
        // 		}
        // 	]
        // }

        var jsonRecords = resultJSON.users;
        var output = '';

        if (resultJSON.userCount >= 1) { // Build list of gridrecords
            jQuery.each(jsonRecords, function(i, val) {
                output += '<li key="' + val['userId'] + '" data-icon="false">';
                output += '<a href="#" onclick="app.OpenAdmin(\'' + app.adm_code + '\', \'' + val['userId'] + '\'); " data-rel="back">';
                output += val['name'];
                output += '</a>';
                output += '</li>';
            });
        } else {
            output += '<li>Geen data gevonden!</li>';
        }

        // Set popup grid content
        $('#impersonationlist_result').append(output);
        $('#impersonationlist_result').listview().listview('refresh');
        // Open the hidden popup
        $("[data-role=popup]").popup("open");

    } else
    if (succes.toUpperCase() == 'F') { // Succes
        app.showMessage(message);
    } else { // Failed
        app.showError(message, 'function: showGetDeviceAdminUsersResult');
    }
}


function GetDeviceAdminRoles(adm_code, userID) {
    app.debug('FUNCTION: GetDeviceAdminRoles');
    app.loadMessage = 'LOAD_ADMIN_ROLES';
    // 		activationServiceResponse getDeviceAdminRoles(
    // 			@WebParam(name = "apiKey") String apiKey,
    // 			@WebParam(name = "productCode") String productCode,
    // 			@WebParam(name = "deviceId") String deviceId,
    // 			@WebParam(name = "admCode") String admCode)

    app.adm_code = adm_code;
    userID = (userID) ? userID : '';

    app.ImpersionationUserID = userID;

    // var xmlRequest = '<productCode>'+app.productcode+'</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId><admCode>' + adm_code + '</admCode>';
    var xmlRequest = '<productCode>' + app.productcode + '</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId><admCode>' + BRVUtil.escapeHtmlEntities(adm_code) + '</admCode><userId>' + userID + '</userId>';
    app.wsErrorCode = 'OAS002';
    app.doRequestWS('OAS', 'ActivationService', 'getDeviceAdminRoles', xmlRequest, showGetDeviceAdminRolesResult, showWSError);
}

function showGetDeviceAdminRolesResult(xhttp) {
    app.debug('FUNCTION: showGetDeviceAdminRolesResult');

    CheckWSError(xhttp);

    // <code>S</code>
    // <message>DEVICE_DATA</message>
    // <jsonData>
    // {"access":[]}
    // </jsonData>

    // <code>S</code>
    // <message>DEVICE_DATA</message>
    // <jsonData>
    // {
    // "access": ["ACCESS",
    // "FINANCE",
    // "RELATIONS",
    // "OPENITEM",
    // "PEOPLE",
    // "ACTION",
    // "DASHBOARD",
    // "ARTICLE",
    // "DEBTORS",
    // "CREDITORS",
    // "HOURS",
    // "SALESINVOICES",
    // "SALESORDERS"]
    // }
    // </jsonData>

    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        // var resultJSON = JSON.parse(jsondata);
        var resultJSON = BRVUtil.parseJSON(jsondata);
        // {"access":["ACCESS","FINANCE","RELATIONS","OPENITEM","PEOPLE","ACTION","DASHBOARD","ARTICLE","DEBTORS","CREDITORS","HOURS","SALESINVOICES","SALESORDERS"]}
        if (BRVUtil.checkValue(resultJSON.access)) {
            if (resultJSON.access.length > 0) { // Roles found!
                app.adminAccess = resultJSON.access;
                app.AddToPhoneStorage('adminAccess', app.adminAccess);

                // Remember this admin as last opened
                //app.AddToPhoneStorage('lstadmcode', app.adm_code);
                updateUserData(app.activeusername, '', '', app.adm_code);
                getAdminData(app.startScreen, '', '');

            } else { // No roles found or admin not found.
                app.adm_code = '';
                app.adminAccess = '';
                app.showMessage('NO ACCESS TO SPECIFIED ADMIN');
                getScreenFromJSON('adminselect');
            }
        } else {
            app.adm_code = '';
            app.adminAccess = '';
            app.showMessage('NO ACCESS TO SPECIFIED ADMIN');
            getScreenFromJSON('adminselect');
        }
    } else
    if (succes.toUpperCase() == 'F') { // Succes
        // app.newactivation = false;
        app.showMessage(message);
    } else { // Failed
        // ERROR: class java.io.IOException: Server returned HTTP response code: 500 for URL: http://40.68.250.191/YSSSOAP/ActivationService?wsdl
        app.showError(message, 'function: showGetDeviceAdminRolesResult');
    }
}

// function GetDeviceAdminRoles(adm_code) {
// 	app.debug('FUNCTION: GetDeviceAdminRoles');
// 	app.loadMessage = 'LOAD_ADMIN_ROLES';
// 	// 		activationServiceResponse getDeviceAdminRoles(
// 	// 			@WebParam(name = "apiKey") String apiKey,
// 	// 			@WebParam(name = "productCode") String productCode,
// 	// 			@WebParam(name = "deviceId") String deviceId,
// 	// 			@WebParam(name = "admCode") String admCode)

// 	app.adm_code = adm_code;

// 	// var xmlRequest = '<productCode>'+app.productcode+'</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId><admCode>' + adm_code + '</admCode>';
// 	var xmlRequest = '<productCode>'+app.productcode+'</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId><admCode>' + BRVUtil.escapeHtmlEntities(adm_code) + '</admCode>';
// 	app.wsErrorCode='OAS002';
// 	app.doRequestWS('OAS', 'ActivationService', 'getDeviceAdminRoles', xmlRequest, showGetDeviceAdminRolesResult, showWSError);
// }
// function showGetDeviceAdminRolesResult(xhttp) {
// 	app.debug('FUNCTION: showGetDeviceAdminRolesResult');

// 	CheckWSError(xhttp);

// 	// <code>S</code>
// 	// <message>DEVICE_DATA</message>
// 	// <jsonData>
// 	// {"access":[]}
// 	// </jsonData>

// 	// <code>S</code>
// 	// <message>DEVICE_DATA</message>
// 	// <jsonData>
// 	// {
// 		// "access": ["ACCESS",
// 		// "FINANCE",
// 		// "RELATIONS",
// 		// "OPENITEM",
// 		// "PEOPLE",
// 		// "ACTION",
// 		// "DASHBOARD",
// 		// "ARTICLE",
// 		// "DEBTORS",
// 		// "CREDITORS",
// 		// "HOURS",
// 		// "SALESINVOICES",
// 		// "SALESORDERS"]
// 	// }
// 	// </jsonData>

// 	var response = b64_to_str(xhttp.response);
// 	var succes = BRVUtil.strExtract(response, '<code>', '</code>');
// 	var message = BRVUtil.strExtract(response, '<message>', '</message>');
// 	var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

// 	if (succes.toUpperCase() == 'S') { // Succes
// 		// var resultJSON = JSON.parse(jsondata);
// 		var resultJSON = BRVUtil.parseJSON(jsondata);
// 		// {"access":["ACCESS","FINANCE","RELATIONS","OPENITEM","PEOPLE","ACTION","DASHBOARD","ARTICLE","DEBTORS","CREDITORS","HOURS","SALESINVOICES","SALESORDERS"]}
// 		if ( BRVUtil.checkValue( resultJSON.access ) ) { 
// 			if (resultJSON.access.length > 0) {	// Roles found!
// 				app.adminAccess = resultJSON.access;
// 				app.AddToPhoneStorage('adminAccess', app.adminAccess);

// 				// Remember this admin as last opened
// 				//app.AddToPhoneStorage('lstadmcode', app.adm_code);
// 				updateUserData(app.activeusername, '', '', app.adm_code);
// 				getAdminData(app.startScreen, '', '');

// 			} else {	// No roles found or admin not found.
// 				app.adm_code = '';
// 				app.adminAccess = ''; 
// 				app.showMessage('NO ACCESS TO SPECIFIED ADMIN');
// 				getScreenFromJSON('adminselect');
// 			}
// 		} else {
// 			app.adm_code = '';
// 			app.adminAccess = '';
// 			app.showMessage('NO ACCESS TO SPECIFIED ADMIN');
// 			getScreenFromJSON('adminselect');
// 		}
// 	} else 
// 	if (succes.toUpperCase() == 'F') { // Succes
// 		// app.newactivation = false;
// 		app.showMessage(message);
// 	} else { // Failed
// 		// ERROR: class java.io.IOException: Server returned HTTP response code: 500 for URL: http://40.68.250.191/YSSSOAP/ActivationService?wsdl
// 		app.showError(message, 'function: showGetDeviceAdminRolesResult');
// 	}
// }




function GetDeviceInfoV2() {
    app.debug('FUNCTION: GetDeviceInfoV2');
    app.loadMessage = 'LOAD_DEVICE_INFO';
    //		activationServiceResponse getDeviceInfo(
    //			@WebParam(name = "apiKey") String apiKey,
    //			@WebParam(name = "productCode") String productCode,
    //			@WebParam(name = "deviceId") String deviceId)
    // var xmlRequest = '<productCode>'+app.productcode+'</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId>';
    var xmlRequest = '<productCode>' + app.productcode + '</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId><deviceName>' + app.devicename + '</deviceName>';
    app.wsErrorCode = 'OAS003';
    app.doRequestWS('OAS', 'ActivationService', 'getDeviceInfoV2', xmlRequest, showGetDeviceInfoV2Result, showWSError);
}

function showGetDeviceInfoV2Result(xhttp) {
    app.debug('FUNCTION: showGetDeviceInfoV2Result');

    CheckWSError(xhttp);

    // ** Error **
    //<code>F</code>
    //<message>RELATION_NOT_FOUND</message>
    //<jsonData></jsonData>

    // ** Succes **
    // <code>S</code>
    // <message>DEVICE_DATA</message>
    // <jsonData>
    // {
    // 	"ClientName": "BrancheView demonstratie",
    // 	"ClientCity": "Uden",
    // 	"ClientEmail": "development@brancheview.com",
    // 	"IsAfUser": false,
    // 	"UserName": "Demo Gebruiker",
    // 	"UserEmail": "development@brancheview.com",
    // 	"UserFirstName": "Demo",
    // 	"status": 9,
    // 	"apiKey": "d92f3fb386dc4aa4bd9e33f8d17de8fd",
    // 	"avUrl": "https://wgw.brancheview.com/WGWSOAP/rest",
    // 	"avUserId": "MOBILE",
    // 	"avPassword": "M0b!l#",
    // 	"avSerial": "AV9396078B",
    // 	"blocked": false,
    // 	"b64message": "",
    // 	"pincodeMandatory": false,
    // 	"checkPincode": false,
    // 	"checkPassword": false,
    // 	"productCode": "MOBILE",
    // 	"adm_code": "MOBGRD20",
    // 	"access": [
    // 		"ACTION",
    // 		"ARTICLE",
    // 		"BANK",
    // 		"CONCEPTORDER",
    // 		"CREDITORS",
    // 		"DASHBOARD",
    // 		"DEBTORS",
    // 		"EMPLOYEE",
    // 		"FINANCE",
    // 		"HOURS",
    // 		"OPENITEM",
    // 		"PEOPLE",
    // 		"POSTREG",
    // 		"PURCHASEORDERS",
    // 		"RELATIONS",
    // 		"SALESINVOICES",
    // 		"SALESORDERS",
    // 		"STOCKPAGES"
    // 	]
    // }
    // </jsonData>

    // *************************************
    // V2 response is missing: avUrl !!!!
    // *************************************

    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        // var resultJSON = JSON.parse(jsondata);
        var resultJSON = BRVUtil.parseJSON(jsondata);
        app.appBlocked = BRVUtil.isBool(resultJSON.blocked);
        app.appBlockedMsg = BRVUtil.checkValue(resultJSON.b64message) ? b64_to_str(resultJSON.b64message) : '';

        app.IsAfUser = BRVUtil.isBool(resultJSON.IsAfUser);

        //Testing
        // app.IsAfUser = true;

        if (app.appBlocked) {
            app.appBlockedMsg = BRVUtil.checkValue(app.appBlockedMsg) ? app.appBlockedMsg : app.translateMessage('MAINTENANCE');
            getScreenFromJSONDefault('maintenancescreen', true);
        } else if (BRVUtil.checkValue(app.appBlockedMsg)) {
            app.showMessage(app.appBlockedMsg, 0, false);
            showGetDeviceInfoV2Result_step2(xhttp);
        } else {
            showGetDeviceInfoV2Result_step2(xhttp);
        }
    } else {
        app.showMessage(message);
        app.lastErrorMsg = app.translateMessage(message);
        getScreenFromJSONDefault('errorscreen');
    }
}

function showGetDeviceInfoV2Result_step2(xhttp) {
    app.debug('FUNCTION: showGetDeviceInfoV2Result');

    CheckWSError(xhttp);

    // ** Error **
    //<code>F</code>
    //<message>RELATION_NOT_FOUND</message>
    //<jsonData></jsonData>

    // ** Succes **
    // <code>S</code>
    // <message>DEVICE_DATA</message>
    // <jsonData>
    // {
    // 	"ClientName": "BrancheView demonstratie",
    // 	"ClientCity": "Uden",
    // 	"ClientEmail": "development@brancheview.com",
    // 	"IsAfUser": false,
    // 	"UserName": "Demo Gebruiker",
    // 	"UserEmail": "development@brancheview.com",
    // 	"UserFirstName": "Demo",
    // 	"status": 9,
    // 	"apiKey": "d92f3fb386dc4aa4bd9e33f8d17de8fd",
    // 	"avUrl": "https://wgw.brancheview.com/WGWSOAP/rest",
    // 	"avUserId": "MOBILE",
    // 	"avPassword": "M0b!l#",
    // 	"avSerial": "AV9396078B",
    // 	"blocked": false,
    // 	"b64message": "",
    // 	"pincodeMandatory": false,
    // 	"checkPincode": false,
    // 	"checkPassword": false,
    // 	"productCode": "MOBILE",
    // 	"adm_code": "MOBGRD20",
    // 	"access": [
    // 		"ACTION",
    // 		"ARTICLE",
    // 		"BANK",
    // 		"CONCEPTORDER",
    // 		"CREDITORS",
    // 		"DASHBOARD",
    // 		"DEBTORS",
    // 		"EMPLOYEE",
    // 		"FINANCE",
    // 		"HOURS",
    // 		"OPENITEM",
    // 		"PEOPLE",
    // 		"POSTREG",
    // 		"PURCHASEORDERS",
    // 		"RELATIONS",
    // 		"SALESINVOICES",
    // 		"SALESORDERS",
    // 		"STOCKPAGES"
    // 	]
    // }
    // </jsonData>

    // *************************************
    // V2 response is missing: avUrl !!!!
    // *************************************

    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        // var resultJSON = JSON.parse(jsondata);
        var resultJSON = BRVUtil.parseJSON(jsondata);

        // Does user have set password
        app.checkPassword = BRVUtil.parseBoolean(resultJSON.checkPassword);

        // Does user have set pincode
        app.checkPincode = BRVUtil.parseBoolean(resultJSON.checkPincode);

        // Use of pincode is mandatory ?
        app.pincodeMandatory = BRVUtil.parseBoolean(resultJSON.pincodeMandatory);

        // Save some extra client-/userinfo to storage
        app.AddToPhoneStorage('clientname', (resultJSON.ClientName) ? resultJSON.ClientName : '');
        app.AddToPhoneStorage('clientcity', (resultJSON.ClientCity) ? resultJSON.ClientCity : '');
        app.AddToPhoneStorage('clientemail', (resultJSON.ClientEmail) ? resultJSON.ClientEmail : '');
        app.AddToPhoneStorage('username', (resultJSON.UserName) ? resultJSON.UserName : '');
        app.AddToPhoneStorage('useremail', (resultJSON.UserEmail) ? resultJSON.UserEmail : '');
        app.AddToPhoneStorage('userfirstname', (resultJSON.UserFirstName) ? resultJSON.UserFirstName : '');
        //

        app.AddToPhoneStorage('wsurl', resultJSON.avUrl);
        app.AddToPhoneStorage('apikey', resultJSON.apiKey);

        app.wsurl = resultJSON.avUrl;
        app.wsuser = resultJSON.avUserId;
        app.wspwd = resultJSON.avPassword;
        app.avserial = resultJSON.avSerial;
        // app.apikey		= resultJSON.apiKey; 
        // Check for Office ApiKey (apiKey) or AV ApiKey (avApiKey)
        // If avApiKey is set then use this one otherwhise use default Office apiKey
        app.apikey = (BRVUtil.checkValue(BRVUtil.alltrim(resultJSON.avApiKey)) && resultJSON.avApiKey.indexOf('http') < 0) ? BRVUtil.alltrim(resultJSON.avApiKey) : BRVUtil.alltrim(resultJSON.apiKey);

        // ToDo: Check for API or user/password!!!!
        // 
        if (BRVUtil.checkValue(app.wsurl) && BRVUtil.checkValue(app.avserial) && BRVUtil.checkValue(app.wsuser) && BRVUtil.checkValue(app.wspwd) && BRVUtil.checkValue(app.apikey)) {

            // Set last used admin only when it's not App Browser!!
            if (BRVUtil.checkValue(resultJSON.access) && !BRVUtil.isBrowser()) {
                // app.adm_code = resultJSON.adm_code;
                // unescape HTML entities before storing adm_code.
                app.adm_code = BRVUtil.unescapeHtmlEntities(resultJSON.adm_code);

                //Add a * before admin_code when it's last openen admin. So lateron we know we have to reopen that admin!
                app.adm_code = '*' + app.adm_code;

                app.adminAccess = resultJSON.access;
                app.AddToPhoneStorage('adminAccess', app.adminAccess);
            }

            app.deviceStatus = resultJSON.status; // 1: Development, 2: Test, 9: Productie
            if (app.deviceStatus == 1 || app.deviceStatus == 2) { // When development or test show message to user!
                message = (app.deviceStatus == 1) ? 'DEVELOPMODE' : 'TESTMODE';
                message = app.translateMessage(message);
                app.showMessage(message, null, false);
            }

            // If there's no userActivations object then create it and convert current user.
            var userActivations = app.GetFromPhoneStorage('userActivations');
            if (!BRVUtil.checkValue(userActivations)) {
                if (!findUserActivation(app.activeusername)) {
                    app.activationuser = resultJSON.UserEmail;

                    var newUserActivation = [];
                    newUserActivation["deviceId"] = app.GetFromPhoneStorage('deviceID');
                    newUserActivation["subscriptionNumber"] = app.GetFromPhoneStorage('subscription');
                    newUserActivation["yobSubscriptionNumber"] = app.GetFromPhoneStorage('YOBsubscription');
                    newUserActivation["avkey"] = app.GetFromPhoneStorage('avkey');

                    curwsseq = app.GetFromPhoneStorage('wsseq');
                    saveUserActivation(newUserActivation, curwsseq);
                }
            }

            startApplication('getdeviceinfoTrue');
        } else {
            message = app.translateMessage('INCOMPLETE_SETTINGS');
            app.showMessage(message, 0, false);
            setTimeout(function() {
                resetRegistrationData();
                startApplication('init');
            }, 200);
        }
    } else { // Failed
        // Clear some activation settings.
        // app.AddToPhoneStorage('activated', 'false');
        app.AddToPhoneStorage('wsurl', '');
        app.AddToPhoneStorage('apikey', '');
        app.AddToPhoneStorage('subscription', '');
        app.AddToPhoneStorage('YOBsubscription', '');

        // app.activated = false;
        app.wsurl = '';
        app.wsuser = '';
        app.wspwd = '';
        app.avserial = '';
        app.apikey = '';
        app.subscription = '';
        app.YOBsubscription = '';

        // app.showMessage(message);
        // // startApplication('init'); // Device must be activated again!

        // removeUserActivation(app.deviceid);

        // var action = (app.checkmultiuser() && app.activated) ? 'activateduserlogin' : 'init';
        // startApplication(action);

        if (app.checkmultiuser() && app.activated) {
            message = app.translateMessage(message);
            message += '<br><br>';
            message += app.translateMessage('DELETE_DEVICE');
            jQuery.confirm({
                title: '&nbsp;',
                content: message,
                buttons: {
                    ja: function() {
                        // removeUserActivation(app.activeusername);
                        // startApplication('activateduserlogin');

                        BRVDatabase.successCallBack = function() { startApplication('activateduserlogin'); };
                        removeUserActivation(app.activeusername);

                    },
                    nee: function() {
                        startApplication('activateduserlogin');
                    }
                }
            });
        } else {
            app.showMessage(message);
            // startApplication();
            app.lastErrorMsg = app.translateMessage(message);
            getScreenFromJSONDefault('errorscreen');

        }

    }
}

function GetOASSettings() {
    // app.debug('FUNCTION: getOasUrl');

    // // GET	http://localhost:8080/REST/wds/?service=AppServices&action=getOasUrl&request=.....

    // // <deviceId>7897289782892682699902</deviceId>
    // // <appCode>MOBILE</appCode>
    // // <appVersion>1.0</appVersion>
    // // <activationCode>BV782890278972</activationCode>

    // // {"response": "<code>S</code><message>OAS_DATA</message><jsonData>{"OasApiKey":"647346278346846823648","OasUrl":"http://staging-uden.yob.nl"}</jsonData>"}

    // app.activationcode = $('#activationcode').val();
    // app.activationuser = $('#activationuser').val();

    // if (!app.activated && BRVUtil.isBool(app.demoAvailable) && app.activationcode == '' && app.activationuser == '' ) {
    // // if ( (!app.activated || app.checkmultiuser()) && BRVUtil.isBool(app.demoAvailable) && app.activationcode == '' && app.activationuser == '' ) {
    // 	var message = app.translateMessage('ACTIVATE_DEMO');
    // 	jQuery.confirm({
    // 		title: '&nbsp;',
    // 		content: message,
    // 		buttons: {
    // 			ja: function () {
    // 				app.activationcode = app.demoActivationCode;
    // 				app.activationuser = app.demoActivationUser;
    // 				app.AddToPhoneStorage('isdemo', 'true');

    // 				// ToDo: Check WDS (?) if there are multiple product definitions.
    // 				// Present definition list to user. After user has selected definition continue... When there's only one definition then continue...

    // 				// getOasUrl();
    // 				getUserProducts();
    // 			},
    // 			nee: function () {
    // 				app.activationcode = '';
    // 				app.activationuser = '';
    // 				app.RemoveFromPhoneStorage('isdemo');
    // 			}
    // 		}
    // 	});
    // } else {
    // 	getOasUrl();
    // }
}

// **********************************************************************************************************************
function getUserProducts() {
    app.debug('FUNCTION: getUserProducts');
    app.loadMessage = 'GET_PRODUCTLIST';
    var xmlRequest = '';
    xmlRequest += '<appCode>' + app.productcode + '</appCode>';
    xmlRequest += '<appVersion>' + app.versionApp + '</appVersion>';
    app.wsErrorCode = 'WDS006';
    app.doRequestWS('WDS', 'AppServices', 'getProductList', xmlRequest, getUserProductsResult, showWSError);
}

function getUserProductsResult(xhttp) {
    // - If only one definition -> getOasUrl();
    // - If multiple definitions present list of definitions to user.
    // 	 On user definition selection -> getOasUrl();

    app.debug('FUNCTION: getUserProductsResult');

    CheckWSError(xhttp);

    var response = b64_to_str(xhttp.response);
    // <code>S</code>
    // <message>PRODUCTS</message>
    // <jsonData>
    // {
    // 	"products": [{
    // 		"productCode": "MOBILE",
    // 		"productName": "BrancheView Mobile App"
    // 	},
    // {
    // 	"products": [{
    // 		"productCode": "MOBILE_HOUR",
    // 		"productName": "BrancheView Mobile App - Urenregistratie"
    // 	}],
    // 	"qtyProducts": 2
    // }
    // </jsonData>

    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        var resultJSON = BRVUtil.parseJSON(jsondata);
        var totProducts = resultJSON.qtyProducts;

        var tmpJson = JSON.parse(JSON.stringify(resultJSON));

        // Check for available product activations 
        // If no activation available then remove product from list.
        for (var i = 0; i < tmpJson.qtyProducts; i++) {
            var isAvailable = getProductDemoActivation(tmpJson.products[i].productCode, true);
            if (!isAvailable) {
                resultJSON.products.splice(i, 1);
                totProducts--;
            }
        }

        if (totProducts <= 0) {
            message = 'Demo is momenteel niet beschikbaar!';
            app.showMessage(message, 0, false);
        } else if (totProducts == 1) {
            // resultJSON.products[0].productCode;
            // resultJSON.products[0].productName;
            app.productcode = resultJSON.products[0].productCode;
            if (getProductDemoActivation('DEFAULT', false)) {
                getOasUrl();
            } else {
                message = 'Demo is momenteel niet beschikbaar!';
                app.showMessage(message, 0, false);
            }
            // getOasUrl();
        } else {

            // Create popupbuttons
            var buttons = [];
            for (var a = 0; a < totProducts; a++) {
                addUserProductButton(buttons, resultJSON.products[a]);
            }

            var button = {};
            button['annuleren'] = {};
            button.text = 'Annuleren';
            button.btnClass = 'btn-default btn-brv btn-block';
            button.action = function() {};
            buttons.push(button);

            message = '<h1>Selecteer de gewenste demo</h1>';
            jQuery.confirm({
                title: false,
                content: message,
                // btnClass: 'testing',
                buttons: buttons
            });
        }
    } else { // Failed
        app.showError(message, 'function: getUserProductsResult');
    }
}

function addUserProductButton(btnArr, prodObj) {
    var button = {};
    var buttonCode = prodObj.productCode;
    button[buttonCode] = {};
    button.text = prodObj.productName;
    button.btnClass = 'btn-default btn-brv btn-brv-blue btn-block';
    button.action = function() { setUserProduct(buttonCode); };
    btnArr.push(button);
}

function setUserProduct(productcode) {
    app.productcode = productcode;
    //	getOasUrl();

    if (getProductDemoActivation(productcode, false)) {
        getOasUrl();
    } else {
        var message = 'Demo is momenteel niet beschikbaar!';
        app.showMessage(message, 0, false);
    }
}

function getProductDemoActivation(productcode, check) {
    var isAvailable = false;
    //app.demoActivations
    for (var i = 0; i < app.demoActivations.length; i++) {
        if (app.demoActivations[i].product == productcode) {
            if (check) {
                isAvailable = true;
            } else {
                isAvailable = true;

                app.activationcode = app.demoActivations[i].activationcode;
                app.activationuser = app.demoActivations[i].activationuser;

                app.demoActivationUser = app.demoActivations[i].activationuser;
                app.demoActivationCode = app.demoActivations[i].activationcode;
            }
            break;
        }
    }
    return isAvailable;
}

// **********************************************************************************************************************


function getOASActivationCode() {
    //	var isDemo = (app.GetFromPhoneStorage('isdemo') == 'true')?true:false;
    var oaswsurl = app.GetFromPhoneStorage('oaswsurl');
    oaswsurl = oaswsurl.toLowerCase();

    var activationCode = app.activationcode; // BV00000000 / YS00000000

    // if (isDemo) {	// DEMO
    if (app.isdemo) { // DEMO
        activationCode = app.demoActivationCode;
    } else {

        // Get from user profile
        if (activationCode == '') { // Geen activatiecode bekend
            activationCode = getUserData(app.activeusername, 'activationcode');
        }

        // Generate activatiecode prefix from OASURL
        if (activationCode == '') { // Geen activatiecode bekend
            // Staging-uden
            if (oaswsurl.indexOf('staging-uden.') >= 0) {
                activationCode = BRVUtil.padr('SU', '0', 10);
            } else
            // YOB Services
            if (oaswsurl.indexOf('yob.') >= 0) {
                activationCode = BRVUtil.padr('YS', '0', 10);
            } else
            // YOB Services
            if (oaswsurl.indexOf('webserviceinfrastructuur.') >= 0) {
                activationCode = BRVUtil.padr('YS', '0', 10);
            } else
            // Staging
            if (oaswsurl.indexOf('staging.') >= 0) {
                activationCode = BRVUtil.padr('ST', '0', 10);
            } else {
                // BrancheView
                activationCode = BRVUtil.padr('BV', '0', 10);
            }
        }
    }

    return activationCode;
}


function getOasUrl() {
    app.debug('FUNCTION: getOasUrl');
    app.loadMessage = 'GET_OAS_SETTINGS';
    if (app.activationcode != '') {
        var xmlRequest = '';
        xmlRequest += '<deviceId>' + app.deviceid + '</deviceId>';
        xmlRequest += '<deviceName>' + app.devicename + '</deviceName>'; // CHANGE IN WDS NEEDED!!!!!
        xmlRequest += '<appCode>' + app.productcode + '</appCode>';
        xmlRequest += '<appVersion>' + app.versionApp + '</appVersion>';
        xmlRequest += '<activationCode>' + app.activationcode + '</activationCode>';
        // xmlRequest += '<activationCode>' + getOASActivationCode() + '</activationCode>';
        app.wsErrorCode = 'WDS001';
        app.doRequestWS('WDS', 'AppServices', 'getOasUrl', xmlRequest, showgetOasUrlResult, showWSError);
    } else {
        var message = 'ENTER_USER_ACTIVATION_CODE';
        app.showMessage(message);
    }
}

function showgetOasUrlResult(xhttp) {
    app.debug('FUNCTION: showgetOasUrlResult');

    CheckWSError(xhttp);

    var response = b64_to_str(xhttp.response);

    // <code>S</code>
    // <message>OAS_DATA</message>
    // <jsonData>
    // {
    // "OasApiKey": "647346278346846823648",
    // "OasUrl": "http: //staging-uden.yob.nl"
    // }
    // </jsonData>

    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes

        // var resultJSON = JSON.parse(jsondata);
        var resultJSON = BRVUtil.parseJSON(jsondata);
        // var appJSON = resultJSON.json;

        app.oasurl = resultJSON.OasUrl;
        app.apikeyOAS = resultJSON.OasApiKey;

        app.AddToPhoneStorage('oaswsurl', resultJSON.OasUrl);
        app.AddToPhoneStorage('apikeyoas', resultJSON.OasApiKey);

        ActivateDevice_step2();

    } else { // Failed
        app.showError(message, 'function: showgetOasUrlResult');
    }
}


function renewOasUrl() {
    app.debug('FUNCTION: renewOasUrl');
    app.loadMessage = 'GET_OAS_SETTINGS';
    var activationcode = getOASActivationCode();
    if (activationcode != '') {
        var xmlRequest = '';
        xmlRequest += '<deviceId>' + app.deviceid + '</deviceId>';

        xmlRequest += '<deviceName>' + app.devicename + '</deviceName>'; // CHANGE IN WDS NEEDED!!!!!

        xmlRequest += '<appCode>' + app.productcode + '</appCode>';
        xmlRequest += '<appVersion>' + app.versionApp + '</appVersion>';
        // xmlRequest += '<activationCode>' + app.activationcode + '</activationCode>';
        xmlRequest += '<activationCode>' + activationcode + '</activationCode>';
        app.wsErrorCode = 'WDS002';
        app.doRequestWS('WDS', 'AppServices', 'getOasUrl', xmlRequest, showrenewOasUrlResult, showWSError);
    } else {
        var message = 'UNKNOWN_ACTIVATION_CODE';
        app.showError(message, 'function: renewOasUrl');
    }
}

function showrenewOasUrlResult(xhttp) {
    app.debug('FUNCTION: showrenewOasUrlResult');

    CheckWSError(xhttp);

    var response = b64_to_str(xhttp.response);
    // <code>S</code>
    // <message>OAS_DATA</message>
    // <jsonData>
    // {
    // "OasApiKey": "647346278346846823648",
    // "OasUrl": "http: //staging-uden.yob.nl"
    // }
    // </jsonData>
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        // var resultJSON = JSON.parse(jsondata);
        var resultJSON = BRVUtil.parseJSON(jsondata);
        app.oasurl = resultJSON.OasUrl;
        app.apikeyOAS = resultJSON.OasApiKey;
        app.AddToPhoneStorage('oaswsurl', resultJSON.OasUrl);
        app.AddToPhoneStorage('apikeyoas', resultJSON.OasApiKey);
        GetDeviceInfoV2();
    } else { // Failed
        app.showError(message, 'function: showrenewOasUrlResult');
    }
}


// -----
function saveUserActivation(jsonOBJ, wsseq) {
    // jsonOBJ:
    // {
    // 	"deviceId": "4200000000",
    // 	"deviceName": "Unknown Generic Generic",
    // 	"companyName": "ATY Test",
    // 	"city": "Plaats",
    // 	"startDate": "20160914",
    // 	"subscriptionNumber": "0995862722",
    // 	"subscribedQty": 5,
    // 	"usedQty": 5,
    // 	"avkey": "087048083103117077053049071099089069104086085113105066057078114073082079047120116107115043068050065076054051074055080052072122081121108097100098075067090084112119110088056101109111070102118106"
    // }

    var userActivationsStorage = app.GetFromPhoneStorage('userActivations');
    var userActivationsTMP, userActivations;
    if (BRVUtil.checkValue(userActivationsStorage)) {
        // userActivations = JSON.parse(userActivationsStorage);
        userActivations = BRVUtil.parseJSON(userActivationsStorage);
        // userActivationsTMP = JSON.parse(userActivationsStorage);
        userActivationsTMP = BRVUtil.parseJSON(userActivationsStorage);
    } else {
        userActivations = new Object();
        userActivations["activations"] = [];
        userActivationsTMP = new Object();
        userActivationsTMP["activations"] = [];
    }

    var addActivation = true;
    var registrationCnt = userActivations.activations.length;
    // Check if current activated user already exists!
    if (registrationCnt > 0) {
        for (var i = 0; i < registrationCnt; i++) {
            var curRecord = userActivations.activations[i];
            if (curRecord.activationuser == app.activationuser) {
                // Already exists, do not add!!
                addActivation = false;
            }
        }
    }

    // var isDemo = (app.GetFromPhoneStorage('isdemo') == 'true')?true:false;
    // var activationuser		= (isDemo) ? app.demoActivationUser : app.activationuser;
    // var activationcode		= (isDemo) ? app.demoActivationCode : app.activationcode;
    var activationuser = (app.isdemo) ? app.demoActivationUser : app.activationuser;
    var activationcode = (app.isdemo) ? app.demoActivationCode : app.activationcode;
    var deviceId = jsonOBJ.deviceId;
    var subscriptionNumber = jsonOBJ.subscriptionNumber;
    var yobSubscriptionNumber = jsonOBJ.yobSubscriptionNumber;
    var avkey = jsonOBJ.avkey;
    var oasurl = app.oasurl;
    var apikeyoas = app.apikeyOAS;
    var productcode = app.productcode;

    var IsAfUser = app.IsAfUser;

    //var delUserOnStartup	= (app.loginMethods['loginFidesqueSSO'] || app.loginMethods['loginFidesqueSSOdirect']) ? true : false;
    // Check logintype and set 'delUserOnStartup'
    var delUserOnStartup = (app.logintype == "loginFidesqueSSO" || app.logintype == "loginFidesqueSSOdirect") ? true : false;
    //var delUserOnStartup	= false;	// For now removed!!. Causes issue in portal when user switches applications!!!!

    // Add current activated user
    if (addActivation) {
        // {
        // 	"activations": [{
        // 		"activationuser": "tijssena@gmail.com",
        // 		"username": "tijssena@gmail.com",
        // 		"deviceId": "4200000000",
        // 		"subscriptionNumber": "0995862722",
        // 		"avkey": "075077112101103054102080067104118072085050113111084070081089071086105110114069116076051098047078090088048107066117099065087073115121109079082052049100083043097108106122068056119055057074120053"
        // 	}]
        // }
        // var activationuser		= app.activationuser;
        // var deviceId				= jsonOBJ.deviceId;
        // var subscriptionNumber	= jsonOBJ.subscriptionNumber;
        // var avkey				= jsonOBJ.avkey;
        // userActivationsTMP.activations.push( {"activationuser":activationuser, "username":activationuser, "activationcode": activationcode, "deviceId":deviceId, "subscriptionNumber":subscriptionNumber, "avkey":avkey, "wsseq":(wsseq)?wsseq:1, "oasurl":oasurl, "apikeyoas":apikeyoas, "productcode":productcode } );

        // userActivationsTMP.activations.push( {"activationuser":activationuser, "username":activationuser, "activationcode": activationcode, "deviceId":deviceId, "subscriptionNumber":subscriptionNumber, "avkey":avkey, "wsseq":(wsseq)?wsseq:1, "oasurl":oasurl, "apikeyoas":apikeyoas, "productcode":productcode, "delUserOnStartup":delUserOnStartup, "fidesqueid":FidesqueSSOLogin.claimed_id } );

        // userActivationsTMP.activations.push( {"activationuser":activationuser, "username":activationuser, "activationcode": activationcode, "deviceId":deviceId, "subscriptionNumber":subscriptionNumber, "avkey":avkey, "wsseq":(wsseq)?wsseq:1, "oasurl":oasurl, "apikeyoas":apikeyoas, "productcode":productcode, "delUserOnStartup":delUserOnStartup, "fidesqueid": FidesqueSSOLogin.claimed_id } );
        // userActivationsTMP.activations.push( {"activationuser":activationuser, "username":activationuser, "activationcode": activationcode, "deviceId":deviceId, "subscriptionNumber":subscriptionNumber, "avkey":avkey, "wsseq":(wsseq)?wsseq:1, "oasurl":oasurl, "apikeyoas":apikeyoas, "productcode":productcode, "delUserOnStartup":delUserOnStartup, "fidesqueid": FidesqueSSOLogin.claimed_id, "logintype": app.logintype } );
        userActivationsTMP.activations.push({ "activationuser": activationuser, "username": activationuser, "activationcode": activationcode, "deviceId": deviceId, "subscriptionNumber": subscriptionNumber, "yobSubscriptionNumber": yobSubscriptionNumber, "avkey": avkey, "wsseq": (wsseq) ? wsseq : 1, "oasurl": oasurl, "apikeyoas": apikeyoas, "productcode": productcode, "delUserOnStartup": delUserOnStartup, "fidesqueid": FidesqueSSOLogin.claimed_id, "logintype": app.logintype, "IsAfUser": IsAfUser });
    }
    app.AddToPhoneStorage('userActivations', JSON.stringify(userActivationsTMP));
    app.AddToPhoneStorage('deviceID', deviceId);
    app.AddToPhoneStorage('avkey', avkey);
    app.AddToPhoneStorage('subscription', subscriptionNumber);
    app.AddToPhoneStorage('YOBsubscription', yobSubscriptionNumber);
    app.AddToPhoneStorage('activeusername', activationuser);
    app.AddToPhoneStorage('productcode', productcode);
    app.AddToPhoneStorage('logintype', app.logintype);

    app.AddToPhoneStorage('IsAfUser', app.IsAfUser);

    BRVDatabase.successCallBack = null;
    BRVDatabase.updateUserActivations(JSON.stringify(userActivationsTMP));

    app.activeusername = activationuser;
    app.subscription = subscriptionNumber;
    app.YOBsubscription = yobSubscriptionNumber;
    BVW_Cryptor.setKey(avkey);

}

function removeUserActivation(username) {
    app.debug('FUNCTION: removeUserActivation:' + username);
    var isDeleted = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');
    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {
                    userActivations.activations.splice(i, 1); // Remove current record.
                    app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations));
                    BRVDatabase.updateUserActivations(JSON.stringify(userActivations));
                    isDeleted = true;
                    break;
                }
            }
            // app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations) );
        }
    }
    return isDeleted;
}

function updateUserData(username, wsseq, avkey, lstadmcode) {
    app.debug('FUNCTION: updateUserData:' + username);
    var isUpdated = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');
    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {

                    // wsseq
                    if (BRVUtil.checkValue(wsseq)) {
                        if (!userActivations.activations[i].wsseq) {
                            userActivations.activations[i]["wsseq"] = '';
                        }
                        userActivations.activations[i].wsseq = wsseq;
                        isUpdated = true;
                    }

                    // avkey
                    if (BRVUtil.checkValue(avkey)) {
                        if (!userActivations.activations[i].avkey) {
                            userActivations.activations[i]["avkey"] = '';
                        }
                        userActivations.activations[i].avkey = avkey;
                        isUpdated = true;
                    }

                    // lstadmcode
                    if (BRVUtil.checkValue(lstadmcode)) {
                        if (!userActivations.activations[i].lstadmcode) {
                            userActivations.activations[i]["lstadmcode"] = '';
                        }
                        userActivations.activations[i].lstadmcode = lstadmcode;
                        isUpdated = true;
                    }


                    // Save oasurl
                    if (!userActivations.activations[i].oasurl) {
                        userActivations.activations[i]["oasurl"] = '';
                    }
                    if (userActivations.activations[i].oasurl == app.oasurl) {
                        userActivations.activations[i].oasurl = app.oasurl;
                        isUpdated = true;
                    }
                    // Save apikeyoas
                    if (!userActivations.activations[i].apikeyoas) {
                        userActivations.activations[i]["apikeyoas"] = '';
                    }

                    if (userActivations.activations[i].apikeyoas != app.apikeyOAS) {
                        userActivations.activations[i].apikeyoas = app.apikeyOAS;
                        isUpdated = true;
                    }

                    // Save productcode
                    if (!userActivations.activations[i].productcode) {
                        userActivations.activations[i]["productcode"] = '';
                    }

                    if (userActivations.activations[i].productcode != app.productcode) {
                        userActivations.activations[i].productcode = app.productcode;
                        isUpdated = true;
                    }

                    // Save IsAfUser
                    if (!userActivations.activations[i].IsAfUser) {
                        userActivations.activations[i]["IsAfUser"] = app.IsAfUser;
                        isUpdated = true;
                    }

                    if (isUpdated) {
                        app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations));
                        BRVDatabase.successCallBack = null;
                        BRVDatabase.updateUserActivations(JSON.stringify(userActivations));
                    }

                    isUpdated = true;
                    break;
                }
            }
            // app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations) );
        }
    }
    return isUpdated;
}

function getUserData(username, dataid) {
    app.debug('FUNCTION: getUserData:' + username);
    var returnValue = '';
    var userActivations = app.GetFromPhoneStorage('userActivations');
    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {
                    if (BRVUtil.checkValue(dataid)) {
                        if (userActivations.activations[i][dataid]) {
                            returnValue = userActivations.activations[i][dataid];
                        }
                    }
                    break;
                }
            }
        }
    }
    return returnValue;
}

function findUserActivation(username) {
    app.debug('FUNCTION: findUserActivation:' + username);
    var found = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');
    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {
                    found = true;
                    break;
                }
            }
        }
    }
    return found;
}

function saveUserFilter(username, filterid, filtervalue) {
    app.debug('FUNCTION: saveUserFilter:' + username);
    var isUpdated = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {

                    if (!userActivations.activations[i].filter) {
                        userActivations.activations[i]["filter"] = [];
                    }

                    var addFilter = true;
                    for (var a = 0; a < userActivations.activations[i].filter.length; a++) {
                        if (userActivations.activations[i].filter[a].filterid == filterid) {
                            userActivations.activations[i].filter[a].filtervalue = filtervalue;
                            addFilter = false;
                        }
                    }
                    if (addFilter) {
                        userActivations.activations[i].filter.push({ 'filterid': filterid, 'filtervalue': filtervalue });
                    }

                    isUpdated = true;
                    break;
                }
            }
            app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations));
            BRVDatabase.successCallBack = null;
            BRVDatabase.updateUserActivations(JSON.stringify(userActivations));
        }
    }
    return isUpdated;
}

function getUserFilter(username, filterid) {
    app.debug('FUNCTION: getUserFilter:' + username);
    var filtervalue = '';
    var userActivations = app.GetFromPhoneStorage('userActivations');

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {
                    if (userActivations.activations[i].filter) {
                        for (var a = 0; a < userActivations.activations[i].filter.length; a++) {
                            if (userActivations.activations[i].filter[a].filterid == filterid) {
                                filtervalue = userActivations.activations[i].filter[a].filtervalue;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }
    return filtervalue;
}


function saveUserSort(username, sortid, sortvalue) {
    app.debug('FUNCTION: saveUserSort:' + username);
    var isUpdated = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {

                    if (!userActivations.activations[i].sort) {
                        userActivations.activations[i]["sort"] = [];
                    }

                    var addSort = true;
                    for (var a = 0; a < userActivations.activations[i].sort.length; a++) {
                        if (userActivations.activations[i].sort[a].sortid == sortid) {
                            userActivations.activations[i].sort[a].sortvalue = sortvalue;
                            addSort = false;
                            break;
                        }
                    }
                    if (addSort) {
                        userActivations.activations[i].sort.push({ 'sortid': sortid, 'sortvalue': sortvalue });
                    }

                    isUpdated = true;
                    break;
                }
            }
            app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations));
            BRVDatabase.successCallBack = null;
            BRVDatabase.updateUserActivations(JSON.stringify(userActivations));
        }
    }
    return isUpdated;
}

function getUserSort(username, sortid) {
    app.debug('FUNCTION: getUserSort:' + username);
    var sortvalue = '';
    var userActivations = app.GetFromPhoneStorage('userActivations');

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {
                    if (userActivations.activations[i].sort) {
                        for (var a = 0; a < userActivations.activations[i].sort.length; a++) {
                            if (userActivations.activations[i].sort[a].sortid == sortid) {
                                sortvalue = userActivations.activations[i].sort[a].sortvalue;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }
    return sortvalue;
}

function removeUserSort(username, sortid) {
    app.debug('FUNCTION: removeUserSort:' + username);
    var isUpdated = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {
                    if (userActivations.activations[i].sort) {
                        for (var a = 0; a < userActivations.activations[i].sort.length; a++) {
                            if (userActivations.activations[i].sort[a].sortid == sortid) {
                                userActivations.activations[i].sort.splice(a, 1); // Remove current record.
                                app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations));
                                BRVDatabase.successCallBack = null;
                                BRVDatabase.updateUserActivations(JSON.stringify(userActivations));
                                isUpdated = true;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            // app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations) );
        }
    }
    return isUpdated;
}


function clearUserView(username, clearFilter, clearSort, clearSearch) {
    app.debug('FUNCTION: clearUserView:' + username);
    var isUpdated = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {

                    // filter
                    if (clearFilter && userActivations.activations[i].filter) {
                        delete userActivations.activations[i]['filter'];
                        isUpdated = true;
                    }

                    // sort
                    if (clearSort && userActivations.activations[i].sort) {
                        delete userActivations.activations[i]['sort'];
                        isUpdated = true;
                    }

                    // search
                    if (clearSearch && userActivations.activations[i].search) {
                        delete userActivations.activations[i]['search'];
                        isUpdated = true;
                    }

                    if (isUpdated) {
                        app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations));
                        BRVDatabase.successCallBack = null;
                        BRVDatabase.updateUserActivations(JSON.stringify(userActivations));
                    }

                    break;
                }
            }
        }
    }
    return isUpdated;
}


function saveUserSearch(username, searchid, searchvalue) {
    app.debug('FUNCTION: saveUserSearch:' + username);
    var isUpdated = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');
    searchvalue = str_to_b64(searchvalue); // Encode string to Base64, otherwise " (quotes) will give some troubles!

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {

                    if (!userActivations.activations[i].search) {
                        userActivations.activations[i]["search"] = [];
                    }

                    var addSearch = true;
                    for (var a = 0; a < userActivations.activations[i].search.length; a++) {
                        if (userActivations.activations[i].search[a].searchid == searchid) {
                            userActivations.activations[i].search[a].searchvalue = searchvalue;
                            addSearch = false;
                            break;
                        }
                    }
                    if (addSearch) {
                        userActivations.activations[i].search.push({ 'searchid': searchid, 'searchvalue': searchvalue });
                    }

                    isUpdated = true;
                    break;
                }
            }
            app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations));

            BRVDatabase.successCallBack = null;
            BRVDatabase.updateUserActivations(JSON.stringify(userActivations));
        }
    }
    return isUpdated;
}

function getUserSearch(username, searchid) {
    app.debug('FUNCTION: getUserSearch:' + username);
    var searchvalue = '';
    var userActivations = app.GetFromPhoneStorage('userActivations');

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {
                    if (userActivations.activations[i].search) {
                        for (var a = 0; a < userActivations.activations[i].search.length; a++) {
                            if (userActivations.activations[i].search[a].searchid == searchid) {
                                // searchvalue = userActivations.activations[i].search[a].searchvalue;
                                searchvalue = b64_to_str(userActivations.activations[i].search[a].searchvalue); // Decode B64 to str
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }
    return searchvalue;
}

function removeUserSearch(username, searchid) {
    app.debug('FUNCTION: removeUserSearch:' + username);
    var isUpdated = false;
    var userActivations = app.GetFromPhoneStorage('userActivations');

    if (BRVUtil.checkValue(userActivations)) {
        // userActivations = JSON.parse(userActivations);
        userActivations = BRVUtil.parseJSON(userActivations);
        var registrationCnt = userActivations.activations.length;
        if (registrationCnt > 0) {
            for (var i = 0; i < userActivations.activations.length; i++) {
                var curRecord = userActivations.activations[i];
                if (curRecord.username == username) {
                    if (userActivations.activations[i].search) {
                        for (var a = 0; a < userActivations.activations[i].search.length; a++) {
                            if (userActivations.activations[i].search[a].searchid == searchid) {
                                userActivations.activations[i].search.splice(a, 1); // Remove current record.
                                app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations));
                                BRVDatabase.successCallBack = null;
                                BRVDatabase.updateUserActivations(JSON.stringify(userActivations));
                                isUpdated = true;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            // app.AddToPhoneStorage('userActivations', JSON.stringify(userActivations) );
        }
    }
    return isUpdated;
}

function checkWhatsNew(jsonStr) {
    // Check if there's a whatsnew
    if (BRVUtil.checkValue(jsonStr)) {
        var jsonTmp = JSON.parse(jsonStr);
        if (jsonTmp.app.whatsnew) {
            app.showWhatsNewOnStart = true;
        }
    }
}
// -----



function GetLocalAppDefinition() {
    // app.startLoading('LOCAL_APP_DEFINITION');
    // require("js/_BRVDemoApp.js", SetLocalAppDefinition);
    // require("js/_BRVBoekhAppTest.js", SetLocalAppDefinition);
    // require("js/_BRVBoekhAppTest.js", SetLocalAppDefinition);
    // require("js/_BRVFieldValueFunctionTest.js", SetLocalAppDefinition);
}

function SetLocalAppDefinition() {
    // Do some patching in app definition
    myJSONObject = modifyAppJSON(myJSONObject);

    var myJSONString = JSON.stringify(myJSONObject);
    // **********************
    // console.log(myJSONString);
    // **********************
    var myJSONStringB64 = window.btoa(unescape(encodeURIComponent(myJSONString))); // When JSON is downloaded directly from App Builder!
    // var myJSONStringB64 = str_to_b64( myJSONString );
    jsonObject = myJSONObject;
    app.appJSON = myJSONString;
    app.versionJSON = jsonObject.app.version;
    app.versionJSONStatus = 9;
    app.AddToPhoneStorage('appjson', myJSONStringB64);
    app.AddToPhoneStorage('appjsonversion', app.versionJSON);
    app.AddToPhoneStorage('appjsonversionstatus', app.versionJSONStatus);

    // Check if there's a whatsnew
    checkWhatsNew(app.appJSON);

    startApplication('getappdefinitionTrue');
}

function GetAppDefinition() {
    app.debug('FUNCTION: getAppDefinition');

    app.loadMessage = 'INITIAL_APP_DEFINITION';

    // versionApp		: Version of app
    // versionJSON		: Version of JSON

    // GET http://staging-uden.yob.nl/REST/wds/?service=AppServices&action=getAppDefiniton&request=ICAgICAgICAgPGFwaUtleT40MDczMWY0NGRmMjlkNzI1Y2E1NDEzNmM3YmNmOTgzODwvYXBpS2V5Pg0KICAgICAgICAgPGRldmljZUlkPnRlc3Rlc3Q1NmNjYzwvZGV2aWNlSWQ%2BDQogICAgICAgICA8YXZTZXJpYWxOdW1iZXI%2BQVYxMjM0NTY3QTwvYXZTZXJpYWxOdW1iZXI%2BDQogICAgICAgICA8YXBwQ29kZT5NT0JJTEU8L2FwcENvZGU%2BDQogICAgICAgICA8YXBwVmVyc2lvbj4xLjA8L2FwcFZlcnNpb24%2BDQogICAgICAgICA8c3Vic2NyaXB0aW9uTnVtYmVyPjY3Njc2NzgyMjwvc3Vic2NyaXB0aW9uTnVtYmVyPg%3D%3D&encode=false

    //			<apiKey>40731f44df29d725ca54136c7bcf9838</apiKey>
    //			<deviceId>testest56ccc</deviceId>
    //			<avSerialNumber>AV1234567A</avSerialNumber>
    //			<appCode>MOBILE</appCode>
    //			<appVersion>1.0</appVersion>
    //			<subscriptionNumber>676767822</subscriptionNumber>


    // {"response": "<code>S</code><message>APP_DEFINITION</message><jsonData>{"appVersion":"1.0","appStatus":9,"vendor":"BrancheView","jsonVersion":"0.99","jsonStatus":9,"json":"eyJhcHAiOnsi.....fV19"}</jsonData>"}

    var xmlRequest = '';
    xmlRequest += '<apiKey>' + app.apikey + '</apiKey>';
    xmlRequest += '<deviceId>' + app.deviceid + '</deviceId>';
    xmlRequest += '<avSerialNumber>' + app.avserial + '</avSerialNumber>';
    xmlRequest += '<appCode>' + app.productcode + '</appCode>';
    xmlRequest += '<appVersion>' + app.versionApp + '</appVersion>';
    xmlRequest += '<subscriptionNumber>' + app.subscription + '</subscriptionNumber>';
    xmlRequest += '<status>' + app.deviceStatus + '</status>';
    app.wsErrorCode = 'WDS003';
    app.doRequestWS('WDS', 'AppServices', 'getAppDefiniton', xmlRequest, showGetAppDefinitionResult, showWSError);
}

function showGetAppDefinitionResult(xhttp) {
    app.debug('FUNCTION: showGetAppDefinitionResult');

    CheckWSError(xhttp);

    var response = b64_to_str(xhttp.response);

    // <code>S</code>
    // <message>APP_DEFINITION</message>
    // <jsonData>
    // {
    // "appVersion": "1.0",
    // "appStatus": 9,
    // "vendor": "BrancheView",
    // "jsonVersion": "0.99",
    // "jsonStatus": 9,
    // "json": "eyJhcHAiOnsidmVyc2lvbiI6IjEuMCIsIm5hbWUiOiJCcmFuY2hlVmlldyIsInN0....."
    // }</jsonData>

    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        var resultJSON = BRVUtil.parseJSON(jsondata);

        // var appJSON = resultJSON.json;
        // app.appJSON = b64_to_str(appJSON);

        app.versionJSON = resultJSON.jsonVersion;
        app.versionJSONStatus = resultJSON.jsonStatus;

        // Do some patching in app definition
        var appJSONStr = b64_to_str(resultJSON.json);
        var appJSONObj = modifyAppJSON(BRVUtil.parseJSON(appJSONStr));
        app.appJSON = JSON.stringify(appJSONObj);

        // app.AddToPhoneStorage('appjson', appJSON);
        app.AddToPhoneStorage('appjson', str_to_b64(app.appJSON));
        app.AddToPhoneStorage('appjsonversion', resultJSON.jsonVersion);
        app.AddToPhoneStorage('appjsonversionstatus', resultJSON.jsonStatus);
        startApplication('getappdefinitionTrue');

        // Check if there's a whatsnew
        checkWhatsNew(app.appJSON);

    } else { // Failed
        app.lastErrorMsg = message;
        startApplication('getappdefinitionFalse');
    }
}
// -----------------------------------------------------------------------------------------------


function GetLastAppVersion() {
    app.debug('FUNCTION: getLastAppVersion');
    app.loadMessage = 'UPDATE_APP_DEFINITION';

    // GET http://staging-uden.yob.nl/REST/wds/?service=AppServices&action=getLastAppVersion&request=ICAgICAgICAgPGFwaUtleT40MDczMWY0NGRmMjlkNzI1Y2E1NDEzNmM3YmNmOTgzODwvYXBpS2V5Pg0KICAgICAgICAgPGRldmljZUlkPnRlc3Rlc3Q1NmNjYzwvZGV2aWNlSWQ%2BDQogICAgICAgICA8YXZTZXJpYWxOdW1iZXI%2BQVYxMjM0NTY3QTwvYXZTZXJpYWxOdW1iZXI%2BDQogICAgICAgICA8YXBwQ29kZT5NT0JJTEU8L2FwcENvZGU%2BDQogICAgICAgICA8YXBwVmVyc2lvbj4xLjA8L2FwcFZlcnNpb24%2BDQogICAgICAgICA8c3Vic2NyaXB0aW9uTnVtYmVyPjY3Njc2NzgyMjwvc3Vic2NyaXB0aW9uTnVtYmVyPg%3D%3D&encode=false
    //			<apiKey>40731f44df29d725ca54136c7bcf9838</apiKey>
    //			<deviceId>testest56ccc</deviceId>
    //			<avSerialNumber>AV1234567A</avSerialNumber>
    //			<appCode>MOBILE</appCode>
    //			<appVersion>1.0</appVersion>
    //			<subscriptionNumber>676767822</subscriptionNumber>

    // {"response": "<code>S</code><message>APP_VERSION</message><jsonData>{"appVersion":"1.0","appStatus":9,"vendor":"BrancheView","jsonVersion":"0.99","jsonStatus":9}</jsonData>"}
    // appStatus/jsonStatus 1,2,9 (Development, Text, Productie) (Net als WEPs)

    //		activationServiceResponse getDeviceInfo(
    //			@WebParam(name = "apiKey") String apiKey,
    //			@WebParam(name = "productCode") String productCode,
    //			@WebParam(name = "deviceId") String deviceId)

    var xmlRequest = '';
    xmlRequest += '<apiKey>' + app.apikey + '</apiKey>';
    xmlRequest += '<deviceId>' + app.deviceid + '</deviceId>';
    xmlRequest += '<avSerialNumber>' + app.avserial + '</avSerialNumber>';
    xmlRequest += '<appCode>' + app.productcode + '</appCode>';
    xmlRequest += '<appVersion>' + app.versionApp + '</appVersion>';
    xmlRequest += '<subscriptionNumber>' + app.subscription + '</subscriptionNumber>';
    xmlRequest += '<status>' + app.deviceStatus + '</status>';
    app.wsErrorCode = 'WDS004';
    app.doRequestWS('WDS', 'AppServices', 'getLastAppVersion', xmlRequest, showGetLastAppVersionResult, showWSError);
}

function showGetLastAppVersionResult(xhttp) {
    app.debug('FUNCTION: showGetLastAppVersionResult');

    CheckWSError(xhttp);

    var response = b64_to_str(xhttp.response);

    // <code>S</code>
    // <message>APP_VERSION</message>
    // <jsonData>
    // {
    // "appVersion": "1.0",
    // "appStatus": 9,					// 1,2,9 (Development, Test, Productie)
    // "vendor": "BrancheView",
    // "jsonVersion": "0.99",
    // "jsonStatus": 9					// 1,2,9 (Development, Test, Productie)
    // }
    // </jsonData>

    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

    if (succes.toUpperCase() == 'S') { // Succes
        // var resultJSON = JSON.parse(jsondata);
        var resultJSON = BRVUtil.parseJSON(jsondata);
        if (app.versionJSON != resultJSON.jsonVersion) {
            app.debug('FUNCTION: getLastAppVersion, Current version: ' + app.versionJSON + ', New version: ' + resultJSON.jsonVersion);
            app.updateJSON = true;
            startApplication('getdeviceinfoTrue');
        } else {
            app.updateJSON = false;
        }
    } else { // Failed
        app.lastErrorMsg = message;
        app.updateJSON = false;
        startApplication('getappdefinitionFalse');
    }
}

function modifyAppJSON(JSONObj) {
    app.debug('FUNCTION: modifyAppJSON');


    // Try to modify current app definition, when it fails return original!
    try {

        var tmpJSONObj = JSON.parse(JSON.stringify(JSONObj));

        // var startScreen = getAppStartScreen(tmpJSONObj.app.startscreen);

        for (var i = 0; i < tmpJSONObj.screens.length; i++) {
            // console.log( 'ScreenID: ', tmpJSONObj.screens[i].id );

            // // Find app startscreen
            // if ( BRVUtil.checkValue(startScreen) && tmpJSONObj.screens[i].id == startScreen ) {
            // 	// Try to find 'Administraties' button and modify
            // 	for (var buttonI=0; buttonI<tmpJSONObj.screens[i].content.buttons.length; buttonI++ ) {
            // 		var buttonName = tmpJSONObj.screens[i].content.buttons[buttonI].name;
            // 		var buttonOnclickScreen = tmpJSONObj.screens[i].content.buttons[buttonI].onclick.screen;
            // 		if ( buttonName.toLowerCase() == 'administraties' && buttonOnclickScreen.toLowerCase() == 'adminselect' ) {
            // 			// console.log('Adminselect button found!!');
            // 			// console.log('button: ', JSON.stringify( tmpJSONObj.screens[i].content.buttons[buttonI] ) );

            // 			tmpJSONObj.screens[i].content.buttons[buttonI].name = 'Bedrijven';

            // 			var newAdminButton = {};
            // 			newAdminButton['_type'] 					= 'toolbtn';
            // 			newAdminButton['icon'] 						= 'bullets';
            // 			newAdminButton['name'] 						= '<*adm_beg_year>';
            // 			newAdminButton['access'] 					= '';
            // 			newAdminButton['onclick'] 					= {};
            // 			newAdminButton.onclick['action']			= 'GotoScreen';
            // 			newAdminButton.onclick['screenparam']		= '|clear|';
            // 			newAdminButton.onclick['screen']			= 'adminselect';
            // 			newAdminButton.onclick['screenmode']		= 'show';
            // 			newAdminButton['bubblecountquery'] 			= {};
            // 			newAdminButton.bubblecountquery['query'] 	= 'eyJTZWxlY3QiOnsiV2hlcmUiOiI8d2hlcmU+In19';

            // 			// Add new adminselect button to screenbuttons
            // 			tmpJSONObj.screens[i].content.buttons.push(newAdminButton);

            // 			break;
            // 		}
            // 	} 
            // }

            // Modify settingspanel
            if (tmpJSONObj.screens[i].id == 'settingspanel') {

                // Find buttons
                for (var b = 0; b < tmpJSONObj.screens[i].content.buttons.length; b++) {

                    // DEMO mode
                    if (app.isdemo) {
                        // Remove button 'Toegangscode wijzigen'
                        if (tmpJSONObj.screens[i].content.buttons[b].id == 'changepassword') {
                            tmpJSONObj.screens[i].content.buttons.splice(b, 1);
                        }
                    }

                    // Button 'Wachtwoord wijzigen'
                    if (tmpJSONObj.screens[i].content.buttons[b].id == 'changepassword') {
                        tmpJSONObj.screens[i].content.buttons[b].name = 'Toegangscode wijzigen';
                    }
                    // Button 'Gebruiker afmelden'
                    if (tmpJSONObj.screens[i].content.buttons[b].id == 'resetapp') {
                        // tmpJSONObj.screens[i].content.buttons[b].name = '';
                    }
                    // Button 'Afsluiten'
                    if (tmpJSONObj.screens[i].content.buttons[b].id == 'closeapp') {
                        // Is it's multiuser change label name
                        if (app.checkmultiuser() && tmpJSONObj.screens[i].content.buttons[b].name == 'Afsluiten') {
                            tmpJSONObj.screens[i].content.buttons[b].name = 'Afsluiten/Uitloggen';
                        }
                    }

                    // If it's AppInBrowser modify some buttons/screens!
                    if (BRVUtil.isBrowser()) {
                        // Remove button 'Instellingen wijzigen'
                        //if (tmpJSONObj.screens[i].content.buttons[b].id == 'changeusersettings') {
                        //    tmpJSONObj.screens[i].content.buttons.splice(b, 1);
                        //}

                        // Rename button 'Afsluiten'
                        if (tmpJSONObj.screens[i].content.buttons[b].id == 'closeapp') {
                            tmpJSONObj.screens[i].content.buttons[b].name = 'Herstarten';
                        }
                    }
                    //

                }
            }

        }
        return tmpJSONObj;

    } catch (e) {
        // var JSONObj = JSON.parse( JSON.stringify(JSONObj) );
        return JSONObj;
    }
}


function checkValidAppJSON() {
    app.debug('FUNCTION: checkValidAppJSON');
    // Clear app div's
    $('#header').empty();
    $('#content_table').empty();
    $('#footer').empty();


    // Build default JSON object, for errorscreens etc...
    var appJSONDefault = app.appJSONDefault;
    if (BRVUtil.checkValue(appJSONDefault)) {
        app.JSONObjectDefault['app'] = appJSONDefault.app;
        app.JSONObjectDefault['screens'] = appJSONDefault.screens;
    }
    // Build default JSON object, for errorscreens etc...

    var appJSON = app.appJSON;
    if (BRVUtil.checkValue(appJSON)) {
        // appJSON = JSON.parse(appJSON);
        appJSON = BRVUtil.parseJSON(appJSON);
    }

    if (typeof appJSON == 'object') {
        // Store name of APP
        app.nameApp = appJSON.app.name;
        // Store app JSON
        app.JSONObject['app'] = appJSON.app;
        // Store screen JSON
        app.JSONObject['screens'] = appJSON.screens;

        // Set loggedin to false
        // 		app.deviceloggedin = false;

        // if (app.checkPassword) {
        if (app.checkPassword || app.checkPincode) {
            app.deviceloggedin = false;
        }

        // Start application
        buildAppFromJSON(); // Moved to 'getAVLicense'

    } else {
        // Get new app JSON when there's no JSON available on the phone
        app.showError('APP_JSON_ERROR', 'function: checkValidAppJSON');
    }
}

function setAppTitle(title) {
    app.debug('FUNCTION: setAppTitle, title:' + title);

    // Check if it's startscreen then set ap title to admin name if available.
    // if ( app.startScreen == app.JSONObject['screen'].id ) {
    // If screen is app startscreen and screen title is empty or title does not contain < and > char, then replace with adm_desc
    if (app.startScreen == app.JSONObject['screen'].id) {
        //var adm_desc = app.GetFromPhoneStorage('adm_desc');
        //title = (adm_desc!='') ? adm_desc : title;

        // If title does contain < and > chars, then try to replace these vars!
        if (title.indexOf('<') >= 0 && title.indexOf('>') >= 0) {
            title = replaceAllVarsInText(title);
        } else {
            // There where no vars in title, so we set adm_desc as title!
            var adm_desc = app.GetFromPhoneStorage('adm_desc');
            title = (adm_desc != '') ? adm_desc : title;
        }

        //Set title visible
        $('#apptitle').css('visibility', 'visible');
    }

    // Set app title
    $('#apptitle').text(title);

    // If apptitle does not contain any variables (<var>) then make visible.
    // otherwise it will be visible after replacing vars.
    if (title.indexOf('<') < 0 && title.indexOf('>') < 0) {
        $('#apptitle').css('visibility', 'visible');
    }

    // When development or test set title background-color!
    if (app.deviceStatus == 1 || app.deviceStatus == 2) {
        $('#apptitle').css('background-color', '#FF0000');
    }

    // If app is in impersonation mode, then set title background-color!
    if (app.ImpersionationUserID) {
        $('#apptitle').css('color', '#FF00FF');
    }

}


function createAppHeader() {
    app.debug('FUNCTION: createAppHeader');

    // Clear old header
    $('#header').empty();
    $('#header').height('');


    // Restore padding top/bottom
    // $("#page-home").css({"padding-top":'45px', "padding-bottom":'50px'}); // Recreate the screen, apply styles

    // Get app JSON from app vars.
    var JSONObject = (app.JSONObject['app']) ? app.JSONObject['app'] : app.JSONObjectDefault['app'];
    if (JSONObject) {
        // Define output var
        var output = '';

        // App title
        output += '<h1 id="apptitle" style="visibility:hidden">' + JSONObject.name + '</h1>';

        // Search field
        output += '<div id="searchdivOuter" class="searchdivOuter">';

        // output += '<div style="float: right; padding-right:5px; padding-top:2px;display:none" id="filterButtonDiv"><a href="#" onclick="javascript:void(0);" id="filterButton" name="filterButton" class="ui-btn ui-icon-filter ui-btn-icon-notext ui-corner-all">No text</a></div>';

        output += '<div id="searchdiv" class="searchdiv" style="display:none"></div>';

        output += '</div>';

        // Filter
        // output += '<div id="filtersortdiv" class="filtersortdiv" style="display:none"></div>';
        output += '<div id="filtersortdiv" class="filtersortdiv" style="display:none; position: absolute; z-index:1"></div>';

        // Header info field
        output += '<div id="headerinfodiv" style="display:none; visibility:hidden; padding-right:5px; padding-top:10px; width:100%;" resizedone="0"></div>';

        // Columntitles
        // output += '<div id="columntitlediv" class="columntitlediv" style="height:26px; display:none;" resizedone="0"></div>';
        output += '<div id="columntitlediv" class="columntitlediv" style="display:none;" resizedone="0"></div>';

        if (app.activated) {
            // Header buttons
            var buttonOBJ = JSONObject.buttons;
            if (typeof buttonOBJ != 'undefined') {
                for (var btni = 0; btni < buttonOBJ.length; btni++) {
                    var buttonID = buttonOBJ[btni].id;
                    var buttonName = buttonOBJ[btni].name;
                    var buttonIcon = buttonOBJ[btni].icon;
                    var buttonPosition = buttonOBJ[btni].position;
                    var buttonOnclick = buttonOBJ[btni].onclick;
                    if (typeof buttonOnclick != 'undefined') {
                        output += '<a href="#" ';

                        output += (buttonOnclick.action == 'ActivatePanel' && buttonOnclick.actionid != '') ? ' onclick="javascript:buildPanelFromJSON(\'' + buttonOnclick.actionid + '\')" ' : '';

                        if (buttonID == 'homebutton') {
                            if (app.deviceloggedin) {
                                var screenID = getAppStartScreen(JSONObject.startscreen);
                                output += (buttonOnclick.action == 'GotoScreen' && buttonOnclick.screen != '') ? ' onclick="javascript:getScreenFromJSON(\'' + screenID + '\', \'\', \'' + buttonOnclick.screenmode + '\')" ' : '';
                            } else {
                                output += 'onclick="javascript:void(0)"';
                            }
                        } else {
                            output += (buttonOnclick.action == 'GotoScreen' && buttonOnclick.screen != '') ? ' onclick="javascript:getScreenFromJSON(\'' + buttonOnclick.screen + '\', \'\', \'' + buttonOnclick.screenmode + '\')" ' : '';
                        }

                        output += (buttonOnclick.action == 'ShowMessage' && buttonOnclick.message != '') ? ' onclick="javascript:app.showMessage(\'' + b64_to_str(buttonOnclick.message) + '\')" ' : '';

                        output += (buttonOnclick.action == 'CallFunction' && buttonOnclick.message != '') ? ' onclick="javascript:CallFunction(\'' + buttonID + '\', \'' + buttonOnclick.func + '\')" ' : '';

                        // Make button class
                        var tmpClass = '';
                        tmpClass += (buttonPosition != '') ? ' ui-btn-' + buttonPosition + ' ' : '';
                        tmpClass += (buttonIcon != '') ? ' ui-icon-' + buttonIcon + ' ' : '';

                        output += ' class="' + genIconClassName(buttonOBJ[btni], tmpClass) + '" ';
                        output += ' id=' + buttonID + ' ';
                        output += ' >' + buttonName + '</a>';
                    }
                }
            }
        }

        // Add to header
        $('#header').append(output);
        $("#header").trigger("create"); // Recreate the screen, apply styles
    }

    // Reset page-home top padding
    setTimeout(function() {
        // $("#page-home").css({"padding-top":''+$("#header").height()+'px'}); // Recreate the screen, apply styles
    }, 50);
}

function buildAppFromJSON() {
    // var doContinue = true;
    app.debug('FUNCTION: buildAppFromJSON');

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['app'];
    if (app.activated) {
        // if (app.checkPassword && !app.deviceloggedin) {
        if ((app.checkPassword || app.checkPincode) && !app.deviceloggedin) {
            // Render login screen
            getScreenFromJSON('authenticate');
        } else {
            // Render first screen
            // app.startScreen = getAppStartScreen(JSONObject.startscreen);
            // getScreenFromJSON(app.startScreen);
            if (BRVUtil.checkValue(JSONObject.startscreen)) {
                // app.startScreen = getAppStartScreen(JSONObject.startscreen);
                // getScreenFromJSON(app.startScreen);
                // app.deviceloggedin = true;

                // Start mainscreen
                if (!app.pincodeMandatory && !app.checkPincode) {
                    app.startScreen = getAppStartScreen(JSONObject.startscreen);
                    getScreenFromJSON(app.startScreen);
                    app.deviceloggedin = true;
                } else
                // Check if we need to set pincode first
                if (app.pincodeMandatory && !app.checkPincode) {
                    getScreenFromJSONDefault('changepincode', false);
                }
                //Check if we need to show the whatsnew!!
                if (app.showWhatsNewOnStart) {
                    // if (!app.pincodeMandatory && !app.checkPincode && app.showWhatsNewOnStart) {
                    // var whatsnewMessage = BRVUtil.replaceAll(JSONObject.whatsnew, '\n', '<br>');
                    var whatsnewMessage = JSONObject.whatsnew.replace(/\r?\n|\r/g, '<br />'); // Replace all CRLF

                    //Check if we need to replace some vars in the whatsnew text!
                    whatsnewMessage = replaceVarsInText(whatsnewMessage);

                    var whatsnew = '';
                    whatsnew += '<div data-role="page" data-dialog="true" id="whatsnew" isPopupScreen="true">';
                    whatsnew += '    <div data-role="header">';
                    whatsnew += '    	<h2>What\'s New</h2>';
                    whatsnew += '    </div>';
                    whatsnew += '    <div class="ui-content" role="main">';
                    whatsnew += '    <form>';
                    whatsnew += '        <div>';
                    whatsnew += '            <p>' + whatsnewMessage + '</p>';
                    whatsnew += '            <button id="closewhatsnew" type="button" onclick="javascript:jQuery.mobile.back();">Sluiten</button>';
                    whatsnew += '        </div>';
                    whatsnew += '    </form>';
                    whatsnew += '    </div>';
                    whatsnew += '</div>';
                    ($('#whatsnew').length == 0) ? $("body").append(whatsnew): '';
                    $(":mobile-pagecontainer").pagecontainer("change", "#whatsnew");

                    app.showWhatsNewOnStart = false;
                }

            }
        }
    } else {
        // Device not activated, then start activate screen
        getScreenFromJSON('activatedevice');
    }
}


function getAppStartScreen(startScreenObj) {
    startScreenObj = (startScreenObj) ? startScreenObj : JSONObject.startscreen;
    var startScreen = '';
    if (typeof startScreenObj == 'object') {
        var screenIDfromStorage = app.GetFromPhoneStorage('startscreen');
        if (BRVUtil.checkValue(screenIDfromStorage)) {
            // Set startscreen from storage
            for (var i = 0; i < startScreenObj.length; i++) {
                var startScreenObjID = startScreenObj[i].id;
                // Check if startscreen from storage is in startScreenObj, else get first id of startScreenObj
                if (startScreenObjID == screenIDfromStorage) {
                    startScreen = screenIDfromStorage;
                }
            }
            if (!BRVUtil.checkValue(startScreen)) {
                // If startscreen from storage was not in startScreenObj then remove it from storage and set to first id
                app.RemoveFromPhoneStorage('startscreen');
                startScreen = startScreenObj[0].id;
            }
        } else {
            // No startscreen found in storage, so get first of object.
            startScreen = startScreenObj[0].id;
        }
    } else {
        startScreen = startScreenObj;
    }
    return startScreen;
}

function setAppStartScreen(startScreen, reload) {
    if (BRVUtil.checkValue(startScreen)) {
        app.startScreen = startScreen;
        app.AddToPhoneStorage('startscreen', startScreen);
    }
    if (reload) {
        // getScreenFromJSON(app.startScreen);
        startApplication('init');
    }
}


function getScreenFromJSON(screenID, param, mode, skipChecks, skipSaveRoute, buttonID) {

    try {
        // If screenID is empty, then get startscreen from JSONObject
        var JSONObject = (app.JSONObject['app']) ? app.JSONObject['app'] : app.JSONObjectDefault['app'];
        if (screenID == '') {
            screenID = JSONObject.startscreen[0].id;
        }
    } catch (e) {}


    /*    if (!checkButtonEmptyMandatoryFields(buttonID)) {*/
    if (BRVUtil.checkValue(screenID) && !checkButtonEmptyMandatoryFields(buttonID)) {

        $('#footer').show(); // Loginmethods screen has hide the footer, set visible again!!

        // Check if there's a internet connection.
        if ((app.isOnline && app.checkNetwork()) || jQuery.inArray(screenID, ['startmainscreen', 'appinfo']) >= 0) {
            // getScreenFromJSON_step1(screenID, param, mode, skipChecks, skipSaveRoute, buttonID);

            // 'changepassword' is systemscreen in appdefinition.
            // 'changepincode' now is defaultscreen in app. When 'changepassword' screen is called, then goto 'changepincode' screen instead!
            if (screenID == 'changepassword') {
                getScreenFromJSONDefault('changepincode', false);
            } else {
                getScreenFromJSON_step1(screenID, param, mode, skipChecks, skipSaveRoute, buttonID);
            }

        } else {
            app.showMessage('NO_INTERNET_CONNECTION');
        }

    } else {
        // Do nothing!!
    }
}


function getScreenFromJSON_step1(screenID, param, mode, skipChecks, skipSaveRoute, buttonID) {
    var doContinue = true;
    var buttonUseSelect = false;
    var buttonQuestion = '';
    var buttonCancelMsg = '';
    var JSONObject;
    var buttonMaxSelectItems = '';
    var buttonMaxSelectItemsMsg = '';
    var selectedItemsLimit = false;

    // Check if panel is active, close it first!
    var panelActive = $('[data-role="panel"]').hasClass('ui-panel-open'); // Find panel
    if (panelActive) {
        // If panel is active close it.
        var panelID = $('[data-role="panel"]')[0].id;
        $("#" + panelID).panel("close");
    }

    //Change for adding formfield values to footer button parameters
    if (BRVUtil.Left(param, 4) == 'b64|') { // If encoded params, then decode add new params and encode again!
        param = param.replace('b64|', '');
        param = b64_to_str(param);
        JSONObject = app.JSONObject['screen'];
        var tmpValueParams = param.split('|');
        var tmpValueNew = '';
        var tmpfldValue = '';
        var tmpOrigFld = '';
        for (var a = 0; a < tmpValueParams.length; a++) {
            if (BRVUtil.checkValue(tmpValueParams[a])) {
                tmpValueNew = tmpValueParams[a];
                var tmpValueFields = tmpValueNew.split('=');

                //if (BRVUtil.checkValue(tmpValueFields[1])) {
                // Check if there's a value and param is not 'clearbuffer'
                if (BRVUtil.checkValue(tmpValueFields[1]) && tmpValueFields[0] != 'clearbuffer') {
                    // Get data from Form fields
                    if (BRVUtil.checkValue(JSONObject.content.fields)) {
                        var fields = JSONObject.content.fields;
                        var nfields = fields.length;
                        for (var fldi = 0; fldi < nfields; fldi++) {
                            var fldID = fields[fldi].id;
                            tmpOrigFld = tmpValueFields[1];

                            var tmpValueFieldName = tmpValueFields[1].replace('<', '').replace('>', '');

                            if (fldID == tmpValueFieldName) {
                                // Check if it's <p> then get text, else get val
                                // if ( $('#' + fldID).is("p") ) {
                                // 	tmpfldValue = $('#' + fldID).text();
                                // } else {
                                // 	tmpfldValue = $('#' + fldID).val();
                                // }

                                if ($('#' + fldID).is("p")) {
                                    tmpfldValue = $('#' + fldID).text();
                                } else if ($('#' + fldID).is(':checkbox')) {
                                    tmpfldValue = $('#' + fldID).prop('checked') ? 'on' : 'off';
                                } else {
                                    tmpfldValue = $('#' + fldID).val();
                                }

                                tmpfldValue = BRVUtil.checkUnicode(tmpfldValue);

                                //Escape quotes
                                tmpfldValue = BRVUtil.escapeQuotes(tmpfldValue);

                                //Trim spaces
                                tmpfldValue = BRVUtil.alltrim(tmpfldValue);

                                param = param.replace(tmpOrigFld, tmpfldValue);
                            }
                        }
                    }
                }
            }
        }
        param = 'b64|' + str_to_b64(param);
    }


    // Check for button
    if (BRVUtil.checkValue(buttonID)) {
        // Get app JSON from app vars
        var buttonFound = false;
        var objID = app.JSONObject['screen'].id;
        JSONObject = app.JSONObject['screen'];
        buttonUseSelect = '';
        buttonQuestion = '';
        buttonCancelMsg = '';
        //var buttonMaxSelectItems = '';
        //var buttonMaxSelectItemsMsg = '';
        var buttonOBJ = '';

        // Try to find button in footer
        if (!buttonFound) {
            buttonOBJ = JSONObject.content.buttons;
            if (typeof buttonOBJ != 'undefined') {
                for (var btni = 0; btni < buttonOBJ.length; btni++) {
                    if (buttonID == buttonOBJ[btni].id) {
                        buttonUseSelect = BRVUtil.isBool(buttonOBJ[btni].onclick.useselect);
                        buttonQuestion = buttonOBJ[btni].onclick.question;
                        buttonCancelMsg = buttonOBJ[btni].onclick.cancelmsg;
                        buttonMaxSelectItems = buttonOBJ[btni].onclick.maxselectitems;
                        buttonMaxSelectItemsMsg = buttonOBJ[btni].onclick.maxselectitemsmsg;
                        buttonFound = true;
                        break;
                    }
                }
            }
        }

        // Try to find button in form
        if (!buttonFound) {
            buttonOBJ = JSONObject.content.fields;
            if (typeof buttonOBJ != 'undefined') {
                for (var btni1 = 0; btni1 < buttonOBJ.length; btni1++) {
                    if (buttonID == buttonOBJ[btni1].id) {
                        buttonUseSelect = BRVUtil.isBool(buttonOBJ[btni1].onclick.useselect);
                        buttonQuestion = buttonOBJ[btni1].onclick.question;
                        buttonCancelMsg = buttonOBJ[btni1].onclick.cancelmsg;
                        buttonMaxSelectItems = buttonOBJ[btni1].onclick.maxselectitems;
                        buttonMaxSelectItemsMsg = buttonOBJ[btni1].onclick.maxselectitemsmsg;
                        buttonFound = true;
                        break;
                    }
                }
            }
        }

    }

    // Check if button needs selected records
    if (buttonUseSelect) {

        var hdrSumFields = new Array();


        doContinue = false;
        var jsonParam = new Array();
        var jsonParamTmp = new Object();
        // Get values from selected checkboxes

        var selectedItems = 0;
        //var selectedItemsLimit = false;

        // $('[name="checkbox"]').each(function () {
        var ListViewCheckboxes = $('[data-role="listview"] li:not([data-role="list-divider"])').find('input[name="checkbox"]');
        ListViewCheckboxes.each(function() {
            if ($(this).prop('checked') == true) {

                // Remember sumfields
                var sumfldName = $(this).parent().parent().parent().find('[sumfield]').attr("sumfield");
                if (BRVUtil.findInArray(hdrSumFields, sumfldName) < 0) {
                    BRVUtil.addToArray(hdrSumFields, sumfldName);
                }

                var checkboxValue = $(this).val();
                checkboxValue = checkboxValue.split('|');
                // screenID = checkboxValue[0];
                params = (checkboxValue[1] == 'b64') ? b64_to_str(checkboxValue[2]) : checkboxValue[1];
                // Example:	
                // |sub_nr=20002|inv_nr=201630012|
                // |sub_nr=20003|inv_nr=201630015|
                // Output:
                // [{"inv_nr": "201630012", "sub_nr": "20002"}, {"inv_nr": "201630015", "sub_nr": "20003"}]
                tmpPar1 = params.split('|');
                for (var i = 0; i < tmpPar1.length; i++) {
                    var tmpPar2 = tmpPar1[i].split('=');
                    if (tmpPar2[0] != '') {
                        var key = tmpPar2[0];
                        var value = tmpPar2[1];
                        jsonParamTmp[key] = value;
                    }
                }
                jsonParam[jsonParam.length] = jsonParamTmp;
                jsonParamTmp = new Object();
                doContinue = true;

                selectedItems++;

            }
        });

        // Check if there's a max selected items
        if (BRVUtil.checkValue(buttonMaxSelectItems)) {
            if (buttonMaxSelectItems > 0 && selectedItems > buttonMaxSelectItems) {
                doContinue = false;
                selectedItemsLimit = true;
            }
        }

        // Create new params
        if (doContinue) {
            if (BRVUtil.checkValue(param)) {
                if (BRVUtil.Left(param, 4) == 'b64|') { // If encoded params, then decode add new params and encode again!
                    param = param.replace('b64|', '');
                    param = b64_to_str(param);
                    param += "|selecteditems=" + JSON.stringify(jsonParam) + "|";
                    param = 'b64|' + str_to_b64(param);
                } else { // Just add new params
                    param += "|selecteditems=" + JSON.stringify(jsonParam) + "|";
                }
            } else { // Just new params
                param = "|selecteditems=" + JSON.stringify(jsonParam) + "|";
            }

        }


        // Also get sumfield values from header and add to params?
        if (hdrSumFields.length > 0) {
            hdrparam = '';
            for (var i = 0; i < hdrSumFields.length; i++) {
                var fldName = hdrSumFields[i];
                if (BRVUtil.checkValue(fldName)) {
                    var hdrFld = $('#headerinfodiv span').find('[sumFldName="' + fldName + '"]');
                    var fldValue = $(hdrFld).text();
                    hdrparam += "|" + fldName + "=" + fldValue;
                }
            }

            if (BRVUtil.checkValue(param)) {
                if (BRVUtil.Left(param, 4) == 'b64|') { // If encoded params, then decode add new params and encode again!
                    param = param.replace('b64|', '');
                    param = b64_to_str(param);
                    if (BRVUtil.checkValue(hdrparam)) {
                        param += hdrparam + "|";
                    }
                    param = 'b64|' + str_to_b64(param);
                } else { // Just add new params
                    if (BRVUtil.checkValue(hdrparam)) {
                        param += hdrparam + "|";
                    }
                }
            } else { // Just new params
                if (BRVUtil.checkValue(hdrparam)) {
                    param = hdrparam + "|";
                }
            }
        }
    }
    //

    // We can continue?
    if (doContinue) {
        if (BRVUtil.checkValue(buttonQuestion)) {
            jQuery.confirm({
                title: '&nbsp;',
                content: buttonQuestion,
                buttons: {
                    ja: function() {
                        getScreenFromJSON_step2(screenID, param, mode, skipChecks, skipSaveRoute, buttonID);
                    },
                    nee: function() {
                        if (BRVUtil.checkValue(buttonCancelMsg)) {
                            app.showMessage(buttonCancelMsg);
                        }
                    }
                }
            });
        } else {
            getScreenFromJSON_step2(screenID, param, mode, skipChecks, skipSaveRoute, buttonID);
        }
    } else {
        if (selectedItemsLimit) {
            var message = '';
            if (BRVUtil.checkValue(buttonMaxSelectItemsMsg)) {
                message = buttonMaxSelectItemsMsg;
            } else {
                message = app.translateMessage('MAX_MARKED_RECORDS');
                message = BRVUtil.replaceAll(message, '<1>', buttonMaxSelectItems);
            }
            app.showMessage(message);
        } else
        if (BRVUtil.isBool(buttonUseSelect)) {
            app.showMessage('NO_MARKED_RECORDS');
        } else {
            app.showMessage('ACTION_ERROR');
        }
    }


}


function getScreenFromJSON_step2(screenID, param, mode, skipChecks, skipSaveRoute, buttonID) {
    skipSaveRoute = BRVUtil.checkValue(skipSaveRoute) ? skipSaveRoute : false;
    (skipSaveRoute) ? '' : app.SavePageRoute(screenID, param, mode, skipChecks); // Do not save when skipSaveRoute or in edit/add mode.

    app.lastScreenCall = new Object();
    app.lastScreenCall['screenid'] = screenID;
    app.lastScreenCall['param'] = param;
    app.lastScreenCall['mode'] = mode;
    app.lastScreenCall['skipChecks'] = skipChecks;

    app.debug('FUNCTION: getScreenFromJSON, screenID:' + screenID + ', param:' + param + ', mode:' + mode);
    app.currentScreen = screenID;

    skipChecks = BRVUtil.checkValue(skipChecks) ? skipChecks : false; // So we can show static info screens! App info, Disclaimer, etc..
    if (!skipChecks) {
        // If not activated, then return to activationscreen
        if (!app.activated && screenID != 'activatedevice') {
            getScreenFromJSON('activatedevice');
            return;
        }

        // If device is activated and password is needed, then return to authenticate screen
        if (screenID != 'authenticate') {
            // if (app.activated && app.checkPassword && !app.deviceloggedin) {
            // if (app.activated && ( app.checkPassword || app.checkPincode ) && !app.deviceloggedin) {
            if (app.activated && (app.checkPassword || app.checkPincode) && !app.deviceloggedin) {
                getScreenFromJSON('authenticate');
                return;
            }

            // If device is activated and no admin is opened
            // Check if adm_code is last opened admin, then it has a * at the beginning.
            if (app.activated && (app.adm_code == '' || BRVUtil.Left(app.adm_code, 1) == '*') && screenID != 'adminselect') {
                // Remove the *
                if (BRVUtil.Left(app.adm_code, 1) == '*') {
                    app.adm_code = app.adm_code.replace('*', '');
                }

                if (BRVUtil.checkValue(app.adm_code)) {
                    app.OpenAdmin(app.adm_code, null);
                } else {
                    getScreenFromJSON('adminselect');
                }
                return;
            }

            // 			if (app.activated && app.adm_code == '' && screenID != 'adminselect') {
            // 				// Check if there's a last opened admin, then open that one!
            // 				// lstadmcode = app.GetFromPhoneStorage('lstadmcode');
            // // 				lstadmcode = getUserData(app.activeusername, 'lstadmcode');
            // // 				if (BRVUtil.checkValue(lstadmcode)) {
            // // 					app.OpenAdmin(lstadmcode);
            // // 				} else {
            // 					getScreenFromJSON('adminselect');
            // 				// }
            // 				return;
            // 			}
        }
    }

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['screens'];

    if (BRVUtil.checkValue(param)) {
        if (BRVUtil.Left(param, 4) == 'b64|') {
            param = param.replace('b64|', '');
            param = b64_to_str(param);
        }
    }

    // Clear content and footer
    $("#content_table").html('');
    $("#footer").html('');

    // Find the screen JSON
    if (BRVUtil.checkValue(screenID)) {

        // When default 'infoscreen' has been deleted or renamed, then use 'app.startscreen' value if 'screenID' contains value 'infoscreen'
        screenID = (BRVUtil.alltrim(app.startScreen) != 'infoscreen' && BRVUtil.alltrim(screenID) == 'infoscreen') ? app.startScreen : screenID;

        for (var i = 0; i < JSONObject.length; i++) {
            if (JSONObject[i].id == screenID) {
                // If found then build the screen
                app.JSONObject['screen'] = JSONObject[i]; // Set screen json
                var objID = app.JSONObject['screen'].id;
                app.screenMode = (BRVUtil.checkValue(mode)) ? mode : null; // Set screen mode
                var tmpParams = (BRVUtil.checkValue(param)) ? param : null;
                saveParams(tmpParams);
                buildScreenFromJSON();
                i = JSONObject.length; // Screen was found, so quit!
            }
        }
    }
}

function getScreenFromJSONDefault(screenID, hideHeaderButtons) {
    app.debug('FUNCTION: getScreenFromJSONDefault, screenID:' + screenID);

    //Rebuild defaultJSON
    if (typeof app.JSONObjectDefault['app'] != 'object') {
        app.appJSONDefault = defaultJSONObject;
        app.JSONObjectDefault['app'] = app.appJSONDefault.app;
    }
    if (typeof app.JSONObjectDefault['screens'] != 'object') {
        app.appJSONDefault = defaultJSONObject;
        app.JSONObjectDefault['screens'] = app.appJSONDefault.screens;
    }

    //Check if we need to hide the headerbuttons
    // if ( hideHeaderButtons && app.JSONObject['screen'].id == 'maintenancescreen' ) {
    if (hideHeaderButtons) {
        delete app.appJSONDefault.app.buttons;
    }


    // Get app default JSON from app vars
    var JSONObject = app.JSONObjectDefault['screens'];

    // Clear content and footer
    $("#content_table").html('');
    $("#footer").html('');


    // Find the screen JSON
    if (BRVUtil.checkValue(screenID)) {
        for (var i = 0; i < JSONObject.length; i++) {
            if (JSONObject[i].id == screenID) {
                // If found then build the screen
                app.JSONObject['screen'] = JSONObject[i]; // Set screen json
                app.screenMode = null; // Set screen mode

                // app.lastErrorMsg
                // app.lastErrorMsgTmp
                if (screenID == 'errorscreen') {

                    app.stopLoading();
                    if (app.lastErrorMsg != app.lastErrorMsgTmp) {
                        var details = app.genLastRequestDetails();
                        var errorMsg = BRVUtil.checkValue(app.lastErrorMsg) ? app.lastErrorMsg : 'CONNECTION_ERROR';
                        app.addWDSLogging('error', errorMsg, details);
                    }
                    app.lastErrorMsgTmp = app.lastErrorMsg;

                    buildScreenFromJSON();

                } else {
                    buildScreenFromJSON();

                }
            }
        }
    }

}

function saveParams(ParamList) {
    app.debug('FUNCTION: saveParams, ParamList:' + ParamList);

    // Check if there's a paramlist
    if (BRVUtil.checkValue(ParamList)) {
        // If paramlist contains '|clear|' then we clean the object
        if (ParamList.indexOf('|clear|') >= 0) {
            app.paramObject = new Object();
            ParamList = ParamList.replace('clear', '');
        }

        // Split the params and create single object nodes
        var tmpParamList = ParamList.split('|');
        for (a = 0; a < tmpParamList.length; a++) {
            if (BRVUtil.checkValue(tmpParamList[a])) {
                var tmpParam = tmpParamList[a].split('=');
                //app.paramObject[tmpParam[0]] = tmpParam[1];

                // Check if we need to remove some textbuffers
                if (tmpParam[0] == 'clearbuffer') {
                    removeImageBuffer(tmpParam[1]);
                    removeTextBuffer(tmpParam[1]);
                } else {
                    app.paramObject[tmpParam[0]] = tmpParam[1];
                }
            }
        }
    }
}

function buildPanelFromJSON(panelID) {
    app.debug('FUNCTION: buildPanelFromJSON, panelID: ' + panelID);

    // ToDo:
    // Panel is (re)build when button is clicked.
    // Find other way to generate or update panel.
    // Issue: 'buttons' which will be available based on condition which can be changed runtime!

    // Remove old panel first and then rebuild it.
    $("#" + panelID).remove();

    // Get app JSON from app vars
    var JSONObject = app.appJSON;
    if (BRVUtil.checkValue(JSONObject)) {
        // JSONObject = JSON.parse(JSONObject);
        JSONObject = BRVUtil.parseJSON(JSONObject);
    }

    // Get some heights
    var appHeight = $(window).height();
    // var appHeight = $('#page-home').height();
    // var headerHeight = $('#header').height();
    var headerHeight = 30;
    var footerHeight = $('#footer').height();
    var panelHeight = appHeight - headerHeight - footerHeight;
    // var panelHeight = appHeight;

    if (JSONObject.screens.length > 0) {
        var output = '';
        for (var i = 0; i < JSONObject.screens.length; i++) {
            if (JSONObject.screens[i].id == panelID && JSONObject.screens[i].content.type == 'panel') {
                output += '<div data-role="panel" id="' + JSONObject.screens[i].id + '" data-position="left" data-display="overlay">';
                output += '<ul data-role="listview">';
                var buttonOBJ = JSONObject.screens[i].content.buttons;

                // If it's browser then remove 'Afsluiten' button from sidepanelmenu
                // if ( BRVUtil.isBrowser() ) {
                // 	for (var btni = 0; btni < buttonOBJ.length; btni++) {
                // 		if (buttonOBJ[btni].id == "closeapp") {
                // 			buttonOBJ.splice(btni,1); // Remove button
                // 		}
                // 	}					
                // }
                //

                for (var btni = 0; btni < buttonOBJ.length; btni++) {
                    var buttonID = buttonOBJ[btni].id;
                    var buttonName = buttonOBJ[btni].name;
                    var buttonOnclick = buttonOBJ[btni].onclick;
                    var checklogin = (BRVUtil.checkValue(buttonOnclick.checklogin) && buttonOnclick.checklogin == 'true') ? true : false;
                    var skipchecks = (BRVUtil.checkValue(buttonOnclick.skipchecks) && buttonOnclick.skipchecks == 'true') ? true : false;

                    var checkhelpurl = (BRVUtil.checkValue(buttonOnclick.checkhelpurl) && buttonOnclick.checkhelpurl == 'true') ? true : false;

                    var checkafuser = (BRVUtil.checkValue(buttonOnclick.checkafuser) && buttonOnclick.checkafuser == 'true') ? true : false;

                    // var showButton = (checklogin && app.checkPassword && !app.deviceloggedin) ? false : true;

                    var showButton = true;
                    // Check for valid login and user is not logged in!
                    if (checklogin && !app.deviceloggedin) {
                        showButton = false;
                    }

                    // If not logged in then hide 'appinfo' and 'changeusersettings'!
                    if (!app.deviceloggedin && (buttonID == 'appinfo' || buttonID == 'changeusersettings')) {
                        showButton = false;
                    }

                    // var btnAccess = checkButtonAccess( buttonOBJ[btni] );
                    var btnAccess = checkButtonAccess(buttonOBJ[btni], true);

                    // Check for page help url.
                    if (checkhelpurl && showButton && btnAccess) {
                        var JSONObjectTMP = app.JSONObject['screen'];
                        var helpurl = (JSONObjectTMP.content.helpurl) ? JSONObjectTMP.content.helpurl : '';
                        showButton = BRVUtil.checkValue(helpurl) ? true : false;
                    }

                    // Check for impersonation.
                    if (checkafuser && showButton && btnAccess) {
                        showButton = app.IsAfUser;
                    }

                    if (showButton && btnAccess) {
                        if (typeof buttonOnclick != 'undefined') {

                            switch (buttonOnclick.action) {
                                case "GotoScreen":
                                    if (buttonOnclick.screen != '') {
                                        output += '<li>';
                                        output += '<a id="' + buttonID + '" href="#" onclick="javascript:getScreenFromJSON(\'' + buttonOnclick.screen + '\', \'\', \'' + buttonOnclick.screenmode + '\', ' + skipchecks + '); $(\'#' + JSONObject.screens[i].id + '\').panel(\'close\');" >' + buttonName + '</a>';
                                        output += '</li>';
                                    }
                                    break;

                                case "dummy":
                                    output += '<li>&nbsp;</li>';
                                    break;

                                case "CallFunction":
                                    // if (buttonOnclick.func == 'app.exitApp' && device.platform.toLowerCase() == 'ios') {
                                    // Do not add exit option.
                                    // if (buttonOnclick.func == 'app.exitApp' && device.platform.toLowerCase() == 'ios' && app.checkPassword) {
                                    if (buttonOnclick.func == 'app.exitApp' && device.platform.toLowerCase() == 'ios' && (app.checkPassword || app.checkPincode)) {
                                        // When it's iOS device we cannot close app, so we just logout! (function 'app.exitApp' will check for iOS device)
                                        output += '<li>';
                                        output += '<a id="' + buttonID + '" href="#" onclick="javascript:CallFunction(\'' + buttonID + '\', \'' + buttonOnclick.func + '\'); $(\'#' + JSONObject.screens[i].id + '\').panel(\'close\');" >' + buttonName + '</a>';
                                        output += '</li>';
                                    } else {
                                        output += '<li>';
                                        output += '<a id="' + buttonID + '" href="#" onclick="javascript:CallFunction(\'' + buttonID + '\', \'' + buttonOnclick.func + '\'); $(\'#' + JSONObject.screens[i].id + '\').panel(\'close\');" >' + buttonName + '</a>';
                                        output += '</li>';
                                    }
                                    break;

                                default:
                                    break;
                            }

                        }
                    }
                }
                output += '</ul>';
                output += '</div>';
            }
        }
        $("#page-home").append(output);
        $("#page-home").trigger("create");

        // Set some panel styling!!
        $("#" + panelID).css({ 'top': headerHeight });
        $("#" + panelID).css({ 'min-height': panelHeight });
        $("#" + panelID).css({ 'max-height': panelHeight });
        $("#" + panelID).css({ 'border': '1px solid #000000' });
        $("#" + panelID).css({ 'position': 'fixed' });
        $("#" + panelID).panel("open"); // Open panel
    }
}

// function buildHeaderInfo_OLD(JSONObject, screentype) {
// 	// screentype: 'listview', 'fieldsform'
// 	var clearHeader = false;
// 	var hasHeaderFields = false;

// 	if (BRVUtil.checkValue(JSONObject.content.headerinfo)) {
// 		try {
// 			if (BRVUtil.checkValue(JSONObject.content.headerinfo.fields)) {
// 				$('#headerinfodiv').empty();
// 				var headerInfoObj = JSONObject.content.headerinfo.fields;
// 				var headerInfoOutput = "";

// 				var headerInfoLeft = '<span name="headerinfoleft" style="float:left; display:block; width:45%;">';
// 				var headerInfoRight = '<span name="headerinforight" style="float:right; display:block; width:45%;">';

// 				for (var i=0; i<headerInfoObj.length; i++) {
// 					var headerInfoOutputTmp = '';

// 					// Generate tempID when object.id is empty
// 					(!BRVUtil.checkValue( headerInfoObj[i].id )) ? headerInfoObj[i].id = 'tempid_'+BRVUtil.generateRandomString(5) : '';

// 					var headerFldID 		= headerInfoObj[i].id;
// 					var headerFldName 		= headerInfoObj[i].name;
// 					var headerFldtype		= headerInfoObj[i].type;
// 					var headerFldPrefix 	= headerInfoObj[i].prefix;
// 					var headerFldSuffix 	= headerInfoObj[i].suffix;
// 					var headerFldPosition 	= (headerInfoObj[i].position) ? headerInfoObj[i].position : 'right';

// 					if ( BRVUtil.checkValue(headerFldID) && BRVUtil.checkValue(headerFldName) ) {
// 						hasHeaderFields = true;
// 					}

// 					headerFldPrefixTmp = '<span style="float:left;display:block;" name="headerinfotitle" >'+headerFldPrefix+'</span>';
// 					headerFldSuffixTmp = '<span name="headerFldSuffix" >'+headerFldSuffix+'</span>';

// 					BRVUtil.checkValue(headerFldPrefix) ? headerInfoOutputTmp = headerFldPrefixTmp + headerInfoOutputTmp : headerInfoOutputTmp;
// 					headerInfoOutputTmp += '<span style="float:right;display:block;">';
// 					// headerInfoOutputTmp += '<span id="'+headerFldID+'" name="'+headerFldID+'"></span>';
// 					headerInfoOutputTmp += '<span id="'+headerFldID+'" name="'+headerFldID+'" sumFldName="'+headerFldName+'"></span>';
// 					BRVUtil.checkValue(headerFldSuffix) ? headerInfoOutputTmp = headerInfoOutputTmp + headerFldSuffixTmp : headerInfoOutputTmp;
// 					headerInfoOutputTmp += '</span>';
// 					if (headerFldPosition == 'left') {
// 						headerInfoLeft += '<span name="headerinfospan" style="float:left; display:block; width:90%;">'+headerInfoOutputTmp+'</span><br>';
// 					}
// 					if (headerFldPosition == 'right') {
// 						headerInfoRight += '<span name="headerinfospan" style="float:right; display:block; width:90%;">'+headerInfoOutputTmp+'</span><br>';
// 					}

// 					if ( !BRVUtil.checkValue(headerFldID) || !BRVUtil.checkValue(headerFldName) ) {
// 						clearHeader = true;
// 					}

// 				}
// 				headerInfoLeft += '</span>';
// 				headerInfoRight += '</span>';

// 				// When it's AppBuiler or there are some headefields, add them to header.
// 				if ( app.isBuilder || hasHeaderFields ) {
// 					headerInfoOutput += headerInfoLeft;
// 					headerInfoOutput += headerInfoRight;
// 				}

// 				$('#headerinfodiv').html(headerInfoOutput);
// 				$('#headerinfodiv').trigger("create");
// 				$('#headerinfodiv').show();
// 				if ( app.isBuilder) {
// 					clearHeader = false;
// 					$('#headerinfodiv').css('visibility', 'visible');
// 				}

// 				// When it's AppBrowser and there are some headerfields, then set min-height (Only needed for Apple Mac devices!!!)
// 				if ( BRVUtil.isBrowser() && hasHeaderFields ) {
// 					// $('#headerinfodiv').css("min-height", "20px");
// 					$('#headerinfodiv').css("overflow", "auto");
// 					$('#headerinfodiv').css("min-height", $('#headerinfodiv').innerHeight() + "px");
// 				}

// 			} else 
// 			if ( app.isBuilder || BRVUtil.isBrowser() ) {
// 				clearHeader = false;
// 				$('#headerinfodiv').css("height", "20px");
// 				$('#headerinfodiv').show();
// 				$('#headerinfodiv').css('visibility', 'visible');
// 			}
// 		} catch(e) {}
// 	}

// 	// Check if header needs to be cleared. In case of builder generated empty header fields!
// 	(clearHeader)?$('#headerinfodiv').empty():'';
// }

function buildHeaderInfo(JSONObject, screentype) {
    // screentype: 'listview', 'fieldsform'
    var clearHeader = false;
    var hasHeaderFields = false;

    if (BRVUtil.checkValue(JSONObject.content.headerinfo)) {
        try {

            if (BRVUtil.checkValue(JSONObject.content.headerinfo.headerhtml) || BRVUtil.checkValue(JSONObject.content.headerinfo.fields)) {
                $('#headerinfodiv').empty();
                var headerInfoObj = JSONObject.content.headerinfo.fields;
                var headerInfoOutput = "";

                // If there's headerhtml then skip old header.
                if (BRVUtil.checkValue(JSONObject.content.headerinfo.headerhtml)) {
                    // var headerInfoHTML = '<div id="headerinfohtml" style="width:100%; display:table;"></div>';
                    var headerInfoHTML = '<div id="headerinfohtml" style="width:100%;"></div>';
                    hasHeaderFields = true;

                    // When it's AppBuiler or there are some headefields, add them to header.
                    if (app.isBuilder || hasHeaderFields) {
                        headerInfoOutput += headerInfoHTML;
                    }

                } else
                if (BRVUtil.checkValue(JSONObject.content.headerinfo.fields)) {
                    var headerInfoLeft = '<span name="headerinfoleft" style="float:left; display:block; width:45%;">';
                    var headerInfoRight = '<span name="headerinforight" style="float:right; display:block; width:45%;">';
                    for (var i = 0; i < headerInfoObj.length; i++) {
                        var headerInfoOutputTmp = '';

                        // Generate tempID when object.id is empty
                        (!BRVUtil.checkValue(headerInfoObj[i].id)) ? headerInfoObj[i].id = 'tempid_' + BRVUtil.generateRandomString(5): '';

                        var headerFldID = headerInfoObj[i].id;
                        var headerFldName = headerInfoObj[i].name;
                        var headerFldtype = headerInfoObj[i].type;
                        var headerFldPrefix = headerInfoObj[i].prefix;
                        var headerFldSuffix = headerInfoObj[i].suffix;
                        var headerFldPosition = (headerInfoObj[i].position) ? headerInfoObj[i].position : 'right';

                        if (BRVUtil.checkValue(headerFldID) && BRVUtil.checkValue(headerFldName)) {
                            hasHeaderFields = true;
                        }

                        headerFldPrefixTmp = '<span style="float:left;display:block;" name="headerinfotitle" >' + headerFldPrefix + '</span>';
                        headerFldSuffixTmp = '<span name="headerFldSuffix" >' + headerFldSuffix + '</span>';

                        BRVUtil.checkValue(headerFldPrefix) ? headerInfoOutputTmp = headerFldPrefixTmp + headerInfoOutputTmp : headerInfoOutputTmp;
                        headerInfoOutputTmp += '<span style="float:right;display:block;">';
                        // headerInfoOutputTmp += '<span id="'+headerFldID+'" name="'+headerFldID+'"></span>';
                        headerInfoOutputTmp += '<span id="' + headerFldID + '" name="' + headerFldID + '" sumFldName="' + headerFldName + '"></span>';
                        BRVUtil.checkValue(headerFldSuffix) ? headerInfoOutputTmp = headerInfoOutputTmp + headerFldSuffixTmp : headerInfoOutputTmp;
                        headerInfoOutputTmp += '</span>';
                        if (headerFldPosition == 'left') {
                            headerInfoLeft += '<span name="headerinfospan" style="float:left; display:block; width:90%;">' + headerInfoOutputTmp + '</span><br>';
                        }
                        if (headerFldPosition == 'right') {
                            headerInfoRight += '<span name="headerinfospan" style="float:right; display:block; width:90%;">' + headerInfoOutputTmp + '</span><br>';
                        }

                        if (!BRVUtil.checkValue(headerFldID) || !BRVUtil.checkValue(headerFldName)) {
                            clearHeader = true;
                        }

                    }
                    headerInfoLeft += '</span>';
                    headerInfoRight += '</span>';

                    // When it's AppBuiler or there are some headefields, add them to header.
                    if (app.isBuilder || hasHeaderFields) {
                        headerInfoOutput += headerInfoLeft;
                        headerInfoOutput += headerInfoRight;
                    }
                }

                $('#headerinfodiv').html(headerInfoOutput);
                $('#headerinfodiv').trigger("create");
                $('#headerinfodiv').show();
                if (app.isBuilder) {
                    clearHeader = false;
                    $('#headerinfodiv').css('visibility', 'visible');
                }

                // NEW HTML HEADER
                if (BRVUtil.checkValue(JSONObject.content.headerinfo.headerhtml)) {
                    $('#headerinfodiv').css('padding-top', '0px');
                    $('#headerinfodiv').css('padding-right', '0px');

                    // console.log('JSONObject.content.headerinfo.headerhtml: ', JSONObject.content.headerinfo.headerhtml);
                    var headerhtml = b64_to_str(JSONObject.content.headerinfo.headerhtml);
                    //					var headerhtml = JSONObject.content.headerinfo.headerhtml;
                    $('#headerinfohtml').html(headerhtml);
                }

                // When it's AppBrowser and there are some headerfields, then set min-height (Only needed for Apple Mac devices!!!)
                if (BRVUtil.isBrowser() && hasHeaderFields) {
                    // $('#headerinfodiv').css("min-height", "20px");
                    $('#headerinfodiv').css("overflow", "auto");
                    $('#headerinfodiv').css("min-height", $('#headerinfodiv').innerHeight() + "px");
                }

            } else
            if (app.isBuilder || BRVUtil.isBrowser()) {
                clearHeader = false;
                $('#headerinfodiv').css("height", "20px");
                $('#headerinfodiv').show();
                $('#headerinfodiv').css('visibility', 'visible');
            }


        } catch (e) {}
    }

    // Check if header needs to be cleared. In case of builder generated empty header fields!
    (clearHeader) ? $('#headerinfodiv').empty(): '';
}


function buildScreenFromJSON() {
    app.debug('FUNCTION: buildScreenFromJSON, screen:' + app.JSONObject['screen'].id);

    if (BRVUtil.isBrowser()) {
        $('#content_table').removeClass('fieldsform');
        $('#content_table').removeClass('listfields');
    }

    // Clear some buffered data first!!!
    app.ObjectQueries = new Array(); // Reset queries object
    app.ObjectQueriesTmp = new Array(); // Reset queries object
    app.BindObjectQueries = new Array(); // Reset queries object
    app.BindObject = new Array(); // Reset queries object

    app.disableFooterButtons = new Array(); // Reset list of footerbuttons to disable

    // Testing
    // app.stopLoading();
    // Clear content_table first.
    $('#content_table').empty();
    $('#content_table').height('');
    // Testing

    $('#content_table').scrollTop(0); // Scroll back to top op screen.

    $("#content_table").hide();

    // Check if we need to restore some css on content_table div
    // When sreentype 'website' was loaded before, the css of content_table has been changed!
    $("#content_table").each(function() {
        $.each(this.attributes, function() {
            if (this.specified) {
                if (BRVUtil.Left(this.name, 4) == 'css_') {
                    var curCssProp = this.name.replace('css_', '');
                    var curCssValue = this.value;
                    $("#content_table").css("" + curCssProp + "", "" + curCssValue + "");
                    $("#content_table").removeAttr(this.name);
                }
            }
        });
    });


    app.activateLiCheckboxes = null;

    app.activateLiLeftColumn = null;

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['screen'];

    // Create the app header
    createAppHeader();

    // Set new screen title
    setAppTitle(JSONObject.name);

    // Reset the livescolling vars
    app.resetLiveScrolling();

    var defaultValue = '';

    var doBubbleQuery = false;

    // Define output var
    var output = '';

    // Build the main DIV
    output += '<div class="app-div" id="' + JSONObject.id + '__"  >';

    // Check for bodytext.
    if (BRVUtil.checkValue(JSONObject.content.bodytoptext)) {
        var bodytoptext;
        if (!BRVUtil.isBool(app.demoAvailable) && BRVUtil.checkValue(JSONObject.content.demobodytoptext)) {
            bodytoptext = b64_to_str(JSONObject.content.demobodytoptext);
        } else {
            // var bodytoptext = b64_to_str(JSONObject.content.bodytoptext);

            if (app.checkmultiuser() && BRVUtil.checkValue(JSONObject.content.bodytoptextmultiuser)) {
                bodytoptext = b64_to_str(JSONObject.content.bodytoptextmultiuser);
            } else {
                bodytoptext = b64_to_str(JSONObject.content.bodytoptext);
            }

        }
        bodytoptext = replaceVarsInText(bodytoptext);

        output += '<div id="bodytoptext">' + bodytoptext + '</div>';
    } else {
        output += '<div id="bodytoptext"></div>';
    }


    // Check for screencontent.
    switch (JSONObject.content.type) {
        case "headerdetail":
            // ToDo: Display Header/Detail screens
            break;

        case "chartform":
            // ToDo: Display Google charts
            output += '<div id="graph" style="width: 100%; height: 250px;" class="p-input"></div >';
            output += '<div id="graph_title" style="width: 100%;" class="p-input"></div >';
            output += '<div id="graph_legend" style="width: 100%;" class="p-input"></div >';
            output += '</div >';
            break;

        case "website":
            buildHeaderInfo(JSONObject, "website");
            // output += '<iframe id="websiteiFrame" name="websiteiFrame" style="width:100%;">';
            output += '<iframe id="websiteiFrame" name="websiteiFrame">';
            output += '</iframe>';
            break;

        case "listviewcols":
        case "listview":
            var searchField = '';
            var filterButton = '';
            if (BRVUtil.checkValue(JSONObject.content.queryfilter) || BRVUtil.checkValue(JSONObject.content.querysort)) {
                var filtersort = '';
                filtersort += '<div id="' + JSONObject.id + '_filtersort" name="' + JSONObject.id + '_filtersort" data-role="collapsible">';
                // filtersort += '<h6 class="filterTitle">/--/</h6>';
                filtersort += '<h6 class="filterTitle" style="display:none">/--/</h6>';

                // Sorting
                if (BRVUtil.checkValue(JSONObject.content.querysort)) {
                    if (JSONObject.content.querysort.length > 0 || app.isBuilder) {

                        var sortStorageID = JSONObject.id + '_sort_select';
                        //var sortStorageValue = app.GetFromTempStorage(sortStorageID);
                        var sortStorageValue = getUserSort(app.activeusername, sortStorageID);


                        var sort = '';
                        sort += '<div id="' + JSONObject.id + '_sort" name="' + JSONObject.id + '_sort">';
                        sort += '<fieldset data-mini="true">';
                        sort += '<label for="' + JSONObject.id + '" style="border: none">Sortering:</label>';
                        sort += '<select name="' + JSONObject.id + '_sort_select" id="' + JSONObject.id + '_sort_select">';
                        var querysort = JSONObject.content.querysort;
                        for (var sorti = 0; sorti < querysort.length; sorti++) {
                            var sortQuery = querysort[sorti].queryorderby;

                            var sortquerydivider = querysort[sorti].querydivider;
                            var sortlistviewdivider = querysort[sorti].listviewdivider;

                            sort += '<option id="' + querysort[sorti].code + '" value="' + querysort[sorti].queryorderby + '"';
                            if (BRVUtil.checkValue(sortquerydivider) && BRVUtil.checkValue(sortlistviewdivider)) {
                                sort += (BRVUtil.checkValue(sortquerydivider)) ? ' dividerquery="' + sortquerydivider + '" ' : '';
                                sort += (BRVUtil.checkValue(sortlistviewdivider)) ? ' divider="' + sortlistviewdivider + '" ' : '';
                            }
                            if (BRVUtil.checkValue(sortStorageValue)) {
                                sort += (sortStorageValue == querysort[sorti].code) ? ' selected ' : '';
                            }
                            sort += '>';
                            sort += querysort[sorti].label;
                            sort += '</option>';

                        }
                        sort += '</select>';
                        sort += '</div>';
                        filtersort += sort;
                    }
                }

                // Filter
                if (BRVUtil.checkValue(JSONObject.content.queryfilter)) {
                    if (JSONObject.content.queryfilter.length > 0 || app.isBuilder) {
                        var filter = '';
                        // filter += '<div id="' + JSONObject.id + '_filter" name="' + JSONObject.id + '_filter" data-role="collapsible">';
                        // filter += '<h6 class="filterTitle">/--/</h6>';
                        filter += '<div id="' + JSONObject.id + '_filter" name="' + JSONObject.id + '_filter">';
                        filter += '<label for="' + JSONObject.id + '" style="border: none">Filter:</label>';
                        filter += '<fieldset data-mini="true">';
                        var queryfilter = JSONObject.content.queryfilter;
                        for (var flti = 0; flti < queryfilter.length; flti++) {
                            var filterCondition = queryfilter[flti].condition;
                            filter += '<label for="' + queryfilter[flti].code + '" style="border: none">' + queryfilter[flti].label + '</label>';
                            filter += '<input name="' + queryfilter[flti].code + '" id="' + queryfilter[flti].code + '" type="checkbox" ';
                            defaultValue = BRVUtil.checkValue(queryfilter[flti].defaultvalue) ? queryfilter[flti].defaultvalue : '';

                            var filterStorageID = JSONObject.id + '_filter_' + queryfilter[flti].code;
                            // var filterStorageValue = app.GetFromTempStorage(filterStorageID);
                            var filterStorageValue = getUserFilter(app.activeusername, filterStorageID);

                            if (BRVUtil.checkValue(defaultValue.toString()) || BRVUtil.checkValue(filterStorageValue.toString())) {
                                var setState = false;
                                // Check for default value
                                if (BRVUtil.checkValue(defaultValue.toString())) {
                                    setState = BRVUtil.isBool(defaultValue);
                                }
                                // Check for storage value and overrule default value.
                                if (BRVUtil.checkValue(filterStorageValue.toString())) {
                                    setState = BRVUtil.isBool(filterStorageValue);
                                }
                                (setState) ? filter += ' checked ': '';
                            }

                            filter += ' value="' + filterCondition + '" >';
                        }
                        filter += '</fieldset>';
                        filter += '</div>';
                        // Append filter
                        // $('#filtersortdiv').append(filter);
                        // $('#filtersortdiv').trigger("create");
                        // $('#filtersortdiv').show();
                        // Remove some styles
                        // $('#' + JSONObject.id + '_filter').find('a').removeClass('ui-btn');
                        // $('#' + JSONObject.id + '_filter').find('a').removeClass('ui-icon-plus');
                        // $('#' + JSONObject.id + '_filter').find('a').removeClass('ui-btn-icon-left');
                        // $('#' + JSONObject.id + '_filter').find('a').removeClass('ui-btn-inherit');
                        // $('#' + JSONObject.id + '_filter').find('a').removeClass('ui-btn-active');
                        filtersort += filter;
                    }
                }


                //Add submit button
                filtersort += '<div id="' + JSONObject.id + '_submit" name="' + JSONObject.id + '_submit" style="position:absolute; right:3px; bottom:10px;" >';
                filtersort += '<button id="submitfiltersort" type="button" onclick="execFilterSort();" style="" data-mini="true">Toepassen</button>';
                filtersort += '</div>';
                //

                filtersort += '</div>';

                // Append filter
                $('#filtersortdiv').append(filtersort);
                $('#filtersortdiv').trigger("create");

                // Add some styling
                $('#filtersortdiv').css({ width: '100%' });

                // Now show filter div
                $('#filtersortdiv').show();


                // Remove some styles
                $('#' + JSONObject.id + '_filtersort').find('a').removeClass('ui-btn');
                $('#' + JSONObject.id + '_filtersort').find('a').removeClass('ui-icon-plus');
                $('#' + JSONObject.id + '_filtersort').find('a').removeClass('ui-btn-icon-left');
                $('#' + JSONObject.id + '_filtersort').find('a').removeClass('ui-btn-inherit');
                $('#' + JSONObject.id + '_filtersort').find('a').removeClass('ui-btn-active');

                $('#' + JSONObject.id + '_filtersort').removeClass('ui-corner-all');
            } else {
                // searchField = '<br>'; 
                // $('#searchdiv').css('padding-top', '5px');	// when there's no filter set, add some little padding to the top.
            }


            if (BRVUtil.checkValue(JSONObject.content.search)) {
                var hideSearchDiv = false;

                $('#searchdiv').empty();
                if (JSONObject.content.search.searchfields.length > 0 || app.isBuilder) {
                    var srcFieldValue = getUserSearch(app.activeusername, JSONObject.id + '_search'); //Get previous search value
                    srcFieldValue = srcFieldValue.replace(/"/g, '&quot;'); // Replace " with &quot else it wont be displayed!
                    searchField += '<input type="search" id="' + JSONObject.id + '_search" name="' + JSONObject.id + '_search" value="' + srcFieldValue + '" data-mini="true" class="ui-shadow">';
                } else {
                    searchField += '<div id="' + JSONObject.id + '_search" name="' + JSONObject.id + '_search" style="height:20px;">&nbsp;</div>';

                    hideSearchDiv = true;
                }

                $('#searchdiv').append(searchField);
                $('#searchdiv').trigger("create");
                $('#searchdiv').show();
                $('#searchdiv').css('padding-top', '5px');

                if (BRVUtil.checkValue(JSONObject.content.queryfilter) || BRVUtil.checkValue(JSONObject.content.querysort)) {
                    var curWidth = $('#searchdiv').width();
                    var newWidth = (app.isBuilder || BRVUtil.isRippleEmulator()) ? curWidth - 60 : curWidth - 36;
                    $('#searchdiv').css("width", "" + newWidth + "");

                    // filterButton = '<div style="float: right; padding-right:5px; padding-top:2px;"><a href="#" onclick="BRVUtil.collapse(\''+BRVUtil.alltrim(JSONObject.id)+'_filtersort\')" id="filterButton" name="filterButton" class="ui-btn ui-icon-filter ui-btn-icon-notext ui-corner-all">No text</a></div>';
                    // $('#searchdivOuter').prepend(filterButton);

                    filterButton = '<div style="position:absolute;" id="filterButtonDiv"><a href="#" onclick="BRVUtil.collapse(\'' + BRVUtil.alltrim(JSONObject.id) + '_filtersort\')" id="filterButton" name="filterButton" class="ui-btn ui-icon-filter ui-btn-icon-notext ui-corner-all">No text</a></div>';
                    $('#searchdiv').append(filterButton);
                    var divtop = $('#searchdivOuter').offset();
                    $('#filterButtonDiv').css('right', '5px');
                    $('#filterButtonDiv').css('top', '35px');

                    // BRVUtil.collapse(\''+BRVUtil.alltrim(JSONObject.id)+'_filtersort\')
                    // $('#filterButtonDiv').show();
                    // var objID = JSONObject.id;
                    // $('#filterButton').click(function() { 
                    // 	BRVUtil.collapse(BRVUtil.alltrim(objID)+'_filtersort');
                    // });						

                    // ******************************************************************************
                    // Add filter button or add click event on title to collapse filter fields ???
                    $('#apptitle').click(function() {
                        BRVUtil.collapse(BRVUtil.alltrim(JSONObject.id) + '_filtersort');
                    });
                    // ******************************************************************************

                    hideSearchDiv = false;

                }

                if (hideSearchDiv && !app.isBuilder) {
                    $('#searchdivOuter').css("display", "none");
                }

            }

            // if (BRVUtil.checkValue(JSONObject.content.search)) {
            // 	if (JSONObject.content.search.searchfields.length > 0 || app.isBuilder) {
            // 		$('#searchdiv').empty();
            // 		// var srcFieldValue = app.GetFromTempStorage(JSONObject.id + '_search'); //Get previous search value
            // 		var srcFieldValue = getUserSearch(app.activeusername, JSONObject.id + '_search'); //Get previous search value
            // 		srcFieldValue = srcFieldValue.replace(/"/g, '&quot;');	// Replace " with &quot else it wont be displayed!

            // 		// var searchField = '<br><input type="search" id="' + JSONObject.id + '_search" name="' + JSONObject.id + '_search" value="' + srcFieldValue + '" data-mini="true" class="ui-shadow">';
            // 		searchField += '<input type="search" id="' + JSONObject.id + '_search" name="' + JSONObject.id + '_search" value="' + srcFieldValue + '" data-mini="true" class="ui-shadow">';
            // 		$('#searchdiv').append(searchField);
            // 		$('#searchdiv').trigger("create");
            // 		$('#searchdiv').show();
            // 		$('#searchdiv').css('padding-top', '5px');

            // 		if (BRVUtil.checkValue(JSONObject.content.queryfilter) || BRVUtil.checkValue(JSONObject.content.querysort)) {
            // 			var curWidth = $('#searchdiv').width();
            // 			var newWidth = (app.isBuilder || BRVUtil.isRippleEmulator())?curWidth-60:curWidth-36;
            // 			$('#searchdiv').css("width", ""+newWidth+"");

            // 			filterButton = '<div style="float: right; padding-right:5px; padding-top:2px;"><a href="#" onclick="BRVUtil.collapse(\''+BRVUtil.alltrim(JSONObject.id)+'_filtersort\')" id="filterButton" name="filterButton" class="ui-btn ui-icon-filter ui-btn-icon-notext ui-corner-all">No text</a></div>';
            // 			$('#searchdivOuter').prepend(filterButton);

            // 			// filterButton += '<a href="#" onclick="javascript:BRVUtil.collapse(\''+BRVUtil.alltrim(JSONObject.id)+'_filtersort\')" class="ui-btn ui-corner-all ui-btn-right ui-icon-bullets ui-btn-icon-notext" id="filterButton" style="margin-right:40px;">Filter</a>';
            // 			// $('#settingsbutton').before(filterButton);

            // 			// ******************************************************************************
            // 			// Add filter button or add click event on title to collapse filter fields ???
            // 			$('#apptitle').click(function() {
            // 				BRVUtil.collapse(BRVUtil.alltrim(JSONObject.id)+'_filtersort');
            // 			});
            // 			// When click event is attached to title then underline title ???
            // 			// var titleHTML = $('#apptitle').html();
            // 			// $('#apptitle').html('<u>' + titleHTML + '</u>');
            // 			// ******************************************************************************
            // 		}

            // 	}
            // } else {
            // 	if (BRVUtil.checkValue(JSONObject.content.queryfilter) || BRVUtil.checkValue(JSONObject.content.querysort)) {
            // 		filterButton = '<div style="float: right; padding-right:5px; padding-top:2px;"><a href="#" onclick="BRVUtil.collapse(\''+BRVUtil.alltrim(JSONObject.id)+'_filtersort\')" id="filterButton" name="filterButton" class="ui-btn ui-icon-bullets ui-btn-icon-notext ui-corner-all">No text</a></div>';
            // 		$('#searchdivOuter').append(filterButton);

            // 		// filterButton += '<a href="#" onclick="javascript:BRVUtil.collapse(\''+BRVUtil.alltrim(JSONObject.id)+'_filtersort\')" class="ui-btn ui-corner-all ui-btn-right ui-icon-bullets ui-btn-icon-notext" id="filterButton" style="margin-right:40px;">Filter</a>';
            // 		// $('#settingsbutton').before(filterButton);

            // 		// ******************************************************************************
            // 		// Add filter button or add click event on title to collapse filter fields ???
            // 		$('#apptitle').click(function() {
            // 			BRVUtil.collapse(BRVUtil.alltrim(JSONObject.id)+'_filtersort');
            // 		});
            // 		// When click event is attached to title then underline title ???
            // 		// var titleHTML = $('#apptitle').html();
            // 		// $('#apptitle').html('<u>' + titleHTML + '</u>');
            // 		// ******************************************************************************
            // 	}
            // }

            buildHeaderInfo(JSONObject, "listview");

            output += '<ul data-role="listview" id="' + JSONObject.id + '" name="' + JSONObject.id + '" data-scroll="true" data-autodividers="false">';
            output += '</ul>';
            break;

        case "fieldsform":

            var query = '';
            var queryAppID = '';
            var queryReqID = '';
            var bindquery = false;
            var keyFld = '';
            defaultValue = '';
            var defaultValues = '';

            var fieldOnclick = '';
            var fieldID = '';
            var fieldName = '';

            var tmpFldID = '';
            var tmpFldValue = '';
            var onchange = '';
            var btnAccess = false;

            buildHeaderInfo(JSONObject, "fieldsform");

            // app.ObjectQueries = new Array(); // Reset queries object
            // app.ObjectQueriesTmp = new Array(); // Reset queries object
            // app.BindObjectQueries = new Array(); // Reset queries object
            // app.BindObject = new Array(); // Reset queries object

            var subType = BRVUtil.checkValue(JSONObject.content.subtype) ? JSONObject.content.subtype : '';
            var fieldsObj = JSONObject.content.fields;

            for (var fldi = 0; fldi < fieldsObj.length; fldi++) {
                // Generate tempID when object.id is empty
                (!BRVUtil.checkValue(fieldsObj[fldi].id)) ? fieldsObj[fldi].id = 'tempid_' + BRVUtil.generateRandomString(5): '';

                try {

                    var showOnScreenMode = fieldsObj[fldi].showonscreenmode;
                    if (!BRVUtil.checkValue(showOnScreenMode) || showOnScreenMode == app.screenMode || app.isBuilder) {

                        output += '<div class="fieldscontainer" data-role="ui-field-contain" id="' + fieldsObj[fldi].id + '_container"';
                        (fieldsObj[fldi].type == 'selectdoc' && !app.isBuilder) ? output += ' style = "display: none;" ': ''; // When type is 'selectdoc' default hide container.
                        output += '>';

                        var tmpClass = (subType == 'info') ? 'p-infolbl' : '';
                        tmpClass += (fieldsObj[fldi].type == 'checkbox') ? 'checkbox' : '';

                        (fieldsObj[fldi].name && fieldsObj[fldi].type != 'function' && fieldsObj[fldi].type != 'button' && fieldsObj[fldi].type != 'extrafields') ? output += '<label for="' + fieldsObj[fldi].id + '" class="' + tmpClass + '">' + fieldsObj[fldi].name + '</label>': '';
                        var widgetID;

                        switch (fieldsObj[fldi].type) {

                            case "widgetimage":
                                // {
                                // 	"id": "testing1",
                                // 	"type": "widgetimage",
                                // 	"width": 120,
                                // 	"height": 120,
                                // 	"url": "https://api.buienradar.nl/image/1.0/RadarMapNL?w=120&h=120"
                                // }
                                widgetID = fieldsObj[fldi].id;
                                output += '<img src="" name="' + widgetID + '" id="' + widgetID + '" style="display: block; margin: auto auto; height:20px;" >';
                                if (BRVUtil.checkValue(fieldsObj[fldi].url)) {
                                    app.BufferedWidgetObj.push(fieldsObj[fldi]);
                                }
                                break;

                            case "widgethtml":
                                // {
                                // 	"id": "testing1",
                                // 	"type": "widgethtml",
                                // 	"width": 120,
                                // 	"height": 120,
                                // 	"url": "https://api.buienradar.nl/image/1.0/RadarMapNL?w=120&h=120"
                                // }
                                widgetID = fieldsObj[fldi].id;
                                output += '<div name="' + widgetID + '" id="' + widgetID + '" style="height:20px;">';
                                if (BRVUtil.checkValue(fieldsObj[fldi].url)) {
                                    app.BufferedWidgetObj.push(fieldsObj[fldi]);
                                }
                                break;

                            case "widgethtmlpage":
                                // {
                                // 	"id": "testing",
                                // 	"type": "widgethtmlpage",
                                // 	"url": "https://gadgets.buienradar.nl/gadget/radarfivedays"
                                // }
                                widgetID = fieldsObj[fldi].id;
                                output += '<iframe src="" name="' + widgetID + '" id="' + widgetID + '" style="border: 0px; overflow: scroll; overflow-x: hidden; overflow-y: hidden; display: block; margin: auto auto; "></iframe>';
                                if (BRVUtil.checkValue(fieldsObj[fldi].url)) {
                                    app.BufferedWidgetObj.push(fieldsObj[fldi]);
                                }
                                break;

                            case "extrafields":
                                // Do nothing!
                                break;

                            case "selectfiltered":
                                query = '';
                                queryAppID = '';
                                queryReqID = '';
                                bindquery = false;

                                if (BRVUtil.checkValue(fieldsObj[fldi].query)) {
                                    query = b64_to_str(fieldsObj[fldi].query.query);
                                    queryAppID = fieldsObj[fldi].query.appid;
                                    queryReqID = fieldsObj[fldi].query.wepid;
                                    keyFld = fieldsObj[fldi].keyfield;
                                    bindquery = fieldsObj[fldi].query.bindquery;
                                }
                                defaultValue = BRVUtil.checkValue(fieldsObj[fldi].defaultvalue) ? app.GetDefaultvalue(fieldsObj[fldi].defaultvalue) : '';
                                output += '<div class="ui-input-search ui-shadow-inset">';
                                output += '<input ';
                                output += ' type="text" ';
                                output += ' name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" ';
                                output += ' objectKey="" ';
                                output += ' value="' + defaultValue + '" ';
                                output += ' novalidate="novalidate" autocomplete="off" autocorrect="off" ';
                                output += ' class="ui-shadow" ';
                                // (app.selectInputTimeout == 0) ? output += ' enterkeyhint="enter" ': '';
                                (app.selectInputTimeout == 0) ? output += ' enterkeyhint="go" ': '';
                                output += '  />';

                                output += '</div>';
                                output += '<ul name="' + fieldsObj[fldi].id + '_result" id="' + fieldsObj[fldi].id + '_result" data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-shadow"><li class="ui-li-static ui-body-inherit ui-screen-hidden"><div class="ui-loader"><span class="ui-icon ui-icon-loading"></span></div></li></ul>';

                                // Check of AppID && WEPID
                                if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID)) {
                                    // only buffer request when it's not a QUERY_GENERAL request OR bindquery
                                    // if (BRVUtil.checkValue(query) && ( queryReqID != app.QUERY_GENERAL || bindquery ) ) { 
                                    if (BRVUtil.checkValue(query) && bindquery) {
                                        bindObjectQuery(fieldsObj[fldi], fieldsObj[fldi].id, fieldsObj[fldi].type, fieldsObj[fldi].keyfield);
                                    }
                                }
                                break;

                            case "selectpopup":
                                query = '';
                                queryAppID = '';
                                queryReqID = '';
                                bindquery = false;

                                if (BRVUtil.checkValue(fieldsObj[fldi].query)) {
                                    query = b64_to_str(fieldsObj[fldi].query.query);
                                    queryAppID = fieldsObj[fldi].query.appid;
                                    queryReqID = fieldsObj[fldi].query.wepid;
                                    keyFld = fieldsObj[fldi].keyfield;
                                    bindquery = fieldsObj[fldi].query.bindquery;
                                }
                                defaultValue = BRVUtil.checkValue(fieldsObj[fldi].defaultvalue) ? app.GetDefaultvalue(fieldsObj[fldi].defaultvalue) : '';

                                output += '<div class="ui-input-search">';

                                // addfunction put icon after input field
                                if (BRVUtil.checkValue(fieldsObj[fldi].addfunction) && !BRVUtil.isBrowser()) {
                                    output += ' <div class="ui-grid-a"> ';
                                    output += ' <div class="ui-block-a ui-block-amod"> ';
                                }

                                output += '<input ';
                                output += ' type="text" ';
                                output += ' name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" ';
                                output += ' objectKey="" ';
                                output += ' value="' + defaultValue + '" ';
                                output += ' novalidate="novalidate" autocomplete="off" autocorrect="off" ';
                                output += ' class="ui-shadow" ';
                                // (app.selectInputTimeout == 0) ? output += ' enterkeyhint="enter" ': '';
                                (app.selectInputTimeout == 0) ? output += ' enterkeyhint="go" ': '';
                                output += '  />';

                                // addfunction put icon after input field
                                if (BRVUtil.checkValue(fieldsObj[fldi].addfunction) && !BRVUtil.isBrowser()) {
                                    output += ' </div> ';
                                    output += ' <div class="ui-block-b ui-block-bmod"> ';
                                    output += '<a href="javascript:CallFunction(\'\', \'' + fieldsObj[fldi].addfunction.action + '\', \'' + fieldsObj[fldi].addfunction.param + '\' )"  data-role="button" data-mini="false" data-icon="' + fieldsObj[fldi].addfunction.icon + '" data-inline="true" data-iconpos="notext" ';
                                    output += ' name="' + fieldsObj[fldi].id + '_function" id="' + fieldsObj[fldi].id + '_function" ';
                                    output += '></a>';
                                    output += ' </div> ';
                                    output += ' </div> ';
                                }

                                output += '</div>';

                                if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID)) {
                                    // only buffer request when it's not a QUERY_GENERAL request OR bindquery
                                    // if (BRVUtil.checkValue(query) && ( queryReqID != app.QUERY_GENERAL || bindquery ) ) {
                                    if (BRVUtil.checkValue(query) && bindquery) {
                                        bindObjectQuery(fieldsObj[fldi], fieldsObj[fldi].id, fieldsObj[fldi].type, fieldsObj[fldi].keyfield);
                                    }
                                }
                                break;

                            case "select":
                                query = '';
                                queryAppID = '';
                                queryReqID = '';
                                keyFld = '';
                                // var bufferquery = false;
                                defaultValues = fieldsObj[fldi].values;

                                // bindquery = false;

                                if (BRVUtil.checkValue(fieldsObj[fldi].query)) {
                                    query = b64_to_str(fieldsObj[fldi].query.query);
                                    queryAppID = fieldsObj[fldi].query.appid;
                                    queryReqID = fieldsObj[fldi].query.wepid;
                                    keyFld = fieldsObj[fldi].keyfield;
                                    // bufferquery = fieldsObj[fldi].query.bufferquery;

                                    // bindquery = fieldsObj[fldi].query.bindquery;
                                }

                                defaultValue = BRVUtil.checkValue(fieldsObj[fldi].defaultvalue) ? app.GetDefaultvalue(fieldsObj[fldi].defaultvalue) : '';

                                // ToDo: Make field look like other input fields
                                if (BRVUtil.isBrowser()) {
                                    output += '<select name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" type="select"  ';
                                } else {
                                    output += '<select name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" type="select"  data-corners="false" ';
                                }

                                if (BRVUtil.checkValue(fieldsObj[fldi].onchange)) {
                                    onchange = fieldsObj[fldi].onchange;
                                    output += ' onChange="' + onchange.action + '(\'' + str_to_b64(JSON.stringify(onchange.param)) + '\', this)" ';
                                }

                                if (BRVUtil.checkValue(fieldsObj[fldi].onclick)) {
                                    var onclick = fieldsObj[fldi].onclick;
                                    output += ' onClick="' + onclick.action + '(\'' + onclick.param + '\', this)" ';
                                }

                                output += ' initValue="" ';

                                output += ' isOpen="false" ';

                                output += '>';

                                // Check if it's activateduserlogin screen, then do no add first empty option value.
                                // if ( JSONObject.id == 'activateduserlogin' ) {
                                // } else {
                                //									output += '<option value=""></option>';
                                // }

                                if (BRVUtil.checkValue(fieldsObj[fldi].placeholder)) {
                                    output += '<option value="" disabled selected>' + fieldsObj[fldi].placeholder + '</option>';
                                } else {
                                    output += '<option value=""></option>';
                                }

                                // Check if select has default values
                                if (BRVUtil.checkValue(defaultValues)) {
                                    for (var i = 0; i < defaultValues.length; i++) {
                                        var key = defaultValues[i].key;
                                        var value = defaultValues[i].value;
                                        //output += '<option value="' + key + '">' + value + '</option>';
                                        output += '<option value="' + key + '" ' + ((defaultValue == key) ? ' selected' : '') + '>' + value + '</option>';
                                    }
                                }

                                // ToDo: Do we still need 'getObjectData', cause we now buffer the queries and execute them at once after building the screen.
                                output += '</select>';

                                if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID)) {
                                    // only buffer request when it's not a QUERY_GENERAL request
                                    // if (BRVUtil.checkValue(query) && (queryReqID != app.QUERY_GENERAL || bufferquery)) {
                                    // if (BRVUtil.checkValue(query) && bufferquery) {

                                    if (BRVUtil.checkValue(query)) {
                                        bufferObjectQuery(fieldsObj[fldi], fieldsObj[fldi].id, fieldsObj[fldi].type, fieldsObj[fldi].keyfield);
                                    }

                                    // if (BRVUtil.checkValue(query) && !bindquery ) {
                                    // 	bufferObjectQuery(fieldsObj[fldi], fieldsObj[fldi].id, fieldsObj[fldi].type, fieldsObj[fldi].keyfield);
                                    // }
                                    // if (BRVUtil.checkValue(query) && bindquery ) { 
                                    // 	bindObjectQuery( fieldsObj[fldi], fieldsObj[fldi].id, fieldsObj[fldi].type, fieldsObj[fldi].keyfield);
                                    // }

                                }
                                break;

                            case "image":
                                output += '<p class="p-input"> ';

                                output += (fieldsObj[fldi].editable == 'false' && BRVUtil.checkValue(fieldsObj[fldi].url)) ? '<a href="' + BRVUtil.linkify(fieldsObj[fldi].url) + '" target="_blank">' : '';

                                output += '<img src="" name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" style="max-height: 100%; max-width: 100%; object-fit: contain; display: block; margin: auto auto;" >';

                                output += (fieldsObj[fldi].editable == 'false' && BRVUtil.checkValue(fieldsObj[fldi].url)) ? '</a>' : '';

                                output += '</p> ';
                                break;

                            case "selectdoc":
                                query = '';
                                queryAppID = '';
                                queryReqID = '';
                                keyFld = '';
                                // var bufferquery = false;
                                defaultValues = fieldsObj[fldi].values;
                                if (BRVUtil.checkValue(fieldsObj[fldi].query)) {
                                    query = b64_to_str(fieldsObj[fldi].query.query);
                                    queryAppID = fieldsObj[fldi].query.appid;
                                    queryReqID = fieldsObj[fldi].query.wepid;
                                    keyFld = fieldsObj[fldi].keyfield;
                                    // bufferquery = fieldsObj[fldi].query.bufferquery;
                                }

                                output += '<div name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" data-role="controlgroup">';

                                if (app.isBuilder) { // If Appbuilder create dummy field
                                    output += '<div class="ui-controlgroup-controls " data-type="horizontal" style="display: flex; margin-bottom:4px;" id="dummy">';
                                    output += '<a href="javascript:void(0)" data-role="button" data-mini="true" class="file_dummy" style="width:100%; border-width:1px; margin-right:5px;">';
                                    output += '</a>';
                                    output += '</div>';
                                }

                                output += '</div>';
                                if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID)) {
                                    // only buffer request when it's not a QUERY_GENERAL request
                                    // if (BRVUtil.checkValue(query) && ( queryReqID != app.QUERY_GENERAL || bufferquery ) ) {
                                    // if (BRVUtil.checkValue(query) && bufferquery ) {
                                    if (BRVUtil.checkValue(query)) {
                                        bufferObjectQuery(fieldsObj[fldi], fieldsObj[fldi].id, fieldsObj[fldi].type, fieldsObj[fldi].keyfield);
                                    }
                                }
                                break;

                            case "function":
                                fieldOnclick = fieldsObj[fldi].onclick;
                                if (typeof fieldOnclick != 'undefined') {
                                    fieldID = fieldsObj[fldi].id;
                                    fieldName = fieldsObj[fldi].name;
                                    output += '<a href="#" ';
                                    output += (fieldOnclick.action == 'ActivatePanel' && fieldOnclick.actionid != '') ? ' onclick="javascript:buildPanelFromJSON(\'' + fieldOnclick.actionid + '\')" ' : '';
                                    output += (fieldOnclick.action == 'GotoScreen' && fieldOnclick.screen != '') ? ' onclick="javascript:getScreenFromJSON(\'' + fieldOnclick.screen + '\', \'\', \'' + fieldOnclick.screenmode + '\')" ' : '';
                                    output += (fieldOnclick.action == 'ShowMessage' && fieldOnclick.message != '') ? ' onclick="javascript:app.showMessage(\'' + b64_to_str(fieldOnclick.message) + '\')" ' : '';
                                    output += ' id=' + fieldID + ' ';
                                    output += ' >' + fieldName + '</a>';
                                }
                                break;

                            case "button":
                                btnAccess = checkButtonAccess(fieldsObj[fldi]);
                                fieldOnclick = fieldsObj[fldi].onclick;

                                //Check if there's an 'AddFile' button and device if not AppInBrowser
                                if (!BRVUtil.isBrowser() && !app.isBuilder) {
                                    try {
                                        if (fieldOnclick.action == "AddFile") {
                                            btnAccess = false;
                                        }
                                    } catch (error) {}
                                }
                                //


                                if (btnAccess) {

                                    //									fieldOnclick = fieldsObj[fldi].onclick;
                                    if (typeof fieldOnclick != 'undefined') {
                                        fieldID = fieldsObj[fldi].id;
                                        fieldName = fieldsObj[fldi].name;
                                        var newScreenParams = '';

                                        if (typeof fieldOnclick != 'undefined') {
                                            newScreenParams = app.GetParams(fieldOnclick.screenparam);
                                            newScreenParams = 'b64|' + str_to_b64(newScreenParams);

                                        }
                                        output += '<a href="#" ';

                                        switch (fieldOnclick.action) {
                                            case "ActivatePanel":
                                                output += (fieldOnclick.actionid != '') ? ' onclick="javascript:buildPanelFromJSON(\'' + fieldOnclick.actionid + '\')" ' : '';
                                                break;

                                            case "GotoScreen":
                                                //output += (fieldOnclick.screen != '') ? ' onclick="javascript:getScreenFromJSON(\'' + fieldOnclick.screen + '\', \'\', \'' + fieldOnclick.screenmode + '\')" ' : '';
                                                //output += (fieldOnclick.screen != '') ? ' onclick="javascript:getScreenFromJSON(\'' + fieldOnclick.screen + '\', \'' + newScreenParams + '\', \'' + fieldOnclick.screenmode + '\')" ' : '';
                                                output += (fieldOnclick.screen != '') ? ' onclick="javascript:getScreenFromJSON(\'' + fieldOnclick.screen + '\', \'' + newScreenParams + '\', \'' + fieldOnclick.screenmode + '\', null, null, \'' + fieldID + '\')" ' : '';
                                                break;

                                            case "ShowMessage":
                                                output += (fieldOnclick.message != '') ? ' onclick="javascript:app.showMessage(\'' + b64_to_str(fieldOnclick.message) + '\')" ' : '';
                                                break;

                                            case "AddPicture":
                                                //output += ' onclick="javascript:AddPicture(\'' + fieldID + '\', \'\', \'' + newScreenParams + '\')" ';
                                                output += ' onclick="javascript:AddPicture(\'' + fieldID + '\', \'\', \'' + newScreenParams + '\')" ';
                                                break;

                                            case "AddFile":
                                                output += ' onclick="javascript:AddFile(\'' + fieldID + '\', \'\', \'' + newScreenParams + '\')" ';
                                                break;

                                            case "SaveFormData":
                                                var saveSuccess = (fieldOnclick.savesuccess) ? str_to_b64(JSON.stringify(fieldOnclick.savesuccess)) : '';

                                                // output += ' onclick="javascript:SaveFormData(\'' + str_to_b64(JSON.stringify(fieldOnclick.savesuccess)) + '\')" ';
                                                // output += ' onclick="javascript:SaveFormData(\'' + fieldID + '\', \'' + str_to_b64(JSON.stringify(fieldOnclick.savesuccess)) + '\', true)" ';
                                                output += ' onclick="javascript:SaveFormData(\'' + fieldID + '\', \'' + saveSuccess + '\', true)" ';
                                                break;

                                            case "CallQueryservice":
                                            case "CallWebservice":
                                                output += ' onclick="javascript:CallWebservice(\'' + fieldID + '\', \'\', true);" ';
                                                // if ( BRVUtil.isBool(fieldOnclick.useselect) ) {
                                                // 	app.activateLiCheckboxes = JSONObject.id;
                                                // }
                                                break;

                                            case "CallExtUrl":
                                                output += ' onclick="javascript:getExternalPage(\'' + fieldID + '\', true);" ';
                                                break;

                                            case "CallFunction":
                                                output += ' onclick="javascript:CallFunction(\'' + fieldID + '\', \'' + fieldOnclick.func + '\');" ';
                                                // if ( BRVUtil.isBool(fieldOnclick.useselect) ) {
                                                // 	app.activateLiCheckboxes = JSONObject.id;
                                                // }
                                                break;

                                                // case "AddPicture":
                                                // 	output += ' onclick="javascript:AddPicture(\'\', \'' + fieldID + '\', \'' + newScreenParams + '\');" ';
                                                // 	break;

                                            case "GetBarcode":
                                                //output += ' onclick="javascript:GetBarcode(\'' + fieldOnclick.target + '\');" ';
                                                break;

                                            case "GoBack":
                                                var steps = BRVUtil.checkValue(fieldOnclick.params) && BRVUtil.checkValue(fieldOnclick.params[0]) ? parseInt(fieldOnclick.params[0]) : 1;
                                                output += ' onclick="javascript:app.goPageRoute(' + steps + ');" ';
                                                break;

                                            default:
                                                output += '';
                                                break;
                                        }
                                        output += ' id=' + fieldID + ' ';
                                        //										output += ' data-role="button" data-mini="true" ';
                                        output += ' data-role="button" ';
                                        output += ' >' + fieldName + '</a>';
                                    }
                                }
                                break;


                            case "methodlist": // Loginmethods
                                // var listID 		= fieldsObj[fldi].id;
                                // output += '<ul name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-shadow"></ul>';
                                output += ' <div name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" class="ui-grid-solo"></div>';
                                break;


                            default:

                                if (app.screenMode == 'show') {
                                    tmpFldValue = (BRVUtil.checkValue(fieldsObj[fldi].defaultvalue)) ? app.GetDefaultvalue(fieldsObj[fldi].defaultvalue, fieldsObj[fldi].type) : '';
                                    output += '<p name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" ';
                                    if (subType == 'info') {
                                        output += ' class="p-info ui-shadow" ';
                                    } else {
                                        output += ' class="p-input ui-shadow" ';
                                    }
                                    output += ' fldtype= "' + fieldsObj[fldi].type + '" ';
                                    output += '>';
                                    output += tmpFldValue;
                                    output += '</p> ';
                                } else {
                                    //if ( JSONObject.id == 'authenticate' && app.checkPincode ) {
                                    if (JSONObject.id == 'authenticate' && (app.checkPincode || app.isBuilder)) {
                                        // if ( JSONObject.id == 'authenticate' && app.checkPincode && !app.checkPassword ) {
                                        // Add pincodefield div
                                        //if ( app.checkPincode) {
                                        output += '<br><div id="pincode"></div>';
                                        //} 
                                    } else
                                    if (JSONObject.id == 'changepincode') {
                                        // Add some pincode fields
                                        if (fieldsObj[fldi].type == 'pincode') {

                                            //if (app.checkPincode && fieldsObj[fldi].id == 'oldpincode') {
                                            if ((app.checkPincode || app.isBuilder) && fieldsObj[fldi].id == 'oldpincode') {
                                                output += '<br><div id="oldpincode"></div><br>';
                                            } else
                                            if (app.checkPassword && fieldsObj[fldi].id == 'oldpincode') {
                                                output += '<br><div id="oldpassword">';
                                                output += '<input ';
                                                output += ' type="password" class="ui-shadow" ';
                                                output += ' name="oldpassword" id="oldpassword" ';
                                                output += ' novalidate="novalidate" autocomplete="off" autocorrect="off" ';
                                                output += ' oldVal="" />';
                                                output += '</div><br>';
                                            }

                                            if (fieldsObj[fldi].id == 'newpincode1') {
                                                output += '<br><div id="newpincode1"></div><br>';
                                            }
                                            if (fieldsObj[fldi].id == 'newpincode2') {
                                                output += '<br><div id="newpincode2"></div><br>';
                                            }
                                        }
                                    } else
                                    // if ( JSONObject.id == 'changepassword' ) {
                                    // 	if (fieldsObj[fldi].type == 'password') {
                                    // 		if (fieldsObj[fldi].id == 'oldpassword') {
                                    // 			output += '<br><div id="oldpincode"></div><br>';
                                    // 		}
                                    // 		if (fieldsObj[fldi].id == 'newpassword1') {
                                    // 			output += '<br><div id="newpincode1"></div><br>';
                                    // 		}
                                    // 		if (fieldsObj[fldi].id == 'newpassword2') {
                                    // 			output += '<br><div id="newpincode2"></div><br>';
                                    // 		}
                                    // 	}
                                    // }else

                                    //For storing scan results
                                    // 'imagebuffer' is not ready yet!
                                    if (fieldsObj[fldi].type == 'imagebuffer') {

                                        output += '<a href="#" ';
                                        output += ' onclick="javascript:AddPhoto(\'' + fieldsObj[fldi].id + '\')" ';
                                        output += ' id="' + fieldsObj[fldi].id + '_button" ';
                                        output += ' data-role="button" ';
                                        output += ' >Foto toevoegen</a>';

                                        //Input field for counter of bufferfield content
                                        if (fieldsObj[fldi].showcounter) {
                                            output += '<input name="' + fieldsObj[fldi].id + '_counter" id="' + fieldsObj[fldi].id + '_counter" class="ui-shadow readonly" readonly value="0">';
                                        }

                                        //ListView of bufferedvalues
                                        if (fieldsObj[fldi].showresultlist) {
                                            var resultheight = (fieldsObj[fldi].resultheight) ? fieldsObj[fldi].resultheight : 0;
                                            // output += '<div class="listCont" style="overflow: hidden; overflow-y: scroll; -webkit-overflow-scrolling: touch; maxHeight: '+resultheight+'px;"><ul style="max-height:200px;" data-role="listview" name="' + fieldsObj[fldi].id + '_list" id="' + fieldsObj[fldi].id + '_list" data-inset="true" data-split-icon="delete" data-split-theme="a"></ul></div>';
                                            output += '<div class="listCont" style="overflow: hidden; overflow-y: scroll; -webkit-overflow-scrolling: touch; min-height: 10px;">';
                                            if (resultheight == 0) {
                                                output += '<ul data-role="listview" name="' + fieldsObj[fldi].id + '_list" id="' + fieldsObj[fldi].id + '_list" data-inset="true" data-split-icon="delete" data-split-theme="a"></ul>';
                                            } else {
                                                output += '<ul style="max-height:' + resultheight + 'px;" data-role="listview" name="' + fieldsObj[fldi].id + '_list" id="' + fieldsObj[fldi].id + '_list" data-inset="true" data-split-icon="delete" data-split-theme="a"></ul>';
                                            }
                                            output += '</div>';
                                        }

                                        //Hidden field for bufferedvalues
                                        output += '<textarea name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" class="ui-shadow ';
                                        output += (app.isBuilder) ? 'builderhidden' : ''; // If it's appbuilder then add 'builderhidden' class, but show field
                                        output += '" rows="5" oldVal="" _type="imagebuffer"';
                                        output += (app.isBuilder) ? '' : ' style="display:none;" '; // If it's appbuilder then do show this field
                                        output += '>';

                                        tmpFldID = fieldsObj[fldi].id;
                                        tmpFldValue = '';
                                        if (BRVUtil.checkValue(app.paramObject[tmpFldID])) {
                                            tmpFldValue = app.paramObject[tmpFldID];
                                        }

                                        if (tmpFldValue == '' && BRVUtil.checkValue(fieldsObj[fldi].defaultvalue)) {
                                            tmpFldValue = app.GetDefaultvalue(fieldsObj[fldi].defaultvalue, fieldsObj[fldi].type);

                                        }

                                        (BRVUtil.checkValue(tmpFldValue.toString())) ? output += tmpFldValue: '';

                                        output += '</textarea> ';


                                    } else
                                    //For storing scan results
                                    if (fieldsObj[fldi].type == 'textbuffer') {

                                        //Input field for counter of bufferfield content
                                        if (fieldsObj[fldi].showcounter) {
                                            output += '<input name="' + fieldsObj[fldi].id + '_counter" id="' + fieldsObj[fldi].id + '_counter" class="ui-shadow readonly" readonly value="0">';
                                        }

                                        //ListView of bufferedvalues
                                        if (fieldsObj[fldi].showresultlist) {
                                            var resultheight = (fieldsObj[fldi].resultheight) ? fieldsObj[fldi].resultheight : 0;
                                            // output += '<div class="listCont" style="overflow: hidden; overflow-y: scroll; -webkit-overflow-scrolling: touch; maxHeight: '+resultheight+'px;"><ul style="max-height:200px;" data-role="listview" name="' + fieldsObj[fldi].id + '_list" id="' + fieldsObj[fldi].id + '_list" data-inset="true" data-split-icon="delete" data-split-theme="a"></ul></div>';
                                            output += '<div class="listCont" style="overflow: hidden; overflow-y: scroll; -webkit-overflow-scrolling: touch; min-height: 10px;">';
                                            if (resultheight == 0) {
                                                output += '<ul data-role="listview" name="' + fieldsObj[fldi].id + '_list" id="' + fieldsObj[fldi].id + '_list" data-inset="true" data-split-icon="delete" data-split-theme="a"></ul>';
                                            } else {
                                                output += '<ul style="max-height:' + resultheight + 'px;" data-role="listview" name="' + fieldsObj[fldi].id + '_list" id="' + fieldsObj[fldi].id + '_list" data-inset="true" data-split-icon="delete" data-split-theme="a"></ul>';
                                            }
                                            output += '</div>';
                                        }

                                        //Hidden field for bufferedvalues
                                        output += '<textarea name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" class="ui-shadow ';
                                        output += (app.isBuilder) ? 'builderhidden' : ''; // If it's appbuilder then add 'builderhidden' class, but show field
                                        output += '" rows="5" oldVal="" _type="textbuffer"';
                                        output += (app.isBuilder) ? '' : ' style="display:none;" '; // If it's appbuilder then do show this field
                                        output += '>';

                                        tmpFldID = fieldsObj[fldi].id;
                                        tmpFldValue = '';
                                        if (BRVUtil.checkValue(app.paramObject[tmpFldID])) {
                                            tmpFldValue = app.paramObject[tmpFldID];
                                        }

                                        if (tmpFldValue == '' && BRVUtil.checkValue(fieldsObj[fldi].defaultvalue)) {
                                            tmpFldValue = app.GetDefaultvalue(fieldsObj[fldi].defaultvalue, fieldsObj[fldi].type);
                                        }

                                        (BRVUtil.checkValue(tmpFldValue.toString())) ? output += tmpFldValue: '';

                                        output += '</textarea> ';


                                    } else
                                    if (fieldsObj[fldi].type == 'textarea') {
                                        var rows = (BRVUtil.checkValue(fieldsObj[fldi].textarearows)) ? fieldsObj[fldi].textarearows : 5;

                                        //output += '<textarea name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" class="ui-shadow" rows="5"';
                                        output += '<textarea name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" class="ui-shadow" rows="' + rows + '"';

                                        BRVUtil.checkValue(fieldsObj[fldi].placeholder) ? output += ' placeholder= "' + fieldsObj[fldi].placeholder + '" ' : '';

                                        output += ' oldVal="" ';

                                        output += ' style="overflow-y:auto;" ';

                                        output += '>';

                                        tmpFldID = fieldsObj[fldi].id;
                                        tmpFldValue = '';
                                        if (BRVUtil.checkValue(app.paramObject[tmpFldID])) {
                                            tmpFldValue = app.paramObject[tmpFldID];
                                        }

                                        if (tmpFldValue == '' && BRVUtil.checkValue(fieldsObj[fldi].defaultvalue)) {
                                            tmpFldValue = app.GetDefaultvalue(fieldsObj[fldi].defaultvalue, fieldsObj[fldi].type);
                                        }

                                        (BRVUtil.checkValue(tmpFldValue.toString())) ? output += tmpFldValue: '';

                                        output += '</textarea> ';
                                    } else {
                                        // addfunction put icon after input field
                                        if (BRVUtil.checkValue(fieldsObj[fldi].addfunction) && !BRVUtil.isBrowser()) {
                                            output += ' <div class="ui-grid-a"> ';
                                            output += ' <div class="ui-block-a ui-block-amod"> ';
                                        }

                                        output += '<input ';

                                        switch (fieldsObj[fldi].type) {
                                            case "password":
                                                output += ' type="password" class="ui-shadow" ';
                                                break;
                                                //Handle number fields the same as currency fields
                                                // 											case "number":
                                                // 												if ( fieldsObj[fldi].hidenumspinner ) {
                                                // 													output += ' type="number" class="ui-shadow" '; 
                                                // 												} else {
                                                // //													output += ' type="number" data-role="" data-mini="true" data-options="" class="ui-shadow" '; 
                                                // 													if (BRVUtil.checkValue(fieldsObj[fldi].editable) && fieldsObj[fldi].editable == 'false') {
                                                // 														output += ' type="number" data-role="" data-options="" class="ui-shadow" '; 
                                                // 													} else {
                                                // 														output += ' type="number" data-role="" data-mini="true" data-options="" class="ui-shadow" '; 
                                                // 													}
                                                // 												}
                                                // 												(BRVUtil.checkValue(fieldsObj[fldi].minvalue)) ? output += ' min="'+fieldsObj[fldi].minvalue+'" ' : ''; 
                                                // 												(BRVUtil.checkValue(fieldsObj[fldi].maxvalue)) ? output += ' max="'+fieldsObj[fldi].maxvalue+'" ' : ''; 
                                                // 												break;
                                            case "date":
                                                output += ' data-role="date" type="text" class="ui-shadow" ';
                                                break;
                                            case "checkbox":
                                                output += ' type="checkbox" ';
                                                break;
                                            case "file":
                                                output += ' type="file" ';
                                                break;
                                            case "www":
                                                output += ' type="url" ';
                                                break;
                                            case "email":
                                                output += ' type="email" ';
                                                break;
                                            case "phone":
                                                output += ' type="tel" ';
                                                break;
                                            default:
                                                output += ' type="text" class="ui-shadow" ';
                                                break;
                                        }

                                        output += ' name="' + fieldsObj[fldi].id + '" id="' + fieldsObj[fldi].id + '" ';

                                        tmpFldID = fieldsObj[fldi].id;
                                        tmpFldValue = '';
                                        if (BRVUtil.checkValue(app.paramObject[tmpFldID])) {
                                            tmpFldValue = app.paramObject[tmpFldID];
                                        }

                                        if (tmpFldValue == '' && BRVUtil.checkValue(fieldsObj[fldi].defaultvalue)) {
                                            tmpFldValue = app.GetDefaultvalue(fieldsObj[fldi].defaultvalue, fieldsObj[fldi].type);
                                        }

                                        if (BRVUtil.checkValue(fieldsObj[fldi].onchange)) {
                                            onchange = fieldsObj[fldi].onchange;
                                            if (onchange.action != '') {
                                                output += ' onChange="' + onchange.action + '(\'' + str_to_b64(JSON.stringify(onchange.param)) + '\', this)" ';

                                                //Check if field calls 'ClickButton' on change.
                                                //In this case we need to disable this button for manually clicking.
                                                if (onchange.action == 'ClickButton') {
                                                    try {
                                                        if (BRVUtil.checkValue(onchange.param[0].buttonid)) {
                                                            app.disableFooterButtons.push(onchange.param[0].buttonid);
                                                        }
                                                    } catch (e) {}
                                                }
                                            }
                                        }

                                        if (fieldsObj[fldi].type == 'checkbox') {
                                            if (BRVUtil.checkValue(tmpFldValue.toString())) {
                                                (BRVUtil.isBool(tmpFldValue)) ? output += ' checked ': '';
                                                output += ' refresh="true" ';
                                            }
                                        }

                                        (BRVUtil.checkValue(tmpFldValue.toString())) ? output += ' value="' + tmpFldValue + '" ': '';
                                        (BRVUtil.checkValue(tmpFldValue.toString())) ? output += ' defaultvalue="' + tmpFldValue + '" ': '';

                                        (BRVUtil.checkValue(fieldsObj[fldi].length)) ? output += ' size="' + fieldsObj[fldi].length + '" ': '';
                                        (BRVUtil.checkValue(fieldsObj[fldi].length)) ? output += ' maxlength="' + fieldsObj[fldi].length + '" ': '';

                                        output += ' novalidate="novalidate" autocomplete="off" autocorrect="off" ';

                                        output += ' fldtype= "' + fieldsObj[fldi].type + '" ';

                                        BRVUtil.checkValue(fieldsObj[fldi].placeholder) ? output += ' placeholder= "' + fieldsObj[fldi].placeholder + '" ' : '';

                                        output += ' oldVal="" />';

                                        // addfunction put icon after input field
                                        if (BRVUtil.checkValue(fieldsObj[fldi].addfunction) && !BRVUtil.isBrowser()) {
                                            output += ' </div> ';
                                            output += ' <div class="ui-block-b ui-block-bmod"> ';
                                            output += '<a href="javascript:CallFunction(\'\', \'' + fieldsObj[fldi].addfunction.action + '\', \'' + fieldsObj[fldi].addfunction.param + '\' )"  data-role="button" data-mini="false" data-icon="' + fieldsObj[fldi].addfunction.icon + '" data-inline="true" data-iconpos="notext" style="border-width:1px;"';
                                            output += ' name="' + fieldsObj[fldi].id + '_function" id="' + fieldsObj[fldi].id + '_function" ';
                                            output += '></a>';
                                            output += ' </div> ';
                                            output += ' </div> ';
                                        }

                                    }
                                }

                                break;
                        }
                        output += '</div>';

                    } // showOnScreenMode

                } catch (e) {}

            }
            break;

        case "text":
            var bodyText = b64_to_str(JSONObject.content.body);
            // Check for errormessage, replace <errormsg> in bodytext with errormessage
            if (BRVUtil.checkValue(JSONObject.content.showlasterror)) {
                if (JSONObject.content.showlasterror == 'true' && BRVUtil.checkValue(app.lastErrorMsg)) {
                    // var errorMessage = app.lastErrorMsg;
                    // bodyText = bodyText.replace('<errormsg>', errorMessage);
                    var errorMessage = (app.wsErrorCode) ? app.wsErrorCode : app.lastErrorMsg;
                    (app.lastErrorMsg.indexOf(app.wsErrorCode) > 0) ? errorMessage = app.lastErrorMsg: ''; // If wsErrorCode in lastErrorMsg then show lastErrorMsg!!

                    bodyText = bodyText.replace('<errormsg>', errorMessage);

                    // Clear the errormessage
                    app.lastErrorMsg = '';
                }
            }
            output += replaceVarsInText(bodyText);
            break;

        case "buttons":

            // var bcquery = null;
            // var bcqueryAppID = null;
            // var bcqueryReqID = null;

            var buttonOBJ = JSONObject.content.body.buttons;

            // ToDo: Get columns from storage
            var buttonCols = JSONObject.content.body.buttonscols;

            var buttonColsStorageValue = app.GetFromPhoneStorage('buttonscreencolumns');
            buttonCols = BRVUtil.checkValue(buttonColsStorageValue) ? parseInt(buttonColsStorageValue) : buttonCols;

            var buttonDataRole = JSONObject.content.body.buttonsdatarole;
            var buttonClass = JSONObject.content.body.buttonsclass;
            var buttonDatashadow = (BRVUtil.isBool(JSONObject.content.body.buttonsdatashadow)) ? "true" : "false";
            var buttonStyle = (BRVUtil.checkValue(JSONObject.content.body.buttonsstyle)) ? JSONObject.content.body.buttonsstyle : '';
            // var buttonHeight 		= (BRVUtil.checkValue(JSONObject.content.body.buttonsheight))?JSONObject.content.body.buttonsheight:'';
            // var buttonWidth 			= (BRVUtil.checkValue(JSONObject.content.body.buttonswidth))?JSONObject.content.body.buttonswidth:'';
            // var buttonslabelfontsize	= (BRVUtil.checkValue(JSONObject.content.body.buttonslabelfontsize))?JSONObject.content.body.buttonslabelfontsize:'';

            // buttonHeight	= (buttonHeight && buttonWidth) ? buttonHeight : '100px'; 
            // buttonWidth	= (buttonHeight && buttonWidth) ? buttonWidth : '100px'; 

            //Build array with queries
            // var QueryArray = new Array();

            if (typeof buttonOBJ != 'undefined') {
                // Create columns
                switch (buttonCols) {
                    case 0:
                        colClass = "ui-grid-none";
                        break;
                    case 1:
                        colClass = "ui-grid-solo";
                        break;
                    case 2:
                        colClass = "ui-grid-a";
                        break;
                    case 3:
                        colClass = "ui-grid-b";
                        break;
                    case 4:
                        colClass = "ui-grid-c";
                        break;
                    case 5:
                        colClass = "ui-grid-d";
                        break;
                    default:
                        buttonCols = 1;
                        colClass = "ui-grid-solo";
                        break;
                }
                output += '<div class="' + colClass + '">';
                var curNr = 0;
                var SomeOptionsVisible = false;
                // Create buttons
                for (var btni = 0; btni < buttonOBJ.length; btni++) {
                    var buttonID = buttonOBJ[btni].id;
                    var buttonName = buttonOBJ[btni].name;
                    var buttonImage = buttonOBJ[btni].image;
                    var buttonOnclick = buttonOBJ[btni].onclick;
                    var buttonBubbleCountQuery = buttonOBJ[btni].bubblecountquery;

                    if (typeof buttonOnclick != 'undefined') {

                        //Get screenparams
                        var newButtonOnclick = '';
                        var newButtonOnclickTmp = '';
                        if (app.paramObject) {
                            if (BRVUtil.checkValue(buttonOnclick.screenparam)) {
                                newButtonOnclickTmp = buttonOnclick.screenparam;
                                var buttonScreenParams = buttonOnclick.screenparam.split('|');
                                for (a = 0; a < buttonScreenParams.length; a++) {
                                    if (BRVUtil.checkValue(buttonScreenParams[a])) {
                                        var buttonScreenParam = buttonScreenParams[a].split('=');
                                        var searchFld = buttonScreenParam[0];
                                        newButtonOnclickTmp = newButtonOnclickTmp.replace('<' + searchFld + '>', app.paramObject[searchFld]);
                                    }
                                }
                            }
                            newButtonOnclick = newButtonOnclickTmp;
                            newButtonOnclick = (newButtonOnclick) ? 'b64|' + str_to_b64(newButtonOnclick) : '';
                        }

                        // Check for button access and license
                        btnAccess = checkButtonAccess(buttonOBJ[btni]);


                        // Just for AppInBrowser, when button not available do keep it's space!
                        /*                        if (BRVUtil.isBrowser() && buttonOnclick.action == 'GotoScreen' && buttonOnclick.screen != '' && !btnAccess) {*/
                        if (BRVUtil.isBrowser() && buttonOnclick.action == 'GotoScreen' && !btnAccess) {
                            tempChr = String.fromCharCode(curNr + 97);
                            tempImg = '';

                            if (buttonCols == 0) {
                                output += '<div class="ui-block-none">';
                            } else {
                                output += '<div class="ui-block-' + tempChr + '">';
                            }

                            output += '&nbsp;</div>';
                            (parseInt(curNr) < parseInt(buttonCols - 1)) ? curNr++ : curNr = 0;
                            //SomeOptionsVisible = true;
                        }
                        //


                        /*						// Just for AppInBrowser, when button is available but no screen is set, just keep it's space
                                                if (BRVUtil.isBrowser() && buttonOnclick.action == 'GotoScreen' && !BRVUtil.checkValue(buttonOnclick.screen) && btnAccess) {
                                                    tempChr = String.fromCharCode(curNr + 97);
                                                    tempImg = '';

                                                    if (buttonCols == 0) {
                                                        output += '<div class="ui-block-none">';
                                                    } else {
                                                        output += '<div class="ui-block-' + tempChr + '">';
                                                    }

                                                    output += '&nbsp;</div>';
                                                    (parseInt(curNr) < parseInt(buttonCols - 1)) ? curNr++ : curNr = 0;
                                                    //SomeOptionsVisible = true;
                        						} else
                        */ // Not AppInBrowser, just do default!
                        if (buttonOnclick.action == 'GotoScreen' && btnAccess) {
                            tempChr = String.fromCharCode(curNr + 97);

                            if (BRVUtil.checkValue(buttonImage)) {
                                tempImg = '';
                                tempImg += '<div class="buttonWrapper">';
                                // tempImg += '<img src="' + buttonImage + '" class="buttonimage" style="'+buttonStyle+'">';
                                tempImg += '<img src="' + buttonImage + '" class="buttonimage" style="' + buttonStyle + '">';

                                //Add bubblecount
                                if (BRVUtil.checkValue(buttonBubbleCountQuery)) {
                                    if (BRVUtil.checkValue(buttonBubbleCountQuery.wepid) && BRVUtil.checkValue(buttonBubbleCountQuery.target)) {
                                        var buttonTarget = buttonBubbleCountQuery.target;
                                        tempImg += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all countBubl  ui-shadow" bgcol="' + buttonBubbleCountQuery.bgcolor + '" bgcolnull="' + buttonBubbleCountQuery.bgcolornull + '" txtcol="' + buttonBubbleCountQuery.textcolor + '"   txtcolnull="' + buttonBubbleCountQuery.textcolornull + '" hidewhennull="' + buttonBubbleCountQuery.hidewhennull + '" id="' + buttonTarget + '" style="display: none;"></span>';
                                    }
                                }

                                tempImg += '</div><br>';
                            } else {
                                tempImg = '';
                            }

                            if (buttonCols == 0) {
                                output += '<div class="ui-block-none">';
                            } else {
                                output += '<div class="ui-block-' + tempChr + '">';
                            }


                            if (BRVUtil.isBrowser() && !BRVUtil.checkValue(buttonOnclick.screen) && (BRVUtil.checkValue(buttonOnclick.screenparam) && buttonOnclick.screenparam.indexOf('dummy') >= 0)) {
                                // If AppinBrowser and no screen and screenparam contains 'dummy'
                                // Do nothing!!!
                            } else {
                                // Do default
                                if (BRVUtil.isBrowser() && !BRVUtil.checkValue(buttonOnclick.screen)) {
                                    output += '<a id="' + buttonID + '" href="#" onclick="javascript:void(0);" ';
                                } else {
                                    output += '<a id="' + buttonID + '" href="#" onclick="javascript:getScreenFromJSON(\'' + buttonOnclick.screen + '\' , \'' + newButtonOnclick + '\', \'' + buttonOnclick.screenmode + '\')" ';
                                }

                                if (BRVUtil.checkValue(buttonClass)) {
                                    output += ' class="' + buttonClass + '" ';
                                } else {
                                    output += ' class="ui-shadow ui-btn" ';
                                }

                                if (BRVUtil.checkValue(buttonDataRole)) {
                                    output += ' data-role="' + buttonDataRole + '" ';
                                }
                                if (BRVUtil.checkValue(buttonDatashadow)) {
                                    output += ' data-shadow="' + buttonDatashadow + '" ';
                                }

                                // output += '>' + tempImg + buttonName + '</a>';

                                // buttonName =  (BRVUtil.checkValue(buttonslabelfontsize)) ? '<font size="'+buttonslabelfontsize+'">'+buttonName+'</font>' : buttonName;

                                var buttonscreenlabels = app.GetFromPhoneStorage('buttonscreenlabels');
                                if (BRVUtil.checkValue(buttonscreenlabels)) {
                                    if (BRVUtil.isBool(buttonscreenlabels)) {
                                        // output += '>' + tempImg + buttonName;
                                        output += '>' + tempImg + buttonName;
                                        output += '</a>';
                                    } else {
                                        output += '>' + tempImg;
                                        output += '</a>';
                                    }
                                } else {
                                    output += '>' + tempImg + buttonName;
                                    output += '</a>';
                                }

                            }

                            output += '</div>';
                            (parseInt(curNr) < parseInt(buttonCols - 1)) ? curNr++ : curNr = 0;
                            SomeOptionsVisible = true;
                        }
                    }

                    // Create bubblecount query
                    if (BRVUtil.checkValue(buttonBubbleCountQuery)) {

                        // if (BRVUtil.checkValue(buttonBubbleCountQuery.wepid) && BRVUtil.checkValue(buttonBubbleCountQuery.target) ) {
                        // 	var bcquery = BRVUtil.parseJSON( b64_to_str( buttonBubbleCountQuery.query )); 
                        // 	if ( BRVUtil.checkValue(bcquery.Select.Into) && BRVUtil.Left( bcquery.Select.Into, 13 ) != 'buttonbubble_' ) {
                        // 		bcquery.Select.Into = 'buttonbubble_' + bcquery.Select.Into;
                        // 	}
                        // 	bcquery = str_to_b64( JSON.stringify(bcquery) );
                        // 	buttonBubbleCountQuery.query = bcquery;
                        // 	app.BufferedQueryObj.push(buttonBubbleCountQuery);
                        // }

                        if (BRVUtil.checkValue(buttonBubbleCountQuery.wepid) && BRVUtil.checkValue(buttonBubbleCountQuery.target)) {
                            var bcquery = buttonBubbleCountQuery.query;

                            // var test = bcquery;
                            // try {
                            //     test = b64_to_str(test);
                            // } catch (err) {
                            //     console.log('err: ', err);

                            // }

                            if (BRVUtil.Left(bcquery, 1) != '{') {
                                bcquery = b64_to_str(bcquery);
                            }

                            bcquery = BRVUtil.parseJSON(bcquery);

                            if (BRVUtil.checkValue(bcquery.Select.Into) && BRVUtil.Left(bcquery.Select.Into, 13) != 'buttonbubble_') {
                                bcquery.Select.Into = 'buttonbubble_' + bcquery.Select.Into;
                            }
                            bcquery = str_to_b64(JSON.stringify(bcquery));
                            buttonBubbleCountQuery.query = bcquery;
                            app.BufferedQueryObj.push(buttonBubbleCountQuery);
                        }
                    }
                    // 

                }

                if (!app.isBuilder) {
                    // Check for bodytext.
                    if (!SomeOptionsVisible) {
                        var noneaccesstext = '';
                        noneaccesstext += '<center>';
                        noneaccesstext += '<br><br><h1>Onvoldoende rechten</h1><br>';
                        noneaccesstext += 'U heeft geen toegang tot de onderdelen<br>';
                        noneaccesstext += 'binnen deze administratie!<br>';
                        noneaccesstext += 'Controleer of u de juiste administratie heeft geopend.';
                        noneaccesstext += '</center>';
                        output += noneaccesstext;
                    }
                }
                output += '</div>';
            }

            // var newQuery = '{"Select": [' + eval(QueryArray) + ']}';
            // if (BRVUtil.checkValue(bcqueryAppID) && BRVUtil.checkValue(bcqueryReqID) && BRVUtil.checkValue(newQuery)) {
            // 	app.doRequestGWRWAW(newQuery, bcqueryAppID, bcqueryReqID, showFieldsFormResult, showWSError, '', '');
            // }

            break;

        default:
            break;
    }

    // Check for bodytext.
    if (BRVUtil.checkValue(JSONObject.content.bodybottomtext)) {
        var bodybottomtext = b64_to_str(JSONObject.content.bodybottomtext);
        bodybottomtext = replaceVarsInText(bodybottomtext);

        output += '<div id="bodybottomtext">' + bodybottomtext + '</div>';
    } else {
        output += '<div id="bodybottomtext"></div>';
    }

    // Close the main DIV
    output += '</div>';


    // Append new content to the main DIV
    $("#content_table").append(output);

    // If user needs to change password to pincode, then show some helptext in top of screen.
    if (JSONObject.id == 'changepincode') {
        if (app.checkPincode) {} else
        if (app.checkPassword) {
            var message = app.translateMessage('CHANGEPWDTEXT');
            $('#bodytoptext').html(message);
        }
    }

    // CHECK app.BufferedQueryObj
    if (app.BufferedQueryObj && app.BufferedQueryObj.length > 0) {
        doBufferedQuerys();
    }


    if (JSONObject.content.type == "fieldsform") {
        var decimals = 0;
        var allowMinus = true;

        fieldsObj = JSONObject.content.fields;
        for (var fld = 0; fld < fieldsObj.length; fld++) {
            BRVUtil.setFieldClass(fieldsObj[fld]);

            // Check if it's info screen and we need to hide some fields!!
            if (subType == 'info') {
                if ($('#' + fieldsObj[fld].id).is("p")) {
                    fldValue = $('#' + fieldsObj[fld].id).text();
                    if (fieldsObj[fld].hidewhenempty && BRVUtil.alltrim(fldValue) == '') {
                        $("#" + fieldsObj[fld].id).parent().hide();
                    }
                }
            }
            //

            switch (fieldsObj[fld].type) {
                case "date":
                    if (!BRVUtil.checkFieldClass(fieldsObj[fld].id, "readonly")) {
                        setTimeout(function(arg1) {
                            $(arg1).datepicker({
                                showWeek: true,
                                changeMonth: false,
                                changeYear: false,
                                firstDay: 1,
                                dateFormat: "dd-mm-yy",
                                dayNamesMin: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
                                dayNames: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
                                monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
                                monthNames: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"]
                            });
                            $(arg1).prop('readonly', true);
                        }, 200, '#' + fieldsObj[fld].id);
                    }
                    break;
                case "textarea":
                    if (!BRVUtil.checkFieldClass(fieldsObj[fld].id, "readonly")) {
                        setTimeout(function(arg1) {
                            if ($(arg1).is("textarea")) {
                                $(arg1).textinput("option", "autogrow", false);
                            }
                        }, 200, '#' + fieldsObj[fld].id);
                    }
                    break;

                case "email":
                    if (fieldsObj[fld].activateinputmask) {
                        $('#' + fieldsObj[fld].id).attr("data-inputmask", "'alias': 'email'");
                        $('#' + fieldsObj[fld].id).attr("inputmode", "email");
                    }
                    break;

                case "phone":
                    // +(31) 612345678
                    // 06-12345678
                    // 06-123 456 78
                    if (fieldsObj[fld].activateinputmask) {
                        $('#' + fieldsObj[fld].id).attr("data-inputmask-regex", "^[-0-9()+]*$");
                        $('#' + fieldsObj[fld].id).attr("inputmode", "numeric");
                    }
                    break;

                case "whatsapp":
                    // +(31) 612345678
                    // 06-12345678
                    // 06-123 456 78
                    if (fieldsObj[fld].activateinputmask) {
                        $('#' + fieldsObj[fld].id).attr("data-inputmask-regex", "^[-0-9()+]*$");
                        $('#' + fieldsObj[fld].id).attr("inputmode", "numeric");
                    }
                    break;

                case "sms":
                    // +(31) 612345678
                    // 06-12345678
                    // 06-123 456 78
                    if (fieldsObj[fld].activateinputmask) {
                        $('#' + fieldsObj[fld].id).attr("data-inputmask-regex", "^[-0-9()+]*$");
                        $('#' + fieldsObj[fld].id).attr("inputmode", "numeric");
                    }
                    break;

                    //Handle number fields the same as currency fields
                case "number":
                case "currency":
                    if (app.screenMode != 'show' && (fieldsObj[fld].editable == "" || fieldsObj[fld].editable != 'false')) { // Only activate spinner when not in show modus
                        if (fieldsObj[fld].hidenumspinner) {
                            // Don't show number spinner

                            //https://github.com/RobinHerbots/Inputmask
                            // Add inputmask !!
                            if (fieldsObj[fld].activateinputmask) {
                                decimals = (fieldsObj[fld].decimals) ? fieldsObj[fld].decimals : 0;
                                allowMinus = (fieldsObj[fld].blockminus) ? !fieldsObj[fld].blockminus : true;

                                //$('#' + fieldsObj[fld].id).attr("data-inputmask", "'alias': 'decimal', 'rightAlign': false, 'positionCaretOnClick': 'radixFocus', 'groupSeparator': '', 'radixPoint': ',', 'digits': " + decimals + ", 'digitsOptional': false");
                                $('#' + fieldsObj[fld].id).attr("data-inputmask", "'alias': 'decimal', 'rightAlign': false, 'positionCaretOnClick': 'radixFocus', 'groupSeparator': '', 'radixPoint': ',', 'digits': " + decimals + ", 'digitsOptional': false, 'allowMinus':" + allowMinus);
                                $('#' + fieldsObj[fld].id).attr("inputmode", "decimal");
                            }

                        } else {
                            // Add spinner to number field
                            $('#' + fieldsObj[fld].id).attr("data-options", '{"type":"horizontal", "inputWidth":"100px"}');
                            $('#' + fieldsObj[fld].id).attr("data-role", "spinbox");
                            (fieldsObj[fld].step) ? $('#' + fieldsObj[fld].id).attr("step", fieldsObj[fld].step): '';
                            $('#' + fieldsObj[fld].id).removeClass("ui-shadow");
                            $('#' + fieldsObj[fld].id).parent().css("padding", "1.5px 0px");
                        }

                        // ToDo: Select value on touch!
                        // Selecting the value will cause a popup 'Knippen, Kopieren, Plakken, Alles Selecteren'
                        // Better way: Keep current functionality and add 'edit' button on right of control which activates numkeyboard. But when user types first number we need 
                        // to clear old input first!!
                        // 
                        // $('#' +  fieldsObj[fld].id).focus(function() { 
                        // $(this).select(); // Select value
                        // $(this).val('');  // Clear old input
                        // });						

                        // If box is empty, then set oldValue
                        $('#' + fieldsObj[fld].id).blur(function() {
                            var oldVal = $(this).attr("oldVal");
                            ($(this).val() == '' && oldVal) ? $(this).val(oldVal): '';
                        });

                        //ATY: Move down so we can set on all fields!!
                        /* // Check fldClearOnFocus
                        if (fieldsObj[fld].clearonfocus && fieldsObj[fld].setfocus) {
                            $('#' + fieldsObj[fld].id).val(''); // Clear old input
                        }
                        if (fieldsObj[fld].clearonfocus) {
                            $('#' + fieldsObj[fld].id).click(function() {
                                var oldVal = $(this).val();
                                $(this).attr("oldVal", oldVal);
                                $(this).val(''); // Clear old input
                            });
                        }*/
                    }
                    break;

                    //Handle number fields the same as currency fields
                    // case "number":
                    // 	if ( app.screenMode != 'show' && (fieldsObj[fld].editable=="" || fieldsObj[fld].editable!='false') ) { // Only activate spinner when not in show modus
                    // 		if ( fieldsObj[fld].hidenumspinner ) {
                    // 			// Don't show number spinner

                    // 			// Add inputmask !!
                    // 			if ( fieldsObj[fld].activateinputmask ) {
                    // 				decimals = (fieldsObj[fld].decimals) ? fieldsObj[fld].decimals : 0;
                    // 				$('#' +  fieldsObj[fld].id).attr( "data-inputmask", "'alias': 'numeric', 'rightAlign': false, 'digits': " + decimals + ", 'digitsOptional': false" );
                    // 				$('#' +  fieldsObj[fld].id).attr( "inputmode", "numeric" );
                    // 			}

                    // 		} else {
                    // 		// Add spinner to number field
                    // 		$('#' +  fieldsObj[fld].id).attr( "data-options", '{"type":"horizontal", "inputWidth":"100px"}' );
                    // 		$('#' +  fieldsObj[fld].id).attr( "data-role", "spinbox" );
                    // 		(fieldsObj[fld].step) ? $('#' +  fieldsObj[fld].id).attr( "step", fieldsObj[fld].step ) : '';
                    // 		$('#' +  fieldsObj[fld].id).removeClass( "ui-shadow" );
                    // 		$('#' +  fieldsObj[fld].id).parent().css( "padding", "1.5px 0px" );
                    // 		}

                    // 		// ToDo: Select value on touch!
                    // 		// Selecting the value will cause a popup 'Knippen, Kopieren, Plakken, Alles Selecteren'
                    // 		// Better way: Keep current functionality and add 'edit' button on right of control which activates numkeyboard. But when user types first number we need 
                    // 		// to clear old input first!!
                    // 		// 
                    // 		// $('#' +  fieldsObj[fld].id).focus(function() { 
                    // 			// $(this).select(); // Select value
                    // 			// $(this).val('');  // Clear old input
                    // 		// });						

                    // 		// If box is empty, then set oldValue
                    // 		$('#' +  fieldsObj[fld].id).blur(function() { 
                    // 			var oldVal = $(this).attr( "oldVal" );
                    // 			( $(this).val() == '' && oldVal ) ? $(this).val(oldVal) : ''; 
                    // 		});						

                    // 		// Check fldClearOnFocus
                    // 		if (fieldsObj[fld].clearonfocus && fieldsObj[fld].setfocus) {
                    // 			$('#' +  fieldsObj[fld].id).val('');  // Clear old input
                    // 		}
                    // 		if (fieldsObj[fld].clearonfocus) {
                    // 			$('#' +  fieldsObj[fld].id).click(function() { 
                    // 				var oldVal = $(this).val();
                    // 				$(this).attr( "oldVal", oldVal );
                    // 				$(this).val('');  // Clear old input
                    // 			 });						
                    // 		}
                    // 	}
                    // 	break;

                case "button":
                    // Remove button class??
                    setTimeout(function(arg1) {
                        var fldtmp = '#' + arg1.id;
                        $(fldtmp).removeClass('ui-corner-all');
                        $(fldtmp).removeClass('readonly');

                        // Check if button classes need to be removed
                        var removeButtonClass = BRVUtil.isBool(arg1.removebuttonclass) ? arg1.removebuttonclass : false;
                        if (removeButtonClass) {
                            $(fldtmp).addClass('flat-btn');
                            $(fldtmp).removeClass('ui-shadow');
                        }

                    }, 200, fieldsObj[fld]);
                    break;

                case "checkbox": // trigger change event.
                    setTimeout(function(arg1) {
                        if (BRVUtil.isBool($(arg1).attr("refresh"))) {
                            $(arg1).change();
                        }
                    }, 50, '#' + fieldsObj[fld].id);
                    break;

                    // Check for preset value and trigger onchange if object has onchange property!!					
                case "text": // trigger change event.
                    setTimeout(function(arg1) {
                        if (BRVUtil.checkValue(arg1.onchange)) {
                            if (BRVUtil.checkValue($('#' + arg1.id).attr("value"))) {
                                $('#' + arg1.id).change();
                            }
                        }
                    }, 50, fieldsObj[fld]);
                    break;

                    // Check for textbuffer data in storage
                case "textbuffer":
                    setTimeout(function(arg1) {
                        getTextBuffer(arg1);
                    }, 100, fieldsObj[fld].id);
                    break;

                    // Check for imagebuffer data in storage
                case "imagebuffer":
                    setTimeout(function(arg1) {
                        getImageBuffer(arg1);
                    }, 100, fieldsObj[fld].id);
                    break;


                default:
                    break;
            }


            //ATY: Here we check if we need to clear field on focus!!
            // Check fldClearOnFocus
            if (fieldsObj[fld].clearonfocus && fieldsObj[fld].setfocus) {
                $('#' + fieldsObj[fld].id).val(''); // Clear old input
            }
            if (fieldsObj[fld].clearonfocus) {
                $('#' + fieldsObj[fld].id).click(function() {
                    var oldVal = $(this).val();
                    $(this).attr("oldVal", oldVal);
                    $(this).val(''); // Clear old input
                });
            }
            //


            // Check if we need to set focus to a field.
            if (BRVUtil.isBool(fieldsObj[fld].setfocus)) {
                setTimeout(function(arg1) {
                    $(arg1).focus();
                }, 200, '#' + fieldsObj[fld].id);
            }


        }

        //Apply input masks!
        try {
            Inputmask().mask(document.querySelectorAll("input"));
        } catch (error) {}


        if (BRVUtil.isBrowser()) {
            var orientation = parent.$("#tabletDiv").attr('class');
            if (orientation == 'landscape') {
                switch (JSONObject.id) {
                    case 'activatedevice':
                        break;
                    case 'dummy1':
                        break;
                    case 'dummy':
                        break;
                    default:
                        $('#content_table').addClass('fieldsform');
                }
            }
        }

    }

    // Build screen footer
    buildFooterFromJSON();

    // When its App Browser then resize some elements when user resizes browser!!
    if (BRVUtil.isBrowser()) {
        setContentTableSize();
    }

    // Get screen data
    getScreenData();

    // Render main DIV
    $("#page-home").trigger("create");


    // // Reset top of content_table based on header position+height
    // setTimeout(function () {
    // 	// Fade screen to visible
    // 	$("#content_table").fadeIn(600);

    // 	if ( !app.isBuilder) {
    // 		var headerTop = -1;
    // 		var headerHeight = parseInt( $('#header').height() );
    // 		var newContentTopPos = headerTop + headerHeight;
    // 		$('#content_table').offset({top: newContentTopPos});
    // 		window.scrollTo(0, 0);
    // 	}
    // }, 50);

    // Check if we are in authentication screen and user must login with pincode
    //if ( JSONObject.id == 'authenticate' && app.checkPincode) {
    if (JSONObject.id == 'authenticate' && (app.checkPincode || app.isBuilder)) {
        var pincode = $('#pincode').pinlogin({
            fields: 5,
            placeholder: '*',
            reset: false,
            autofocus: true,
            complete: function(pin) {
                // Check if pincode is correct and login!
                ValidatePincode(pin);

                // Reset pincode fields
                pincode.reset();
            }
        });
        setTimeout(function() {

            //Prevent jQuery from recreating the pincode fields!
            $('#pincode_pinlogin_0').attr('data-role', 'none');
            $('#pincode_pinlogin_1').attr('data-role', 'none');
            $('#pincode_pinlogin_2').attr('data-role', 'none');
            $('#pincode_pinlogin_3').attr('data-role', 'none');
            $('#pincode_pinlogin_4').attr('data-role', 'none');


            // Set focus to first pincode field
            $('#pincode_pinlogin_0').focus();

            // Set label to center of screen
            var label = $("label").attr("for", "password");
            $(label).css("text-align", "center");

            // Change old field label
            var pincodeLabel = app.translateMessage('ENTER_PINCODE');
            $(label).html(pincodeLabel);

        }, 100);
    }

    // Check if we are in changepassword screen and we need to set pincode
    // if ( JSONObject.id == 'changepassword' && app.checkPincode) {
    // if ( JSONObject.id == 'changepassword') {
    if (JSONObject.id == 'changepincode') {
        app.newPincodeObj = new Object();

        var newpincode2 = $('#newpincode2').pinlogin({
            fields: 5,
            placeholder: '*',
            reset: false,
            autofocus: true,
            complete: function(pin) {

                var oldPassword = $("input[id*='oldpassword']").val();
                app.newPincodeObj.oldPassword = BRVUtil.checkValue(oldPassword) ? oldPassword : '';

                // Store newPin2 to app object
                app.newPincodeObj.newPin2 = pin;

                if (app.newPincodeObj.newPin1 != app.newPincodeObj.newPin2) {
                    // Set bordercolor to error (red)
                    $("input[id*='newpincode1_pinlogin_']").css("border-color", "#ff0000");
                    $("input[id*='newpincode2_pinlogin_']").css("border-color", "#ff0000");

                    app.newPincodeObj = new Object();

                    // reset both instances
                    newpincode1.reset();
                    newpincode2.reset();

                    // disable repeat instance
                    newpincode2.disable();

                    // set focus to first instance again
                    newpincode1.focus(0);

                    var message = 'PINCODE_MISMATCH';
                    app.showMessage(message);
                } else {
                    // Go save new pin
                    // Do not automatically save, let user click save button!
                    // ChangePincode();
                }

            }
        });

        var newpincode1 = $('#newpincode1').pinlogin({
            fields: 5,
            placeholder: '*',
            reset: false,
            autofocus: true,
            complete: function(pin) {
                // Set bordercolor to default
                $("input[id*='newpincode1_pinlogin_']").css("border-color", "#8c8c8c");
                $("input[id*='newpincode2_pinlogin_']").css("border-color", "#8c8c8c");

                // Store newPin1 to app object
                app.newPincodeObj.newPin1 = pin;

                // goto first field of new pincode2 
                newpincode2.focus(0);

            }
        });


        var oldpincode = $('#oldpincode').pinlogin({
            fields: 5,
            placeholder: '*',
            reset: false,
            autofocus: true,
            complete: function(pin) {

                // Store oldPin to app object
                app.newPincodeObj.oldPin = pin;

                // goto first field of new pincode1
                newpincode1.focus(0);

                // disable this instance
                oldpincode.disable();
            }
        });


        setTimeout(function() {
            // Set default bordercolor
            $("input[id*='oldpincode_pinlogin_']").css("border-color", "#8c8c8c");
            $("input[id*='newpincode1_pinlogin_']").css("border-color", "#8c8c8c");
            $("input[id*='newpincode2_pinlogin_']").css("border-color", "#8c8c8c");


            //Prevent jQuery from recreating the pincode fields!
            $('#oldpincode_pinlogin_0').attr('data-role', 'none');
            $('#oldpincode_pinlogin_1').attr('data-role', 'none');
            $('#oldpincode_pinlogin_2').attr('data-role', 'none');
            $('#oldpincode_pinlogin_3').attr('data-role', 'none');
            $('#oldpincode_pinlogin_4').attr('data-role', 'none');

            $('#newpincode1_pinlogin_0').attr('data-role', 'none');
            $('#newpincode1_pinlogin_1').attr('data-role', 'none');
            $('#newpincode1_pinlogin_2').attr('data-role', 'none');
            $('#newpincode1_pinlogin_3').attr('data-role', 'none');
            $('#newpincode1_pinlogin_4').attr('data-role', 'none');

            $('#newpincode2_pinlogin_0').attr('data-role', 'none');
            $('#newpincode2_pinlogin_1').attr('data-role', 'none');
            $('#newpincode2_pinlogin_2').attr('data-role', 'none');
            $('#newpincode2_pinlogin_3').attr('data-role', 'none');
            $('#newpincode2_pinlogin_4').attr('data-role', 'none');


            // Set focus to first pincode field
            $('#oldpincode_pinlogin_0').focus();

            // Set label to center of screen
            var label = $("label").attr("for", "oldpassword");
            $(label).css("text-align", "center");
            var label1 = $("label").attr("for", "newpassword1");
            $(label1).css("text-align", "center");
            var label2 = $("label").attr("for", "newpassword2");
            $(label2).css("text-align", "center");

            //if (app.checkPincode) {
            if (app.checkPincode || app.isBuilder) {
                oldpincode.focus(0);
            } else
            if (app.checkPassword) {
                $("input[id*='oldpassword']").focus();
            }

            if (!app.checkPincode && !app.checkPassword) {
                $("#oldpincode_container").hide();
                newpincode1.focus(0);
            }

            // if ( !app.checkPincode ) {
            // 	$("#oldpincode").parent().hide();
            // 	newpincode1.focus(0);
            // }

            // if ( app.checkPassword && !app.checkPincode ) {
            // 	$( "input[id*='oldpassword']" ).focus();
            // }

            // if (app.checkPincode) {
            // 	oldpincode.focus(0);
            // }

        }, 100);

        // if (fieldsObj[fldi].type == 'password') {
        // 	if (fieldsObj[fldi].id == 'oldpassword') {
        // 		output += '<br><div id="oldpincode"></div>';
        // 	}
        // 	if (fieldsObj[fldi].id == 'newpassword1') {
        // 		output += '<br><div id="newpincode1"></div>';
        // 	}
        // 	if (fieldsObj[fldi].id == 'newpassword2') {
        // 		output += '<br><div id="newpincode"></div>';
        // 	}
        // }

    }



    //Bind event on search box
    var srcField = null;
    if (BRVUtil.checkValue(JSONObject.content.search)) {
        srcField = JSONObject.id + "_search";
        $('#' + srcField).bind("change", function(event, ui) {
            // Reset the livescolling vars
            app.resetLiveScrolling();
            // Clear grid
            $("#" + JSONObject.id).html('');

            // Close filtersortscreen
            BRVUtil.closeifexpanded(BRVUtil.alltrim(JSONObject.id) + '_filtersort');

            // Get new grid data
            getScreenData();
            setTimeout(function() {
                $("#" + srcField).blur(); // To hide the keyboard.
            }, 100);
        });
    }


    //***************************************************************
    //REMOVED BINDING ON FILTER AND SORT OPTIONS!
    //Added 'submit' button to filter/sort screen to activate filters
    //***************************************************************
    //Bind event on filter options
    // if (BRVUtil.checkValue(JSONObject.content.queryfilter)) {
    // 	srcField = JSONObject.id + "_filter";
    // 	$('#' + srcField).find('[type="checkbox"]').each(function() {
    // 		var filterID = this.id;
    // 		var objectID = srcField;
    // 		$('#' + filterID).bind("change", function (event, ui) {
    // 			app.resetLiveScrolling();
    // 			// Clear grid
    // 			$("#" + JSONObject.id).html('');

    // 			// Close filtersortscreen
    // 			// BRVUtil.collapse(BRVUtil.alltrim(JSONObject.id)+'_filtersort');

    // 			// Get new grid data
    // 			getScreenData();
    // 		});
    // 	});
    // }

    //Bind event on sort select
    // if (BRVUtil.checkValue(JSONObject.content.querysort)) {
    // 	srcField = JSONObject.id + "_sort_select";
    // 	$('#' + srcField).bind("change", function (event, ui) {
    // 		app.resetLiveScrolling();
    // 		// Clear grid
    // 		$("#" + JSONObject.id).html('');

    // 		// Close filtersortscreen
    // 		// BRVUtil.collapse(BRVUtil.alltrim(JSONObject.id)+'_filtersort');

    // 		// Get new grid data
    // 		getScreenData();
    // 	});
    // }
    //***************************************************************


    // if ( JSONObject.id == 'errorscreen' ) {
    // 	throw new Error(app.lastErrorMsg);
    // }

    // Fade in screen
    setTimeout(function() {

        // First replace some vars in bodytoptext en bodybottomtext
        replaceVarsInDivWithDataFromStorage('bodytoptext');
        replaceVarsInDivWithDataFromStorage('bodybottomtext');

        // Fade screen to visible
        $("#content_table").fadeIn(600);
    }, 50);

    // Reset top of content_table based on header position+height
    setTimeout(function() {
        if (!app.isBuilder) {
            // var headerTop = 0;
            var headerHeight = parseInt($('#header').height());
            // var newContentTopPos = headerTop + headerHeight;
            var newContentTopPos = headerHeight;

            var ValidHeight = !isNaN(newContentTopPos);
            if (ValidHeight) {
                $('#content_table').offset({ top: newContentTopPos });
                window.scrollTo(0, 0);
            }
        }
    }, 200);
}

function setContentTableSize() {
    // if ( BRVUtil.isBrowser() ) {
    // Resize content_table
    var pageSize = Math.round($('#page-home').height());
    var headerSize = $('#header').outerHeight();
    // var contentSize	= $('#content_table').height();
    var footerSize = $('#footer').outerHeight();
    var newContentSize = pageSize - headerSize - footerSize - 13;

    $('#content_table').css('min-height', newContentSize + 'px');
    $('#content_table').css('max-height', newContentSize + 'px');
    $('#content_table').css('padding-top', '1em');
    $('#content_table').css('padding-left', '1em');
    $('#content_table').css('padding-right', '1em');
    $('#content_table').css('padding-bottom', '0em');


    //	Moved to ResizeListView function!!
    //	// When it's browser we need to add some extra margin to the listview bottom
    //	if ( BRVUtil.isBrowser() ) {
    //		var listView = $('[data-role="listview"]');
    //		if (listView[0]) {
    //			var listViewID = listView[0].id;
    //			$('#'+listViewID).css('margin-bottom', '1em');
    //
    //			// Set focus on content_table so we can page-up/page-down in listview
    //			setTimeout(function () {
    //				$('#content_table').focus();
    //			}, 200);
    //
    //		}
    //	}

    // }
}


function buildFooterFromJSON() {
    app.debug('FUNCTION: buildFooterFromJSON');

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['screen'];

    var buttonOBJ = JSONObject.content.buttons;

    if (typeof buttonOBJ != 'undefined') {
        var showButton = true;

        // Define output var
        var output = '';
        output += '<div data-role="navbar">';

        output += '<div class="ftr-div" id="ftr-home">';
        output += '<ul class="footerbutton">';

        for (var btni = 0; btni < buttonOBJ.length; btni++) {
            // Generate tempID when object.id is empty
            (!BRVUtil.checkValue(buttonOBJ[btni].id)) ? buttonOBJ[btni].id = 'tempid_' + BRVUtil.generateRandomString(5): '';

            showButton = true;
            // if (BRVUtil.checkValue(buttonOBJ[btni].hidewhenscreenmode)) {
            if (showButton && BRVUtil.checkValue(buttonOBJ[btni].hidewhenscreenmode)) {
                if (!app.isBuilder) {
                    showButton = (buttonOBJ[btni].hidewhenscreenmode.indexOf(app.screenMode) < 0) ? true : false;
                }
            }

            // Check if there's multiuser support, then activate back button on screen 'activatedevice'
            // if ( BRVUtil.Left( buttonOBJ[btni].id, 9).toLowerCase() == 'multiuser' ) {
            if (showButton && BRVUtil.Left(buttonOBJ[btni].id, 9).toLowerCase() == 'multiuser') {
                showButton = (app.checkmultiuser()) ? true : false;
            }

            // Check for access
            if (showButton) {
                showButton = checkButtonAccess(buttonOBJ[btni]);

                // Button doesn't require access check!!
                if (!BRVUtil.checkValue(buttonOBJ[btni].access)) {
                    showButton = true;
                }
            }

            //Check if there's an 'AddFile' button and device if not AppInBrowser
            if (!BRVUtil.isBrowser() && !app.isBuilder) {
                try {
                    if (buttonOBJ[btni].onclick.action == "AddFile") {
                        showButton = false;
                    }
                } catch (error) {}
            }
            //


            if (showButton) {
                // // Generate tempID when object.id is empty
                // (!BRVUtil.checkValue( buttonOBJ[btni].id )) ? buttonOBJ[btni].id = 'tempid_'+BRVUtil.generateRandomString(5) : '';

                var buttonID = buttonOBJ[btni].id;
                var buttonName = buttonOBJ[btni].name;
                var buttonIcon = buttonOBJ[btni].icon;
                var buttonOnclick = buttonOBJ[btni].onclick;
                var buttonBubbleCountQuery = buttonOBJ[btni].bubblecountquery;

                var buttonCheckfield = (buttonOBJ[btni].checkfield) ? buttonOBJ[btni].checkfield : ''; // Check this field value for true/false to set button readonly!!

                // Check if there are ay vars in buttonname
                buttonName = replaceAllVarsInText(buttonName);

                if (typeof buttonOnclick != 'undefined') {
                    var newButtonOnclick = '';
                    // var newButtonOnclickTmp = '';

                    newButtonOnclick = app.GetParams(buttonOnclick.screenparam);
                    newButtonOnclick = 'b64|' + str_to_b64(newButtonOnclick);

                    switch (buttonOnclick.action) {
                        case "GotoScreen":
                            if (buttonOnclick.screen != '' || app.isBuilder) {
                                var ScreenName = buttonOnclick.screen;
                                (app.screenMode == 'add' && BRVUtil.checkValue(buttonOnclick.screenreturnadd)) ? ScreenName = buttonOnclick.screenreturnadd: '';
                                (app.screenMode == 'edit' && BRVUtil.checkValue(buttonOnclick.screenreturnedit)) ? ScreenName = buttonOnclick.screenreturnedit: '';
                                (app.screenMode == 'show' && BRVUtil.checkValue(buttonOnclick.screenreturnshow)) ? ScreenName = buttonOnclick.screenreturnshow: '';

                                output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" icon="' + buttonIcon + '" href="#" onclick="javascript:getScreenFromJSON(\'' + ScreenName + '\', \'' + newButtonOnclick + '\', \'' + buttonOnclick.screenmode + '\', null, null, \'' + buttonID + '\')" id="" data-icon="' + buttonIcon + '">' + buttonName;

                                // Get button bubble count
                                if (BRVUtil.checkValue(buttonBubbleCountQuery)) {
                                    if (BRVUtil.checkValue(buttonBubbleCountQuery.wepid) && BRVUtil.checkValue(buttonBubbleCountQuery.target)) {
                                        var buttonTarget = buttonBubbleCountQuery.target;
                                        output += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all countBubl  ui-shadow" bgcol="' + buttonBubbleCountQuery.bgcolor + '" bgcolnull="' + buttonBubbleCountQuery.bgcolornull + '" txtcol="' + buttonBubbleCountQuery.textcolor + '"   txtcolnull="' + buttonBubbleCountQuery.textcolornull + '" hidewhennull="' + buttonBubbleCountQuery.hidewhennull + '" id="' + buttonTarget + '" style="display: none;"></span>';
                                    }
                                }
                                // Get button bubble count
                                output += '</a></li>';

                                if (BRVUtil.isBool(buttonOnclick.useselect)) {
                                    app.activateLiCheckboxes = JSONObject.id;
                                }
                            }
                            break;
                        case "SaveFormData":
                            var saveSuccess = (buttonOnclick.savesuccess) ? str_to_b64(JSON.stringify(buttonOnclick.savesuccess)) : '';
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:SaveFormData(\'' + buttonID + '\', \'' + saveSuccess + '\')" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                        case "ShowMessage":
                            //output += '<li><a id="'+buttonID+'" href="#" onclick="javascript:app.showMessage(\'' + b64_to_str(buttonOnclickMessage) + '\', 500, 2000);" data-icon="'+ buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                            // case "OpenAdmin":
                            // output += '<li><a id="'+buttonID+'" href="#" onclick="javascript:OpenAdmin(\'' + newButtonOnclick + '\', \'' + buttonOnclick.screen + '\', \'' + buttonOnclick.screenmode + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            // break;
                        case "ActivateDevice":
                            // output += '<li><a id="'+buttonID+'" href="#" onclick="javascript:ActivateDevice(\'' + newButtonOnclick + '\', \'' + buttonOnclick.screen + '\', \'' + buttonOnclick.screenmode + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:ActivateDevice();" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                        case "ChangePassword":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:ChangePassword(\'' + newButtonOnclick + '\', \'' + buttonOnclick.screen + '\', \'' + buttonOnclick.screenmode + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                        case "ValidatePassword":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:ValidatePassword(\'' + newButtonOnclick + '\', \'' + buttonOnclick.screen + '\', \'' + buttonOnclick.screenmode + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;

                        case "CallQueryservice":
                        case "CallWebservice":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:CallWebservice(\'' + buttonID + '\', \'' + newButtonOnclick + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            if (BRVUtil.isBool(buttonOnclick.useselect)) {
                                app.activateLiCheckboxes = JSONObject.id;
                            }
                            break;

                        case "CallExtUrl":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:getExternalPage(\'' + buttonID + '\', false);" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            if (BRVUtil.isBool(buttonOnclick.useselect)) {
                                app.activateLiCheckboxes = JSONObject.id;
                            }
                            break;

                        case "CallFunction":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:CallFunction(\'' + buttonID + '\', \'' + buttonOnclick.func + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            if (BRVUtil.isBool(buttonOnclick.useselect)) {
                                app.activateLiCheckboxes = JSONObject.id;
                            }
                            break;
                        case "CallFunctionDefault":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:CallFunction(\'' + buttonID + '\', \'' + buttonOnclick.func + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            if (BRVUtil.isBool(buttonOnclick.useselect)) {
                                app.activateLiCheckboxes = JSONObject.id;
                            }
                            break;
                        case "AddPicture":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:AddPicture(\'\', \'' + buttonID + '\', \'' + newButtonOnclick + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                        case "AddFile":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:AddFile(\'\', \'' + buttonID + '\', \'' + newButtonOnclick + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                        case "GetBarcode":
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:GetBarcode(\'' + buttonOnclick.target + '\');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                        case "GoBack":
                            var steps = BRVUtil.checkValue(buttonOnclick.params) && BRVUtil.checkValue(buttonOnclick.params[0]) ? parseInt(buttonOnclick.params[0]) : 1;
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:app.goPageRoute(' + steps + ');" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                        default:
                            output += '<li><a checkfield="' + buttonCheckfield + '" id="' + buttonID + '" href="#" onclick="javascript:void(0);" data-icon="' + buttonIcon + '">' + buttonName + '</a></li>';
                            break;
                    }
                }
            }
        }

        output += '</ul">';
        output += '</div">';
        output += '</div">';

        $("#footer").append(output);
        $("#footer").trigger("create"); // Recreate the screen, apply styles

        // Save orig footer height
        /*		var footerHeight = $("#footer").attr("origheight");
        		if (typeof footerHeight == 'undefined') {
        			var curHeight = $('#footer').height();
                    $("#footer").attr("origheight", curHeight ); // Backup initial value 
        		}*/


        // Each footer button
        // $('[data-role="footer"] li a').each(function () {
        // 	$(this).on("taphold",function(){
        // 		var message = $(this).attr('message');
        // 		if ( BRVUtil.checkValue(message) ) {				
        // 			app.showMessage(message, null, false);
        // 		}
        // 	}); 
        // });
    }

    // Reset page-home bottom padding
    // setTimeout(function () {
    // 	// $("#page-home").css({"padding-bottom":''+$("#footer").height()+'px'}); // Recreate the screen, apply styles
    // }, 50);

}



function getScreenData() {
    app.debug('FUNCTION: getScreenData');
    app.loadMessage = 'GET_SCREEN_DATA';

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['screen'];

    var queryFileFields = '';

    var query = null;
    var queryWhere = null;
    var queryAppID = null;
    var queryReqID = null;
    var queryHaving = null;

    // Check screenMode
    if (app.screenMode == 'show' || app.screenMode == 'edit' || app.screenMode == 'add' || app.screenMode == null) {

        // CHARTFORM
        if (JSONObject.content.type == 'chartform') {
            // var query = null;
            // var queryWhere = null;
            // var queryHaving = null;
            if (BRVUtil.checkValue(JSONObject.content.query)) {
                // query = (BRVUtil.checkValue(JSONObject.content.query.query)) ? b64_to_str(JSONObject.content.query.query) : '';
                query = buildQueryFromJSON(JSONObject.content.query, app.paramObject, false);
                queryAppID = JSONObject.content.query.appid;
                queryReqID = JSONObject.content.query.wepid;
                queryWhere = (BRVUtil.checkValue(JSONObject.content.query.querywhere)) ? b64_to_str(JSONObject.content.query.querywhere) : '';
                queryHaving = (BRVUtil.checkValue(JSONObject.content.query.queryhaving)) ? b64_to_str(JSONObject.content.query.queryhaving) : '';
            }
            if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID) && BRVUtil.checkValue(query)) {
                app.wsErrorCode = 'A001';
                app.doRequestGWRWAW(query, queryAppID, queryReqID, showChartFormResult, showWSError, '', '');
            }
        }
        // CHARTFORM

        // LISTVIEW
        if (JSONObject.content.type == 'listview') {
            // Multiuseraccess: Create listview for activatedusers
            if (JSONObject.id == 'activateduserlogin') {
                app.debug('FUNCTION: activateduserlogin');
                var output = '';
                var userActivationsStr = app.GetFromPhoneStorage('userActivations');
                if (BRVUtil.checkValue(userActivationsStr)) {
                    // userActivations = JSON.parse(userActivationsStr);
                    var userActivations = BRVUtil.parseJSON(userActivationsStr);
                    userActivations.activations = BRVUtil.ArraySortByColumn(userActivations.activations, "activationuser", true); // Sort array
                    var registrationCnt = userActivations.activations.length;
                    if (registrationCnt > 0) {
                        for (var i = 0; i < userActivations.activations.length; i++) {
                            var curRecord = userActivations.activations[i];
                            output += '<li>';
                            output += '<a href="#" onclick="javascript:app.loginactivateduser(\'' + str_to_b64(JSON.stringify(curRecord)) + '\');">';
                            output += '<h2 class="ui-li-heading"><span name="">' + curRecord.username + '</span></h2>';
                            output += '</a>';
                            output += '</li>';
                        }
                    }
                    $('#' + JSONObject.id).append(output);
                    $('#' + JSONObject.id).listview().listview('refresh');
                }
            }


            // var QueryArray = new Array();
            // var QueryIsArray = false;

            // var query = null;
            // var queryWhere = null;
            // var queryAppID  = null;
            // var queryReqID  = null;
            // var queryHaving = null;

            if (BRVUtil.checkValue(JSONObject.content.query)) {
                query = (BRVUtil.checkValue(JSONObject.content.query.query)) ? b64_to_str(JSONObject.content.query.query) : '';
                query = app.validateQuery(query); // Check if query does contain a valid select or setoption/setfield

                queryAppID = JSONObject.content.query.appid;
                queryReqID = JSONObject.content.query.wepid;
                queryFields = JSONObject.content.query.queryfields;
                queryFileFields = queryFileFields + JSONObject.content.query.filefields;
                queryWhere = (BRVUtil.checkValue(JSONObject.content.query.querywhere)) ? b64_to_str(JSONObject.content.query.querywhere) : '';
                queryHaving = (BRVUtil.checkValue(JSONObject.content.query.queryhaving)) ? b64_to_str(JSONObject.content.query.queryhaving) : '';

                // Add sort condition to query orderby
                if (BRVUtil.checkValue(JSONObject.content.querysort)) {
                    if (JSONObject.content.querysort.length > 0) {
                        var sortQuery = (BRVUtil.checkValue($('#' + JSONObject.id + '_sort_select').val())) ? b64_to_str($('#' + JSONObject.id + '_sort_select').val()) : '';
                        var sortDividerID = $('#' + JSONObject.id + '_sort_select option:selected').attr('id');
                        var sortDivider = $('#' + JSONObject.id + '_sort_select option:selected').attr('divider');
                        var sortDividerQuery = $('#' + JSONObject.id + '_sort_select option:selected').attr('dividerquery');

                        var sortStorageID = JSONObject.id + '_sort_select';

                        if (BRVUtil.checkValue(sortQuery)) {
                            // app.AddToTempStorage(sortStorageID, sortDividerID);

                            // Do not check 'savequerysort' here, cause then sort will not be written to storage and not be used.
                            // var saveSort = (typeof JSONObject.content.savequerysort != 'undefined') ? JSONObject.content.savequerysort : false;
                            // (saveSort) ? saveUserSort(app.activeusername, sortStorageID, sortDividerID) : '';
                            saveUserSort(app.activeusername, sortStorageID, sortDividerID);

                            // var queryObj = JSON.parse(query);
                            var queryObj = BRVUtil.parseJSON(query);
                            //queryObj.Select.Orderby = sortQuery;
                            if (queryObj.Select) {
                                queryObj.Select.Orderby = sortQuery;
                            }

                            // Add listviewdivider
                            if (BRVUtil.checkValue(sortDivider) && BRVUtil.checkValue(sortDividerQuery)) {
                                // Add sort query to current query obj
                                sortDividerQuery = b64_to_str(sortDividerQuery);
                                sortDividerQuery = '(' + sortDividerQuery + ') AS ' + sortDivider;
                                //queryObj.Select.QryField.push(sortDividerQuery);
                                if (queryObj.Select) {
                                    if (queryObj.Select.QryField) {
                                        queryObj.Select.QryField.push(sortDividerQuery);
                                    }
                                }

                                // app.AddToTempStorage(JSONObject.id + "_sort_divider", sortDivider);

                                // Do not check 'savequerysort' here, cause then sort will not be written to storage and not be used.
                                // saveSort = (typeof JSONObject.content.savequerysort != 'undefined') ? JSONObject.content.savequerysort : false;
                                // (saveSort) ? saveUserSort(app.activeusername, JSONObject.id + "_sort_divider", sortDivider) : '';
                                saveUserSort(app.activeusername, JSONObject.id + "_sort_divider", sortDivider);

                            } else {
                                // app.RemoveFromTempStorage(JSONObject.id + "_sort_divider");
                                removeUserSort(app.activeusername, JSONObject.id + "_sort_divider");
                            }

                            // Add queryWhere and queryHaving to SetOption, in case there's no actual query
                            try {
                                if (queryObj.SetOption && !queryObj.Select) {
                                    queryObj.SetOption.push({ "Name": "sortclause", "Value": sortQuery });
                                    queryObj.SetOption.push({ "Name": "sortDividerQuery", "Value": sortDividerQuery });
                                }
                            } catch (e) {}

                            query = JSON.stringify(queryObj);
                        }

                    }
                }

                // Add filter values to queryWhere
                if (BRVUtil.checkValue(JSONObject.content.queryfilter)) {
                    if (JSONObject.content.queryfilter.length > 0) {
                        var queryWhereTMP = '';
                        var filterNr = 0;
                        queryWhereTMP = queryWhereTMP + ' AND ( ';
                        var srcField = JSONObject.id + "_filter";
                        $('#' + srcField).find('[type="checkbox"]').each(function() {
                            var filterID = this.id;
                            var filterStorageID = srcField + '_' + filterID;
                            var state = $(this).prop('checked') ? true : false;

                            // app.AddToTempStorage(filterStorageID, state);
                            var saveFilter = (typeof JSONObject.content.savequeryfilter != 'undefined') ? JSONObject.content.savequeryfilter : false;
                            (saveFilter) ? saveUserFilter(app.activeusername, filterStorageID, state): '';

                            if (state) {
                                if (filterNr == 0) {} else {
                                    queryWhereTMP = queryWhereTMP + ' AND ';
                                }
                                var condition = b64_to_str($('#' + filterID).val());
                                queryWhereTMP = queryWhereTMP + condition;
                                filterNr++;
                            }
                        });
                        queryWhereTMP = queryWhereTMP + ' ) ';
                        if (queryWhere == '') {
                            queryWhere = ' .T. ';
                        }
                        queryWhere += (filterNr > 0) ? queryWhereTMP : '';
                    }
                }

                if (BRVUtil.checkValue(queryFields)) {
                    var tmpQueryFields = queryFields.split('|');
                    for (a = 0; a < tmpQueryFields.length; a++) {
                        if (BRVUtil.checkValue(tmpQueryFields[a])) {
                            var tmpQueryField = tmpQueryFields[a].split('=');
                            var searchFld = tmpQueryField[0];
                            var lcFldValue = '';
                            if (searchFld.substr(0, 1) == '*') { // Check if we need to find the field value in the localstorage
                                searchFld = searchFld.substr(1, searchFld.length);
                                lcFldValue = app.GetFromPhoneStorage(searchFld);
                            } else { // Get field value from form
                                lcFldValue = (app.paramObject) ? app.paramObject[searchFld] : '';
                            }
                            queryWhere = BRVUtil.replaceAll(queryWhere, '<' + searchFld + '>', lcFldValue);

                            queryHaving = BRVUtil.replaceAll(queryHaving, '<' + searchFld + '>', lcFldValue);

                            // Also replace values in query ????
                            query = BRVUtil.replaceAll(query, '<' + searchFld + '>', lcFldValue);
                        }
                    }
                }

                // Add search values to queryWhere
                if (BRVUtil.checkValue(JSONObject.content.search)) {
                    if (JSONObject.content.search.searchfields.length > 0) {
                        var srcField1 = JSONObject.id + "_search";
                        var srcFieldValue = $('#' + srcField1).val();
                        var srcFieldValueStorage = srcFieldValue;
                        srcFieldValueStorage = BRVUtil.illegalSearchChars(srcFieldValueStorage);
                        var tmpSrcFields = JSONObject.content.search.searchfields;

                        // Check if we need to save searchvalue to storage
                        var saveValue = (typeof JSONObject.content.search.savevalue != 'undefined') ? JSONObject.content.search.savevalue : true;

                        //Save search value
                        if (srcFieldValueStorage != '' && saveValue) {
                            saveUserSearch(app.activeusername, srcField1, srcFieldValueStorage);
                        } else {
                            removeUserSearch(app.activeusername, srcField1);
                        }

                        //Add (multi)search to queryWhere
                        queryWhere = AddSearchToQueryWhere(queryWhere, srcFieldValue, tmpSrcFields);
                    }
                }
                query = query.replace('<where>', queryWhere);
                query = query.replace('<having>', queryHaving);

                // Add queryWhere and queryHaving to SetOption, in case there's no actual query
                try {
                    if (BRVUtil.checkValue(queryWhere) || BRVUtil.checkValue(queryHaving)) {
                        var queryTmp = JSON.parse(query);
                        if (queryTmp.SetOption && !queryTmp.Select) {
                            if (BRVUtil.checkValue(queryWhere)) {
                                queryTmp.SetOption.push({ "Name": "whereclause", "Value": (queryWhere.length > 0) ? queryWhere : "" });
                            }
                            if (BRVUtil.checkValue(queryHaving)) {
                                queryTmp.SetOption.push({ "Name": "havingclause", "Value": (queryHaving.length > 0) ? queryHaving : "" });
                            }
                            query = JSON.stringify(queryTmp);
                        }
                    }
                } catch (e) {}

            }

            // Headerinfo
            if (BRVUtil.checkValue(JSONObject.content.headerinfo)) {
                // Add headerinfo to array and get it later!
                bufferHeaderInfoQuery(JSONObject.content.headerinfo);
            }


            // Check if we need to add 'selecteditems' from app.paramObject to the queryobject
            try {
                if (BRVUtil.checkValue(query) && app.paramObject.selecteditems) {
                    var QueryObj = BRVUtil.parseJSON(query);
                    var selecteditems = BRVUtil.parseJSON(app.paramObject.selecteditems);
                    // if (!QueryObj.SetOption) {
                    // 	QueryObj["SetOption"]=[];
                    // }
                    // Only add when 'SetOption' is already there!
                    if (QueryObj.SetOption) {
                        QueryObj.SetOption.push({ "Name": "selecteditems", "Value": (selecteditems.length > 0) ? selecteditems : "" });
                    }
                    query = JSON.stringify(QueryObj);
                }
            } catch (e) {}

            if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID) && BRVUtil.checkValue(query)) {
                app.wsErrorCode = 'A002';
                app.doRequestGWRWAW(query, queryAppID, queryReqID, showListViewResult, showWSError, '', queryFileFields);
            }
        }
        // LISTVIEW

        // LISTVIEWCOLS
        if (JSONObject.content.type == 'listviewcols') {
            query = null;
            queryWhere = null;
            queryAppID = null;
            queryReqID = null;
            queryHaving = null;

            if (BRVUtil.checkValue(JSONObject.content.query)) {
                query = (BRVUtil.checkValue(JSONObject.content.query.query)) ? b64_to_str(JSONObject.content.query.query) : '';
                query = app.validateQuery(query); // Check if query does contain a valid select or setoption/setfield

                queryAppID = JSONObject.content.query.appid;
                queryReqID = JSONObject.content.query.wepid;
                queryFields = JSONObject.content.query.queryfields;

                queryWhere = (BRVUtil.checkValue(JSONObject.content.query.querywhere)) ? b64_to_str(JSONObject.content.query.querywhere) : '';
                queryHaving = (BRVUtil.checkValue(JSONObject.content.query.queryhaving)) ? b64_to_str(JSONObject.content.query.queryhaving) : '';

                // Add sort condition to query orderby
                if (BRVUtil.checkValue(JSONObject.content.querysort)) {
                    if (JSONObject.content.querysort.length > 0) {
                        var sortQuery1 = (BRVUtil.checkValue($('#' + JSONObject.id + '_sort_select').val())) ? b64_to_str($('#' + JSONObject.id + '_sort_select').val()) : '';
                        var sortDividerID1 = $('#' + JSONObject.id + '_sort_select option:selected').attr('id');
                        var sortDivider1 = $('#' + JSONObject.id + '_sort_select option:selected').attr('divider');
                        var sortDividerQuery1 = $('#' + JSONObject.id + '_sort_select option:selected').attr('dividerquery');
                        var sortStorageID1 = JSONObject.id + '_sort_select';

                        if (BRVUtil.checkValue(sortQuery1)) {
                            // app.AddToTempStorage(sortStorageID1, sortDividerID1);
                            // Do not check 'savequerysort' here, cause then sort will not be written to storage and not be used.
                            // var saveSort = (typeof JSONObject.content.savequerysort != 'undefined') ? JSONObject.content.savequerysort : false;
                            // (saveSort) ? saveUserSort(app.activeusername, sortStorageID1, sortDividerID1) : '';
                            saveUserSort(app.activeusername, sortStorageID1, sortDividerID1);

                            // var queryObj = JSON.parse(query);
                            var queryObj1 = BRVUtil.parseJSON(query);
                            queryObj1.Select.Orderby = sortQuery1;

                            // Add listviewdivider
                            if (BRVUtil.checkValue(sortDivider1) && BRVUtil.checkValue(sortDividerQuery1)) {
                                // Add sort query to current query obj
                                sortDividerQuery1 = b64_to_str(sortDividerQuery1);
                                sortDividerQuery1 = '(' + sortDividerQuery1 + ') AS ' + sortDivider1;
                                queryObj1.Select.QryField.push(sortDividerQuery1);

                                // app.AddToTempStorage(JSONObject.id + "_sort_divider", sortDivider);
                                saveUserSort(app.activeusername, JSONObject.id + "_sort_divider", sortDivider1);
                            } else {
                                // app.RemoveFromTempStorage(JSONObject.id + "_sort_divider");
                                removeUserSort(app.activeusername, JSONObject.id + "_sort_divider");
                            }

                            query = JSON.stringify(queryObj1);
                        }

                    }
                }

                // Add filter values to queryWhere
                if (BRVUtil.checkValue(JSONObject.content.queryfilter)) {
                    if (JSONObject.content.queryfilter.length > 0) {
                        var queryWhereTMP1 = '';
                        var filterNr1 = 0;
                        queryWhereTMP1 = queryWhereTMP1 + ' AND ( ';
                        var srcField2 = JSONObject.id + "_filter";
                        $('#' + srcField2).find('[type="checkbox"]').each(function() {
                            var filterID = this.id;
                            var filterStorageID = srcField2 + '_' + filterID;
                            var state = $(this).prop('checked') ? true : false;

                            // app.AddToTempStorage(filterStorageID, state);
                            var saveFilter = (typeof JSONObject.content.savequeryfilter != 'undefined') ? JSONObject.content.savequeryfilter : false;
                            (saveFilter) ? saveUserFilter(app.activeusername, filterStorageID, state): '';

                            if (state) {
                                if (filterNr1 == 0) {} else {
                                    queryWhereTMP1 = queryWhereTMP1 + ' AND ';
                                }
                                var condition = b64_to_str($('#' + filterID).val());
                                queryWhereTMP1 = queryWhereTMP1 + condition;
                                filterNr1++;
                            }
                        });
                        queryWhereTMP1 = queryWhereTMP1 + ' ) ';
                        if (queryWhere == '') {
                            queryWhere = ' .T. ';
                        }
                        queryWhere += (filterNr1 > 0) ? queryWhereTMP1 : '';
                    }
                }

                if (BRVUtil.checkValue(queryFields)) {
                    var tmpQueryFields1 = queryFields.split('|');
                    for (a = 0; a < tmpQueryFields1.length; a++) {
                        if (BRVUtil.checkValue(tmpQueryFields1[a])) {
                            var tmpQueryField1 = tmpQueryFields1[a].split('=');
                            var searchFld3 = tmpQueryField1[0];
                            var lcFldValue1 = '';
                            if (searchFld3.substr(0, 1) == '*') { // Check if we need to find the field value in the localstorage
                                searchFld3 = searchFld3.substr(1, searchFld3.length);
                                lcFldValue1 = app.GetFromPhoneStorage(searchFld3);
                            } else { // Get field value from form
                                lcFldValue1 = (app.paramObject) ? app.paramObject[searchFld3] : '';
                            }
                            queryWhere = BRVUtil.replaceAll(queryWhere, '<' + searchFld3 + '>', lcFldValue1);
                            queryHaving = BRVUtil.replaceAll(queryHaving, '<' + searchFld3 + '>', lcFldValue1);
                            // Also replace values in query ????
                            query = BRVUtil.replaceAll(query, '<' + searchFld3 + '>', lcFldValue1);
                        }
                    }
                }

                // Add search values to queryWhere
                if (BRVUtil.checkValue(JSONObject.content.search)) {
                    if (JSONObject.content.search.searchfields.length > 0) {
                        var srcField3 = JSONObject.id + "_search";
                        var srcFieldValue3 = $('#' + srcField3).val();
                        var srcFieldValueStorage3 = srcFieldValue3;
                        srcFieldValueStorage3 = BRVUtil.illegalSearchChars(srcFieldValueStorage3);
                        var tmpSrcFields3 = JSONObject.content.search.searchfields;

                        // Check if we need to save searchvalue to storage
                        var saveValue1 = (typeof JSONObject.content.search.savevalue != 'undefined') ? JSONObject.content.search.savevalue : true;

                        //Save search value
                        if (srcFieldValueStorage3 != '' && saveValue1) {
                            saveUserSearch(app.activeusername, srcField3, srcFieldValueStorage3);
                        } else {
                            removeUserSearch(app.activeusername, srcField3);
                        }

                        //Add (multi)search to queryWhere
                        queryWhere = AddSearchToQueryWhere(queryWhere, srcFieldValue3, tmpSrcFields3);

                    }
                }
                query = query.replace('<where>', queryWhere);
                query = query.replace('<having>', queryHaving);

                // Add queryWhere and queryHaving to SetOption, in case there's no actual query
                try {
                    if (BRVUtil.checkValue(queryWhere) || BRVUtil.checkValue(queryHaving)) {
                        var queryTmp1 = JSON.parse(query);
                        if (queryTmp1.SetOption && !queryTmp1.Select) {
                            if (BRVUtil.checkValue(queryWhere)) {
                                queryTmp1.SetOption.push({ "Name": "whereclause", "Value": (queryWhere.length > 0) ? queryWhere : "" });
                            }
                            if (BRVUtil.checkValue(queryHaving)) {
                                queryTmp1.SetOption.push({ "Name": "havingclause", "Value": (queryHaving.length > 0) ? queryHaving : "" });
                            }
                            query = JSON.stringify(queryTmp1);
                        }
                    }
                } catch (e) {}

            }

            // Headerinfo
            if (BRVUtil.checkValue(JSONObject.content.headerinfo)) {
                // Add headerinfo to array and get it later!
                bufferHeaderInfoQuery(JSONObject.content.headerinfo);
            }

            // Check if we need to add 'selecteditems' from app.paramObject to the queryobject
            try {
                if (BRVUtil.checkValue(query) && app.paramObject.selecteditems) {
                    var QueryObj1 = BRVUtil.parseJSON(query);
                    var selecteditems1 = BRVUtil.parseJSON(app.paramObject.selecteditems);
                    // if (!QueryObj.SetOption) {
                    // 	QueryObj["SetOption"]=[];
                    // }
                    // Only add when 'SetOption' is already there!
                    if (QueryObj1.SetOption) {
                        QueryObj1.SetOption.push({ "Name": "selecteditems", "Value": (selecteditems1.length > 0) ? selecteditems1 : "" });
                    }
                    query = JSON.stringify(QueryObj1);
                }
            } catch (e) {}

            if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID) && BRVUtil.checkValue(query)) {
                app.wsErrorCode = 'A002a';
                app.doRequestGWRWAW(query, queryAppID, queryReqID, showListViewColsResult, showWSError, '');
            }
        }
        // LISTVIEWCOLS


        // FIELDSFORM
        if (JSONObject.content.type == 'fieldsform') {

            // // ActivateDevice: Get data from device
            // if (JSONObject.id == 'activatedevice') {
            // 	app.debug('FUNCTION: activatedevice');

            // 	// Check if there's a previous activation we can use. Only when not in multiuser mode!!!
            // 	if (!app.checkmultiuser()) { app.checkValidActivation() };

            // 	for (var i = 0; i < JSONObject.content.fields.length; i++) {
            // 		fldID = JSONObject.content.fields[i].id;
            // 		switch (fldID) {
            // 			case "activationuser":
            // 				fldValue = '';
            // 				// fldValue = 'tijssena@gmail.com';
            // 				break;
            // 			case "activationcode":
            // 				if (app.activated) {
            // 					// fldValue = 'ACTIVATED';
            // 					fldValue = '';
            // 				} else {
            // 					fldValue = '';
            // 					// fldValue = 'STj0yslqg2d1jw';
            // 				}
            // 				break;
            // 			case "deviceid":
            // 				fldValue = app.deviceid;
            // 				break;
            // 			case "devicename":
            // 				fldValue = app.devicename;
            // 				break;
            // 			case "appversion":
            // 				fldValue = app.versionApp + '.' + app.versionBuild;
            // 				break;
            // 			default:
            // 				fldValue = '';
            // 				break;
            // 		}
            // 		$('#' + fldID).val(fldValue).change();
            // 	}
            // 	if (app.activated) {
            // 		BRVUtil.setElementReadonly('activationcode', 'on');
            // 	}

            // }
            // // ActivateDevice: Get data from device


            // ActivateDevice: Get data from device
            if (JSONObject.id == 'activatedevice') {
                app.debug('FUNCTION: activatedevice');

                // Check if app has been activated before on this device. Then try to activate again!!
                if (!app.checkmultiuser()) { app.checkValidActivation(); }

                loginMethodsInit();

                // $( "#loginmethods" ).change(function() {
                // 	loginMethodsSelect();
                // });

            }
            // ActivateDevice: Get data from device

            // Userregistration
            if (JSONObject.id == 'userregistration') {
                app.debug('FUNCTION: userregistration');
                $('#footer').show();
            }
            //

            // Adminselect
            if (JSONObject.id == 'adminselect') {
                app.debug('FUNCTION: adminselect');
                var output1 = '';
                for (var ii = 0; ii < app.adminList.length; ii++) {
                    tmpKey = app.adminList[ii].adm_code;
                    tmpValue = app.adminList[ii].adm_desc;
                    if (app.adm_code == tmpKey) {
                        output1 = output1 + '<option value="' + tmpKey + '" SELECTED>' + tmpValue + '</option>';
                    } else {
                        output1 = output1 + '<option value="' + tmpKey + '">' + tmpValue + '</option>';
                    }
                }
                $("#adm_code").append(output1);
                $("#adm_code").trigger("create"); // Recreate the object, apply styles
            }
            // Adminselect

            // if (JSONObject.id == 'changepassword') {
            // 	app.debug('FUNCTION: changepassword');
            // }

            // ChangeUserSettings
            if (JSONObject.id == 'changeusersettings') {
                app.debug('FUNCTION: changeusersettings');
                for (var iii = 0; iii < JSONObject.content.fields.length; iii++) {
                    fldID = JSONObject.content.fields[iii].id;
                    switch (fldID) {
                        case "startscreen":
                            //                            if (BRVUtil.isBrowser()) {
                            //                                $('#startscreen_container').hide();
                            //                            } else {
                            var output2 = '';
                            var startScreenObj = app.JSONObject['app'].startscreen;
                            var screenIDfromStorage = app.GetFromPhoneStorage('startscreen');
                            if (typeof startScreenObj == 'object') {
                                for (var a = 0; a < startScreenObj.length; a++) {
                                    if (startScreenObj[a].id == screenIDfromStorage) {
                                        output2 = output2 + '<option value="' + startScreenObj[a].id + '" SELECTED >' + startScreenObj[a].name + '</option>';
                                    } else {
                                        output2 = output2 + '<option value="' + startScreenObj[a].id + '">' + startScreenObj[a].name + '</option>';
                                    }
                                }
                            } else {
                                output2 = output2 + '<option value="' + startScreenObj + '">' + startScreenObj + '</option>';
                            }
                            $('#' + fldID).append(output2);
                            $('#' + fldID).trigger("create"); // Recreate the object, apply styles
                            setTimeout(function(arg1) {
                                $(arg1).change(function() {
                                    var newValue = $(arg1).val();
                                    setAppStartScreen(newValue, false);
                                });
                            }, 200, '#' + fldID);
                            //                            }
                            break;

                        case "buttonscreencolumns":
                            if (BRVUtil.isBrowser()) {
                                $('#buttonscreencolumns_container').hide();
                            } else {
                                var storageValue = app.GetFromPhoneStorage('buttonscreencolumns');
                                var output3 = '';
                                output3 = output3 + '<option value="" ' + ((!BRVUtil.checkValue(storageValue)) ? ' SELECTED ' : '') + '>Standaard</option>';
                                for (var b = 1; b <= 5; b++) {
                                    output3 = output3 + '<option value="' + b + '" ' + ((b == storageValue) ? ' SELECTED ' : '') + ' >' + b + '</option>';
                                }
                                $('#' + fldID).append(output3);
                                $('#' + fldID).trigger("create"); // Recreate the object, apply styles
                                setTimeout(function(arg1) {
                                    $(arg1).change(function() {
                                        var newValue = $(arg1).val();
                                        app.AddToPhoneStorage('buttonscreencolumns', newValue);
                                    });
                                }, 200, '#' + fldID);
                            }
                            break;

                        case "buttonscreenlabels":
                            if (BRVUtil.isBrowser()) {
                                $('#buttonscreenlabels_container').hide();
                            } else {
                                var storageValue1 = app.GetFromPhoneStorage('buttonscreenlabels');
                                var output4 = '';
                                output4 = output4 + '<option value="" ' + ((!BRVUtil.checkValue(storageValue1)) ? ' SELECTED ' : '') + '>Standaard</option>';
                                if (BRVUtil.checkValue(storageValue1)) {
                                    output4 = output4 + '<option value="true" ' + (BRVUtil.isBool(storageValue1) ? ' SELECTED ' : '') + ' >Aan</option>';
                                    output4 = output4 + '<option value="false" ' + (BRVUtil.isBool(storageValue1) ? '' : ' SELECTED ') + ' >Uit</option>';
                                } else {
                                    output4 = output4 + '<option value="true" >Aan</option>';
                                    output4 = output4 + '<option value="false" >Uit</option>';
                                }
                                $('#' + fldID).append(output4);
                                $('#' + fldID).trigger("create"); // Recreate the object, apply styles
                                setTimeout(function(arg1) {
                                    $(arg1).change(function() {
                                        var newValue = $(arg1).val();
                                        app.AddToPhoneStorage('buttonscreenlabels', newValue);
                                    });
                                }, 200, '#' + fldID);
                            }
                            break;

                        case "multiuseraccess":
                            // When user is logged in by 'loginFidesqueSSO' or 'loginFidesqueSSOdirect' then disable multiuser option 
                            //if (app.logintype == "loginFidesqueSSO" || app.logintype == "loginFidesqueSSOdirect") {
                            if (BRVUtil.isBrowser() || app.logintype == "loginFidesqueSSO" || app.logintype == "loginFidesqueSSOdirect") {
                                $('#multiuseraccess_container').hide();
                                app.multiuser = false;
                            } else {
                                var registrationCnt1 = 0;
                                var userActivations1 = app.GetFromPhoneStorage('userActivations');
                                if (BRVUtil.checkValue(userActivations1)) {
                                    userActivations1 = BRVUtil.parseJSON(userActivations1);
                                    registrationCnt1 = userActivations1.activations.length;
                                }

                                // var isDemo = (app.GetFromPhoneStorage('isdemo') == 'true')?true:false;

                                // Check if there are more then 1 activated users, then remove checkbox.
                                // if (registrationCnt > 1 || isDemo) {   
                                if (registrationCnt1 > 1 || app.isdemo) {
                                    $('#multiuseraccess_container').hide();
                                    // app.AddToPhoneStorage('multiuser', 'true');
                                } else {
                                    var storageValue1 = app.GetFromPhoneStorage('multiuser');
                                    $('#' + fldID).prop("checked", (BRVUtil.isBool(storageValue1)) ? true : false);
                                    setTimeout(function(arg1, arg2) {
                                        $(arg1).change(function() {
                                            app.AddToPhoneStorage('multiuser', $(arg1).prop('checked') ? 'true' : 'false');
                                            app.multiuser = $(arg1).prop('checked') ? true : false;
                                        });
                                    }, 200, '#' + fldID);
                                }
                            }
                            break;

                        case "selectinputtimeout":
                            var storageValue = app.GetFromPhoneStorage('selectinputtimeout');
                            storageValue = (storageValue > 0) ? storageValue : app.selectInputTimeout;
                            $('#' + fldID).val(storageValue);
                            $('#' + fldID).trigger("create"); // Recreate the object, apply styles
                            setTimeout(function(arg1) {
                                $(arg1).change(function() {
                                    var newValue = $(arg1).val();

                                    if (newValue == 0 || newValue < 800) {
                                        newValue = 0;
                                        $('#' + fldID).val(newValue);
                                    }

                                    // // Check if value is minimal 800 ms!
                                    // if (newValue == '' || newValue < 800) {
                                    //     newValue = 800;
                                    //     $('#' + fldID).val(newValue);
                                    // }
                                    app.selectInputTimeout = newValue;
                                    app.AddToPhoneStorage('selectinputtimeout', newValue);
                                });
                            }, 200, '#' + fldID);
                            break;


                        default:
                            break;
                    }
                }
            }

            GetBindObjectQuery(); // Bind some events

            // Build main query
            // var query = null;
            if (BRVUtil.checkValue(JSONObject.content.query)) {

                if (BRVUtil.checkValue(JSONObject.content.query.appid) && BRVUtil.checkValue(JSONObject.content.query.wepid) && BRVUtil.checkValue(JSONObject.content.query.query)) {
                    // query = (BRVUtil.checkValue(JSONObject.content.query.query)) ? b64_to_str(JSONObject.content.query.query) : '';
                    // queryFileFields = queryFileFields + JSONObject.content.query.filefields;

                    addQuery = true;

                    if (BRVUtil.checkValue(JSONObject.content.query.notwhenscreenmode)) {
                        addQuery = (JSONObject.content.query.notwhenscreenmode.indexOf(app.screenMode) < 0) ? true : false;
                    }

                    if (addQuery) {
                        //Add bubblecountquery to tmpObj
                        app.BufferedQueryObj.push(JSONObject.content.query);
                    }
                }
            }
            // Build main query

            // Build field query
            // It's already done!!!
            // if (BRVUtil.checkValue(JSONObject.content.fields)) {
            // 	var fieldOBJ = JSONObject.content.fields;
            // 	if (typeof fieldOBJ != 'undefined') {
            // 		for (var fldi = 0; fldi < fieldOBJ.length; fldi++) {
            // 			//Add fieldqueries to tmpObj
            // 			var fldqueryObj = fieldOBJ[fldi];
            // 			if (BRVUtil.checkValue(fldqueryObj.query)) {
            // 				if (BRVUtil.checkValue(fldqueryObj.query.appid) && BRVUtil.checkValue(fldqueryObj.query.wepid) && BRVUtil.checkValue(fldqueryObj.query.query)) {
            // 					app.BufferedQueryObj.push(fldqueryObj.query);
            // 				}
            // 			}

            // 		}
            // 	}
            // }
            // Build field query

            // Build button bubble query
            if (BRVUtil.checkValue(JSONObject.content.buttons)) {
                var buttonOBJ = JSONObject.content.buttons;
                if (typeof buttonOBJ != 'undefined') {
                    for (var btni = 0; btni < buttonOBJ.length; btni++) {
                        var bubblecountquery = buttonOBJ[btni].bubblecountquery;
                        if (BRVUtil.checkValue(bubblecountquery)) {
                            if (BRVUtil.checkValue(bubblecountquery.wepid) && BRVUtil.checkValue(bubblecountquery.target) && BRVUtil.checkValue(bubblecountquery.query)) {
                                //Add bubblecountquery to tmpObj
                                var bcquery = BRVUtil.parseJSON(b64_to_str(bubblecountquery.query));
                                if (BRVUtil.checkValue(bcquery.Select.Into) && BRVUtil.Left(bcquery.Select.Into, 13) != 'buttonbubble_') {
                                    bcquery.Select.Into = 'buttonbubble_' + bcquery.Select.Into;
                                }
                                bcquery = str_to_b64(JSON.stringify(bcquery));
                                bubblecountquery.query = bcquery;

                                app.BufferedQueryObj.push(bubblecountquery);
                            }
                        }
                    }
                }
            }
            // Build button bubble query

            // Headerinfo
            if (BRVUtil.checkValue(JSONObject.content.headerinfo)) {
                // Add headerinfo to array and get it later!
                bufferHeaderInfoQuery(JSONObject.content.headerinfo);
            }

            // CHECK app.BufferedWidgetObj
            if (app.BufferedWidgetObj && app.BufferedWidgetObj.length >= 0) {
                doBufferedWidgets();
            }

            // CHECK app.BufferedQueryObj
            if (app.BufferedQueryObj && app.BufferedQueryObj.length >= 0) {
                doBufferedQuerys();
            }


            // Do something with bodytoptext and bodybottomtext!
            // console.log('OK DONE!!!');
            // replaceVarsWithData('bodytoptext');

        }
        // FIELDSFORM

        // WEBSITE
        if (JSONObject.content.type == 'website') {
            if (BRVUtil.checkValue(JSONObject.content.url)) {

                var websiteUrl = JSONObject.content.url;
                // Replace vars in url with storage and paramobj data
                websiteUrl = BRVUtil.replaceVarsWithDataInString(websiteUrl);

                // ****************************************************************************
                // Store orig css settings op content_table!!!!
                // function 'buildScreenFromJSON' does restore the original 'css_*' settings!!
                $('#content_table').attr("css_top", $('#content_table').css("top"));
                $('#content_table').attr("css_padding", $('#content_table').css("padding"));
                // ****************************************************************************

                // var pageHeight = $('#page-home').height();
                var pageHeight = jQuery.mobile.getScreenHeight();
                var headerHeight = (app.isBuilder) ? 0 : $('#header').outerHeight();
                var footerHeight = $('#footer').outerHeight();
                var contentHeight = pageHeight - headerHeight - footerHeight;

                $('#content_table').css({ top: headerHeight });
                $('#content_table').css({ padding: 0 });
                $('#websiteiFrame').css({ width: '100%' });
                $('#websiteiFrame').css({ height: contentHeight });
                $('#websiteiFrame').attr('src', websiteUrl);
            }
        }
        // WEBSITE


        // BUTTONS
        if (JSONObject.content.type == 'buttons') {
            // Build main query
            // var query = null;
            var curbufferlength = app.BufferedQueryObj.length;
            var execBuffer = false;

            if (BRVUtil.checkValue(JSONObject.content.query)) {

                if (BRVUtil.checkValue(JSONObject.content.query.appid) && BRVUtil.checkValue(JSONObject.content.query.wepid) && BRVUtil.checkValue(JSONObject.content.query.query)) {
                    // query = (BRVUtil.checkValue(JSONObject.content.query.query)) ? b64_to_str(JSONObject.content.query.query) : '';
                    // queryFileFields = queryFileFields + JSONObject.content.query.filefields;

                    addQuery = true;

                    if (BRVUtil.checkValue(JSONObject.content.query.notwhenscreenmode)) {
                        addQuery = (JSONObject.content.query.notwhenscreenmode.indexOf(app.screenMode) < 0) ? true : false;
                    }

                    if (addQuery) {
                        //Add bubblecountquery to tmpObj
                        app.BufferedQueryObj.push(JSONObject.content.query);
                        execBuffer = true;
                    }
                }

            }
            // Build main query

            // CHECK app.BufferedQueryObj, only call 'doBufferedQuerys()' when curbufferlength == 0 and we added a query to the buffer !!!!!
            // if (app.BufferedQueryObj && curbufferlength == 0 && app.BufferedQueryObj.length > 0) {
            if (app.BufferedQueryObj && curbufferlength == 0 && execBuffer) {
                doBufferedQuerys();
            }

        }
        // BUTTONS



    }
}


function loginMethodsInit() {
    app.loginMethod = null;
    $('#activationuser_container').hide();
    $('#activationcode_container').hide();
    $('#loginmethods_container').show();

    $('#qrcode_container').hide();
    $('#qrcode').attr('src', 'css/images/loginQRcode.png');
    $('#qrcode').css({ 'width': '200px', 'height': '200px' });
    $('#qrcode').parent().removeClass('p-input');
    $('#qrcode').click(function() { loginMethodsSelect('loginQrCode'); });
    $('#footer').hide();

    var loginScreenMessage = (app.loginScreenMessage) ? b64_to_str(app.loginScreenMessage) : '';

    // Check if userregistration is active
    if (app.userregistration && BRVUtil.parseBoolean(app.userregistration.active)) {
        loginScreenMessage = loginScreenMessage + "<center><a href=\"javascript:void(0)\" onclick=\"getScreenFromJSONDefault('userregistration');\">" + app.userregistration.registertext + "</a></center><br>";
    }

    (loginScreenMessage) ? $('#bodytoptext').html(loginScreenMessage): '';

    var loginAvailable = false;
    var output = '';
    var buttonStyle = "height:85px; margin-top:5px; padding: 5px 15px 5px 15px; border-radius:10px; background-color: #ffffff;";
    var buttonClass = "flat-btn";


    // If it's browser then check for Fidesque SSO normal/direct!!
    if (BRVUtil.isBrowser()) {
        if (app.loginMethods.loginFidesqueSSOdirect) {
            app.logintype = "loginFidesqueSSOdirect";
            loginAvailable = true;
            // var claimed_id = decodeURIComponent( BRVUtil.getUrlParam('openid.claimed_id') );
            FidesqueSSOLogin.checkValidLogin();
        } else {
            loginAvailable = true;
            var callBack = BRVUtil.getUrlParam('callBack');
            if (BRVUtil.checkValue(callBack)) {
                if (callBack == 'FidesqueSSOLogin.checkValidLogin') { // FidesqueSSOLogin.checkValidLogin
                    app.logintype = "loginFidesqueSSO";
                    // var claimed_id = decodeURIComponent( BRVUtil.getUrlParam('openid.claimed_id') );
                    FidesqueSSOLogin.checkValidLogin();
                }
            } else {
                // // Show container
                // $('#bodytoptext').show();
                // $('#loginmethods_container').show();
            }
        }
    } else {
        // // Show container
        // $('#bodytoptext').show();
        // $('#loginmethods_container').show();
    }


    var linkStyle = "color:black;";
    output += '<div style="text-align:center;">';
    if (app.loginMethods.loginFidesque) {
        loginAvailable = true;
        output += ' <div class="buttonWrapper" style="padding:5px;">';
        output += '     <a id="111" href="#" onclick="javascript:loginMethodsSelect(\'loginFidesque\');" style="' + linkStyle + '">';
        output += '         <img src="css/images/loginFidesque.png" class="buttonimage" style="' + buttonStyle + '">';
        output += '         <br>Fidesque';
        output += '     </a>';
        output += ' </div>';
    }
    if (app.loginMethods.loginFidesqueSSO) {
        loginAvailable = true;
        output += ' <div class="buttonWrapper" style="padding:5px;">';
        output += '     <a id="111" href="#" onclick="javascript:loginMethodsSelect(\'loginFidesqueSSO\');" style="' + linkStyle + '">';
        output += '         <img src="css/images/loginFidesqueSSO.png" class="buttonimage" style="' + buttonStyle + '">';
        output += '         <br>Fidesque SSO';
        output += '     </a>';
        output += ' </div>';
    }
    if (app.loginMethods.loginActivationCode) {
        loginAvailable = true;
        output += ' <div class="buttonWrapper" style="padding:5px;">';
        output += '     <a id="111" href="#" onclick="javascript:loginMethodsSelect(\'loginActivationCode\');" style="' + linkStyle + '">';
        output += '         <img src="css/images/loginActivationCode.svg" class="buttonimage" style="' + buttonStyle + '">';
        output += '         <br>E-mail';
        output += '     </a>';
        output += ' </div>';
    }
    if (app.loginMethods.loginDemo) {
        loginAvailable = true;
        output += ' <div class="buttonWrapper" style="padding:5px;">';
        output += '     <a id="111" href="#" onclick="javascript:loginMethodsSelect(\'loginDemo\');" style="' + linkStyle + '">';
        output += '         <img src="css/images/loginDemo.svg" class="buttonimage" style="' + buttonStyle + '">';
        output += '         <br>Demogebruiker';
        output += '     </a>';
        output += ' </div>';
    }

    if (!loginAvailable) {
        (app.loginDisabledMessage) ? $('#bodytoptext').html(b64_to_str(app.loginDisabledMessage)): $('#bodytoptext').html(app.translateMessage('NO_LOGINMETHODS'));
        output += ' <div class="buttonWrapper" style="padding:5px;">';
        output += '     <img src="css/images/loginDisabled.svg" class="buttonimage" style="' + buttonStyle + '">';
        output += ' </div>';
    }
    output += '</div>';

    // if (app.loginMethods.loginFidesque) {
    //     loginAvailable = true;
    //     output += '<div class="ui-block-a">';
    //     output += '<a id="111" href="#" onclick="javascript:loginMethodsSelect(\'loginFidesque\');" ';
    //     output += ' class="' + buttonClass + '" ';
    //     output += ' data-role="button" ';
    //     output += ' data-shadow="false" ';
    //     output += '>';
    //     output += '<div class="buttonWrapper">';
    //     output += '<img src="css/images/loginFidesque.png" class="buttonimage" style="' + buttonStyle + '">';
    //     output += '</div><br>';
    //     output += 'Fidesque</a>';
    //     output += '</div>';
    // }
    // if (app.loginMethods.loginFidesqueSSO) {
    //     loginAvailable = true;
    //     output += '<div class="ui-block-a">';
    //     output += '<a id="111" href="#" onclick="javascript:loginMethodsSelect(\'loginFidesqueSSO\');" ';
    //     output += ' class="' + buttonClass + '" ';
    //     output += ' data-role="button" ';
    //     output += ' data-shadow="false" ';
    //     output += '>';
    //     output += '<div class="buttonWrapper">';
    //     output += '<img src="css/images/loginFidesqueSSO.png" class="buttonimage" style="' + buttonStyle + '">';
    //     output += '</div><br>';
    //     output += 'Fidesque SSO</a>';
    //     output += '</div>';
    // }
    // if (app.loginMethods.loginActivationCode) {
    //     loginAvailable = true;
    //     output += '<div class="ui-block-a">';
    //     output += '<a id="111" href="#" onclick="javascript:loginMethodsSelect(\'loginActivationCode\');" ';
    //     output += ' class="' + buttonClass + '" ';
    //     output += ' data-role="button" ';
    //     output += ' data-shadow="false" ';
    //     output += '>';
    //     output += '<div class="buttonWrapper">';
    //     output += '<img src="css/images/loginActivationCode.svg" class="buttonimage" style="' + buttonStyle + '">';
    //     output += '</div><br>';
    //     output += 'E-mail</a>';
    //     output += '</div>';
    // }
    // if (app.loginMethods.loginDemo) {
    //     loginAvailable = true;
    //     output += '<div class="ui-block-a">';
    //     output += '<a id="111" href="#" onclick="javascript:loginMethodsSelect(\'loginDemo\');" ';
    //     output += ' class="' + buttonClass + '" ';
    //     output += ' data-role="button" ';
    //     output += ' data-shadow="false" ';
    //     output += '>';
    //     output += '<div class="buttonWrapper">';
    //     output += '<img src="css/images/loginDemo.svg" class="buttonimage" style="' + buttonStyle + '">';
    //     output += '</div><br>';
    //     output += 'Demogebruiker</a>';
    //     output += '</div>';
    // }

    // if (!loginAvailable) {
    //     (app.loginDisabledMessage) ? $('#bodytoptext').html(b64_to_str(app.loginDisabledMessage)): $('#bodytoptext').html(app.translateMessage('NO_LOGINMETHODS'));
    //     output = '';
    //     output += '<div class="ui-block-a">';
    //     output += '<a id="111" href="#" onclick="javascript:void(0);" ';
    //     output += ' class="' + buttonClass + '" ';
    //     output += ' data-role="button" ';
    //     output += ' data-shadow="false" ';
    //     output += '>';
    //     output += '<div class="buttonWrapper">';
    //     output += '<img src="css/images/loginDisabled.svg" class="buttonimage" style="' + buttonStyle + '">';
    //     output += '</div><br>';
    //     output += '</a>';
    //     output += '</div>';
    // }


    $('#loginmethods').append(output);
    // $('#loginmethods').listview().listview('refresh');
}

function loginMethodsSelect(selectedMethod) {
    // var selectedMethod = $('#loginmethods').val();

    app.loginMethod = selectedMethod;
    switch (selectedMethod) {
        case "loginActivationCode":
            app.logintype = "loginActivation";
            $('#activationuser').val('');
            $('#activationcode').val('');

            $('#footer').show();
            $('#loginmethods_container').hide();
            $('#activationuser_container').show();
            $('#activationcode_container').show();

            if (!BRVUtil.isBrowser() && app.loginMethods.loginQrCode) { $('#qrcode_container').show(); }

            setTimeout(function() {
                $('#activationuser').focus();
            }, 200);
            break;

        case "loginDemo":
            app.logintype = "loginDemo";
            $('#activationuser').val(app.demoActivationUser);
            $('#activationcode').val(app.demoActivationCode);
            setTimeout(function() {
                ActivateDevice();
            }, 200);
            break;

        case "loginFidesque":
            app.logintype = "loginFidesque";
            $('#activationuser').val('');
            $('#activationcode').val('');

            // TESTING
            // $('#activationuser').val('BrvAppBuilder');
            // $('#activationcode').val('87654321');
            // TESTING

            $('#footer').show();
            $('#loginmethods_container').hide();
            $('#activationuser_container').show();
            $('#activationcode_container').show();

            setTimeout(function() {
                $('#activationuser').focus();
            }, 200);
            break;


        case "loginFidesqueSSO":
            app.logintype = "loginFidesqueSSO";
            $('#activationuser').val('');
            $('#activationcode').val('');

            $('#footer').hide();
            $('#loginmethods_container').show();
            $('#activationuser_container').hide();
            $('#activationcode_container').hide();

            setTimeout(function() {
                // $('#activationuser').focus();
                FidesqueSSOLogin.checkValidLogin();
                // FidesqueSSOLogin.FidesqueLogin();
            }, 200);
            break;


        case "loginOasUserCode":
            app.logintype = "loginActivation";
            $('#activationuser').val('');
            $('#activationcode').val('');

            $('#footer').show();
            $('#loginmethods_container').hide();
            $('#activationuser_container').show();
            $('#activationcode_container').show();

            setTimeout(function() {
                $('#activationuser').focus();
            }, 200);
            break;

        case "loginQrCode":
            app.logintype = "loginActivation";
            $('#activationuser').val('');
            $('#activationcode').val('');
            scanBRVQRCode();
            break;
    }
}

function cancelLogin() {
    getScreenFromJSONDefault('activatedevice');
}

function cancelUserRegistration() {
    getScreenFromJSONDefault('activatedevice');
}

function sendUserRegistration(params, buttonID) {
    if (!checkButtonEmptyMandatoryFields(buttonID)) {
        var emailObj = {};

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];

        var fields = JSONObject.content.fields;
        var nfields = fields.length;
        for (var fldi = 0; fldi < nfields; fldi++) {
            var fldID = fields[fldi].id;
            var fldType = fields[fldi].type;

            if ($('#' + fldID).is("p")) {
                fldValue = $('#' + fldID).text();
            } else if ($('#' + fldID).is(':checkbox')) {
                fldValue = $('#' + fldID).prop('checked') ? 'on' : 'off';
            } else {
                fldValue = $('#' + fldID).val();
            }

            fldValue = BRVUtil.checkUnicode(fldValue);

            //Escape quotes
            fldValue = BRVUtil.escapeQuotes(fldValue);

            //Trim spaces
            fldValue = BRVUtil.alltrim(fldValue);

            // Add field with value to emailObj
            emailObj[fldID] = fldValue;
        }

        // Send confirmation to user
        var SendGridObj = {};
        SendGridObj['fromEmail'] = app.userregistration.EmailBackoffice;
        SendGridObj['senderName'] = BRVUtil.alltrim(app.userregistration.EmailBackofficeName);
        SendGridObj['toEmail'] = BRVUtil.alltrim(emailObj.email);
        SendGridObj['cc'] = null;
        SendGridObj['bcc'] = null;
        SendGridObj['templateId'] = app.userregistration.EmailTemplateID;
        SendGridObj['attachments'] = null;
        SendGridObj['dynamicTemplateParams'] = new Array();

        SendGridObj.dynamicTemplateParams.push({ 'key': 'firstname', 'value': BRVUtil.alltrim(emailObj.firstname) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'lastname', 'value': BRVUtil.alltrim(emailObj.lastname) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'email', 'value': BRVUtil.alltrim(emailObj.email) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'companyname', 'value': BRVUtil.alltrim(emailObj.companyname) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'phonenumber', 'value': BRVUtil.alltrim(emailObj.phonenumber) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'comment', 'value': BRVUtil.alltrim(emailObj.comment) });

        SendGridObj.dynamicTemplateParams.push({ 'key': 'productcode', 'value': BRVUtil.alltrim(app.productcode) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'officecode', 'value': BRVUtil.alltrim(app.officecode) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'clientcode', 'value': BRVUtil.alltrim(app.clientcode) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'identifier', 'value': BRVUtil.alltrim(app.identifier) });
        SendGridObj.dynamicTemplateParams.push({ 'key': 'deviceid', 'value': BRVUtil.alltrim(app.deviceid) });

        SendGridEmail(app.userregistration.SendGridApi, SendGridObj, sendUserRegistrationBackOffice);
    }
}

function sendUserRegistrationBackOffice() {
    var emailObj = {};

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['screen'];

    var fields = JSONObject.content.fields;
    var nfields = fields.length;
    for (var fldi = 0; fldi < nfields; fldi++) {
        var fldID = fields[fldi].id;
        var fldType = fields[fldi].type;

        if ($('#' + fldID).is("p")) {
            fldValue = $('#' + fldID).text();
        } else if ($('#' + fldID).is(':checkbox')) {
            fldValue = $('#' + fldID).prop('checked') ? 'on' : 'off';
        } else {
            fldValue = $('#' + fldID).val();
        }

        fldValue = BRVUtil.checkUnicode(fldValue);

        //Escape quotes
        fldValue = BRVUtil.escapeQuotes(fldValue);

        //Trim spaces
        fldValue = BRVUtil.alltrim(fldValue);

        // Add field with value to emailObj
        emailObj[fldID] = fldValue;
    }


    // Send registration to backoffice
    var SendGridObj = {};
    SendGridObj['fromEmail'] = BRVUtil.alltrim(app.userregistration.EmailBackoffice);
    SendGridObj['senderName'] = BRVUtil.alltrim(app.userregistration.EmailBackofficeName);
    SendGridObj['toEmail'] = BRVUtil.alltrim(app.userregistration.EmailBackoffice);
    SendGridObj['cc'] = null;
    SendGridObj['bcc'] = null;
    SendGridObj['templateId'] = app.userregistration.EmailBackofficeTemplateID;
    SendGridObj['attachments'] = null;
    SendGridObj['dynamicTemplateParams'] = new Array();

    SendGridObj.dynamicTemplateParams.push({ 'key': 'firstname', 'value': BRVUtil.alltrim(emailObj.firstname) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'lastname', 'value': BRVUtil.alltrim(emailObj.lastname) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'email', 'value': BRVUtil.alltrim(emailObj.email) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'companyname', 'value': BRVUtil.alltrim(emailObj.companyname) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'phonenumber', 'value': BRVUtil.alltrim(emailObj.phonenumber) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'comment', 'value': BRVUtil.alltrim(emailObj.comment) });

    SendGridObj.dynamicTemplateParams.push({ 'key': 'productcode', 'value': BRVUtil.alltrim(app.productcode) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'officecode', 'value': BRVUtil.alltrim(app.officecode) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'clientcode', 'value': BRVUtil.alltrim(app.clientcode) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'identifier', 'value': BRVUtil.alltrim(app.identifier) });
    SendGridObj.dynamicTemplateParams.push({ 'key': 'deviceid', 'value': BRVUtil.alltrim(app.deviceid) });

    SendGridEmail(app.userregistration.SendGridApi, SendGridObj, sendUserRegistrationBackOfficeSuccess);
}

function sendUserRegistrationBackOfficeSuccess() {
    app.showMessage('SUCCESS_SENDUSERREGCONFIRMATION');
    // Go back!
    cancelUserRegistration();
}

function SendGridEmail(strApiKey, SendGridObj, callbackfunc) {
    var apiKey = (strApiKey) ? strApiKey : app.sendGridApi;
    var SendGridApiUrl = app.sendGridUrl + '/api/v1/sendgrid/email/' + apiKey;
    var jsonRequest = JSON.stringify(SendGridObj);

    app.request = jQuery.ajax({
        type: "POST",
        url: SendGridApiUrl,
        crossDomain: true,
        data: jsonRequest,
        contentType: 'application/json',
        success: function(data, status, req) {
            if (status == 'success') {
                if (jQuery.isFunction(callbackfunc)) { callbackfunc(); }
            } else {
                app.showError('ERROR_SENDUSERREGCONFIRMATION', 'function: SendGridEmail');
            }
        },
        error: function(data, status, req) {
            app.showError('ERROR_SENDUSERREGCONFIRMATION', 'function: SendGridEmail');
        }
    });
}


function doBufferedWidgets() {
    for (var i = 0; i < app.BufferedWidgetObj.length; i++) {
        var widgetID = app.BufferedWidgetObj[i].id;
        var widgetUrl = app.BufferedWidgetObj[i].url;
        var widgetWidth = (app.BufferedWidgetObj[i].width) ? app.BufferedWidgetObj[i].width : 100;
        var widgetHeight = (app.BufferedWidgetObj[i].height) ? app.BufferedWidgetObj[i].height : 100;
        var widgetType = app.BufferedWidgetObj[i].type;
        if (BRVUtil.checkValue(widgetID) && BRVUtil.checkValue(widgetUrl)) {
            switch (widgetType) {
                case "widgetimage":
                    // Replace vars in url with storage and paramobj data
                    widgetUrl = BRVUtil.replaceVarsWithDataInString(widgetUrl);
                    $('#' + widgetID).attr('src', widgetUrl);
                    $('#' + widgetID).css('width', widgetWidth);
                    $('#' + widgetID).css('height', widgetHeight);
                    break;

                case "widgethtml":
                    // Replace vars in url with storage and paramobj data
                    widgetUrl = BRVUtil.replaceVarsWithDataInString(widgetUrl);
                    $('#' + widgetID).load(widgetUrl);
                    $('#' + widgetID).css('width', widgetWidth);
                    $('#' + widgetID).css('height', widgetHeight);
                    break;

                case "widgethtmlpage":
                    // Replace vars in url with storage and paramobj data
                    widgetUrl = BRVUtil.replaceVarsWithDataInString(widgetUrl);
                    $('#' + widgetID).attr('src', widgetUrl);
                    $('#' + widgetID).css('width', widgetWidth);
                    $('#' + widgetID).css('height', widgetHeight);
                    break;

                default:
                    break;
            }
        }
    }
}


function doBufferedQuerys(initDone) {
    // -------------------------------------------------------
    // [{
    // 	"query": "eyJTZWxlY3QiOnsiU2VsZWN0VHlwZSI6IiIsIldoZXJlIjoiPHdoZXJlPiIsIkZyb20iOiJjb250YWN0IiwiT3JkZXJCeSI6ImNvbnRhY3Quc3ViX25yIiwiUXJ5RmllbGQiOlsiW4AgXSArIEFMTFRSSU0oU1RSKFNVTShkcl9hbXQrY3JfYW10KSkpIEFTIGRlYnRvcnNfYWxlcnQiXSwiSW50byI6ImJ1dHRvbmJ1YmJsZV9kZWJ0b3JzX2FsZXJ0In19",
    // 	"appid": "_MOBILE",
    // 	"wepid": "QUERY_GENERAL_TEST",
    // 	"queryfields": "",
    // 	"querywhere": "Y29udGFjdC5kZWJfc2hvdz0uVC4=",
    // 	"target": "debtors_alert",
    // 	"bgcolor": "#ed1d24",
    // 	"textcolor": "#ffffff"
    // },
    // {
    // 	"query": "eyJTZWxlY3QiOnsiU2VsZWN0VHlwZSI6IiIsIldoZXJlIjoiPHdoZXJlPiIsIkZyb20iOiJjb250YWN0IiwiT3JkZXJCeSI6ImNvbnRhY3Quc3ViX25yIiwiUXJ5RmllbGQiOlsiW4AgXSArIEFMTFRSSU0oU1RSKFNVTShkcl9hbXQrY3JfYW10KSkpIEFTIGNyZWRpdG9yc19hbGVydCJdLCJJbnRvIjoiYnV0dG9uYnViYmxlX2NyZWRpdG9yc19hbGVydCJ9fQ==",
    // 	"appid": "_MOBILE",
    // 	"wepid": "QUERY_GENERAL",
    // 	"queryfields": "",
    // 	"querywhere": "Y29udGFjdC5kZWJfc2hvdz0uRi4=",
    // 	"target": "creditors_alert",
    // 	"bgcolor": "#ed1d24",
    // 	"bgcolornull": "#ffffff",
    // 	"textcolor": "#ffffff",
    // 	"textcolornull": "#000000"
    // },
    // {
    // 	"query": "eyJTZWxlY3QiOnsiV2hlcmUiOiI8d2hlcmU+IiwiRnJvbSI6ImFydGljbGUiLCJRcnlGaWVsZCI6WyJjb3VudCgqKSBBUyBhcnRpY2xlX3RvdGFsIl0sIkludG8iOiJidXR0b25idWJibGVfdGVzdGluZyJ9fQ==",
    // 	"appid": "_MOBILE",
    // 	"wepid": "QUERY_GENERAL",
    // 	"queryfields": "",
    // 	"querywhere": "LlQu",
    // 	"target": "article_total",
    // 	"bgcolor": "#FFFFFF",
    // 	"textcolor": "#000000"
    // },
    // {
    // 	"appid": "_MOBILE",
    // 	"wepid": "QUERY_GENERAL",
    // 	"query": "eyJTZWxlY3QiOnsiV2hlcmUiOiI8d2hlcmU+IiwiSm9pbiI6W3siVGFibGUiOiJjb250YWN0IiwiSm9pblR5cGUiOiJMRUZUIE9VVEVSIiwiSm9pbkNvbmRpdGlvbiI6ImNvbnRhY3Quc3ViX25yID09IG9wZW5pdGVtLnN1Yl9uciJ9XSwiRnJvbSI6Im9wZW5pdGVtIiwiUXJ5RmllbGQiOlsiY291bnQoKikgQVMgcmVjZWl2ZV90b3RhbCJdLCJJbnRvIjoiYnV0dG9uYnViYmxlX3JlY2VpdmUifX0=",
    // 	"queryfields": "",
    // 	"querywhere": "Tk9UIG9wZW5pdGVtLmRyX2FtdCtvcGVuaXRlbS5jcl9hbXQgPSAwIEFORCBjb250YWN0LmRlYl9zaG93",
    // 	"target": "receive_total",
    // 	"bgcolor": "#ffffff",
    // 	"bgcolornull": "#ffffff",
    // 	"textcolor": "#000000",
    // 	"textcolornull": "#000000"
    // },
    // {
    // 	"appid": "_MOBILE",
    // 	"wepid": "QUERY_GENERAL",
    // 	"query": "eyJTZWxlY3QiOnsiV2hlcmUiOiI8d2hlcmU+IiwiSm9pbiI6W3siVGFibGUiOiJjb250YWN0IiwiSm9pblR5cGUiOiJMRUZUIE9VVEVSIiwiSm9pbkNvbmRpdGlvbiI6ImNvbnRhY3Quc3ViX25yID09IG9wZW5pdGVtLnN1Yl9uciJ9XSwiRnJvbSI6Im9wZW5pdGVtIiwiUXJ5RmllbGQiOlsiY291bnQoKikgQVMgcGF5X3RvdGFsIl0sIkludG8iOiJidXR0b25idWJibGVfcGF5In19",
    // 	"queryfields": "",
    // 	"querywhere": "Tk9UIG9wZW5pdGVtLmRyX2FtdCtvcGVuaXRlbS5jcl9hbXQgPSAwIEFORCBOT1QgY29udGFjdC5kZWJfc2hvdw== ",
    // 	"target": "pay_total",
    // 	"bgcolor": "#ffffff",
    // 	"textcolor": "#000000"
    // }]

    //INIT: First time join all QUERY_GENERALS in app.BufferedQueryObj
    //So all QUERY_GENERAL's are combined in just one request/response
    if (!initDone && app.BufferedQueryObj.length > 0) {
        var tmpQryQuery = new Array();
        var tmpQryQueryGeneral = new Array();
        var QryQueryGeneral = {};
        for (var i = 0; i < app.BufferedQueryObj.length; i++) {
            if (app.BufferedQueryObj[i]) {
                var wepid = app.BufferedQueryObj[i].wepid;

                if (wepid == app.QUERY_GENERAL) {
                    // Check if appid is already set
                    if (!QryQueryGeneral.appid) {
                        QryQueryGeneral.appid = app.BufferedQueryObj[i].appid;
                    }
                    // Check if wepid is already set
                    if (!QryQueryGeneral.wepid) {
                        QryQueryGeneral.wepid = app.BufferedQueryObj[i].wepid;
                    }
                    // Check if filefields is already set
                    if (app.BufferedQueryObj[i].filefields) {
                        if (!QryQueryGeneral.queryFileFields) {
                            QryQueryGeneral.filefields = app.BufferedQueryObj[i].filefields;
                        } else { // add filefields
                            QryQueryGeneral.filefields = QryQueryGeneral.filefields + app.BufferedQueryObj[i].filefields;
                        }
                    }
                    // Build the query and also replace some vars
                    var newQuery = buildQueryFromJSON(app.BufferedQueryObj[i], app.paramObject, false);
                    if (newQuery) {
                        newQuery = alterJSONQuery(newQuery, "\"Select\":");
                        tmpQryQueryGeneral.push(newQuery);
                    }
                } else {
                    tmpQryQuery.push(app.BufferedQueryObj[i]);
                }
            }
        }

        if (tmpQryQueryGeneral.length > 0) {
            tmpQryQueryGeneral = JSON.parse('{"Select": [' + eval(tmpQryQueryGeneral) + ']}');
            QryQueryGeneral.query = tmpQryQueryGeneral;
            tmpQryQuery.push(QryQueryGeneral);
        }

        app.BufferedQueryObj = new Array();
        app.BufferedQueryObj = tmpQryQuery;
    }
    // -------------------------------------------------------

    if (app.BufferedQueryObj.length > 0) {
        var curQueryObj = app.BufferedQueryObj[0];
        // {
        // 	"query": "eyJTZWxlY3QiOnsiU2VsZWN0VHlwZSI6IiIsIldoZXJlIjoiPHdoZXJlPiIsIkZyb20iOiJjb250YWN0IiwiT3JkZXJCeSI6ImNvbnRhY3Quc3ViX25yIiwiUXJ5RmllbGQiOlsiW4AgXSArIEFMTFRSSU0oU1RSKFNVTShkcl9hbXQrY3JfYW10KSkpIEFTIGRlYnRvcnNfYWxlcnQiXSwiSW50byI6ImRlYnRvcnNfYWxlcnQifX0=",
        // 	"appid": "_MOBILE",
        // 	"wepid": "QUERY_GENERAL_TEST",
        // 	"queryfields": "",
        // 	"querywhere": "Y29udGFjdC5kZWJfc2hvdz0uVC4=",
        // 	"filefields": "|fieldname|",
        // 	"target": "debtors_alert",
        // 	"bgcolor": "#ed1d24",
        // 	"textcolor": "#ffffff"
        // }

        // Check if query is object, then it's multiple QUERY_GENERAL queries, otherwhise it's just other WEP. 
        var query = (typeof curQueryObj.query == 'string') ? buildQueryFromJSON(curQueryObj, app.paramObject, false) : JSON.stringify(curQueryObj.query);
        var appid = curQueryObj.appid;
        var wepid1 = curQueryObj.wepid;
        var filefields = curQueryObj.filefields;

        if (BRVUtil.checkValue(query) && BRVUtil.checkValue(appid) && BRVUtil.checkValue(wepid1)) {
            app.wsErrorCode = 'A017';
            app.doRequestGWRWAW(query, appid, wepid1, doBufferedQuerysResult, showWSError, '', filefields);
        } else {
            // Continue next!
            app.BufferedQueryObj.splice(0, 1);

            setTimeout(function() { // Use small timeout!!
                doBufferedQuerys(true); // Call doBufferedQuerys without init!!
            }, 200);

        }

    } else {
        // If no form requests left, then get selectlists data and after that do buffered header queries.
        // setTimeout(function () {
        // 	setSelectList(GetBufferedHeaderInfoQuery);
        // }, 100);

        // If no form requests left, then get buffered header queries.
        // GetBufferedHeaderInfoQuery();

        // Enable/Disable Footer buttons!!
        setFooterButtonStatus();

        setTimeout(function() {
            GetBufferedObjectQuery(GetBufferedHeaderInfoQuery);
        }, 100);

    }

}

function doBufferedQuerysResult(data, status, req) {
    app.debug('FUNCTION: doBufferedQuerysResult, status:' + status);
    // if (!CheckGWRWAWError(data, status, req) || app.isBuilder ) { 
    if (!CheckGWRWAWError(data, status, req)) {
        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];
        var jsonData = returnjsonData(req);
        app.screenJSONData = jsonData; // Save current screendata, so we can use this in buffered queries.

        jQuery.each(jsonData.response.queryresults, function(key, value) {
            valueName = value.name.toLowerCase();
            valueValue = value.recordset;
            switch (valueName) {
                case "webquery":
                    showFieldsFormResultFromWebQuery(JSONObject, valueValue, false);
                    break;

                case (valueName.match(/^buttonbubble_/) || {}).input:
                    setButtonBubbleValue(valueValue);
                    break;

                case (valueName.match(/^select_/) || {}).input:
                    setSelectValue(valueValue, valueName, JSONObject.content.fields, false);
                    break;

                case (valueName.match(/^selectdoc_/) || {}).input:
                    setDocumentValue(valueValue, valueName, JSONObject.content.fields);
                    break;

                default:
                    break;
            }
        });

        app.BufferedQueryObj.splice(0, 1);

        setTimeout(function() { // Use small timeout!!
            doBufferedQuerys(true); // Call doBufferedQuerys without init!!
        }, 200);

    }
}


function setFooterButtonStatus() {
    $('[data-role="footer"] li a').each(function() {
        // * In 'Buildfooterfromjson' add button attribute with link to formfield
        // * Check if button needs to be disabled based on value of linked formfield
        // * Bind evend on linked formfield? When changed check if button needs to be enabled/disabled??

        var setButton = false;

        var checkField = $(this).attr('checkfield');
        var fieldValue = '';

        if (BRVUtil.checkValue(checkField)) {
            // Check if checkfield has value.
            if ($('#' + checkField).is("p")) {
                fieldValue = $('#' + checkField).text();
            } else {
                fieldValue = $('#' + checkField).val();
            }
            setButton = true;
        }

        // Check if there is an other reason to disable button
        if (BRVUtil.findInArray(app.disableFooterButtons, $(this).attr("id")) >= 0) {
            fieldValue = false;
            setButton = true;
        }


        if (setButton) {
            if (BRVUtil.parseBoolean(fieldValue) == false) {
                if (app.isBuilder) {
                    $(this).addClass('readonly');
                    //$(this).attr("onclickbackup", $(this).attr("ondblclick")); // Testing only!!
                    //$(this).attr("ondblclick", ""); // Testing only!!
                    //$(this).attr("textbackup", $(this).text()); // Testing only!!
                    //$(this).html( "<strike>"+$(this).text()+"</strike>"  ); // Testing only!!
                } else {
                    if (!$(this).hasClass('readonly')) {
                        $(this).addClass('readonly'); // Add readonly class
                        $(this).attr("onclickbackup", $(this).attr("onclick")); // Backup onclick 
                        $(this).attr("onclick", ""); // clear onclick
                    }
                }
            } else {
                if (app.isBuilder) {
                    $(this).removeClass('readonly');
                    //$(this).attr("ondblclick", $(this).attr("onclickbackup")); // Testing only!!
                    //$(this).attr("onclickbackup", ""); // Testing only!!
                    //$(this).text( $(this).attr("textbackup") );  // Testing only!!
                    //$(this).attr("textbackup", "");  // Testing only!!					
                } else {
                    if ($(this).hasClass('readonly')) {
                        $(this).removeClass('readonly'); // Remove readonly class
                        $(this).attr("onclick", $(this).attr("onclickbackup")); // restore onclick from backup
                        $(this).attr("onclickbackup", ""); // clear onclick backup
                    }
                }
            }
        }

    });
}


function buildQueryFromJSON(queryObj, paramObject, test) {
    // app.debug('FUNCTION: buildQueryFromJSON, queryObj:'+queryObj+', paramObject:'+paramObject+', test:'+test );
    app.debug('FUNCTION: buildQueryFromJSON');


    //This part causes issues in AppBuilder, Find another way?!?
    //	if (typeof queryObj.query == 'string') {
    //		queryObj.query = b64_to_str(queryObj.query);
    //	}
    //	if (typeof queryObj.query == 'object') {
    //		queryObj.query = JSON.stringify(queryObj.query);
    //	}
    //	var query = (BRVUtil.checkValue(queryObj.query)) ? queryObj.query : '';
    //************************************************************************** */

    var query = (BRVUtil.checkValue(queryObj.query)) ? b64_to_str(queryObj.query) : '';

    query = app.validateQuery(query); // Check if query does contain a valid select or setoption/setfield
    var queryFields = queryObj.queryfields;
    var queryWhere = (BRVUtil.checkValue(BRVUtil.alltrim(queryObj.querywhere))) ? b64_to_str(BRVUtil.alltrim(queryObj.querywhere)) : '';
    var queryHaving = (BRVUtil.checkValue(BRVUtil.alltrim(queryObj.queryhaving))) ? b64_to_str(BRVUtil.alltrim(queryObj.queryhaving)) : '';

    if (paramObject) {
        if (BRVUtil.checkValue(queryFields)) {
            var tmpQueryFields = queryFields.split('|');
            for (a = 0; a < tmpQueryFields.length; a++) {
                if (BRVUtil.checkValue(tmpQueryFields[a])) {
                    var tmpQueryField = tmpQueryFields[a].split('=');
                    var searchFld = tmpQueryField[0];
                    var lcFldValue = '';
                    if (searchFld.substr(0, 1) == '*') { // Check if we need to find the field value in the localstorage
                        searchFld = searchFld.substr(1, searchFld.length);
                        lcFldValue = app.GetFromPhoneStorage(searchFld);
                    } else { // Get field value from form
                        lcFldValue = paramObject[searchFld];
                    }
                    queryWhere = BRVUtil.replaceAll(queryWhere, '<' + searchFld + '>', lcFldValue);

                    queryHaving = BRVUtil.replaceAll(queryHaving, '<' + searchFld + '>', lcFldValue);

                    // Also replace values in query ????
                    query = BRVUtil.replaceAll(query, '<' + searchFld + '>', lcFldValue);
                }
            }
        }

        // Check if we need to add 'selecteditems' from app.paramObject to the queryobject
        try {
            if (BRVUtil.checkValue(query) && paramObject.selecteditems) {
                var QueryObj = BRVUtil.parseJSON(query);
                var selecteditems = BRVUtil.parseJSON(paramObject.selecteditems);
                //    if (!QueryObj.SetOption) {
                // 	   QueryObj["SetOption"]=[];
                //    }
                // Only add when 'SetOption' is already there!
                if (QueryObj.SetOption) {
                    QueryObj.SetOption.push({ "Name": "selecteditems", "Value": (selecteditems.length > 0) ? selecteditems : "" });
                }
                query = JSON.stringify(QueryObj);
            }
        } catch (e) {}
    }


    // Check if we need to add filter and search to headerquery.
    var JSONObject = app.JSONObject['screen'];
    if (BRVUtil.checkValue(JSONObject.content.headerinfo)) {

        if (BRVUtil.checkValue(JSONObject.content.headerinfo.query)) {
            // Add filter to headerquery
            if (BRVUtil.checkValue(JSONObject.content.headerinfo.query.addfilter)) {
                if (BRVUtil.checkValue(JSONObject.content.queryfilter)) {
                    if (JSONObject.content.queryfilter.length > 0) {
                        var queryWhereTMP = '';
                        var filterNr = 0;
                        queryWhereTMP = queryWhereTMP + ' AND ( ';
                        var srcField = JSONObject.id + "_filter";
                        $('#' + srcField).find('[type="checkbox"]').each(function() {
                            var filterID = this.id;
                            var state = $(this).prop('checked') ? true : false;
                            if (state) {
                                if (filterNr == 0) {} else {
                                    queryWhereTMP = queryWhereTMP + ' AND ';
                                }
                                var condition = b64_to_str($('#' + filterID).val());
                                queryWhereTMP = queryWhereTMP + condition;
                                filterNr++;
                            }
                        });
                        queryWhereTMP = queryWhereTMP + ' ) ';
                        if (queryWhere == '') {
                            queryWhere = ' .T. ';
                        }
                        queryWhere += (filterNr > 0) ? queryWhereTMP : '';
                    }
                }
            }


            // Add search to headerquery
            if (BRVUtil.checkValue(JSONObject.content.headerinfo.query.addsearch)) {
                if (BRVUtil.checkValue(JSONObject.content.search)) {
                    if (JSONObject.content.search.searchfields.length > 0) {
                        var srcField4 = JSONObject.id + "_search";
                        var srcFieldValue = $('#' + srcField4).val();
                        var tmpSrcFields = JSONObject.content.search.searchfields;
                        queryWhere = AddSearchToQueryWhere(queryWhere, srcFieldValue, tmpSrcFields);
                    }
                }
            }
        }
    }


    // ALSO ADD DATA FROM FORM FIELDS ?!?
    if (JSONObject.content.fields) {
        // console.log( 'Fields: ', JSONObject.content.fields );
        var fields = JSONObject.content.fields;
        var nfields = fields.length;
        for (var fldi = 0; fldi < nfields; fldi++) {
            var fldID = fields[fldi].id;
            var fldType = fields[fldi].type;

            if ($('#' + fldID).is("p")) {
                fldValue = $('#' + fldID).text();
            } else if ($('#' + fldID).is(':checkbox')) {
                fldValue = $('#' + fldID).prop('checked') ? 'on' : 'off';
            } else {
                fldValue = $('#' + fldID).val();
            }

            if (fldType == 'date') {
                if (BRVUtil.checkValue(fldValue)) {
                    if (fldValue.indexOf('T') > -1) {
                        fldValue = BRVUtil.ISOdateToStr(fldValue);
                    }

                    var tmpDate = '';
                    if (fldValue.indexOf('/') > 0) {
                        tmpDate = fldValue.split('/');
                    } else {
                        tmpDate = fldValue.split('-');
                    }

                    // var tmpDate = fldValue.split('-');
                    var sDay = BRVUtil.padl(tmpDate[0], '0', 2);
                    var sMonth = BRVUtil.padl(tmpDate[1], '0', 2);
                    var sYear = tmpDate[2];
                    fldValue = "" + sYear + "-" + sMonth + "-" + sDay + " 00:00:00";
                }
            }

            fldValue = BRVUtil.checkUnicode(fldValue);

            //Escape quotes
            fldValue = BRVUtil.escapeQuotes(fldValue);

            //Trim spaces
            fldValue = BRVUtil.alltrim(fldValue);

            queryWhere = BRVUtil.replaceAll(queryWhere, '<' + fldID + '>', fldValue);
            queryHaving = BRVUtil.replaceAll(queryHaving, '<' + fldID + '>', fldValue);
        }
    }
    //

    if (query) {
        query = query.replace('<where>', queryWhere);
        query = query.replace('<having>', queryHaving);
    }

    // console.log( 'paramObject; ', paramObject);
    // console.log( 'query; ', query);
    // console.log( 'queryWhere; ',  queryWhere);
    // console.log( 'queryHaving; ',  queryHaving);


    return query;
}

function AddSearchToQueryWhere(queryWhere, srcFieldValue, SrcFields) {
    if (srcFieldValue != '') {
        // var queryWhere = queryWhere;
        // var SrcFields = SrcFields.split('|');
        srcFieldValue = BRVUtil.illegalSearchChars(srcFieldValue);
        srcFieldValue = BRVUtil.checkUnicode(srcFieldValue);
        srcFieldValue = BRVUtil.escapeQuotes(srcFieldValue);

        //Remove all empty ones!
        // var SrcFields = SrcFields.filter(function (el) {
        var SrcFields = SrcFields.split('|').filter(function(el) {
            return el != null && el != '';
        });

        //If there are some SrcFields add them to querywhere 
        if (SrcFields.length > 0) {
            // For now we can only use multiple '+' or multiple ',' in one search.
            // They can not be combined in one search!
            // Check for '+' and ',' occurencies 
            var srcAndCnt = (srcFieldValue.match(/[+]/g) || []).length;
            var srcOrCnt = (srcFieldValue.match(/[,]/g) || []).length;

            var tmpWhereValue = '';

            // All search values MUST match (+)
            // Or when search values does not contain any , or + sign 
            if ((srcAndCnt > 0 && srcOrCnt == 0) || (srcAndCnt == 0 && srcOrCnt == 0)) {
                var srcValueArray = srcFieldValue.split('+');
                for (x = 0; x < srcValueArray.length; x++) {
                    var curValue = BRVUtil.alltrim(srcValueArray[x]);
                    for (y = 0; y < SrcFields.length; y++) {
                        if (y == 0) {
                            tmpWhereValue = tmpWhereValue + ' ( ';
                        }
                        tmpWhereValue = tmpWhereValue + ' UPPER([' + curValue + ']) $ UPPER(' + SrcFields[y] + ') ';
                        // if ( y == 0 || y < SrcFields.length-1 ) {
                        if (y < SrcFields.length - 1) {
                            tmpWhereValue = tmpWhereValue + ' OR ';
                        }
                        if (y == SrcFields.length - 1) {
                            tmpWhereValue = tmpWhereValue + ' ) ';
                        }
                    }
                    if (srcValueArray.length > 1 && (x == 0 || x < srcValueArray.length - 1)) {
                        tmpWhereValue = tmpWhereValue + ' AND ';
                    }
                }
            }

            // All search values MAY match (,)
            if (srcAndCnt == 0 && srcOrCnt > 0) {
                var srcValueArray1 = srcFieldValue.split(',');
                for (x = 0; x < srcValueArray1.length; x++) {
                    var curValue1 = BRVUtil.alltrim(srcValueArray1[x]);
                    for (y = 0; y < SrcFields.length; y++) {
                        if (y == 0) {
                            tmpWhereValue = tmpWhereValue + ' ( ';
                        }
                        tmpWhereValue = tmpWhereValue + ' UPPER([' + curValue1 + ']) $ UPPER(' + SrcFields[y] + ') ';
                        // if ( y == 0 || y < SrcFields.length-1 ) {
                        if (y < SrcFields.length - 1) {
                            tmpWhereValue = tmpWhereValue + ' OR ';
                        }
                        if (y == SrcFields.length - 1) {
                            tmpWhereValue = tmpWhereValue + ' ) ';
                        }
                    }
                    if (srcValueArray1.length > 1 && (x == 0 || x < srcValueArray1.length - 1)) {
                        tmpWhereValue = tmpWhereValue + ' OR ';
                    }
                }
            }

            // Check if tmpWhereValue is created and append to current queryWhere
            if (tmpWhereValue != '') {
                if (queryWhere == '') {
                    queryWhere = ' .T. ';
                }
                queryWhere = queryWhere + ' AND ' + tmpWhereValue;
            }

        }

    }

    return queryWhere;
}


// function AddSearchToQueryWhere(queryWhere, srcFieldValue, SrcFields) {
// 	var queryWhere = queryWhere;
// 	var SrcFields = SrcFields.split('|');
// 	var srcFieldValue = BRVUtil.illegalSearchChars(srcFieldValue);
// 	srcFieldValue = BRVUtil.checkUnicode(srcFieldValue);
// 	srcFieldValue = BRVUtil.escapeQuotes(srcFieldValue);

// 	if (srcFieldValue != '') {
// 		if (queryWhere == '') {
// 			queryWhere = ' .T. ';
// 		}
// 		queryWhere = queryWhere + ' AND ( ';
// 		for (a = 0; a < SrcFields.length; a++) {
// 			if (BRVUtil.checkValue(SrcFields[a])) {
// 				if (a == 1) {
// 				} else {
// 					queryWhere = queryWhere + ' OR ';
// 				}

// 				var tmpSrcFieldValue = srcFieldValue.split('+');
// 				if (tmpSrcFieldValue.length > 0) {
// 					var tmpSrc = '(';
// 					for (s = 0; s < tmpSrcFieldValue.length; s++) {
// 						var tmpValue = BRVUtil.alltrim( tmpSrcFieldValue[s] );
// 						if (s == 0) {
// 						} else {
// 							tmpSrc += ' AND ';
// 						}
// 						tmpSrc += "  UPPER([" + tmpValue + "]) $ UPPER(" + SrcFields[a] + ") ";
// 					}
// 					tmpSrc += ')';
// 					queryWhere += tmpSrc;
// 				}

// 			}
// 		}
// 		queryWhere = queryWhere + ' ) ';
// 	}
// 	return queryWhere;
// }

function alterJSONQuery(query, removeElem) {
    // app.debug('FUNCTION: alterJSONQuery, query:'+query+', removeElem:'+removeElem);
    app.debug('FUNCTION: alterJSONQuery');
    //var removeElem	= "\"Select\":";
    var selectPos = query.indexOf(removeElem);
    if (selectPos >= 0) {
        query = query.substring(selectPos + removeElem.length);
        query = query.substring(0, query.length - 1);
        query = BRVUtil.alltrim(query);
    }
    return query;
}

function returnjsonData(req) {
    app.debug('FUNCTION: returnjsonData');
    var lcRetVal = req.responseText;
    if (BRVUtil.Left(lcRetVal, 1) == '~') {
        lcRetVal = lcRetVal.substr(1, lcRetVal.length);
        lcRetVal = BVW_Cryptor.DecryptString(lcRetVal);
    }
    app.lastdoRequestWS['decryptedResponse'] = lcRetVal;

    // lcRetVal = JSON.parse(lcRetVal);
    lcRetVal = BRVUtil.parseJSON(lcRetVal);

    if (BRVUtil.checkValue(lcRetVal.response.newkey)) {
        app.AddToPhoneStorage('avkey', lcRetVal.response.newkey);
        BVW_Cryptor.setKey(lcRetVal.response.newkey);
        updateUserData(app.activeusername, 1, lcRetVal.response.newkey);
    } else {
        // Set newSeq in 'doRequestGWRWAW' instead at this point!!!
        // var newSeq = parseInt(app.GetFromPhoneStorage('wsseq')) + 1;
        // app.AddToPhoneStorage('wsseq', newSeq);
    }

    return lcRetVal;
}


function execFilterSort() {
    // Get app JSON from app vars
    var JSONObject = app.JSONObject['screen'];

    // Clear content first
    $("#" + JSONObject.id).html('');

    // Close filtersortscreen
    BRVUtil.closeifexpanded(BRVUtil.alltrim(JSONObject.id) + '_filtersort');

    // Reset livescrolling
    app.resetLiveScrolling();

    // Get new screendata 
    getScreenData();
}


function showChartFormResult(data, status, req) {
    // app.debug('FUNCTION: showChartFormResult, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showChartFormResult, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {

        // Get app JSON from app vars
        // var JSONObject = app.JSONObject['screen'];

        var jsonData = returnjsonData(req);

        if (BRVUtil.checkValue(jsonData.response.queryresults)) {

            var elemKey = BRVUtil.findElemInArray(jsonData.response.queryresults, "name", "WebQuery");
            var jsonRecords = jsonData.response.queryresults[elemKey].recordset;

            // var output = '';

            // var graphID = jsonRecords[0].graphid;
            // var graphTitle = jsonRecords[0].title;
            var graphType = jsonRecords[0].graphtype;
            // var graphAmount = jsonRecords[0].amount;
            // var graphData = jsonRecords[0].graphdata;
            // var graphDataJSONobj = JSON.parse(b64_to_str(graphData));

            buildChart('graph', graphType, jsonRecords[0], false);
        }
    }
}


function showListViewColsResult(data, status, req) {
    app.debug('FUNCTION: showListViewColsResult, status:' + status + ', req:' + JSON.stringify(req));
    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];

        var jsonData = returnjsonData(req);

        var elemKey = new Array();
        var jsonRecords = new Array();
        try {
            elemKey = BRVUtil.findElemInArray(jsonData.response.queryresults, "name", "WebQuery");
            jsonRecords = jsonData.response.queryresults[elemKey].recordset;
            app.setLiveScrolling(jsonData, getScreenData);
        } catch (e) {}

        var output = '';
        if (app.iRecordCount > 0 || app.isBuilder) {
            for (var i = (app.isBuilder && app.iCurrentPage == 1) ? -2 : 0; i < jsonRecords.length; i++) { // Builder: If builder then start on -2
                var record = i >= 0 ? jsonRecords[i] : [];

                var dividerFldValue = '';

                // Get Divider field
                if (BRVUtil.checkValue(JSONObject.content.listviewdivider)) {
                    dividerFldValue = record[JSONObject.content.listviewdivider];
                    dividerFldValue = (dividerFldValue) ? dividerFldValue : '';
                }
                // if (BRVUtil.checkValue( app.GetFromTempStorage(JSONObject.id + "_sort_divider") )) {
                // 	dividerFldValue = app.GetFromTempStorage(JSONObject.id + "_sort_divider");
                if (BRVUtil.checkValue(getUserSort(app.activeusername, JSONObject.id + "_sort_divider"))) {
                    dividerFldValue = getUserSort(app.activeusername, JSONObject.id + "_sort_divider");
                    dividerFldValue = record[dividerFldValue];
                    dividerFldValue = (dividerFldValue) ? dividerFldValue : '';
                }
                //

                // rowColumns = formatListViewRowColumns(JSONObject.content.columns, i, record);
                // rowColumns = formatListViewRowColumns(JSONObject.content.fields[0].columns, i, record);

                rowColumns = formatListViewRowColumns(JSONObject.content.fields[0].columns, i, record);

                var tmpOutput = '';
                var tmpOutputClose = '';
                if (typeof JSONObject.content.onclick.action != 'undefined') {

                    switch (JSONObject.content.onclick.action) {
                        case "GotoScreen":
                            var newScreenParams = JSONObject.content.onclick.screenparam;
                            for (var fld in record) {
                                var field = [fld][0];
                                var fieldvalue = record[fld];
                                var searchFld = '<' + field + '>';
                                if (newScreenParams.indexOf(searchFld) >= 0) {
                                    var re = eval('/' + searchFld + '/ig');
                                    newScreenParams = newScreenParams.replace(re, fieldvalue);
                                }
                            }

                            var param = 'b64|' + str_to_b64(newScreenParams);
                            var checkboxParam = JSONObject.id + '|' + param; // ScreenID |
                            // ScreenParams(Base64 encoded)

                            // Check for '_noclick' field
                            var noClick = (BRVUtil.checkValue(record._noclick)) ? BRVUtil.isBool(record._noclick) : '';

                            if (BRVUtil.checkValue(JSONObject.content.onclick.screen) && !noClick) {
                                tmpOutput = '<a href="#" onclick="javascript:getScreenFromJSON(\'' + JSONObject.content.onclick.screen + '\', \'' + param + '\', \'' + JSONObject.content.onclick.screenmode + '\')" data="">';
                                tmpOutputClose = '</a>';
                            } else {
                                var noClickMessage = (BRVUtil.checkValue(record._noclickmessage)) ? BRVUtil.alltrim(record._noclickmessage) : '';
                                if (BRVUtil.checkValue(noClickMessage)) {
                                    tmpOutput = '<a href="#" onclick="javascript:app.showMessage(\'' + noClickMessage + '\', null, false);" class="ui-btn">';
                                } else {
                                    tmpOutput = '<a href="#" onclick="javascript:void(0);" class="ui-btn">';
                                }
                                tmpOutputClose = '</a>';
                            }
                            break;

                        default:
                            // Create dummy href so classes 'ui-btn-icon-right' and 'ui-icon-carat-r' will not be added by jQuery
                            // 
                            tmpOutput = '<a href="#" onclick="javascript:void(0);" class="ui-btn">';
                            tmpOutputClose = '</a>';
                            break;
                    }
                } else {
                    // Create dummy href so classes 'ui-btn-icon-right' and 'ui-icon-carat-r' will not be added by jQuery
                    // 
                    tmpOutput = '<a href="#" onclick="javascript:void(0);" class="ui-btn">';
                    tmpOutputClose = '</a>';
                }

                var fullbgcolor = '';
                if (BRVUtil.checkValue(record.fullbackgroundcolor)) {
                    fullbgcolor = (BRVUtil.Left(record.fullbackgroundcolor, 1) == '#') ? record.fullbackgroundcolor : BRVUtil.FoxColorToHex(record.fullbackgroundcolor);
                    app.activateLiLeftColumn = JSONObject.id;
                }
                var fontcolor = '';
                if (BRVUtil.checkValue(record.fontcolor)) {
                    fontcolor = (BRVUtil.Left(record.fontcolor, 1) == '#') ? record.fontcolor : BRVUtil.FoxColorToHex(record.fontcolor);
                    app.activateLiLeftColumn = JSONObject.id;
                }

                output += '<li ';
                // output += (bgcolor) ? ' bgcolor="' + bgcolor + '" ' : '';
                output += (fullbgcolor) ? ' fullbgcolor="' + fullbgcolor + '" ' : '';
                output += (fontcolor) ? ' fontcolor="' + fontcolor + '" ' : '';
                output += (dividerFldValue) ? ' dividervalue="' + dividerFldValue + '" ' : '';
                output += '>';

                // ADD checkboxes
                var noSelect = (BRVUtil.checkValue(record._noselect)) ? BRVUtil.isBool(record._noselect) : '';
                output += '<div id="li-checkBoxLeft" class="li-checkBoxLeft">';
                // output += ' <label><input type="checkbox" name="checkbox" id="checkbox_' + i + '" value="' + checkboxParam + '" class="ui-shadow"/></label>';
                if (noSelect) {
                    // output += ' <label><input type="checkbox" name="checkbox" id="checkbox_' + i + '" value="' + checkboxParam + '" data-role="none" disabled /></label>';
                    output += ' <label><input type="checkbox" name="checkbox" id="checkbox_' + i + '" value="' + checkboxParam + '" data-role="none" style="display:none" disabled /></label>';
                } else {
                    output += ' <label><input type="checkbox" name="checkbox" id="checkbox_' + i + '" value="' + checkboxParam + '" data-role="none" /></label>';
                }
                output += '</div>';

                if (BRVUtil.checkValue(record.backgroundcolor)) {
                    output += '<div id="li-colorBoxLeft" class="li-colorBoxLeft">';
                    output += '&nbsp;';
                    output += '</div>';
                }

                output += tmpOutput;

                output += rowColumns;

                if (BRVUtil.checkValue(tmpOutputClose)) {
                    output += tmpOutputClose;
                }

                output += '</li>';
            }
        } else {
            output += '<li>Geen data gevonden!</li>';
        }

        $('#' + JSONObject.id).append(output);
        $('#' + JSONObject.id).listview().listview('refresh');

        $('[name="' + JSONObject.id + '"] li').each(function() {

            // ui-btn
            $(this).find('a').css("text-shadow", "none"); // Remove text shadow!

            var fullbgcolor = $(this).attr("fullbgcolor");
            if (BRVUtil.checkValue(fullbgcolor)) {
                $(this).css({
                    backgroundColor: fullbgcolor
                });
                $(this).find('a').css("background-color", "transparent");
            }

            var fontcolor = $(this).attr("fontcolor");
            if (BRVUtil.checkValue(fontcolor)) {
                $(this).find('a').css("color", fontcolor);
            }
        });

        // SET LIST DIVIDERS
        if (BRVUtil.checkValue(dividerFldValue)) {
            $('#' + JSONObject.id).listview({
                autodividers: true,
                autodividersSelector: function(li) {
                    var out = li.attr("dividervalue");
                    return out;
                }
            });
        }
        //

        $('#' + JSONObject.id).listview().listview('refresh');


        // Set column title positions
        if ($('#columntitlediv').attr("resizedone") == '0') {
            var liA = $('[data-role="listview"] li:not([data-role="list-divider"])').children('a:first');
            var liAPadding = liA.css("padding");
            $('#tabletitle').css("padding", liAPadding);
            $('#tabletitle').css("padding-top", "0");
            $('#tabletitle').css("padding-bottom", "0");

            // Set resizedone
            $('#columntitlediv').attr("resizedone", "1");
        }

        setTimeout(function() {
            // ResizeListView();	

            // var listViewtbody = $('[data-role="listview"] li:not([data-role="list-divider"])').find('tbody');
            // var columnArray = [];
            // var rowArray = [];
            // $(listViewtbody).find('tr').each(function () {
            // 	rowArray = [];
            // 	$(this).find('td').each(function () { 
            // 		rowArray.push( $(this).width() );
            // 	});
            // 	columnArray.push( rowArray );
            // });


            var listViewtbody = $('[data-role="listview"] li:not([data-role="list-divider"])').find('tbody');
            var totalWidth = $(listViewtbody).width() - 20;
            var trs = $(listViewtbody).children('tr:first');
            // var tds = $(listViewtbody).children('tr:first').children('td').length
            // var colWidth = totalWidth/tds;

            $(listViewtbody).find('tr').each(function() {
                $(this).find('td').each(function() {
                    $(this).css({
                        "overflow": "hidden"
                            // "width": colWidth+"px",
                            // "min-width": colWidth+"px",
                            // "max-width": colWidth+"px",
                    });
                });
            });

            ResizeListView();

        }, (app.isBuilder) ? 1000 : 100);

        // Get header data
        GetBufferedHeaderInfoQuery();

        // // Activate checkboxes / colorboxes.
        if (BRVUtil.checkValue(app.activateLiCheckboxes) || BRVUtil.checkValue(app.activateLiLeftColumn)) {
            activateLiLeftColumn(JSONObject.id);

            // When there are new records added to the list we need to do some recalculation		   
            checkCheckbox(this, JSONObject.id);
        }

    }
}


function showListViewResult(data, status, req) {
    app.debug('FUNCTION: showListViewResult, status:' + status + ', req:' + JSON.stringify(req));
    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];

        var jsonData = returnjsonData(req);

        var elemKey = new Array();
        var jsonRecords = new Array();
        try {
            elemKey = BRVUtil.findElemInArray(jsonData.response.queryresults, "name", "WebQuery");
            jsonRecords = jsonData.response.queryresults[elemKey].recordset;
            app.setLiveScrolling(jsonData, getScreenData);
        } catch (e) {}

        var output = '';
        if (app.iRecordCount > 0 || app.isBuilder) {
            var graphData = new Array();
            for (var i = (app.isBuilder && app.iCurrentPage == 1) ? -2 : 0; i < jsonRecords.length; i++) { // Builder: If builder then start on -2
                var record = i >= 0 ? jsonRecords[i] : [];
                var rowTitle = i >= 0 ? (record[JSONObject.content.fields[0].title.name] ? record[JSONObject.content.fields[0].title.name] : '') : '[' + (JSONObject.content.fields[0].title.name ? JSONObject.content.fields[0].title.name.replace(/\|/g, "") : "____") + ']';
                var rowTitleName = JSONObject.content.fields[0].title.name;
                var rowTitleId = JSONObject.content.fields[0].title.id;
                var fldPrefix = JSONObject.content.fields[0].title.prefix;
                var fldSuffix = JSONObject.content.fields[0].title.suffix;
                var dividerFldValue = '';
                BRVUtil.checkValue(fldPrefix) ? rowTitle = fldPrefix + rowTitle : rowTitle;
                BRVUtil.checkValue(fldSuffix) ? rowTitle = rowTitle + fldSuffix : rowTitle;

                try {
                    thumbImage = BRVUtil.checkValue(JSONObject.content.fields[0].thumbimage.name) ? (BRVUtil.checkImageB64(record[JSONObject.content.fields[0].thumbimage.name])) : '';
                } catch (e) {
                    thumbImage = '';
                }

                // Get Divider field
                if (BRVUtil.checkValue(JSONObject.content.listviewdivider)) {
                    dividerFldValue = record[JSONObject.content.listviewdivider];
                    dividerFldValue = (dividerFldValue) ? dividerFldValue : '';
                }
                // if (BRVUtil.checkValue( app.GetFromTempStorage(JSONObject.id + "_sort_divider") )) {
                // 	dividerFldValue = app.GetFromTempStorage(JSONObject.id + "_sort_divider");
                if (BRVUtil.checkValue(getUserSort(app.activeusername, JSONObject.id + "_sort_divider"))) {
                    dividerFldValue = getUserSort(app.activeusername, JSONObject.id + "_sort_divider");
                    dividerFldValue = record[dividerFldValue];
                    dividerFldValue = (dividerFldValue) ? dividerFldValue : '';
                }
                //

                // Check for multiple subtitle's
                rowSubTitle = formatListViewRowField(JSONObject.content.fields[0].subtitle, i, record, graphData);

                // Check for multiple asidetext's
                rowAsideText = formatListViewRowField(JSONObject.content.fields[0].asidetext, i, record, graphData);

                var tmpOutput = '';
                var tmpOutputClose = '';
                if (typeof JSONObject.content.onclick.action != 'undefined') {
                    switch (JSONObject.content.onclick.action) {

                        case "GetUsrLinkDocument":
                            //if (BRVUtil.checkValue(record.link_file)) {
                            tmpOutput = '<a href="#" onclick="javascript:getUsrLinkDocument(\'' + str_to_b64(JSON.stringify(record)) + '\')">';
                            tmpOutputClose = '</a>';
                            //}
                            break;

                        case "GotoScreen":
                            var newScreenParams = JSONObject.content.onclick.screenparam;
                            for (var fld in record) {
                                var field = [fld][0];
                                var fieldvalue = record[fld];
                                var searchFld = '<' + field + '>';
                                if (newScreenParams.indexOf(searchFld) >= 0) {
                                    var re = eval('/' + searchFld + '/ig');
                                    newScreenParams = newScreenParams.replace(re, fieldvalue);
                                }
                            }

                            var param = 'b64|' + str_to_b64(newScreenParams);
                            var checkboxParam = JSONObject.id + '|' + param; // ScreenID |
                            // ScreenParams(Base64 encoded)

                            // Check for '_noclick' field
                            var noClick = (BRVUtil.checkValue(record._noclick)) ? BRVUtil.isBool(record._noclick) : '';

                            if (BRVUtil.checkValue(JSONObject.content.onclick.screen) && !noClick) {
                                tmpOutput = '<a href="#" onclick="javascript:getScreenFromJSON(\'' + JSONObject.content.onclick.screen + '\', \'' + param + '\', \'' + JSONObject.content.onclick.screenmode + '\')" data="">';
                                tmpOutputClose = '</a>';
                            } else {
                                var noClickMessage = (BRVUtil.checkValue(record._noclickmessage)) ? BRVUtil.alltrim(record._noclickmessage) : '';
                                if (BRVUtil.checkValue(noClickMessage)) {
                                    tmpOutput = '<a href="#" onclick="javascript:app.showMessage(\'' + noClickMessage + '\', null, false);" class="ui-btn li-ListText10">';
                                } else {
                                    tmpOutput = '<a href="#" onclick="javascript:void(0);" class="ui-btn li-ListText10">';
                                }
                                tmpOutputClose = '</a>';
                            }
                            break;

                        case "ShowMessage":
                            tmpOutput = '<a href="#" onclick="javascript:app.showMessage(\'' + b64_to_str(JSONObject.content.onclick.message) + '\');">';
                            tmpOutputClose = '</a>';
                            break;

                        case "OpenAdmin":
                            var newScreenParams = JSONObject.content.onclick.screenparam;
                            for (var fld in record) {
                                var field = [fld][0];
                                var fieldvalue = record[fld];
                                var searchFld = '<' + field + '>';
                                if (newScreenParams.indexOf(searchFld) >= 0) {
                                    var re = eval('/' + searchFld + '/ig');
                                    newScreenParams = newScreenParams.replace(re, fieldvalue);
                                }
                            }

                            // Check for '_noclick' field
                            var noClick = (BRVUtil.checkValue(record._noclick)) ? BRVUtil.isBool(record._noclick) : '';
                            if (noClick) {
                                // tmpOutput = '<a href="#" onclick="javascript:void(0);" class="ui-btn li-ListText10">';
                                var noClickMessage = (BRVUtil.checkValue(record._noclickmessage)) ? BRVUtil.alltrim(record._noclickmessage) : '';
                                if (BRVUtil.checkValue(noClickMessage)) {
                                    tmpOutput = '<a href="#" onclick="javascript:app.showMessage(\'' + noClickMessage + '\', null, false);" class="ui-btn li-ListText10">';
                                } else {
                                    tmpOutput = '<a href="#" onclick="javascript:void(0);" class="ui-btn li-ListText10">';
                                }
                                tmpOutputClose = '</a>';
                            } else {
                                tmpOutput = '<a href="#" onclick="javascript:app.OpenAdmin(\'' + newScreenParams + '\', null);">';
                                tmpOutputClose = '</a>';
                            }
                            break;

                        default:
                            // Create dummy href so classes 'ui-btn-icon-right' and 'ui-icon-carat-r' will not be added by jQuery
                            // 
                            tmpOutput = '<a href="#" onclick="javascript:void(0);" class="ui-btn li-ListText10">';
                            tmpOutputClose = '</a>';
                            break;
                    }
                } else {
                    // Create dummy href so classes 'ui-btn-icon-right' and 'ui-icon-carat-r' will not be added by jQuery
                    // 
                    tmpOutput = '<a href="#" onclick="javascript:void(0);" class="ui-btn li-ListText10">';
                    tmpOutputClose = '</a>';
                }

                // var bgcolor = '';
                // if (BRVUtil.checkValue(record.backgroundcolor)) {
                // 	bgcolor = (BRVUtil.Left(record.backgroundcolor, 1) == '#') ? record.backgroundcolor : BRVUtil.FoxColorToHex(record.backgroundcolor);
                // 	app.activateLiLeftColumn = JSONObject.id;
                // }

                // output += (thumbImage) ? '<li class="ui-li ui-li-has-thumb" bgcolor="' + bgcolor + '" ' : '<li bgcolor="' + bgcolor + '" ';
                // output += (dividerFldValue) ? ' dividervalue="'+dividerFldValue+'" ' : '';

                // output += '>';

                var bgcolor = '';
                if (BRVUtil.checkValue(record.backgroundcolor)) {
                    bgcolor = (BRVUtil.Left(record.backgroundcolor, 1) == '#') ? record.backgroundcolor : BRVUtil.FoxColorToHex(record.backgroundcolor);
                    app.activateLiLeftColumn = JSONObject.id;
                }
                var fullbgcolor = '';
                if (BRVUtil.checkValue(record.fullbackgroundcolor)) {
                    fullbgcolor = (BRVUtil.Left(record.fullbackgroundcolor, 1) == '#') ? record.fullbackgroundcolor : BRVUtil.FoxColorToHex(record.fullbackgroundcolor);
                    app.activateLiLeftColumn = JSONObject.id;
                }
                var fontcolor = '';
                if (BRVUtil.checkValue(record.fontcolor)) {
                    fontcolor = (BRVUtil.Left(record.fontcolor, 1) == '#') ? record.fontcolor : BRVUtil.FoxColorToHex(record.fontcolor);
                    app.activateLiLeftColumn = JSONObject.id;
                }

                output += '<li ';
                output += (bgcolor) ? ' bgcolor="' + bgcolor + '" ' : '';
                output += (fullbgcolor) ? ' fullbgcolor="' + fullbgcolor + '" ' : '';
                output += (fontcolor) ? ' fontcolor="' + fontcolor + '" ' : '';
                output += (thumbImage) ? ' class="ui-li ui-li-has-thumb" ' : '';
                output += (dividerFldValue) ? ' dividervalue="' + dividerFldValue + '" ' : '';
                output += '>';

                var noSelect = (BRVUtil.checkValue(record._noselect)) ? BRVUtil.isBool(record._noselect) : '';
                output += '<div id="li-checkBoxLeft" class="li-checkBoxLeft">';
                // output += ' <label><input type="checkbox" name="checkbox" id="checkbox_' + i + '" value="' + checkboxParam + '" class="ui-shadow"/></label>';
                if (noSelect) {
                    // output += ' <label><input type="checkbox" name="checkbox" id="checkbox_' + i + '" value="' + checkboxParam + '" data-role="none" disabled /></label>';
                    output += ' <label><input type="checkbox" name="checkbox" id="checkbox_' + i + '" value="' + checkboxParam + '" data-role="none" style="display:none" disabled /></label>';
                } else {
                    output += ' <label><input type="checkbox" name="checkbox" id="checkbox_' + i + '" value="' + checkboxParam + '" data-role="none" /></label>';
                }
                output += '</div>';

                if (BRVUtil.checkValue(record.backgroundcolor)) {
                    output += '<div id="li-colorBoxLeft" class="li-colorBoxLeft">';
                    output += '&nbsp;';
                    output += '</div>';
                }

                output += tmpOutput;

                output += (thumbImage) ? '<img class="ui-li-thumb" src="' + thumbImage + '">' : '';
                output += '<h2 class="ui-li-heading"><span ';
                if (app.isBuilder) {
                    (i == -2) ? output += ' id="' + rowTitleId + '" ': ''; // Builder: Add id to span element of only first li
                }
                output += ' name="' + rowTitleName + '">' + rowTitle + '</span></h2>';

                output += (rowSubTitle) ? '<p class="ui-li-desc">' + rowSubTitle + '</p>' : '';

                output += (rowAsideText) ? '<p class="ui-li-aside">' + rowAsideText + '</p>' : '';

                if (graphData.length) {
                    // ToDo: Find out what is causing issue with combochart width/height!!! 
                    // if ( graphData[i].graphtype == 'combochart' ) {
                    // 	output += '<p class="ui-li-aside listviewgraphcombo" id="' + graphData[i].graphid + '"></p>';
                    // } else {
                    output += '<p class="ui-li-aside listviewgraph" id="' + graphData[i].graphid + '"></p>';
                    // }
                }

                if (BRVUtil.checkValue(tmpOutputClose)) {
                    output += tmpOutputClose;
                }

                output += '</li>';
            }
        } else {
            output += '<li>Geen data gevonden!</li>';
        }

        $('#' + JSONObject.id).append(output);
        $('#' + JSONObject.id).listview().listview('refresh');

        $('[name="' + JSONObject.id + '"] li').each(function() {
            $(this).find('a').css("text-shadow", "none"); // Remove text shadow!

            var bgcolor = $(this).attr("bgcolor");
            if (BRVUtil.checkValue(bgcolor)) {
                $(this).css({
                    backgroundColor: bgcolor
                });
            }

            var fullbgcolor = $(this).attr("fullbgcolor");
            if (BRVUtil.checkValue(fullbgcolor)) {
                $(this).css({
                    backgroundColor: fullbgcolor
                });

                if (BRVUtil.checkValue(bgcolor)) {
                    $(this).find('a').css("background-color", bgcolor);
                } else {
                    $(this).find('a').css("background-color", "transparent");
                }
            }

            var fontcolor = $(this).attr("fontcolor");
            if (BRVUtil.checkValue(fontcolor)) {
                $(this).find('a').css("color", fontcolor);
            }
        });

        // SET LIST DIVIDERS
        if (BRVUtil.checkValue(dividerFldValue)) {
            $('#' + JSONObject.id).listview({
                autodividers: true,
                autodividersSelector: function(li) {
                    var out = li.attr("dividervalue");
                    return out;
                }
            });
        }
        //

        $('#' + JSONObject.id).listview().listview('refresh');

        // Resize listview fields
        // setTimeout(function () {
        // 	ResizeListView();	
        // }, 100);
        setTimeout(function() {
            ResizeListView();
        }, (app.isBuilder) ? 1000 : 200);

        // Get header data
        GetBufferedHeaderInfoQuery();

        // Build the graphs
        if (BRVUtil.checkValue(graphData)) {
            if (graphData.length > 0) {
                for (var i = 0; i < graphData.length; i++) {
                    buildChart(graphData[i].graphid, graphData[i].graphtype, graphData[i], true);
                }
            }
        }

        // Activate checkboxes / colorboxes.
        if (BRVUtil.checkValue(app.activateLiCheckboxes) || BRVUtil.checkValue(app.activateLiLeftColumn)) {
            activateLiLeftColumn(JSONObject.id);

            // Code below causes issue that lines are not clickable anymore!! Fix later!
            // When there are new records added to the list we need to do some recalculation		   
            // $('#' + JSONObject.id + ' li .li-checkBoxLeft ').each(function (i, item) {
            // 	checkCheckbox(this, JSONObject.id);
            // });

        }

    }
}


function ResizeListView() {
    $('[data-role="listview"] li:not([data-role="list-divider"])').each(function() {
        var li = $(this);
        var heading = $(this).find('h2[class="ui-li-heading"]');
        var thumb = $(this).find('img[class="ui-li-thumb"]');
        var desc = $(this).find('p[class="ui-li-desc"]');
        var aside = $(this).find('p[class="ui-li-aside"]');

        var liWidth = (li.width()) ? li.width() : 0;
        var headingWidth = (heading.width()) ? heading.width() : 0;
        var thumbWidth = (thumb.width()) ? thumb.width() + 10 : 10;
        var descWidth = (desc.width()) ? desc.width() : 0;
        var asideWidth = (aside.width()) ? aside.width() + 10 : 10;

        var newDescWidth = liWidth - thumbWidth - asideWidth;

        newDescWidth = newDescWidth - 50; // ToDo: Check if there's any icon on the right.
        heading.width(newDescWidth);
        desc.width(newDescWidth);
    });

    // When it's browser we need to add some extra margin to the listview bottom
    if (BRVUtil.isBrowser()) {
        var listView = $('[data-role="listview"]');
        if (listView[0]) {
            var listViewID = listView[0].id;
            $('#' + listViewID).css('margin-bottom', '1em');

            // Set focus on content_table so we can page-up/page-down in listview
            setTimeout(function() {
                $('#content_table').focus();
            }, 200);

        }
    }

    // Set columntitles to correct position
    if (BRVUtil.isBrowser()) {
        if ($('#columntitlediv').html()) {
            var postionarray = new Array();

            //            console.log('We have some titles');
            //            console.log('Lets set some column positions');

            var firstrow = $('[data-role="listview"] li:not([data-role="list-divider"])').children('a:first');
            var firstrowtablecolumns = $(firstrow).find('[data-role="table"]').children('tbody').children('tr:first').children('td');
            firstrowtablecolumns.each(function() {
                postionarray.push($(this).offset().left);
            });

            var tabletitlecolumns = $('#columntitlediv').find('[id="tabletitle"]').children('thead').children('tr:first').children('th');
            for (var coli = 0; coli < tabletitlecolumns.length; coli++) {
                $(tabletitlecolumns[coli]).offset({ left: postionarray[coli] });
            }
        }
    }

    // Reset top of content_table based on header position+height
    // setTimeout(function () {
    // 	if ( !app.isBuilder) {
    // 		var headerTop = -1;
    // 		var headerHeight = parseInt( $('#header').height() );
    // 		var newContentTopPos = headerTop + headerHeight;
    // 		$('#content_table').offset({top: newContentTopPos});
    // 	}
    // }, 200);

}

function CallFunction(buttonID, buttonFunc, params) {
    app.debug('FUNCTION: CallFunction, buttonID:' + buttonID + ', buttonFunc:' + buttonFunc);
    //	if ( !checkButtonEmptyMandatoryFields(buttonID) ) {	
    BRVUtil.tryFunction(buttonFunc, params, buttonID);
    //	} else {
    //		 // Do nothing!!!
    //	}
}

function ShowFields(param, src) {
    app.debug('FUNCTION: ShowFields, param:' + param + ', src:' + src);
    var srcFldID = src.id;
    var srcFldValue = $('#' + srcFldID).val();

    if (src.type == 'checkbox') { // Get checkbox value, set srcFldValue to 'on'/'off'
        srcFldValue = ($('#' + srcFldID).prop("checked")) ? 'on' : 'off';
    }

    // var jsonParams = (BRVUtil.checkValue(param)) ? JSON.parse(b64_to_str(param)) : '';
    var jsonParams = (BRVUtil.checkValue(param)) ? BRVUtil.parseJSON(b64_to_str(param)) : '';
    try {
        for (var i = 0; i < jsonParams.length; i++) {
            var fldID = jsonParams[i].fieldid;
            var fldActivateValue = jsonParams[i].onvalue;
            var fldEditable = jsonParams[i].editable;
            var showThisFld = false;
            var tmpValueList = fldActivateValue.split('|');
            for (a = 0; a < tmpValueList.length; a++) {
                if (BRVUtil.checkValue(tmpValueList[a])) {
                    if (tmpValueList[a] == srcFldValue) {
                        showThisFld = true;
                    }
                }
            }
            var defaultValue = $("#" + fldID).attr("defaultvalue");
            if (app.isBuilder) { // Always show field when it's builder time!!
                if (showThisFld) {
                    $("#" + fldID).removeClass('builderhidden');
                    $("#" + fldID + '_function').removeClass('builderhidden');
                    // Restore to default value ?
                    (BRVUtil.checkValue(defaultValue)) ? $('#' + fldID).val(defaultValue).change(): '';
                } else {
                    $("#" + fldID).addClass('builderhidden');
                    $("#" + fldID + '_function').addClass('builderhidden');
                    // clear value ?
                    $('#' + fldID).val('').change();
                }
            } else {
                if (showThisFld) {
                    $("#" + fldID + "_container").show();
                    // (BRVUtil.checkValue( defaultValue )) ? $('#' + fldID).val(defaultValue).change() : ''; 
                } else {
                    $("#" + fldID + "_container").hide();
                    $('#' + fldID).val('').change();
                }
            }
        }
    } catch (e) {}
}


function formatListViewRowColumns(colObj, i, record) {
    // outputTbl += '<table data-role="table" id="table-custom-2" class="ui-body-d table-stripe" style="width:100%;">';
    // outputTbl += '	<thead>';
    // outputTbl += '		<tr class="ui-bar-d">';
    // outputTbl += '			<th>&nbsp;</th>';
    // outputTbl += '			<th>HJ</th>';
    // outputTbl += '			<th>VJ</th>';
    // outputTbl += '			<th>Verschil</th>';
    // outputTbl += '		</tr>';
    // outputTbl += '	</thead>';
    // outputTbl += '	<tbody>';
    // outputTbl += '		<tr>';
    // outputTbl += '			<td>Omzet</td>';
    // outputTbl += '			<td>500,00</td>';
    // outputTbl += '			<td>250,00</td>';
    // outputTbl += '			<td>250,00</td>';
    // outputTbl += '		</tr>';
    // outputTbl += '	</tbody>';
    // outputTbl += '</table>';

    var rowColumns = '';
    if (BRVUtil.checkValue(colObj) || i == -2) { // Builder
        var columnArray = new Array();
        if (BRVUtil.checkValue(colObj)) {
            if (colObj.length >= 0) {
                columnArray = colObj.concat();
            } else {
                BRVUtil.addToArray(columnArray, colObj);
            }
        } else {
            BRVUtil.addToArray(columnArray, {});
        }


        // Create header column titles
        // if (i == 0) {
        if (i == 0 && $('#columntitlediv').is(':empty')) {
            // var columntitlediv = '<table id="tabletitle" style="width:100%; padding-left: 1em; padding-right: 1em; border:1px #000000 solid;">'; 
            // var columntitlediv = '<table id="tabletitle" name="tabletitle" style="height:26px; width:100%; table-layout: fixed;">'; 
            var columntitlediv = '<table id="tabletitle" name="tabletitle" style="width:100%; table-layout: fixed;">';
            columntitlediv += '<thead>';
            columntitlediv += '<tr>';
            for (var a = 0; a < columnArray.length; a++) {
                var column = columnArray[a];
                var colWidth = (column.width) ? column.width : (100 / columnArray.length);
                colWidth = Math.round(colWidth);
                var colStyle = ' width:' + colWidth + '%; max-width:' + colWidth + '%; vertical-align: top; ';
                var rowStyle = '';

                switch (column.type) {
                    case "text":
                        rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'left') + '; ' + colStyle + '" ';
                        break;

                    case "date":
                    case "datetime":
                        rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'right') + '; ' + colStyle + '" ';
                        break;

                    case "number":
                    case "currency":
                        rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'right') + '; ' + colStyle + '" ';
                        break;

                    default:
                        rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'left') + '; ' + colStyle + '" ';
                        break;
                }

                if (i >= 0) {
                    columntitlediv += '<th ' + rowStyle + '>';
                    columntitlediv += (column.label) ? column.label : '';
                    columntitlediv += '</th>';
                }
            }
            columntitlediv += '</tr>';
            columntitlediv += '</thead>';

            // $('#columntitlediv').empty();
            $('#columntitlediv').append(columntitlediv);
            $('#columntitlediv').trigger("create");
            $('#columntitlediv').show();
        }


        rowColumns += '<table data-role="table" id="table" style="width:98%; table-layout: fixed;">';
        // Create header/rows
        rowColumns += '<thead>';
        rowColumns += '<tr>';
        for (var a = 0; a < columnArray.length; a++) {
            var column = columnArray[a];
            var colWidth = (column.width) ? column.width : (100 / columnArray.length);
            colWidth = Math.round(colWidth);
            var colStyle = ' width:' + colWidth + '%; max-width:' + colWidth + '%; display:inline-block; vertical-align: top; ';
            var rowStyle = '';

            switch (column.type) {
                case "text":
                    rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'left') + '; ' + colStyle + '" ';
                    break;

                case "date":
                case "datetime":
                    rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'right') + '; ' + colStyle + '" ';
                    break;

                case "number":
                case "currency":
                    rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'right') + '; ' + colStyle + '" ';
                    break;

                default:
                    rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'left') + '; ' + colStyle + '" ';
                    break;
            }

            if (i >= 0) {
                //				rowColumns += '<th ' + rowStyle + '>'; 
                //				rowColumns += (column.label) ? column.label : ''; 
                //				rowColumns += '</th>'; 
            } else {
                // Builder
                rowColumns += '<th ' + rowStyle + '><span id="' + column.id + '" name="' + column.name + '">';
                rowColumns += '[' + (column.name ? column.name.replace(/\|/g, "") : "____") + ']'; // Builder
                rowColumns += '</span></th>';
            }
        }
        rowColumns += '</tr>';
        rowColumns += '</thead>';

        // Create row
        rowColumns += '<tbody>';
        rowColumns += '<tr>';
        for (var a = 0; a < columnArray.length; a++) {
            var column = columnArray[a];

            var colWidth = (column.width) ? column.width : (100 / columnArray.length);
            colWidth = Math.round(colWidth);
            var colStyle = ' width:' + colWidth + '%; max-width:' + colWidth + '%; display:inline-block; font-size:small; vertical-align: top; ';
            var rowStyle = '';

            switch (column.type) {
                case "text":
                    rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'left') + '; ' + colStyle + '" ';
                    break;

                case "date":
                case "datetime":
                    rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'right') + '; ' + colStyle + '" ';
                    break;

                case "number":
                case "currency":
                    rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'right') + '; ' + colStyle + '" ';
                    break;

                default:
                    rowStyle += ' style="text-align:' + ((column.alignment) ? column.alignment : 'left') + '; ' + colStyle + '" ';
                    break;
            }

            if (i >= 0) {
                var curRecord = '';
                try {
                    curRecord = BRVUtil.alltrim(record[column.name].toString());
                } catch (e) {}

                // Format the column
                switch (i >= 0 ? column.type : 'text') {
                    case "text":
                        curRecord = BRVUtil.alltrim(curRecord.toString());
                        break;

                    case "date":
                        curRecord = BRVUtil.strToDate2(curRecord);
                        curRecord = (curRecord != '00-00-0000') ? curRecord : '';
                        break;

                    case "datetime":
                        // 2017-09-08T15:05:57+02:00
                        if (curRecord.indexOf('T') > -1) {
                            // 2016-06-21T00:00:00+02:00
                            curRecord = BRVUtil.ISOdatetimeToStr(curRecord);
                        }
                        break;

                    case "number":
                    case "currency":
                        var colDecimals = column.decimals;
                        curRecord = BRVUtil.number_format(curRecord, colDecimals, ',', '.');
                        break;

                    case "icon":
                        curRecord = b64_to_str(curRecord);
                        break;

                    default:
                        curRecord = BRVUtil.alltrim(curRecord.toString());
                        break;
                }

                rowColumns += '<td ' + rowStyle + '>';
                rowColumns += curRecord;
                rowColumns += '</td>';

            } else {
                // Builder
            }
        }
        rowColumns += '</tr>';
        rowColumns += '</tbody>';
        rowColumns += '</table>';
    }
    return rowColumns;
}


function formatListViewRowField(fldObj, i, record, graphData) {
    // Check for multiple titles
    var rowTitle = '';
    if (BRVUtil.checkValue(fldObj) || i == -2) { // Builder
        var fieldArray = new Array();
        if (BRVUtil.checkValue(fldObj)) {
            if (fldObj.length >= 0) {
                fieldArray = fldObj.concat();
            } else {
                BRVUtil.addToArray(fieldArray, fldObj);
            }
        } else {
            BRVUtil.addToArray(fieldArray, {});
        }
        for (var a = 0; a < fieldArray.length; a++) {
            fieldTitle = fieldArray[a];
            var rowFieldTmp = '';

            var rowFieldValue = null;

            if (i >= 0) {
                var fieldTMP = fieldTitle.name.split('|');
                var fldPrefix = fieldTitle.prefix;
                var fldSuffix = fieldTitle.suffix;
                var fldHideWhenEmpty = fieldTitle.hidewhenempty;
                var hideTitle = false;
                for (b = 0; b < fieldTMP.length; b++) {
                    if (BRVUtil.checkValue(fieldTMP[b])) {
                        var recordValue = record[fieldTMP[b]];
                        rowFieldTmp = rowFieldTmp + fieldTMP[b];
                        if (BRVUtil.Left(fieldTMP[b], 1) != '<') {

                            var curRecord = '';
                            try {
                                curRecord = BRVUtil.alltrim(record[fieldTMP[b]].toString());
                            } catch (e) {}

                            // if ( BRVUtil.checkValue( BRVUtil.alltrim( record[fieldTMP[b]].toString() ) ) ) {
                            if (BRVUtil.checkValue(curRecord)) {
                                // Format the recordValue
                                switch (i >= 0 ? fieldTitle.type : 'text') {
                                    case "graph":
                                        graphData.push(record);
                                        recordValue = '';
                                        break;

                                    case "text":
                                        recordValue = BRVUtil.alltrim(recordValue.toString());
                                        hideTitle = (recordValue == '') ? true : false;
                                        break;

                                    case "date":
                                        recordValue = BRVUtil.strToDate2(recordValue);
                                        recordValue = (recordValue != '00-00-0000') ? recordValue : '';
                                        hideTitle = (recordValue == '') ? true : false;
                                        break;

                                    case "datetime":
                                        // 2017-09-08T15:05:57+02:00
                                        if (recordValue.indexOf('T') > -1) {
                                            // 2016-06-21T00:00:00+02:00
                                            recordValue = BRVUtil.ISOdatetimeToStr(recordValue);
                                        }
                                        hideTitle = (recordValue == '') ? true : false;
                                        break;

                                    case "number":
                                    case "currency":
                                        hideTitle = (recordValue == 0) ? true : false;
                                        var fldDecimals = fieldTitle.decimals;
                                        recordValue = BRVUtil.number_format(recordValue, fldDecimals, ',', '.');

                                        //SUM
                                        rowFieldValue = recordValue;

                                        // Add some color to the recordValue
                                        var FontColor = '';
                                        if (parseFloat(recordValue) > 0) {
                                            FontColor = fieldTitle.textcolorpos;
                                        } else
                                        if (parseFloat(recordValue) < 0) {
                                            FontColor = fieldTitle.textcolorneg;
                                        } else {
                                            FontColor = fieldTitle.textcolornull;
                                        }
                                        if (BRVUtil.checkValue(FontColor)) {
                                            recordValue = '<font color="' + FontColor + '">' + recordValue + '</font>';
                                        }
                                        break;

                                    case "icon":
                                        recordValue = b64_to_str(recordValue);
                                        break;

                                    default:
                                        recordValue = BRVUtil.alltrim(recordValue.toString());
                                        break;
                                }
                                rowFieldTmp = rowFieldTmp.replace(fieldTMP[b], recordValue);
                            } else {
                                rowFieldTmp = rowFieldTmp.replace(fieldTMP[b], '');
                                hideTitle = true;
                            }
                        }
                    }
                }
                if (fldHideWhenEmpty && hideTitle) {
                    rowFieldTmp = '';
                } else {
                    // Add prefix and suffix
                    BRVUtil.checkValue(fldPrefix) ? rowFieldTmp = fldPrefix + rowFieldTmp : rowFieldTmp;
                    BRVUtil.checkValue(fldSuffix) ? rowFieldTmp = rowFieldTmp + fldSuffix : rowFieldTmp;
                }
            } else {
                rowFieldTmp = '[' + (fieldTitle.name ? fieldTitle.name.replace(/\|/g, "") : "____") + ']'; // Builder
            }
            if (BRVUtil.checkValue(rowFieldTmp)) {
                var rowTitleValue = rowFieldTmp;
                rowFieldTmp = '<span ';
                if (app.isBuilder) {
                    (i == -2) ? rowFieldTmp += ' id="' + fieldTitle.id + '" ': ''; // Builder: Add id to span element of only first li
                }
                // rowFieldTmp += ' name="' + fieldTitle.name + '">' + rowTitleValue + '</span>';

                rowFieldTmp += ' name="' + fieldTitle.name + '" ';

                var sumFieldValue = (typeof fieldTitle.sum != 'undefined') ? fieldTitle.sum : '';
                if (sumFieldValue) {
                    // var fldName = '_'+fieldTitle.name+'_sum'; 
                    var fldName = '_' + BRVUtil.convertToPlainText(fieldTitle.name) + '_sum';
                    var rowFieldTmpAdd = '';
                    rowFieldTmpAdd += ' sumfield="' + fldName + '" ';
                    rowFieldTmpAdd += ' sumvalue="' + rowFieldValue + '" ';
                    rowFieldTmpAdd += ' decimals="' + fieldTitle.decimals + '" ';
                    rowFieldTmp += (app.isBuilder && i < 0) ? '' : rowFieldTmpAdd;
                }

                rowFieldTmp += '>' + rowTitleValue + '</span>';

                rowTitle += rowFieldTmp;
                rowTitle += (a == fieldArray.length - 1 || fieldArray[a + 1].nolinebreak) ? '' : '<br>';
            }
        }
    }
    return rowTitle;
}


// function SetFieldValue(param, src) {
// 	app.debug('FUNCTION: SetFieldValue, param:'+param+', src:'+src);
// 	var srcFldJson = $("#" + src.id + " option:selected").attr("jsonValues");
// 	// var jsonObj = (BRVUtil.checkValue(srcFldJson)) ? JSON.parse(b64_to_str(srcFldJson)) : '';
// 	var jsonObj = (BRVUtil.checkValue(srcFldJson)) ? BRVUtil.parseJSON(b64_to_str(srcFldJson)) : '';
// 	// var jsonParams = (BRVUtil.checkValue(param)) ? JSON.parse(b64_to_str(param)) : '';
// 	var jsonParams = (BRVUtil.checkValue(param)) ? BRVUtil.parseJSON(b64_to_str(param)) : '';
// 	for (var i = 0; i < jsonParams.length; i++) {
// 		var fldID 		= jsonParams[i].fieldid;
// 		var fldValueFld	= jsonParams[i].fieldvalue;
// 		switch (fldID) {
// 			case "_showmessage": 
// 				// If fieldid is '_showmessage' then display fieldvalue.  
// 				(BRVUtil.checkValue(jsonObj[fldValueFld]))?app.showMessage(jsonObj[fldValueFld], null, false):'';
// 				break;
// 			default:
// 				var newValue = (BRVUtil.checkValue(jsonObj[fldValueFld]))?jsonObj[fldValueFld]:fldValueFld; 
// 				$('#' + fldID).val(newValue).change();
// 				break;
// 		}
// 	}
// }
function SetFieldValue(param, src) {
    app.debug('FUNCTION: SetFieldValue, param:' + param + ', src:' + src);
    var srcFldJson = $("#" + src.id + " option:selected").attr("jsonValues");
    var jsonObj = (BRVUtil.checkValue(srcFldJson)) ? BRVUtil.parseJSON(b64_to_str(srcFldJson)) : '';
    // ---------------------------------
    // ToDo: Find better way for this!!!
    // On first init of screen some attributes are not available yet, so we cannot get attribute data.
    // Only in this case add some timeout!!
    // ---------------------------------

    if (BRVUtil.checkValue(jsonObj)) {
        // Go ahead!!!
        var jsonParams = (BRVUtil.checkValue(param)) ? BRVUtil.parseJSON(b64_to_str(param)) : '';
        for (var i = 0; i < jsonParams.length; i++) {
            var fldID = jsonParams[i].fieldid;
            var fldValueFld = jsonParams[i].fieldvalue;

            switch (fldID) {
                case "_showmessage":
                    // If fieldid is '_showmessage' then display fieldvalue.  
                    (BRVUtil.checkValue(jsonObj[fldValueFld])) ? app.showMessage(jsonObj[fldValueFld], null, false): '';
                    break;
                case "_beep":
                    // If fieldid is '_beep' then beep x-times.  
                    try {
                        var newValue = (BRVUtil.checkValue(jsonObj[fldValueFld])) ? jsonObj[fldValueFld] : fldValueFld;
                        var times = parseInt(newValue);
                        (BRVUtil.checkValue(times) && times > 0) ? navigator.notification.beep(times): '';
                    } catch (err) {}
                    break;
                default:
                    //var newValue = (BRVUtil.checkValue(jsonObj[fldValueFld]))?jsonObj[fldValueFld]:fldValueFld; 
                    // Check if jsonObj does contain data for his field, otherwhise check if form contains field, otherwhise just put value from params
                    var newValue = (BRVUtil.checkValue(jsonObj[fldValueFld])) ? jsonObj[fldValueFld] : (($('#' + fldValueFld)) ? $('#' + fldValueFld).val() : fldValueFld);

                    // Check if we need to buffer some data
                    if ($('#' + fldID).attr("_type") == 'textbuffer') {
                        newValue = updateTextBuffer(src.id, fldID, newValue);
                    }
                    //
                    newValue = formatFieldToShow(fldID, newValue);

                    $('#' + fldID).val(newValue).change();
                    break;
            }
        }

        // Enable/Disable Footer buttons!!
        setFooterButtonStatus();

    } else {
        // Set timeout, cause 'src' attributes maybe not finished yet!!!
        setTimeout(function(param, src) {
            var srcFldJson = $("#" + src.id + " option:selected").attr("jsonValues");
            var jsonObj = (BRVUtil.checkValue(srcFldJson)) ? BRVUtil.parseJSON(b64_to_str(srcFldJson)) : '';
            var jsonParams = (BRVUtil.checkValue(param)) ? BRVUtil.parseJSON(b64_to_str(param)) : '';
            for (var i = 0; i < jsonParams.length; i++) {
                var fldID = jsonParams[i].fieldid;
                var fldValueFld = jsonParams[i].fieldvalue;
                switch (fldID) {
                    case "_showmessage":
                        // If fieldid is '_showmessage' then display fieldvalue.  
                        (BRVUtil.checkValue(jsonObj[fldValueFld])) ? app.showMessage(jsonObj[fldValueFld], null, false): '';
                        break;
                    case "_beep":
                        // If fieldid is '_beep' then beep x-times.  
                        try {
                            var newValue = (BRVUtil.checkValue(jsonObj[fldValueFld])) ? jsonObj[fldValueFld] : fldValueFld;
                            var times = parseInt(newValue);
                            (BRVUtil.checkValue(times) && times > 0) ? navigator.notification.beep(times): '';
                        } catch (err) {}
                        break;
                    default:
                        //var newValue = (BRVUtil.checkValue(jsonObj[fldValueFld]))?jsonObj[fldValueFld]:fldValueFld; 
                        // Check if jsonObj does contain data for his field, otherwhise check if form contains field, otherwhise just put value from params
                        var newValue = (BRVUtil.checkValue(jsonObj[fldValueFld])) ? jsonObj[fldValueFld] : (($('#' + fldValueFld)) ? $('#' + fldValueFld).val() : fldValueFld);

                        // Check if we need to buffer some data
                        if ($('#' + fldID).attr("_type") == 'textbuffer') {
                            newValue = updateTextBuffer(src.id, fldID, newValue);
                        }
                        //

                        newValue = formatFieldToShow(fldID, newValue);

                        $('#' + fldID).val(newValue).change();
                        break;
                }
            }

            // Enable/Disable Footer buttons!!
            setFooterButtonStatus();

        }, 200, param, src);
    }
}

function SetFieldValueFunction(param, src) {
    // We need to slowdown this a bit, otherwhise some fields are not yet available?!?
    setTimeout(function(arg1, arg2) {
        SetFieldValueFunction_step2(arg1, arg2);
    }, 50, param, src);
}

function SetFieldValueFunction_step2(param, src) {
    app.debug('FUNCTION: SetFieldValueFunction, param:' + param + ', src:' + src);
    var jsonParams = (BRVUtil.checkValue(param)) ? BRVUtil.parseJSON(b64_to_str(param)) : '';
    for (var i = 0; i < jsonParams.length; i++) {
        var newValue = null;
        var TgtFldID = jsonParams[i].fieldid;
        var fldValueFunc = b64_to_str(jsonParams[i].fieldvaluefunction);
        var outputStr = fldValueFunc;
        var extract = outputStr.match(/[<](.*?)[>]/g);
        if (extract && extract.length) {
            for (var i = 0; i < extract.length; i++) {
                var fldID = extract[i].replace('<', '').replace('>', '');
                if ($('#' + fldID).is("p")) {
                    fldValue = $('#' + fldID).text();
                } else if ($('#' + fldID).is(':checkbox')) {
                    fldValue = $('#' + fldID).prop('checked') ? 'on' : 'off';
                } else {
                    fldValue = $('#' + fldID).val();
                }
                fldValueFunc = BRVUtil.replaceAll(fldValueFunc, '<' + fldID + '>', fldValue);
            }
        }

        // Try to run the function
        try {
            newValue = eval(fldValueFunc);
        } catch (e) {}

        // If it has return value then set value to target field!
        if (BRVUtil.checkValue(newValue)) {
            newValue = formatFieldToShow(TgtFldID, newValue);
            $('#' + TgtFldID).val(newValue).change();
        }
    }
}

// function getFormFieldValueOnType(srcFldID) {
//     var returnValue = null;

//     // Get app JSON from app vars
//     var JSONObject = app.JSONObject['screen'];
//     // Get formfields obj
//     var formFields = JSONObject.content.fields;

//     var nfields = formFields.length;
//     for (var fldi = 0; fldi < nfields; fldi++) {
//         var fldID = formFields[fldi].id;

//         if (fldID == srcFldID) {
//             var fldType = formFields[fldi].type;
//             var fldName = formFields[fldi].name;

//             // console.log('fldName: ', fldName)
//             // console.log('fldType: ', fldType)

//             // switch (fldType) {
//             //     case "date":
//             //     case "datetime":
//             //         returnValue = $('#' + fldID).val();
//             //         console.log('1returnValue: ', returnValue);

//             //         returnValue = BRVUtil.strToDate2(returnValue);

//             //         console.log('2returnValue: ', returnValue);

//             //         break;

//             //     case "number":
//             //     case "currency":
//             //         var decimals = (formFields[fldi].decimals) ? formFields[fldi].decimals : 0;
//             //         if (decimals > 0) {
//             //             returnValue = $('#' + fldID).val();
//             //             returnValue = BRVUtil.replaceAll(returnValue.toString(), ',', '.');
//             //             returnValue = parseFloat(returnValue);
//             //         } else {
//             //             returnValue = parseInt($('#' + fldID).val());
//             //         }
//             //         break;

//             //     default:
//             //         returnValue = $('#' + fldID).val();
//             //         break;
//             // }


//         }

//     }

//     return returnValue;
// }

function getTextBuffer(fldID) {
    var bufferID = 'buff_' + fldID;
    var curBuffer = app.GetFromPhoneStorage(bufferID);
    var curCount = 0;
    var curBufferObj = null;
    var output = '';

    if (BRVUtil.checkValue(curBuffer)) {
        //curCount = BRVUtil.parseJSON(curBuffer).values.length;
        curBufferObj = BRVUtil.parseJSON(curBuffer);
        curCount = curBufferObj.length;

        //Fill listview with buffer records
        //for (var i=0; i<curBufferObj.length; i++) {
        for (var i = curBufferObj.length - 1; i >= 0; i--) {
            //output += "<li>"+curBufferObj[i]+"</li>";

            output += '<li>';
            output += '<a href="javascript:void(0)"><p>' + curBufferObj[i] + '</p></a>';
            output += '<a href="javascript:void(0)" onclick="removeFromTextBuffer(\'' + fldID + '\', \'' + curBufferObj[i] + '\', this)" data-rel="dialog" data-transition="slideup">delete</a>';
            output += '</li>';

        }
        $('#' + fldID + "_list").append(output);
        $('#' + fldID + "_list").listview().listview('refresh');
        //
        //	} else {
        //		output += '<li>';
        //		output += '<a href="javascript:void(0)"><p>Geen data gevonden</p></a>';
        //		output += '</li>';
    }
    //	$('#'+fldID+"_list").append(output);
    //	$('#'+fldID+"_list").listview().listview('refresh');

    $('#' + fldID + "_counter").val(curCount);
    $('#' + fldID).val(curBuffer);
    return curBuffer;
}

function removeTextBuffer(fldID) {
    var bufferID = 'buff_' + fldID;
    app.RemoveFromPhoneStorage(bufferID);
    $('#' + fldID + "_counter").val(0);
}

function removeFromTextBuffer(fldID, value, elem) {
    var message = app.translateMessage('REMOVE_RECORD');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                removeFromTextBuffer_step2(fldID, value, elem);
            },
            nee: function() {}
        }
    });
}

function removeFromTextBuffer_step2(fldID, value, elem) {
    var bufferID = 'buff_' + fldID;
    var curBuffer = app.GetFromPhoneStorage(bufferID);
    var curBufferObj = BRVUtil.parseJSON(curBuffer);
    var listitem = $(elem).parent("li");
    var saveCurBuffer = false;

    for (var i = 0; i < curBufferObj.length; i++) {
        if (curBufferObj[i] == value) {
            curBufferObj.splice(i, 1); // Remove current record.

            listitem.remove();
            $('#' + fldID + "_list").listview().listview('refresh');

            saveCurBuffer = true;
            break;
        }
    }

    if (saveCurBuffer) {
        curBuffer = JSON.stringify(curBufferObj);
        app.AddToPhoneStorage(bufferID, curBuffer);

        $('#' + fldID + "_counter").val(curBufferObj.length);
        $('#' + fldID).val(curBuffer);
    }
}

function updateTextBuffer(srcFldID, tgtFldID, newValue, deleteValue) {
    var JSONObject = app.JSONObject['screen'];
    var fieldsObj = JSONObject.content.fields;

    var addValue = true;
    var saveCurBuffer = true;
    var bufferID = 'buff_' + tgtFldID;
    var curBuffer = app.GetFromPhoneStorage(bufferID);
    var curBufferObj = [];

    // Check if there's a curBuffer and then parse it to curBufferObj
    if (BRVUtil.checkValue(curBuffer)) {
        curBufferObj = BRVUtil.parseJSON(curBuffer);
    }

    if (BRVUtil.checkValue(newValue)) {
        // Check if newValue already exists in curBufferObj
        //if ( curBufferObj.values.length > 0 ) {
        if (curBufferObj.length > 0) {
            //for (var i=0; i<curBufferObj.values.length; i++) {
            for (var i = 0; i < curBufferObj.length; i++) {
                //if (curBufferObj.values[i] == newValue) {
                if (curBufferObj[i] == newValue) {
                    addValue = false;
                    saveCurBuffer = false;

                    // Checkif we need to delete this value!
                    if (deleteValue) {
                        //curBufferObj.values.splice(i, 1); // Remove current record.
                        curBufferObj.splice(i, 1); // Remove current record.
                        saveCurBuffer = true;
                    }
                }
            }
        }

        // Check if we need to add newValue to curBufferObj
        if (addValue) {
            //curBufferObj.values.push(newValue);	
            curBufferObj.push(newValue);
        }

        //Set counterfield
        //$('#'+tgtFldID+"_counter").val(curBufferObj.values.length);
        $('#' + tgtFldID + "_counter").val(curBufferObj.length);

        //Check if we need to set focus to sourcefield again!!
        for (var fldi = 0; fldi < fieldsObj.length; fldi++) {
            if (fieldsObj[fldi].id == srcFldID) {
                //Check if we need to set focus to srcfield and remove value
                //Use setTimeout, otherwise sometimes we are too faaaaaast! and element isn't available yet.
                setTimeout(function(arg1) {
                    if (BRVUtil.isBool(arg1.setfocus)) {
                        $('#' + arg1.id).focus();

                        //Check if we need to clear on focus
                        if (BRVUtil.isBool(arg1.clearonfocus)) {
                            $('#' + arg1.id).val('');
                        }
                    }
                }, 10, fieldsObj[fldi]);
                break;
            }
        }

        // Save new curBufferObj to storage
        if (saveCurBuffer) {
            app.AddToPhoneStorage(bufferID, JSON.stringify(curBufferObj));

            var output = '';
            output += '<li>';
            output += '<a href="javascript:void(0)"><p>' + newValue + '</p></a>';
            output += '<a href="javascript:void(0)" onclick="removeFromTextBuffer(\'' + tgtFldID + '\', \'' + newValue + '\', this)" data-rel="dialog" data-transition="slideup">delete</a>';
            output += '</li>';

            $('#' + tgtFldID + "_list").prepend(output);
            $('#' + tgtFldID + "_list").listview().listview('refresh');
        }
    }
    return JSON.stringify(curBufferObj);
}


function ResetFieldFocus() {
    app.debug('FUNCTION: ResetFieldFocus');
    var JSONObject = app.JSONObject['screen'];
    var fieldsObj = JSONObject.content.fields;

    // Check screen for field which need to be set on focus
    for (var fldi = 0; fldi < fieldsObj.length; fldi++) {
        if (BRVUtil.parseBoolean(fieldsObj[fldi].setfocus)) {
            // Check if we need to set focus
            $('#' + fieldsObj[fldi].id).focus(); // set focus
            // Check if we need to clear value on focus
            if (BRVUtil.parseBoolean(fieldsObj[fldi].clearonfocus)) {
                $('#' + fieldsObj[fldi].id).val(''); // Clear old input
            }
        }
    }
}

function RefreshFieldQuery(param, src) {
    app.debug('FUNCTION: RefreshFieldQuery, param:' + param + ', src:' + src);
    var jsonParams = (BRVUtil.checkValue(param)) ? BRVUtil.parseJSON(b64_to_str(param)) : '';
    var srcValue = BRVUtil.alltrim($("#" + src.id).val());
    var doContinue = (!BRVUtil.checkValue(srcValue) && BRVUtil.parseBoolean(jsonParams[0].notempty)) ? false : true;

    if (doContinue) {
        if (jsonParams && jsonParams.length > 0) {
            var fldID = jsonParams[0].fieldid;
            if (BRVUtil.checkValue(fldID)) {
                setTimeout(function(fldID) {
                    // find fldID in current screen reload it's query
                    var JSONObject = app.JSONObject['screen'];
                    var fieldsObj = JSONObject.content.fields;
                    for (var fldi = 0; fldi < fieldsObj.length; fldi++) {
                        if (fieldsObj[fldi].id == fldID) {
                            bufferObjectQuery(fieldsObj[fldi], fieldsObj[fldi].id, fieldsObj[fldi].type, fieldsObj[fldi].keyfield);
                            GetBufferedObjectQuery(null);
                            break;
                        }
                    }
                }, 200, fldID);
            }
        }
    }
}


function SetFieldFocus(param, src) {
    app.debug('FUNCTION: SetFieldFocus, param:' + param + ', src:' + src);
    var jsonParams = (BRVUtil.checkValue(param)) ? BRVUtil.parseJSON(b64_to_str(param)) : '';
    var srcValue = BRVUtil.alltrim($("#" + src.id).val());
    var doContinue = (!BRVUtil.checkValue(srcValue) && BRVUtil.parseBoolean(jsonParams[0].notempty)) ? false : true;

    //console.log('doContinue: ', doContinue);
    //console.log('srcField: ', src.id);
    //console.log('srcValue: ', BRVUtil.checkValue(srcValue));
    //console.log('tgtField: ', jsonParams[0].fieldid);
    //console.log('tgtValue: ', $('#' +  jsonParams[0].fieldid).val());
    //console.log('notempty: ', BRVUtil.parseBoolean( jsonParams[0].notempty ));
    //console.log('jsonParams[0]: ', jsonParams[0]);

    if (doContinue) {
        if (jsonParams && jsonParams.length > 0) {
            var fldID = jsonParams[0].fieldid;
            if (BRVUtil.checkValue(fldID)) {
                // Set focus after a little timeout, cause we would be to early!!
                setTimeout(function(fldID) {
                    // Set focus
                    $('#' + fldID).focus();

                    // find fldID in current screen and check if we need to clear it's value!'
                    var JSONObject = app.JSONObject['screen'];
                    var fieldsObj = JSONObject.content.fields;
                    for (var fldi = 0; fldi < fieldsObj.length; fldi++) {
                        if (fieldsObj[fldi].id == fldID) {
                            if (BRVUtil.parseBoolean(fieldsObj[fldi].clearonfocus)) {
                                $('#' + fieldsObj[fldi].id).val(''); // Clear old input
                            }
                            break;
                        }
                    }
                }, 200, fldID);

            }
        }
    }
}

function ClickButton(param, src) {
    app.debug('FUNCTION: ClickButton, param:' + param + ', src:' + src);
    var jsonParams = (BRVUtil.checkValue(param)) ? BRVUtil.parseJSON(b64_to_str(param)) : '';
    var srcValue = $("#" + src.id).val();
    var doContinue = (!BRVUtil.checkValue(srcValue) && BRVUtil.parseBoolean(jsonParams[0].notempty)) ? false : true;
    // Only continue when 'notempty' and screen load is ready and mode is 'edit'/'add'
    if (doContinue && app.screenloaddone && (app.screenMode == 'edit' || app.screenMode == 'add')) {
        if (jsonParams.length > 0) {
            var btnID = jsonParams[0].buttonid;
            if (BRVUtil.checkValue(btnID)) {

                if (app.isBuilder) {
                    $("#" + btnID).dblclick();
                } else {
                    // If button is readonly, then onclick has been moved to onclickbackup, get function and exec function!!
                    if ($("#" + btnID).hasClass('readonly')) {

                        //var myFunc = $("#"+btnID).attr("onclickbackup");
                        //if (jQuery.isFunction(myFunc)) { myFunc(); }

                        try {
                            var myFunc = $("#" + btnID).attr("onclickbackup");
                            (eval(myFunc));
                        } catch (e) {}

                    } else { // If button is not readonly, then just click on the button!
                        $("#" + btnID).click();
                    }

                }
            }
        }
    }
}

function RefreshField(param, src) {
    app.debug('FUNCTION: RefreshField, param:' + param + ', src:' + src);

    // RefreshedField = param;
    // ToDo: check if param is Base64 encoded
    // ToDo: check if there are more params.
    var param = b64_to_str(param);

    var tmpParamList = param.split('|');
    for (a = 0; a < tmpParamList.length; a++) {

        tmpParamList[a] = tmpParamList[a].replace(/"/ig, '');
        RefreshedField = tmpParamList[a];

        var query = '';

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];
        var fieldsObj = JSONObject.content.fields;

        for (var fldi = 0; fldi < fieldsObj.length; fldi++) {
            if (fieldsObj[fldi].id == RefreshedField) {
                var fldqueryObj = fieldsObj[fldi].query;

                // Has Query
                if (BRVUtil.checkValue(fldqueryObj)) {
                    fldquery = (BRVUtil.checkValue(fldqueryObj.query)) ? b64_to_str(fldqueryObj.query) : '';
                    fldqueryAppID = fldqueryObj.appid;
                    fldqueryReqID = fldqueryObj.wepid;
                    queryWhere = (BRVUtil.checkValue(fldqueryObj.querywhere)) ? b64_to_str(fldqueryObj.querywhere) : '';
                    queryHaving = (BRVUtil.checkValue(fldqueryObj.queryhaving)) ? b64_to_str(fldqueryObj.queryhaving) : '';

                    var tmpCheckFields = fieldsObj[fldi].checkfield.split('|');
                    for (a = 0; a < tmpCheckFields.length; a++) {
                        if (BRVUtil.checkValue(tmpCheckFields[a])) {
                            var tmpCheckField = tmpCheckFields[a].split('=');
                            var searchFld = tmpCheckField[0];
                            var formFldValue = $('#' + searchFld).val();
                            queryWhere = queryWhere.replace('<' + searchFld + '>', formFldValue);
                            queryHaving = queryHaving.replace('<' + searchFld + '>', formFldValue);

                            // Also replace values in fldquery ????
                            fldquery = BRVUtil.replaceAll(fldquery, '<' + searchFld + '>', formFldValue);

                        }
                    }

                    if (queryWhere == '') {
                        queryWhere = ' .T. ';
                    }
                    query = fldquery;
                    query = query.replace('<where>', queryWhere);
                    query = query.replace('<having>', queryHaving);
                }
                //
            }
        }
        // if (BRVUtil.checkValue(query)) {
        if (BRVUtil.checkValue(fldqueryAppID) && BRVUtil.checkValue(fldqueryReqID) && BRVUtil.checkValue(query)) {
            app.wsErrorCode = 'A004';
            app.doRequestGWRWAW(query, fldqueryAppID, fldqueryReqID, showRefreshFieldResult, showWSError);
        }

    }

}

function showRefreshFieldResult(data, status, req) {
    // app.debug('FUNCTION: showRefreshFieldResult, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showRefreshFieldResult, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];

        var jsonData = returnjsonData(req);
        var jsonRecords = jsonData.response.queryresults[0].recordset;

        // ToDo: Check for field type.
        setSelectValue(jsonRecords, RefreshedField, JSONObject.content.fields, true);

        RefreshedField = null;
    }
}


function buildChart(elementID, graphType, recordObj, hidelegend) {
    // VERSION V2
    // "amount": 734250.51,
    // "graphdata": "",
    // "graphid": "top10revenue",
    // "graphtype": "piechart",
    // "title": "Omzet Top 10"

    // VERSION V1
    // "amount": 366837.52,
    // "graphcolors": "['#2A8C7C', '#FFA527', '#3D6092']",
    // "graphdata": "",
    // "graphid": "periodfigures",
    // "graphlabels": "",
    // "graphtype": "combochart",
    // "title": "Periodecijfers"

    if (BRVUtil.checkValue(recordObj.graphlabels) && BRVUtil.checkValue(recordObj.graphcolors)) {
        buildChartV1(elementID, graphType, recordObj, hidelegend);
    } else {
        buildChartV2(elementID, graphType, recordObj, hidelegend);
    }
}

function buildChartV2(elementID, graphType, recordObj, hidelegend) {
    // VERSION V2
    // "graphdata": "",
    // "graphid": "top10revenue",
    // "graphtype": "piechart",
    // "title": "Omzet Top 10"

    var graphTitle = recordObj.title;
    var graphType = recordObj.graphtype;
    var graphID = recordObj.graphid;
    var graphDataJSONobj = (BRVUtil.checkValue(recordObj.graphdata)) ? BRVUtil.parseJSON(b64_to_str(recordObj.graphdata)) : '';
    var defaultColors = ['#3D6092', '#60A8CC', '#2A8C7C', '#FFA527', '#CC5CA5', '#9C63C0', '#9D9D9E', '#8DB964', '#FFC926', '#996E2C', '#C43B3B'];

    var settings = (graphDataJSONobj.settings) ? graphDataJSONobj.settings : '';
    var targetscreen = (settings.targetscreen) ? settings.targetscreen : graphID;
    var headerSumDecimals = (settings.headersumdecimals || settings.headersumdecimals == 0) ? settings.headersumdecimals : 2;
    var rowDecimals = (settings.rowdecimals || settings.rowdecimals == 0) ? settings.rowdecimals : 2;
    var rowSort = (settings.rowsort) ? settings.rowsort : '';
    var hideNullRows = (settings.hidenullrows) ? settings.hidenullrows : false;

    defaultColors = (settings.graphcolors) ? eval(settings.graphcolors) : eval(defaultColors);
    var graphColors = [];

    // Replace vars in apptitle
    $('#apptitle').html($('#apptitle').html().replace('&lt;title&gt;', graphTitle));
    $('#apptitle').css('visibility', 'visible');

    // var targetscreen	= (graphDataJSONobj.targetscreen) ? graphDataJSONobj.targetscreen : '';
    var headersum = (graphDataJSONobj.headersum) ? graphDataJSONobj.headersum : null;
    var header = (graphDataJSONobj.header) ? graphDataJSONobj.header : null;
    var rows = (graphDataJSONobj.rows) ? graphDataJSONobj.rows : null;
    // Result Array:
    // [
    // 	["rec_id","Groep","Omzet",{"role":"style"}],
    // 	["8110","Omzet artikelgroep 3","249796.01","#3D6092"],
    // 	["8115","Omzet artikelgroep 4","243594.82","#60A8CC"],
    // 	["8105","Omzet artikelgroep 2","120840.00","#2A8C7C"],
    // 	["9400","Overige opbrengsten","61607.56","#FFA527"],
    // 	["8100","Omzet artikelgroep 1","58370.80","#CC5CA5"],
    // 	["8000","Omzet","41.32","#9C63C0"]
    // ]

    var dataArray = []; // Data for creating Google Graph
    var dataArrayColumnRows = []; // Data for creating legend
    var dataArrayColumnValues = [];
    var dataArrayColumnValuesSettings = [];
    var hasRecID = false;
    var decimals = '';

    // First row contains header data

    if (graphType == 'combochart') {
        dataArrayColumnRows.push(["rec_id", header.desclabel, header.value1label, header.value2label, header.resultlabel]);
    } else {
        dataArrayColumnRows.push(["rec_id", header.desclabel, header.valuelabel, { role: 'style' }]);
    }

    // Create rows with column data
    var align = 'left';
    jQuery.each(rows, function(key, value) {
        jQuery.each(value, function(valuekey, valuevalue) {
            switch (valuekey) {
                case "rec_id":
                    align = '';
                    decimals = '';
                    hasRecID = true;
                    break;
                case "desc":
                    align = 'left';
                    decimals = '';
                    break;
                case "value":
                case "value1":
                case "value2":
                case "result":
                    align = 'right';
                    decimals = 2;
                    valuevalue = parseFloat(valuevalue);
                    break;
                case "color":
                    align = '';
                    decimals = '';
                    graphColors.push(valuevalue);
                    break;
                default:
                    align = '';
                    decimals = '';
                    break;
            }

            // Add value to array
            dataArrayColumnValues.push(valuevalue);

            (key == 0) ? dataArrayColumnValuesSettings.push({ "field": valuekey, "align": align, "decimals": decimals }): '';

        });
        // Add value array to row array
        dataArrayColumnRows.push(dataArrayColumnValues);
        // Clear value array
        dataArrayColumnValues = [];
    });

    // Prepaire dataArray for Google Graph
    dataArray = dataArray.concat(dataArrayColumnRows);
    // Check if there's a rec_id, this we need to remove for the Graph only
    (hasRecID) ? dataArray = BRVUtil.removeArrayEl(dataArray, 0): '';

    /* PIECHART */
    if (graphType == 'piechart') {
        var options = {
            legend: {
                position: "none"
            },
            pieSliceText: 'none',
            title: '',
            pieStartAngle: 90,
            sliceVisibilityThreshold: 0,
            backgroundColor: 'transparent',
            enableInteractivity: false,
            chartArea: {
                width: '100%',
                height: '75%'
            },
            colors: (graphColors.length > 0) ? graphColors : defaultColors
        };

        // Create graph
        var data = google.visualization.arrayToDataTable(dataArray);
        var chart = new google.visualization.PieChart(document.getElementById(elementID));
        //chart.draw(data, options);
        (app.isBuilder) ? setTimeout(function() { chart.draw(data, options); }, 100): chart.draw(data, options);
    }

    /* COLUMNCHART */
    if (graphType == 'columnchart') {
        var options = {
            hAxis: {
                logScale: false,
                textPosition: 'none'
            },
            vAxis: {
                logScale: false,
                textPosition: 'none',
                viewWindowMode: 'maximized' // this will have no effect on this chart, incidentally
            },
            legend: {
                position: "none"
            },
            title: '',
            backgroundColor: 'transparent',
            enableInteractivity: false,
            bar: {
                groupWidth: "95%"
            },
            chartArea: {
                width: '100%',
                height: '75%'
            },
            colors: (graphColors.length > 0) ? graphColors : defaultColors
        };

        // Create graph
        var data = google.visualization.arrayToDataTable(dataArray);
        var chart = new google.visualization.ColumnChart(document.getElementById(elementID));
        //chart.draw(data, options);
        (app.isBuilder) ? setTimeout(function() { chart.draw(data, options); }, 100): chart.draw(data, options);
    }


    /* COMBOCHART */
    if (graphType == 'combochart') {
        var seriesNr = dataArray[0].length - 2;
        var options = {
            vAxis: {
                textPosition: 'none',
                viewWindowMode: 'maximized' // this will have no effect on this chart, incidentally
            },
            hAxis: {
                textPosition: (hidelegend) ? 'none' : 'bottom'
            },
            seriesType: "bars",
            series: "",
            legend: {
                position: "none"
            },
            bar: {
                groupWidth: "95%"
            },
            chartArea: {
                width: '100%',
                height: '75%'
            },
            backgroundColor: 'transparent',
            enableInteractivity: false,
            colors: (graphColors.length > 0) ? graphColors : defaultColors
        };

        // Set results line
        myObj = new Object();
        myObj[seriesNr] = {
            type: "line"
        };
        options.series = myObj;

        var data = google.visualization.arrayToDataTable(dataArray);
        var chart = new google.visualization.ComboChart(document.getElementById(elementID));
        //chart.draw(data, options);
        (app.isBuilder) ? setTimeout(function() { chart.draw(data, options); }, 100): chart.draw(data, options);
    }


    if (!hidelegend) {
        // Create sum table
        var sumTable = '<table style="width:100%;">';
        if (headersum.length > 0) {
            for (var i = 0; i < headersum.length; i++) {
                sumTable += '<tr>';
                sumTable += (headersum[i].color) ? '<td style="background-color:' + headersum[i].color + '">&nbsp;</td>' : '';
                sumTable += '<td style="text-align:left;">';
                // Check if we need to add a link to the desc field
                var newScreenParam = '|rec_id=' + headersum[i].rec_id + '|';
                newScreenParam = (newScreenParam) ? 'b64|' + str_to_b64(newScreenParam) : '';
                sumTable += (headersum[i].rec_id) ? '<a href="javascript:void(0);" onclick="javascript:getScreenFromJSON(\'' + targetscreen + '\', \'' + newScreenParam + '\', \'show\')">' : '';
                sumTable += headersum[i].desc;
                sumTable += (headersum[i].rec_id) ? '</a>' : '';
                sumTable += '</td>';

                var headerSumvalue = headersum[i].value;
                // var headerSumDecimals = (headersum[i].decimals || headersum[i].decimals == 0) ? headerSumDecimals : 2; 
                headerSumvalue = BRVUtil.number_format(headerSumvalue, headerSumDecimals, ',', '.');

                sumTable += '<td style="text-align:right;">' + headerSumvalue + '</td>';
                sumTable += '</tr>';
            }
            sumTable += '</table>';
            $('#' + elementID + '_title').html(sumTable);
        } else {
            $('#' + elementID + '_title').hide();
        }

        // Create legend table
        var legendTable = '<table style="width:100%">';
        var legendRows = '';
        var legendRow = '';
        for (var i = 0; i < dataArrayColumnRows.length; i++) {
            var rowRecId = '';
            if (i == 0) { // Header
                legendTable += '<tr>';

                // First check for color column, if exists then add empty td to header
                for (var a = 0; a < dataArrayColumnRows[i].length; a++) {
                    var column = a;
                    var columnField = dataArrayColumnValuesSettings[column].field;
                    switch (columnField) {
                        case 'color': // color
                            legendTable += '<td>&nbsp;</td>';
                            break;

                        case 'DUMMY': // color
                            legendTable += '';
                            break;

                        default:
                            break;
                    }
                }

                // Create header column
                for (var a = 0; a < dataArrayColumnRows[i].length; a++) {
                    var column = a;
                    var columnField = dataArrayColumnValuesSettings[column].field;
                    var columnAlign = (dataArrayColumnValuesSettings[column].align) ? dataArrayColumnValuesSettings[column].align : 'left';
                    switch (columnField) {
                        case 'rec_id': // rec_id
                            legendTable += '<td style="text-align:left;display:none;"><b>' + dataArrayColumnRows[i][a] + '</b></td>';
                            break;
                        case 'color':
                            // legendTable += '<td style="text-align:left;display:none;"><b>' + dataArrayColumnRows[i][a] + '</b></td>';
                            break;
                        default:
                            legendTable += '<td style="text-align:' + columnAlign + ';"><b>' + dataArrayColumnRows[i][a] + '</b></td>';
                            break;
                    }

                }
                legendTable += '</tr>';
            } else { // Rows
                legendRow = '<tr>';

                // First check for color column
                for (var a = 0; a < dataArrayColumnRows[i].length; a++) {
                    var column = a;
                    var columnField = dataArrayColumnValuesSettings[column].field;
                    switch (columnField) {
                        case 'color': // color
                            legendRow += (dataArrayColumnRows[i][a]) ? '<td style="background-color:' + dataArrayColumnRows[i][a] + '">&nbsp;</td>' : '';
                            break;
                        case 'rec_id': // color
                            rowRecId = dataArrayColumnRows[i][a];
                            break;
                        default:
                            break;
                    }
                }


                // Check other columns
                var RowIsNull = false;
                for (var a = 0; a < dataArrayColumnRows[i].length; a++) {
                    var column = a;
                    var columnField = dataArrayColumnValuesSettings[column].field;
                    var columnAlign = (dataArrayColumnValuesSettings[column].align) ? dataArrayColumnValuesSettings[column].align : 'left';

                    switch (columnField) {
                        case 'rec_id': // rec_id
                            legendRow += '<td style="text-align:left;display:none;">' + dataArrayColumnRows[i][a] + '</td>';
                            break;
                        case 'color': // color
                            break;
                        case 'desc': // color
                            // Create screen params
                            var newScreenParam = '|rec_id=' + rowRecId + '|';
                            newScreenParam = (newScreenParam) ? 'b64|' + str_to_b64(newScreenParam) : '';

                            legendRow += '<td style="text-align:' + columnAlign + ';">';
                            legendRow += (rowRecId) ? '<a href="javascript:void(0);" onclick="javascript:getScreenFromJSON(\'' + targetscreen + '\', \'' + newScreenParam + '\', \'show\')">' : '';
                            legendRow += dataArrayColumnRows[i][a];
                            legendRow += (rowRecId) ? '</a>' : '';
                            legendRow += '</td>';
                            break;
                        default:
                            var rowValue = dataArrayColumnRows[i][a];

                            (rowValue == '' || rowValue == 0) ? RowIsNull = true: '';

                            (rowDecimals || rowDecimals == 0) ? rowValue = BRVUtil.number_format(rowValue, rowDecimals, ',', '.'): '';
                            legendRow += '<td style="text-align:' + columnAlign + ';">' + rowValue + '</td>';
                            break;
                    }
                }
                legendRow += '</tr>';
            }


            if (hideNullRows && RowIsNull) {} else {
                // Change sort of rows
                if (rowSort == 'desc') {
                    legendRows = legendRow + legendRows;
                } else {
                    legendRows += legendRow;
                }
            }
        }
        legendTable += legendRows;
        legendTable += '</table>';
        $('#' + elementID + '_legend').html(legendTable);
    }
}

function buildChartV1(elementID, graphType, recordObj, hidelegend) {
    app.debug('FUNCTION: buildChart, elementID:' + elementID + ', graphType:' + graphType + ', recordObj:' + recordObj + ', hidelegend:' + hidelegend);

    var graphTitle = recordObj.title;
    var graphAmount = recordObj.amount;
    var graphAmountTot = recordObj.amounttot;
    var graphID = recordObj.graphid;
    // var graphDataJSONobj = (BRVUtil.checkValue(recordObj.graphdata)) ? JSON.parse(b64_to_str(recordObj.graphdata)) : '';
    var graphDataJSONobj = (BRVUtil.checkValue(recordObj.graphdata)) ? BRVUtil.parseJSON(b64_to_str(recordObj.graphdata)) : '';
    // var graphDataLabelsJSONobj = (BRVUtil.checkValue(recordObj.graphlabels)) ? JSON.parse(b64_to_str(recordObj.graphlabels)) : '';
    var graphDataLabelsJSONobj = (BRVUtil.checkValue(recordObj.graphlabels)) ? BRVUtil.parseJSON(b64_to_str(recordObj.graphlabels)) : '';
    var defaultColors = ['#3D6092', '#60A8CC', '#2A8C7C', '#FFA527', '#CC5CA5', '#9C63C0', '#9D9D9E', '#8DB964', '#FFC926', '#996E2C', '#C43B3B'];
    var graphColors = (BRVUtil.checkValue(recordObj.graphcolors)) ? recordObj.graphcolors : defaultColors;
    graphColors = eval(graphColors);

    // Replace vars in apptitle
    $('#apptitle').html($('#apptitle').html().replace('&lt;title&gt;', graphTitle));
    $('#apptitle').css('visibility', 'visible');

    if (graphType == 'barchart') {
        var myArray = [];
        var myArrayFields = [];
        var myArrayLabels = [];

        jQuery.each(graphDataLabelsJSONobj[0], function(key, value) {
            myArrayLabels.push(value);
            myArrayFields.push(key);
        });

        myArrayLabels.push({
            role: 'style'
        }); // Add color column

        myArray.push(myArrayLabels);

        var options = {
            hAxis: {
                logScale: false,
                textPosition: 'none'
            },
            vAxis: {
                logScale: false,
                textPosition: 'none',
                viewWindowMode: 'maximized' // this will have no effect on this chart, incidentally

            },
            legend: {
                position: "none"
            },
            title: '',
            sliceVisibilityThreshold: 0,
            backgroundColor: 'transparent',
            enableInteractivity: false,
            bar: {
                groupWidth: "95%"
            },
            chartArea: {
                width: '100%',
                height: '75%'
            },
            colors: graphColors
        };

        for (var i = 0; i < graphDataJSONobj.length; i++) {
            var myArrayValues = [];
            for (var a = 0; a < myArrayFields.length; a++) {
                var value = graphDataJSONobj[i][myArrayFields[a]];
                value = (a == 0) ? value : parseFloat(value);
                myArrayValues.push(value);
            }
            myArrayValues.push(options.colors[i]); // Add column color
            myArray.push(myArrayValues); // Add values
        }

        var data = google.visualization.arrayToDataTable(myArray);
        var chart = new google.visualization.BarChart(document.getElementById(elementID));
        //chart.draw(data, options);
        (app.isBuilder) ? setTimeout(function() { chart.draw(data, options); }, 100): chart.draw(data, options);

        if (!hidelegend) {
            var output = '';
            var titleArray = [];
            output += '<table style="width:100%">';
            for (var i = 0; i < myArray.length; i++) {
                if (i == 0) { // Header
                    output += '<tr>';
                    output += '<td>&nbsp;</td>';
                    for (var a = 0; a < myArrayLabels.length - 1; a++) {
                        output += (a == 0) ? '<td style="text-align:left;"><b>' + myArrayLabels[a] + '</b></td>' : '<td style="text-align:right;"><b>' + myArrayLabels[a] + '</b></td>';
                    }
                    output += '</tr>';
                } else { // Lines
                    output += '<tr>';
                    output += '<td style="background-color:' + options.colors[i - 1] + '">&nbsp;</td>';
                    for (var a = 0; a < myArrayFields.length; a++) {
                        var value = myArray[i][a];
                        value = (a == 0) ? value : parseFloat(value);
                        if (a > 0) { // Calculate totals
                            arrayPos = BRVUtil.findInArray(titleArray, myArrayLabels[a]);
                            if (arrayPos < 0) { // Element found in array
                                BRVUtil.addToArray(titleArray, [myArrayLabels[a], value]);
                            } else { // Add value to current element value
                                tempValue = titleArray[arrayPos][1];
                                titleArray[arrayPos][1] = tempValue + value;
                            }
                        }
                    }
                    output += '</tr>';
                }
            }
            output += '</table>';
            $('#' + elementID + '_legend').html(output);

            // Totals
            var newTitle = '<table style="width:100%;">';
            for (var i = 0; i < titleArray.length; i++) {
                newTitle += '<tr>';
                newTitle += '<td style="width:50%; text-align:left;">Totaal ' + titleArray[i][0].toLowerCase() + '</td>';
                newTitle += '<td style="width:50%; text-align:right;">' + BRVUtil.number_format(titleArray[i][1], 2, ',', '.') + '</td>';
                newTitle += '</tr>';
            }
            newTitle += '</table>';
            $('#' + elementID + '_title').html(newTitle);
        }
    }

    if (graphType == 'piechart') {
        var myArray = [];
        var myArrayFields = [];
        var myArrayLabels = [];

        jQuery.each(graphDataLabelsJSONobj[0], function(key, value) {
            myArrayLabels.push(value);
            myArrayFields.push(key);
        });

        myArrayLabels.push({
            role: 'style'
        }); // Add color column

        myArray.push(myArrayLabels);

        var options = {
            legend: {
                position: "none"
            },
            pieSliceText: 'none',
            title: '',
            pieStartAngle: 90,
            sliceVisibilityThreshold: 0,
            backgroundColor: 'transparent',
            enableInteractivity: false,
            chartArea: {
                width: '100%',
                height: '75%'
            },
            colors: graphColors
        };

        for (var i = 0; i < graphDataJSONobj.length; i++) {
            var myArrayValues = [];
            for (var a = 0; a < myArrayFields.length; a++) {
                var value = graphDataJSONobj[i][myArrayFields[a]];
                value = (a == 0) ? value : parseFloat(value);
                myArrayValues.push(value);
            }
            myArrayValues.push(options.colors[i]); // Add column color
            myArray.push(myArrayValues); // Add values
        }

        var data = google.visualization.arrayToDataTable(myArray);
        var chart = new google.visualization.PieChart(document.getElementById(elementID));
        //chart.draw(data, options);
        (app.isBuilder) ? setTimeout(function() { chart.draw(data, options); }, 100): chart.draw(data, options);

        if (!hidelegend) {
            var output = '';
            var titleArray = [];
            output += '<table style="width:100%">';
            for (var i = 0; i < myArray.length; i++) {
                if (i == 0) { // Header
                    output += '<tr>';
                    output += '<td>&nbsp;</td>';
                    for (var a = 0; a < myArrayLabels.length - 1; a++) {
                        output += (a == 0) ? '<td style="text-align:left;"><b>' + myArrayLabels[a] + '</b></td>' : '<td style="text-align:right;"><b>' + myArrayLabels[a] + '</b></td>';
                    }
                    output += '</tr>';
                } else { // Lines
                    output += '<tr>';
                    output += '<td style="background-color:' + options.colors[i - 1] + '">&nbsp;</td>';
                    for (var a = 0; a < myArrayFields.length; a++) {

                        var value = myArray[i][a];
                        value = (a == 0) ? value : parseFloat(value);

                        if (a > 0) { // Calculate totals
                            arrayPos = BRVUtil.findInArray(titleArray, myArrayLabels[a]);
                            if (arrayPos < 0) { // Element found in array
                                BRVUtil.addToArray(titleArray, [myArrayLabels[a], value]);
                            } else { // Add value to current element value
                                tempValue = titleArray[arrayPos][1];
                                titleArray[arrayPos][1] = tempValue + value;
                            }
                        }
                        output += (a == 0) ? '<td style="text-align:left;">' + value + '</td>' : '<td style="text-align:right;">' + BRVUtil.number_format(value, 2, ',', '.') + '</td>';
                    }
                    output += '</tr>';
                }
            }
            output += '</table>';
            $('#' + elementID + '_legend').html(output);

            // Totals
            var newTitle = '<table style="width:100%;">';
            for (var i = 0; i < titleArray.length; i++) {
                newTitle += '<tr>';
                newTitle += '<td style="width:50%; text-align:left;">Totaal ' + titleArray[i][0].toLowerCase() + '</td>';
                newTitle += '<td style="width:50%; text-align:right;">' + BRVUtil.number_format(titleArray[i][1], 2, ',', '.') + '</td>';
                newTitle += '</tr>';
            }
            newTitle += '</table>';
            $('#' + elementID + '_title').html(newTitle);
        }
    }

    if (graphType == 'columnchart') {
        var myArray = [];
        var myArrayFields = [];
        var myArrayLabels = [];

        jQuery.each(graphDataLabelsJSONobj[0], function(key, value) {
            myArrayLabels.push(value);
            myArrayFields.push(key);
        });

        myArrayLabels.push({
            role: 'style'
        }); // Add color column

        myArray.push(myArrayLabels);

        var options = {
            hAxis: {
                logScale: false,
                textPosition: 'none'
            },
            vAxis: {
                logScale: false,
                textPosition: 'none',
                viewWindowMode: 'maximized' // this will have no effect on this chart, incidentally
            },
            legend: {
                position: "none"
            },
            title: '',
            backgroundColor: 'transparent',
            enableInteractivity: false,
            bar: {
                groupWidth: "95%"
            },
            chartArea: {
                width: '100%',
                height: '75%'
            },
            colors: graphColors
        };

        for (var i = 0; i < graphDataJSONobj.length; i++) {
            var myArrayValues = [];
            for (var a = 0; a < myArrayFields.length; a++) {
                var value = graphDataJSONobj[i][myArrayFields[a]];
                value = (a == 0) ? value : parseFloat(value);
                myArrayValues.push(value);
            }
            myArrayValues.push(options.colors[i]); // Add column color
            myArray.push(myArrayValues); // Add values
        }

        var data = google.visualization.arrayToDataTable(myArray);
        var chart = new google.visualization.ColumnChart(document.getElementById(elementID));
        //chart.draw(data, options);
        (app.isBuilder) ? setTimeout(function() { chart.draw(data, options); }, 100): chart.draw(data, options);

        if (!hidelegend) {
            var output = '';
            var titleArray = [];
            output += '<table style="width:100%">';
            for (var i = 0; i < myArray.length; i++) {
                if (i == 0) { // Header
                    output += '<tr>';
                    output += '<td>&nbsp;</td>';
                    for (var a = 0; a < myArrayLabels.length - 1; a++) {
                        output += (a == 0) ? '<td style="text-align:left;"><b>' + myArrayLabels[a] + '</b></td>' : '<td style="text-align:right;"><b>' + myArrayLabels[a] + '</b></td>';
                    }
                    output += '</tr>';
                } else { // Lines
                    output += '<tr>';
                    output += '<td style="background-color:' + options.colors[i - 1] + '">&nbsp;</td>';
                    for (var a = 0; a < myArrayFields.length; a++) {

                        var value = myArray[i][a];
                        value = (a == 0) ? value : parseFloat(value);

                        if (a > 0) { // Calculate totals
                            arrayPos = BRVUtil.findInArray(titleArray, myArrayLabels[a]);
                            if (arrayPos < 0) { // Element found in array
                                BRVUtil.addToArray(titleArray, [myArrayLabels[a], value]);
                            } else { // Add value to current element value
                                tempValue = titleArray[arrayPos][1];
                                titleArray[arrayPos][1] = tempValue + value;
                            }
                        }
                        output += (a == 0) ? '<td style="text-align:left;">' + value + '</td>' : '<td style="text-align:right;">' + BRVUtil.number_format(value, 2, ',', '.') + '</td>';
                    }
                    output += '</tr>';
                }
            }
            output += '</table>';
            $('#' + elementID + '_legend').html(output);

            // Totals
            var newTitle = '<table style="width:100%;">';
            for (var i = 0; i < titleArray.length; i++) {
                newTitle += '<tr>';
                newTitle += '<td style="width:50%; text-align:left;">Totaal ' + titleArray[i][0].toLowerCase() + '</td>';
                newTitle += '<td style="width:50%; text-align:right;">' + BRVUtil.number_format(titleArray[i][1], 2, ',', '.') + '</td>';
                newTitle += '</tr>';
            }
            newTitle += '</table>';
            $('#' + elementID + '_title').html(newTitle);
        }
    }

    if (graphType == 'combochart') {
        var myArray = [];
        var myArrayFields = [];
        var myArrayLabels = [];
        jQuery.each(graphDataLabelsJSONobj[0], function(key, value) {
            myArrayLabels.push(value);
            myArrayFields.push(key);
        });
        myArray.push(myArrayLabels);

        for (var i = 0; i < graphDataJSONobj.length; i++) {
            var myArrayValues = [];
            for (var a = 0; a < myArrayFields.length; a++) {
                var value = graphDataJSONobj[i][myArrayFields[a]];
                value = (a == 0) ? value : parseFloat(value);
                myArrayValues.push(value);
            }
            myArray.push(myArrayValues);
        }

        var seriesNr = myArrayFields.length - 2;
        var options = {
            vAxis: {
                textPosition: 'none',
                viewWindowMode: 'maximized' // this will have no effect on this chart, incidentally
            },
            hAxis: {
                textPosition: (hidelegend) ? 'none' : 'bottom'
            },
            seriesType: "bars",
            // series: {2: {type: "line"} },
            series: "",
            legend: {
                position: "none"
            },
            bar: {
                groupWidth: "95%"
            },
            chartArea: {
                width: '100%',
                height: '75%'
            },
            backgroundColor: 'transparent',
            enableInteractivity: false,
            colors: graphColors
        };

        // Set results line
        myObj = new Object();
        myObj[seriesNr] = {
            type: "line"
        };
        options.series = myObj;

        var data = google.visualization.arrayToDataTable(myArray);
        var chart = new google.visualization.ComboChart(document.getElementById(elementID));
        //chart.draw(data, options);
        (app.isBuilder) ? setTimeout(function() { chart.draw(data, options); }, 100): chart.draw(data, options);

        if (!hidelegend) {
            var output = '';
            var output1 = '';
            var outputRow = '';
            var doAddRow = false;
            var titleArray = [];
            output += '<table style="width:100%">';
            for (var i = 0; i < myArray.length; i++) {
                doAddRow = false;
                if (i == 0) { // Header
                    output += '<tr>';
                    for (var a = 0; a < myArrayLabels.length; a++) {
                        output += (a == 0) ? '<td style="text-align:left;"><b>' + myArrayLabels[a] + '</b></td>' : '<td style="text-align:right;"><b>' + myArrayLabels[a] + '</b></td>';
                    }
                    output += '</tr>';
                } else { // Lines
                    outputRow = '<tr>';
                    for (var a = 0; a < myArrayFields.length; a++) {

                        var value = myArray[i][a];
                        value = (a == 0) ? value : parseFloat(value);

                        if (a > 0) { // Calculate totals
                            arrayPos = BRVUtil.findInArray(titleArray, myArrayLabels[a]);
                            if (arrayPos < 0) { // Element found in array
                                BRVUtil.addToArray(titleArray, [myArrayLabels[a], value]);
                            } else { // Add value to current element value
                                tempValue = titleArray[arrayPos][1];
                                titleArray[arrayPos][1] = tempValue + value;
                            }
                        }

                        outputRow += (a == 0) ? '<td style="text-align:left;">' + value + '</td>' : '<td style="text-align:right;">' + BRVUtil.number_format(value, 2, ',', '.') + '</td>';

                        (a > 0 && value != 0) ? doAddRow = true: '';
                    }
                    outputRow += '</tr>';
                    (doAddRow) ? output1 = outputRow + output1: '';
                }
            }
            output += output1;
            output += '</table>';
            $('#' + elementID + '_legend').html(output);

            // Totals
            var newTitle = '<table style="width:100%;">';
            for (var i = 0; i < titleArray.length; i++) {
                newTitle += '<tr>';
                newTitle += '<td style="background-color:' + options.colors[i] + '">&nbsp;</td>';
                newTitle += '<td style="width:50%; text-align:left;">Totaal ' + titleArray[i][0].toLowerCase() + '</td>';
                newTitle += '<td style="width:50%; text-align:right;">' + BRVUtil.number_format(titleArray[i][1], 2, ',', '.') + '</td>';
                newTitle += '</tr>';
            }
            newTitle += '</table>';
            $('#' + elementID + '_title').html(newTitle);
        }
    }
}

function replaceVarsInDivWithDataFromStorage(divID) {
    //Replace all #vars# in div element with data from storage
    var curDiv = $('#' + divID);
    var replaced = false;
    if (curDiv.length) {
        var curHTML = curDiv.html();
        var tagArray = curHTML.match(/#(.+)\#/ig);
        if (tagArray) {
            for (var a = 0; a < tagArray.length; a++) {
                var newValue = '';
                var curTag = tagArray[a];
                curTag = BRVUtil.replaceAll(curTag, '#', '');

                // Find tag in phone storage
                newValue = app.GetFromPhoneStorage(curTag);
                if (newValue) {
                    curHTML = curHTML.replace('#' + curTag + '#', newValue);
                    replaced = true;
                }
            }
        }
        if (replaced) {
            curDiv.html(curHTML);
        }
    }
}

function replaceVarInDiv(divID, varName, newValue) {
    // Find 'varName' in 'divID' and replace with 'newValue'
    var curDiv = $('#' + divID);
    if (curDiv.length) {
        var foundVar = curDiv.html().match(varName);
        if (foundVar) {
            // curDiv.html( curDiv.html().replace(varName, newValue) );
            curDiv.html(BRVUtil.replaceAll(curDiv.html(), varName, newValue));
        }
    }
}


function replaceVarsInText(inputText) {
    app.debug('FUNCTION: replaceVarsInText');

    // Check for App vars
    inputText = inputText.replace(/<app_nameApp>/ig, app.nameApp);
    inputText = inputText.replace(/<app_versionApp>/ig, app.versionBuild);
    inputText = inputText.replace(/<app_versionJSON>/ig, app.versionJSON);
    inputText = inputText.replace(/<app_versionJSONStatus>/ig, app.versionJSONStatus);
    inputText = inputText.replace(/<app_avserial>/ig, app.avserial);
    inputText = inputText.replace(/<app_deviceid>/ig, app.deviceid);
    inputText = inputText.replace(/<app_devicename>/ig, app.devicename);
    inputText = inputText.replace(/<app_adm_code>/ig, app.adm_code);
    inputText = inputText.replace(/<app_demo>/ig, app.isdemo);

    // Check for old App vars
    inputText = inputText.replace(/<nameApp>/ig, app.nameApp);
    inputText = inputText.replace(/<versionApp>/ig, app.versionBuild);
    inputText = inputText.replace(/<versionJSON>/ig, app.versionJSON);
    inputText = inputText.replace(/<versionJSONStatus>/ig, app.versionJSONStatus);
    inputText = inputText.replace(/<avserial>/ig, app.avserial);
    inputText = inputText.replace(/<deviceid>/ig, app.deviceid);
    inputText = inputText.replace(/<devicename>/ig, app.devicename);
    inputText = inputText.replace(/<adm_code>/ig, app.adm_code);

    // Get some data from localstorage
    inputText = inputText.replace(/<app_emp_nr>/ig, app.GetFromPhoneStorage('emp_nr'));
    inputText = inputText.replace(/<app_emp_name>/ig, app.GetFromPhoneStorage('emp_name'));
    inputText = inputText.replace(/<app_contact_name>/ig, app.GetFromPhoneStorage('contact_acct_name'));
    inputText = inputText.replace(/<app_people_name>/ig, app.GetFromPhoneStorage('people_ad_name'));

    // inputText = inputText.replace(/<app_last_adm_code>/ig, app.GetFromPhoneStorage('lstadmcode'));
    inputText = inputText.replace(/<app_last_adm_code>/ig, getUserData(app.activeusername, 'lstadmcode'));

    inputText = inputText.replace(/<app_subscription>/ig, app.GetFromPhoneStorage('subscription'));
    inputText = inputText.replace(/<app_yobsubscription>/ig, app.GetFromPhoneStorage('YOBsubscription'));
    inputText = inputText.replace(/<app_adm_desc>/ig, app.GetFromPhoneStorage('adm_desc'));
    // Check for old vars
    inputText = inputText.replace(/<emp_nr>/ig, app.GetFromPhoneStorage('emp_nr'));
    inputText = inputText.replace(/<emp_name>/ig, app.GetFromPhoneStorage('emp_name'));
    // inputText = inputText.replace(/<last_adm_code>/ig, app.GetFromPhoneStorage('lstadmcode'));
    inputText = inputText.replace(/<last_adm_code>/ig, getUserData(app.activeusername, 'lstadmcode'));

    inputText = inputText.replace(/<subscription>/ig, app.GetFromPhoneStorage('subscription'));
    inputText = inputText.replace(/<YOBsubscription>/ig, app.GetFromPhoneStorage('YOBsubscription'));
    inputText = inputText.replace(/<adm_desc>/ig, app.GetFromPhoneStorage('adm_desc'));

    // Client/User info from OAS
    inputText = inputText.replace(/<username>/ig, app.GetFromPhoneStorage('username'));
    inputText = inputText.replace(/<useremail>/ig, app.GetFromPhoneStorage('useremail'));
    inputText = inputText.replace(/<userfirstname>/ig, app.GetFromPhoneStorage('userfirstname'));
    inputText = inputText.replace(/<clientname>/ig, app.GetFromPhoneStorage('clientname'));
    inputText = inputText.replace(/<clientcity>/ig, app.GetFromPhoneStorage('clientcity'));
    inputText = inputText.replace(/<clientemail>/ig, app.GetFromPhoneStorage('clientemail'));

    inputText = inputText.replace(/<activeusername>/ig, app.activeusername);

    inputText = inputText.replace(/<maintenancemessage>/ig, app.appBlockedMsg);
    inputText = inputText.replace(/<appblockedmsg>/ig, app.appBlockedMsg);

    // Some custom text which can be uses by custom app's
    inputText = inputText.replace(/<cust_text1>/ig, app.GetFromPhoneStorage('cust_text1'));
    inputText = inputText.replace(/<cust_text2>/ig, app.GetFromPhoneStorage('cust_text2'));
    inputText = inputText.replace(/<cust_text3>/ig, app.GetFromPhoneStorage('cust_text3'));
    inputText = inputText.replace(/<cust_text4>/ig, app.GetFromPhoneStorage('cust_text4'));
    inputText = inputText.replace(/<cust_text5>/ig, app.GetFromPhoneStorage('cust_text5'));
    inputText = inputText.replace(/<cust_text6>/ig, app.GetFromPhoneStorage('cust_text6'));
    inputText = inputText.replace(/<cust_text7>/ig, app.GetFromPhoneStorage('cust_text7'));
    inputText = inputText.replace(/<cust_text8>/ig, app.GetFromPhoneStorage('cust_text8'));
    inputText = inputText.replace(/<cust_text9>/ig, app.GetFromPhoneStorage('cust_text9'));
    inputText = inputText.replace(/<cust_text10>/ig, app.GetFromPhoneStorage('cust_text10'));
    return inputText;
}

function replaceAllVarsInText(inputText) {
    app.debug('FUNCTION: replaceAllVarsInText');
    if (inputText.indexOf('<') >= 0 && inputText.indexOf('>') >= 0) {
        // Find all vars between < and >
        var varsArray = inputText.match(/[<](.*?)[>]/g);
        for (var i = 0; i < varsArray.length; i++) {
            var curVar = varsArray[i];
            var curVarTmp = curVar;
            var curVarValTmp = '';
            if (curVarTmp.substr(0, 1) == '*' || curVarTmp.substr(1, 1) == '*') {
                curVarTmp = curVarTmp.replace('<', '');
                curVarTmp = curVarTmp.replace('>', '');
                curVarTmp = curVarTmp.replace('*', '');
                curVarValTmp = app.GetFromPhoneStorage(curVarTmp);
                if (BRVUtil.checkValue(curVarValTmp)) {
                    //Replace var in inputText with value from storage
                    inputText = inputText.replace(curVar, curVarValTmp);
                }
            }
        }

        // If there are some vars left try to replace with vars defined in app
        inputText = replaceVarsInText(inputText);

        //ToDo: If there are still <vars> in title then try to find data from form fields.
        //....
    }
    return inputText;
}




//------------------------------------
function GetBarcode(formFieldID) {
    app.BarcodeTargetFieldID = formFieldID;
    BRVUtil.cameraGetBarcode(CatchBarcode);
}

function CatchBarcode() {
    // alert("We got a barcode\n" +
    // "Result: " + app.BarcodeData.text + "\n" +
    // "Format: " + app.BarcodeData.format + "\n" +
    // "Cancelled: " + app.BarcodeData.cancelled);

    if (BRVUtil.checkValue($('#' + app.BarcodeTargetFieldID).attr('objectKey'))) {
        // $('#'+app.BarcodeTargetFieldID).val(app.BarcodeData.text).keyup();
        $('#' + app.BarcodeTargetFieldID).val(app.BarcodeData.text);

        // Trigger enter on input field.
        var e = $.Event("keyup", { keyCode: 13 });
        $('#' + app.BarcodeTargetFieldID).trigger(e);

    } else {
        $('#' + app.BarcodeTargetFieldID).val(app.BarcodeData.text).change();
    }

    app.BarcodeTargetFieldID = null;
}
//------------------------------------

//------------------------------------
function scanBRVQRCode() {
    // Scan QR-code for activating functions on device.
    BRVUtil.cameraGetBarcode(CatchBRVQRCode);
}

function CatchBRVQRCode() {
    var doContinue = true;

    // *****************
    // Example:
    // *****************
    // QR Code Type		: Plain Text
    // Text				: cW/iMUa1sufJ+a3kt2nLAJcQ/rG1Qf7SlGx5ZetnKYY0L7cj5+WulF/DOe7MphBgjnTQcUzCuKSxi6weIaU/+IcTbZtNg9sVr2spkPoqTQ==
    // Error Correction	: High (30%)
    //
    // Key: 121097112100119070073082071085077106099054117089115102072105047110103043052049107090068075056055109122076084053083118101048078088066057086116074065111120113087098051069067104080050081079114108
    //
    // *****************
    // Decoded JSON:
    // {
    // 	"activationuser": "tijssena@gmail.com", 
    // 	"activationcode": "ST20jdr312mp1i" 
    // }
    //
    // *****************
    // Encoded JSON: 
    // cW/iMUa1sufJ+a3kt2nLAJcQ/rG1Qf7SlGx5ZetnKYY0L7cj5+WulF/DOe7MphBgjnTQcUzCuKSxi6weIaU/+IcTbZtNg9sVr2spkPoqTQ==

    // Use with encoding!
    // Create new BWV_Cryptor
    // var newEnc = $.extend( {}, BVW_Cryptor );
    // newEnc.setKey('121097112100119070073082071085077106099054117089115102072105047110103043052049107090068075056055109122076084053083118101048078088066057086116074065111120113087098051069067104080050081079114108');

    // var encodedQRText	= app.BarcodeData.text;
    // if ( doContinue ) { 
    // 	if ( !BRVUtil.checkValue( encodedQRText ) ) { 
    // 		doContinue = false;
    // 	}
    // }

    // if ( doContinue ) { 
    // 	try {
    // 		var decodedQRText	= newEnc.DecryptString( encodedQRText );
    // 	} catch(e) {}

    // 	if ( !BRVUtil.checkValue( decodedQRText ) ) { 
    // 		doContinue = false;
    // 	}
    // }
    //

    // Use without encoding!
    decodedQRText = app.BarcodeData.text;
    if (doContinue) {
        if (!BRVUtil.checkValue(decodedQRText)) {
            doContinue = false;
        }
    }
    //

    if (doContinue) {
        try {
            // var JSONQRText		= JSON.parse( decodedQRText );
            var JSONQRText = BRVUtil.parseJSON(decodedQRText);
        } catch (e) {}

        if (!BRVUtil.checkValue(JSONQRText.activationuser) || !BRVUtil.checkValue(JSONQRText.activationcode)) {
            doContinue = false;
        }
    }

    if (doContinue) {
        $('#activationuser').val(JSONQRText.activationuser);
        $('#activationcode').val(JSONQRText.activationcode);
        ActivateDevice();
    } else {
        app.showMessage('INVALID_QR_ACTIVATION', null, false);
    }

}
//------------------------------------


//------------------------------------
function AddFile(formFieldID, buttonID, param) {
    var BtnId = BRVUtil.checkValue(formFieldID) ? formFieldID : buttonID;

    if (!checkButtonEmptyMandatoryFields(BtnId)) {
        app.SavePictureButtonId = buttonID;
        app.SavePictureFieldId = formFieldID;
        if (BRVUtil.Left(param, 4) == 'b64|') { // If encoded params, then decode params.
            param = param.replace('b64|', '');
            param = b64_to_str(param);
        }
        app.SavePictureParam = param;

        //BRVUtil.getDesktopFile(BRVUtil.desktopGetFileSuccess);

        BRVUtil.GetFile(CatchPicture);

    } else {
        // Do nothing!!
    }
}
//------------------------------------



//------------------------------------
// For multipage scanning!!
//------------------------------------
// 'imagebuffer' is not ready yet!
function AddPhoto(imageBufferID) {
    app.imageBufferID = imageBufferID;
    BRVUtil.cameraGetPicture(CatchPhoto);
}

function CatchPhoto() {
    if (BRVUtil.checkValue(app.cameraImageData)) {
        console.log('catch photo', app.cameraImageData)
        var fileName = '';
        var ContentFileExtension = BRVUtil.strExtract(app.cameraImageData, 'data:image/', ';base64,');

        if (BRVUtil.checkValue(ContentFileExtension)) {
            fileName = BRVUtil.strTimeStamp() + '.' + ContentFileExtension;
            app.cameraImageData = app.cameraImageData.replace('data:image/' + ContentFileExtension + ';base64,', ''); // Remove metadata
        } else {
            fileName = BRVUtil.strTimeStamp() + '.jpg';
        }

        if (BRVUtil.checkValue(app.SavePictureFileName)) {
            fileName = app.SavePictureFileName;
            app.SavePictureFileName = '';
        }
    }

    if (typeof app.DeskTopFile == 'object' && app.DeskTopFile != null) {
        // {
        // 	"content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABA.....",
        // 	"filename": "icon.png",
        // 	"filesize": 151804,
        // 	"filetype": "image/png"
        // }		

        var fileName = app.DeskTopFile.filename;
        // var ContentFileExtension = BRVUtil.strExtract(app.DeskTopFile.filetype, '/', '');
        var ContentFileExtension = BRVUtil.file_get_ext(fileName);
        var fileContent = app.DeskTopFile.content.replace('data:' + app.DeskTopFile.filetype + ';base64,', ''); // Remove metadata

        app.cameraImageData = fileContent; // Remove metadata

        if (BRVUtil.checkValue(app.SavePictureFileName)) {
            fileName = app.SavePictureFileName;
            app.SavePictureFileName = '';
        }
    }

    if (BRVUtil.checkValue(fileName) && BRVUtil.checkValue(app.cameraImageData)) {
        // Add to photobuffer ?!?
        //console.log('fileName: ', fileName);
        //console.log('data: ', app.cameraImageData);
        updateImageBuffer(app.imageBufferID, fileName, app.cameraImageData, ContentFileExtension, false);
        app.SavePictureButtonId = null;
        app.SavePictureFieldId = null;
        app.SavePictureParam = null;
        app.SavePictureFileName = null;
    }
}


function getImageBuffer(fldID) {
    var bufferID = 'buff_' + fldID;
    var curBuffer = app.GetFromPhoneStorage(bufferID);
    var curCount = 0;
    var curBufferObj = null;
    var output = '';

    if (BRVUtil.checkValue(curBuffer)) {
        curBufferObj = BRVUtil.parseJSON(curBuffer);
        curCount = curBufferObj.length;

        //Fill listview with buffer records
        for (var i = 0; i < curBufferObj.length; i++) {
            output += '<li>';
            output += '<a href="javascript:void(0)" onclick="previewImageBuffer(\'' + fldID + '\', \'' + curBufferObj[i] + '\')"><p>' + curBufferObj[i] + '</p></a>';
            output += '<a href="javascript:void(0)" onclick="removeFromImageBuffer(\'' + fldID + '\', \'' + curBufferObj[i] + '\', this)" data-rel="dialog" data-transition="slideup">delete</a>';
            output += '</li>';
        }
        $('#' + fldID + "_list").append(output);
        $('#' + fldID + "_list").listview().listview('refresh');
    }

    $('#' + fldID + "_counter").val(curCount);
    $('#' + fldID).val(curBuffer);
    return curBuffer;
}

function previewImageBuffer(fldID, value) {
    // Get preview from online service!
    console.log('fldID: ', fldID);
    console.log('value: ', value);
}

function removeImageBuffer(fldID) {
    var bufferID = 'buff_' + fldID;
    app.RemoveFromPhoneStorage(bufferID);
    $('#' + fldID + "_counter").val(0);

    //ToDo: Remove cache from online service!

}

function removeFromImageBuffer(fldID, value, elem) {
    var message = app.translateMessage('REMOVE_RECORD');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                removeFromImageBuffer_step2(fldID, value, elem);
            },
            nee: function() {}
        }
    });
}

function removeFromImageBuffer_step2(fldID, value, elem) {
    var bufferID = 'buff_' + fldID;
    var curBuffer = app.GetFromPhoneStorage(bufferID);
    var curBufferObj = BRVUtil.parseJSON(curBuffer);
    var listitem = $(elem).parent("li");
    var saveCurBuffer = false;

    for (var i = 0; i < curBufferObj.length; i++) {
        if (curBufferObj[i] == value) {
            curBufferObj.splice(i, 1); // Remove current record.

            listitem.remove();
            $('#' + fldID + "_list").listview().listview('refresh');

            saveCurBuffer = true;
            break;
        }
    }

    if (saveCurBuffer) {
        curBuffer = JSON.stringify(curBufferObj);
        app.AddToPhoneStorage(bufferID, curBuffer);

        $('#' + fldID + "_counter").val(curBufferObj.length);
        $('#' + fldID).val(curBuffer);


        //ToDo: Remove image from online service!

    }
}

function updateImageBuffer(tgtFldID, filename, filecontentsB64, fileExtension, deleteValue) {
    // console.log('filename: ', filename);
    // console.log('fileExtension: ', fileExtension);
    // console.log('filecontentsB64: ', filecontentsB64);

    var newValue = filename;
    var addValue = true;
    var saveCurBuffer = true;
    var bufferID = 'buff_' + tgtFldID;
    var curBuffer = app.GetFromPhoneStorage(bufferID);
    var curBufferObj = [];

    // Check if there's a curBuffer and then parse it to curBufferObj
    if (BRVUtil.checkValue(curBuffer)) {
        curBufferObj = BRVUtil.parseJSON(curBuffer);
    }

    if (BRVUtil.checkValue(newValue)) {
        // Check if newValue already exists in curBufferObj
        if (curBufferObj.length > 0) {
            for (var i = 0; i < curBufferObj.length; i++) {
                if (curBufferObj[i] == newValue) {
                    addValue = false;
                    saveCurBuffer = false;

                    // Checkif we need to delete this value!
                    if (deleteValue) {
                        curBufferObj.splice(i, 1); // Remove current record.
                        saveCurBuffer = true;
                    }
                }
            }
        }

        // Check if we need to add newValue to curBufferObj
        if (addValue) {
            curBufferObj.push(newValue);
        }

        //Set counterfield
        $('#' + tgtFldID + "_counter").val(curBufferObj.length);

        // Save new curBufferObj to storage
        if (saveCurBuffer) {
            app.AddToPhoneStorage(bufferID, JSON.stringify(curBufferObj));

            var output = '';
            output += '<li>';
            output += '<a href="javascript:void(0)"><p>' + newValue + '</p></a>';
            output += '<a href="javascript:void(0)" onclick="removeFromImageBuffer(\'' + tgtFldID + '\', \'' + newValue + '\', this)" data-rel="dialog" data-transition="slideup">delete</a>';
            output += '</li>';

            // $('#' + tgtFldID + "_list").prepend(output);
            $('#' + tgtFldID + "_list").append(output);
            $('#' + tgtFldID + "_list").listview().listview('refresh');

            ($('#fileselect_popup').length > 0) ? $('#fileselect_popup').remove(): ''; // Remove popup screen
            ($('#SignatureScreen').length > 0) ? $('#SignatureScreen').remove(): ''; // Remove popup screen


            //ToDo: Send image to online service!

        } else {
            // Todo: Show error ?!?
        }
    }
    return JSON.stringify(curBufferObj);
}
//------------------------------------



//------------------------------------
function AddPicture(formFieldID, buttonID, param) {
    var BtnId = BRVUtil.checkValue(formFieldID) ? formFieldID : buttonID;

    if (!checkButtonEmptyMandatoryFields(BtnId)) {
        app.SavePictureButtonId = buttonID;
        app.SavePictureFieldId = formFieldID;
        if (BRVUtil.Left(param, 4) == 'b64|') { // If encoded params, then decode params.
            param = param.replace('b64|', '');
            param = b64_to_str(param);
        }
        app.SavePictureParam = param;
        // BRVUtil.cameraGetPicture( CatchPicture );

        BRVUtil.cameraGetPicture(CatchPicture);
    } else {
        // Do nothing!!
    }
}

function CatchPicture() {
    if (BRVUtil.checkValue(app.cameraImageData)) {
        var fileName = '';
        var ContentFileExtension = BRVUtil.strExtract(app.cameraImageData, 'data:image/', ';base64,');

        if (BRVUtil.checkValue(ContentFileExtension)) {
            fileName = BRVUtil.strTimeStamp() + '.' + ContentFileExtension;
            app.cameraImageData = app.cameraImageData.replace('data:image/' + ContentFileExtension + ';base64,', ''); // Remove metadata
        } else {
            fileName = BRVUtil.strTimeStamp() + '.jpg';
        }

        if (BRVUtil.checkValue(app.SavePictureFileName)) {
            fileName = app.SavePictureFileName;
            app.SavePictureFileName = '';
        }
    }

    if (typeof app.DeskTopFile == 'object' && app.DeskTopFile != null) {
        // {
        // 	"content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABA.....",
        // 	"filename": "icon.png",
        // 	"filesize": 151804,
        // 	"filetype": "image/png"
        // }		

        var fileName = app.DeskTopFile.filename;
        // var ContentFileExtension = BRVUtil.strExtract(app.DeskTopFile.filetype, '/', '');
        var ContentFileExtension = BRVUtil.file_get_ext(fileName);
        var fileContent = app.DeskTopFile.content.replace('data:' + app.DeskTopFile.filetype + ';base64,', ''); // Remove metadata

        app.cameraImageData = fileContent; // Remove metadata

        if (BRVUtil.checkValue(app.SavePictureFileName)) {
            fileName = app.SavePictureFileName;
            app.SavePictureFileName = '';
        }
    }

    if (BRVUtil.checkValue(fileName) && BRVUtil.checkValue(app.cameraImageData)) {
        SavePicture(app.SavePictureFieldId, app.SavePictureButtonId, app.SavePictureParam, fileName, app.cameraImageData, ContentFileExtension);
        app.SavePictureButtonId = null;
        app.SavePictureFieldId = null;
        app.SavePictureParam = null;
        app.SavePictureFileName = null;
    }
}

function SavePicture(formFieldID, buttonID, param, filename, filecontentsB64, fileExtension) {
    app.debug('FUNCTION: AddPicture, buttonID:' + buttonID + ', param:' + param);
    app.loadMessage = 'SAVE_PICTURE_DATA';

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['screen'];
    var objID = JSONObject.id;

    var objAppID = '';
    var objWepID = '';
    // var objUseSelect = ""; 
    var objQuery = '';
    var objQueryFields = '';
    var objQueryWhere = '';
    // var objQuestion = '';
    var FldBtnId = '';

    if (BRVUtil.checkValue(formFieldID)) {
        var jsonOBJ = JSONObject.content.fields;
        FldBtnId = formFieldID;
    }
    if (BRVUtil.checkValue(buttonID)) {
        var jsonOBJ = JSONObject.content.buttons;
        FldBtnId = buttonID;
    }

    if (typeof jsonOBJ != 'undefined') {
        for (var btni = 0; btni < jsonOBJ.length; btni++) {
            if (FldBtnId == jsonOBJ[btni].id) {
                objName = jsonOBJ[btni].name;
                objAppID = jsonOBJ[btni].onclick.appid;
                objWepID = jsonOBJ[btni].onclick.wepid;
                // objUseSelect = jsonOBJ[btni].onclick.useselect;
                // objQuestion = jsonOBJ[btni].onclick.question;
                objQuery = (BRVUtil.checkValue(jsonOBJ[btni].onclick.query)) ? b64_to_str(jsonOBJ[btni].onclick.query) : '';
                objQueryFields = jsonOBJ[btni].onclick.queryfields;
                objQueryWhere = (BRVUtil.checkValue(jsonOBJ[btni].onclick.querywhere)) ? b64_to_str(jsonOBJ[btni].onclick.querywhere) : '';
                app.screenSaveSuccess[objID] = (BRVUtil.checkValue(jsonOBJ[btni].onclick.savesuccess)) ? jsonOBJ[btni].onclick.savesuccess : '';
                break;
            }
        }
    }

    // Get data from params
    if (app.paramObject) {
        if (BRVUtil.checkValue(objQueryFields)) {
            var tmpQueryFields = objQueryFields.split('|');
            for (var a = 0; a < tmpQueryFields.length; a++) {
                if (BRVUtil.checkValue(tmpQueryFields[a])) {
                    var tmpQueryField = tmpQueryFields[a].split('=');
                    var searchFld = tmpQueryField[0];
                    var value = app.paramObject[searchFld];
                    value = BRVUtil.checkUnicode(value);
                    value = BRVUtil.escapeQuotes(value);
                    objQueryWhere = BRVUtil.replaceAll(objQueryWhere, '<' + searchFld + '>', value);
                    objQuery = BRVUtil.replaceAll(objQuery, '<' + searchFld + '>', value);
                }
            }
        }
    }

    // Get data from Form fields
    if (BRVUtil.checkValue(JSONObject.content.fields)) {
        var fields = JSONObject.content.fields;
        var nfields = fields.length;
        for (var fldi = 0; fldi < nfields; fldi++) {
            var fldID = fields[fldi].id;
            // var fldName = fields[fldi].name;
            // var fldType = fields[fldi].type;
            // var fldLength = fields[fldi].length;

            // Check if it's <p> then get text, else get val
            // if ( $('#' + fldID).is("p") ) {
            // 	fldValue = $('#' + fldID).text();
            // } else {
            // 	fldValue = $('#' + fldID).val();
            // }

            if ($('#' + fldID).is("p")) {
                fldValue = $('#' + fldID).text();
            } else if ($('#' + fldID).is(':checkbox')) {
                fldValue = $('#' + fldID).prop('checked') ? 'on' : 'off';
            } else {
                fldValue = $('#' + fldID).val();
            }

            // ToDo: Do something with fldType??
            //
            // switch (fldType) {
            // 	case "textarea":
            // 		break;
            // 	default:
            // }

            fldValue = BRVUtil.checkUnicode(fldValue);

            //Escape quotes
            fldValue = BRVUtil.escapeQuotes(fldValue);

            //Trim spaces
            fldValue = BRVUtil.alltrim(fldValue);

            objQuery = BRVUtil.replaceAll(objQuery, '<' + fldID + '>', fldValue);
            objQueryWhere = BRVUtil.replaceAll(objQueryWhere, '<' + fldID + '>', fldValue);
        }
    }

    // Create query
    if (app.paramObject) {
        if (BRVUtil.checkValue(objQueryFields)) {
            var tmpQueryFields = objQueryFields.split('|');
            for (a = 0; a < tmpQueryFields.length; a++) {
                if (BRVUtil.checkValue(tmpQueryFields[a])) {
                    var tmpQueryField = tmpQueryFields[a].split('=');
                    var searchFld = tmpQueryField[0];
                    objQueryWhere = BRVUtil.replaceAll(objQueryWhere, '<' + searchFld + '>', app.paramObject[searchFld]);
                    objQuery = BRVUtil.replaceAll(objQuery, '<' + searchFld + '>', app.paramObject[searchFld]);
                }
            }
        }
    }

    query = objQuery.replace('<where>', objQueryWhere);
    query = query.replace('<filename>', filename);
    query = query.replace('<fileextension>', fileExtension);
    query = query.replace('#fileextension#', fileExtension);
    query = query.replace('<timestamp>', BRVUtil.strTimeStamp());
    query = query.replace('#timestamp#', BRVUtil.strTimeStamp());
    query = query.replace('<filecontents>', filecontentsB64);

    // Escape CR/LF
    query = BRVUtil.escapeCRLF(query);

    if (BRVUtil.checkValue(objAppID) && BRVUtil.checkValue(objWepID) && BRVUtil.checkValue(query)) {
        app.wsErrorCode = 'A005';
        app.doRequestGWRWAW(query, objAppID, objWepID, showSavePictureResponse, showWSError);
    }
}

function showSavePictureResponse(data, status, req) {
    // app.debug('FUNCTION: showSavePictureResponse, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showSavePictureResponse, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {

        // Get app JSON from app vars
        var objID = app.JSONObject['screen'].id;
        // var JSONObject = app.JSONObject['screen'];

        // var jsonData = returnjsonData(req);
        // var jsonRecords = jsonData.response.responsedata;
        // var message = jsonRecords.message;

        var jsonData = returnjsonData(req);
        var jsonResponse = jsonData.response;
        var message = jsonResponse.responsedata.message;

        // Check if signature screen is visible, close it!
        if (BRVUtil.isBrowser()) {
            ($('#SignatureScreen').length > 0) ? $('#SignatureScreen').remove(): ''; // Remove popup screen
        } else {
            ($('#SignatureScreen').length > 0) ? jQuery.mobile.back(): ''; // Go back one page
        }

        // ($('#SelectDesktopFile').length > 0) ? jQuery.mobile.back() : '';		// Go back one page
        ($('#fileselect_popup').length > 0) ? $('#fileselect_popup').remove(): ''; // Remove popup screen

        if (BRVUtil.checkValue(message)) {
            app.showMessage(message, null, false);
        }

        // Check for Sucess action
        var onSaveSuccess = '';
        var onSaveSuccessAction = '';
        var onSaveSuccessScreen = '';
        var onSaveSuccessScreenMode = '';
        var onSaveSuccessScreenParams = '';
        if (typeof app.screenSaveSuccess[objID] == 'object') {
            onSaveSuccess = app.screenSaveSuccess[objID];
            if (BRVUtil.checkValue(onSaveSuccess)) {
                onSaveSuccessAction = BRVUtil.checkValue(onSaveSuccess.action) ? onSaveSuccess.action : '';
                onSaveSuccessScreen = BRVUtil.checkValue(onSaveSuccess.screen) ? onSaveSuccess.screen : '';
                onSaveSuccessScreenMode = BRVUtil.checkValue(onSaveSuccess.screenmode) ? onSaveSuccess.screenmode : '';
                onSaveSuccessScreenParams = BRVUtil.checkValue(onSaveSuccess.screenparam) ? onSaveSuccess.screenparam : '';
            }
        }

        if (onSaveSuccessAction == 'GotoScreen' && onSaveSuccessScreen != '') {

            app.removeLastPageRoute(objID); // Remove current screen first.

            // Replace parameters with response values
            for (var fld in jsonResponse.responsedata) {
                var fldID = fld;
                var fldValue = jsonResponse.responsedata[fld];
                onSaveSuccessScreenParams = onSaveSuccessScreenParams.replace('<' + fldID + '>', fldValue);
            }

            // Replace some vars in onSaveSuccessScreenParams with values from app.paramObject
            if (app.paramObject) {
                if (BRVUtil.checkValue(onSaveSuccessScreenParams)) {
                    var tmpParamFields = onSaveSuccessScreenParams.split('|');
                    for (a = 0; a < tmpParamFields.length; a++) {
                        if (BRVUtil.checkValue(tmpParamFields[a])) {
                            var tmpParamField = tmpParamFields[a].split('=');
                            var searchFld = tmpParamField[0];
                            onSaveSuccessScreenParams = BRVUtil.replaceAll(onSaveSuccessScreenParams, '<' + searchFld + '>', app.paramObject[searchFld]);
                        }
                    }
                }
            }

            var param = (onSaveSuccessScreenParams != '') ? 'b64|' + str_to_b64(onSaveSuccessScreenParams) : '';
            getScreenFromJSON(onSaveSuccessScreen, param, '' + onSaveSuccessScreenMode + '');
        } else {
            // It was success and we don't need to go to other screen.
            // Check if we need to set focus to a field in this form!
            ResetFieldFocus();
        }

    }
}
//------------------------------------

function CallWebservice(buttonID, param, useFormFieldButtons) {
    app.debug('FUNCTION: CallWebservice, buttonID:' + buttonID + ', param:' + param);

    if (!checkButtonEmptyMandatoryFields(buttonID)) {

        // Get app JSON from app vars
        var objID = app.JSONObject['screen'].id;
        var JSONObject = app.JSONObject['screen'];

        var buttonAppID = '';
        var buttonWepID = '';
        var buttonUseSelect = "";
        var buttonQuery = '';
        var buttonQueryFields = '';
        var buttonQueryWhere = '';
        var buttonQueryHaving = '';
        var buttonQuestion = '';
        var buttonCancelMsg = '';
        var buttonMaxSelectItems = '';
        var buttonMaxSelectItemsMsg = '';
        var selectedItemsLimit = false;

        var buttonOBJ = (useFormFieldButtons) ? JSONObject.content.fields : JSONObject.content.buttons;
        var buttonQueryObj = null;
        if (typeof buttonOBJ != 'undefined') {
            for (var btni = 0; btni < buttonOBJ.length; btni++) {
                if (buttonID == buttonOBJ[btni].id) {
                    buttonName = buttonOBJ[btni].name;
                    buttonAppID = buttonOBJ[btni].onclick.appid;
                    buttonWepID = buttonOBJ[btni].onclick.wepid;
                    buttonUseSelect = buttonOBJ[btni].onclick.useselect;
                    buttonQuestion = buttonOBJ[btni].onclick.question;
                    buttonCancelMsg = buttonOBJ[btni].onclick.cancelmsg;
                    buttonMaxSelectItems = buttonOBJ[btni].onclick.maxselectitems;
                    buttonMaxSelectItemsMsg = buttonOBJ[btni].onclick.maxselectitemsmsg;

                    buttonQuery = (BRVUtil.checkValue(buttonOBJ[btni].onclick.query)) ? b64_to_str(buttonOBJ[btni].onclick.query) : '';
                    buttonQueryFields = buttonOBJ[btni].onclick.queryfields;
                    buttonQueryWhere = (BRVUtil.checkValue(buttonOBJ[btni].onclick.querywhere)) ? b64_to_str(buttonOBJ[btni].onclick.querywhere) : '';
                    buttonQueryHaving = (BRVUtil.checkValue(buttonOBJ[btni].onclick.queryhaving)) ? b64_to_str(buttonOBJ[btni].onclick.queryhaving) : '';
                    // buttonQueryObj = (BRVUtil.checkValue(buttonQuery))? JSON.parse(buttonQuery) : null;
                    app.screenSaveSuccess[objID] = (BRVUtil.checkValue(buttonOBJ[btni].onclick.savesuccess)) ? buttonOBJ[btni].onclick.savesuccess : null;
                    break;
                }
            }
        }

        // var doRequest = true;
        var doRequest = (BRVUtil.checkValue(buttonQuery)) ? true : false;

        // if ( BRVUtil.isBool(buttonUseSelect) ) {
        // 	buttonQuery = addSelectFieldsToQuery(buttonQuery);
        // 	doRequest = (BRVUtil.checkValue(buttonQuery)) ? true : false;
        // }

        if (BRVUtil.isBool(buttonUseSelect)) {
            var resultObj = addSelectFieldsToQuery(buttonQuery);
            buttonQuery = resultObj[0];
            doRequest = (BRVUtil.checkValue(buttonQuery)) ? true : false;

            // Check if there's a max selected items
            if (BRVUtil.checkValue(buttonMaxSelectItems)) {
                if (buttonMaxSelectItems > 0 && resultObj[1] > buttonMaxSelectItems) {
                    doRequest = false;
                    selectedItemsLimit = true;
                }
            }

        }

        if (doRequest) {
            if (app.paramObject) {
                if (BRVUtil.checkValue(buttonQueryFields)) {
                    var tmpQueryFields = buttonQueryFields.split('|');
                    for (a = 0; a < tmpQueryFields.length; a++) {
                        if (BRVUtil.checkValue(tmpQueryFields[a])) {
                            var tmpQueryField = tmpQueryFields[a].split('=');
                            var searchFld = tmpQueryField[0];

                            var value = app.paramObject[searchFld];
                            value = BRVUtil.checkUnicode(value);
                            value = BRVUtil.escapeQuotes(value);

                            buttonQueryWhere = BRVUtil.replaceAll(buttonQueryWhere, '<' + searchFld + '>', value);
                            buttonQueryHaving = BRVUtil.replaceAll(buttonQueryHaving, '<' + searchFld + '>', value);
                            buttonQuery = BRVUtil.replaceAll(buttonQuery, '<' + searchFld + '>', value);
                        }
                    }
                }
            }
            // Get data from Form fields
            if (BRVUtil.checkValue(JSONObject.content.fields)) {
                var fields = JSONObject.content.fields;
                var nfields = fields.length;
                for (var fldi = 0; fldi < nfields; fldi++) {
                    var fldID = fields[fldi].id;
                    // var fldName = fields[fldi].name;
                    // var fldType = fields[fldi].type;
                    // var fldLength = fields[fldi].length;

                    // Check if it's <p> then get text, else get val
                    // if ( $('#' + fldID).is("p") ) {
                    // 	fldValue = $('#' + fldID).text();
                    // } else {
                    // 	fldValue = $('#' + fldID).val();
                    // }

                    if ($('#' + fldID).is("p")) {
                        fldValue = $('#' + fldID).text();
                    } else if ($('#' + fldID).is(':checkbox')) {
                        fldValue = $('#' + fldID).prop('checked') ? 'on' : 'off';
                    } else {
                        fldValue = $('#' + fldID).val();
                    }

                    fldValue = BRVUtil.checkUnicode(fldValue);

                    //Escape quotes
                    fldValue = BRVUtil.escapeQuotes(fldValue);
                    //Trim spaces
                    fldValue = BRVUtil.alltrim(fldValue);
                    buttonQueryWhere = BRVUtil.replaceAll(buttonQueryWhere, '<' + fldID + '>', fldValue);
                    buttonQueryHaving = BRVUtil.replaceAll(buttonQueryHaving, '<' + fldID + '>', fldValue);
                    buttonQuery = BRVUtil.replaceAll(buttonQuery, '<' + fldID + '>', fldValue);
                }
            }
            query = buttonQuery;
            query = query.replace('<where>', buttonQueryWhere);
            query = query.replace('<having>', buttonQueryHaving);

            // Check for invalid "select"
            // {
            // 	"Select": {
            // 		"Where": ""
            // 	},
            // 	"SetOption": [
            // 		{
            // 			"Name": "filename",
            // 			"Value": "test.txt"
            // 		}
            // 	]
            // }			
            query = app.validateQuery(query);
            //

        }

        if (doRequest) {
            if (BRVUtil.checkValue(buttonQuestion)) {
                jQuery.confirm({
                    title: '&nbsp;',
                    content: buttonQuestion,
                    buttons: {
                        ja: function() {
                            // Escape HTML-entities and CR/LF
                            query = BRVUtil.escapeCRLF(query);
                            if (BRVUtil.checkValue(buttonAppID) && BRVUtil.checkValue(buttonWepID) && BRVUtil.checkValue(query)) {
                                app.wsErrorCode = 'A006';
                                app.doRequestGWRWAW(query, buttonAppID, buttonWepID, showCallWebserviceResponse, showWSError);
                            }
                        },
                        nee: function() {
                            if (BRVUtil.checkValue(buttonCancelMsg)) {
                                app.showMessage(buttonCancelMsg);
                            }
                        }
                    }
                });
            } else {
                // Escape HTML-entities and CR/LF
                query = BRVUtil.escapeCRLF(query);
                if (BRVUtil.checkValue(buttonAppID) && BRVUtil.checkValue(buttonWepID) && BRVUtil.checkValue(query)) {
                    app.wsErrorCode = 'A006';
                    app.doRequestGWRWAW(query, buttonAppID, buttonWepID, showCallWebserviceResponse, showWSError);
                }
            }
        } else {
            if (selectedItemsLimit) {
                var message = '';
                if (BRVUtil.checkValue(buttonMaxSelectItemsMsg)) {
                    message = buttonMaxSelectItemsMsg;
                } else {
                    message = app.translateMessage('MAX_MARKED_RECORDS');
                    message = BRVUtil.replaceAll(message, '<1>', buttonMaxSelectItems);
                }
                app.showMessage(message);
            } else
            if (BRVUtil.isBool(buttonUseSelect)) {
                app.showMessage('NO_MARKED_RECORDS');
            } else {
                app.showMessage('ACTION_ERROR');
            }
        }
    } else {
        // Do nothing!!!
    }
}

function showCallWebserviceResponse(data, status, req) {
    // app.debug('FUNCTION: showCallWebserviceResponse, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showCallWebserviceResponse, status:' + status);

    if (!CheckGWRWAWError(data, status, req)) {

        // Get app JSON from app vars
        var objID = app.JSONObject['screen'].id;
        // var JSONObject = app.JSONObject['screen'];

        var jsonData = returnjsonData(req);
        var jsonRecords = jsonData.response.responsedata;
        var message = jsonRecords.message;
        var messagedetail = jsonRecords.messagedetail;
        var unmark = '';
        var doSuccess = true;

        if (BRVUtil.checkValue(message)) {
            message = app.translateMessage(message);
        }

        if (BRVUtil.checkValue(messagedetail)) {
            messagedetail = messagedetail.split(',');
            var returnMessage = '';
            for (var i = 0; i < messagedetail.length; i++) {
                returnMessage += (messagedetail.length > 1) ? '- ' : '';
                returnMessage += app.translateMessage(messagedetail[i]);
                returnMessage += '<br>';
            }
            message += '<br><br>';
            message += returnMessage;
            message += '<br>';
        }

        // Check for 'content', 'link_file', 'filecontents','filename'
        // Then assume we need to show a document, so open it with 'BRVUtil.saveToLocalFileAndOpen'
        if (BRVUtil.checkValue(jsonRecords.filename) && BRVUtil.checkValue(jsonRecords.filecontents)) {
            BRVUtil.saveToLocalFileAndOpen(jsonRecords.filename, jsonRecords.filecontents);
        } else
        if (BRVUtil.checkValue(jsonRecords.link_file) && BRVUtil.checkValue(jsonRecords.content)) {
            BRVUtil.saveToLocalFileAndOpen(jsonRecords.link_file, jsonRecords.content);
        }

        if (BRVUtil.checkValue(jsonRecords.result)) {
            switch (jsonRecords.result.toUpperCase()) {
                case "ERROR":
                    $('[name="checkbox"]').each(function() {
                        if ($(this).prop('checked') == true) {
                            $(this).prop("checked", false);
                        }
                    });
                    if (!BRVUtil.checkValue(message)) {
                        message = 'FAIL';
                    }
                    doSuccess = false;
                    break;

                case "DONE":
                    $('[name="checkbox"]').each(function() {
                        if ($(this).prop('checked') == true) {
                            $(this).prop("checked", false);
                        }
                    });
                    if (!BRVUtil.checkValue(message)) {
                        message = 'DONE';
                    }
                    // Reload screen
                    if (BRVUtil.checkValue(app.lastScreenCall['screenid'])) {
                        getScreenFromJSON(app.lastScreenCall['screenid'], app.lastScreenCall['param'], app.lastScreenCall['mode'], app.lastScreenCall['skipChecks']);
                    }
                    break;

                case "UNMARK":
                    if (BRVUtil.checkValue(jsonRecords.unmark)) {
                        // unmark = JSON.parse(jsonRecords.unmark);
                        unmark = BRVUtil.parseJSON(jsonRecords.unmark);
                        for (var i = 0; i < unmark.length; i++) {
                            $('[name="checkbox"]').each(function() {
                                if ($(this).prop('checked') == true) {
                                    check = true;
                                    var checkboxValue = $(this).val();
                                    checkboxValue = checkboxValue.split('|');
                                    params = (checkboxValue[1] == 'b64') ? b64_to_str(checkboxValue[2]) : checkboxValue[1];
                                    jQuery.each(unmark[i], function(key, value) {
                                        checkcondition = key + '=' + value + '|';
                                        check = check + (params.indexOf(checkcondition) < 0) ? false : true;
                                    });
                                    if (check) {
                                        $(this).prop("checked", false);
                                    }
                                }
                            });
                        }
                        message += app.translateMessage('RECORDS_UNMARKED');
                    }
                    doSuccess = false;
                    break;

                default:
                    break;
            }
        }

        if (BRVUtil.checkValue(message)) {
            app.showMessage(message, null, false);
        }


        // Check for Sucess action
        var onSaveSuccess = '';
        var onSaveSuccessAction = '';
        var onSaveSuccessScreen = '';
        var onSaveSuccessScreenMode = '';
        var onSaveSuccessScreenParams = '';

        if (typeof app.screenSaveSuccess[objID] == 'object') {
            onSaveSuccess = app.screenSaveSuccess[objID];
            if (BRVUtil.checkValue(onSaveSuccess)) {
                onSaveSuccessAction = BRVUtil.checkValue(onSaveSuccess.action) ? onSaveSuccess.action : '';
                onSaveSuccessScreen = BRVUtil.checkValue(onSaveSuccess.screen) ? onSaveSuccess.screen : '';
                onSaveSuccessScreenMode = BRVUtil.checkValue(onSaveSuccess.screenmode) ? onSaveSuccess.screenmode : '';
                onSaveSuccessScreenParams = BRVUtil.checkValue(onSaveSuccess.screenparam) ? onSaveSuccess.screenparam : '';
            }
        }

        if (doSuccess && onSaveSuccessAction == 'GotoScreen' && onSaveSuccessScreen != '') {

            app.removeLastPageRoute(objID); // Remove current screen first.

            // Replace parameters with response values
            for (var fld in jsonRecords) {
                var fldID = fld;
                var fldValue = jsonRecords[fld];
                onSaveSuccessScreenParams = onSaveSuccessScreenParams.replace('<' + fldID + '>', fldValue);
            }

            // Replace some vars in onSaveSuccessScreenParams with values from app.paramObject
            if (app.paramObject) {
                if (BRVUtil.checkValue(onSaveSuccessScreenParams)) {
                    var tmpParamFields = onSaveSuccessScreenParams.split('|');
                    for (a = 0; a < tmpParamFields.length; a++) {
                        if (BRVUtil.checkValue(tmpParamFields[a])) {
                            var tmpParamField = tmpParamFields[a].split('=');
                            var searchFld = tmpParamField[0];
                            onSaveSuccessScreenParams = BRVUtil.replaceAll(onSaveSuccessScreenParams, '<' + searchFld + '>', app.paramObject[searchFld]);
                        }
                    }
                }
            }

            var param = (onSaveSuccessScreenParams != '') ? 'b64|' + str_to_b64(onSaveSuccessScreenParams) : '';

            // Slow down a bit, else it will cause errors!
            setTimeout(function() {
                getScreenFromJSON(onSaveSuccessScreen, param, '' + onSaveSuccessScreenMode + '');
            }, 500);
        } else {
            // It was success and we don't need to go to other screen.
            // Check if we need to set focus to a field in this form!
            ResetFieldFocus();
        }
    }

}

function activateLiCheckboxes(screenID) {
    app.debug('FUNCTION: activateLiCheckboxes, screenID:' + screenID);

    // Activate checkboxes in UL-LI on screenID
    $('#' + screenID + ' li a ').each(function(i, item) {
        $(item).addClass('li-ListText');
    });

    $('#' + screenID + ' li .li-checkBoxLeft ').each(function(i, item) {
        $(item).show();
    });
}

function activateLiLeftColumn(screenID) {
    app.debug('FUNCTION: activateLiLeftColumn, screenID:' + screenID);

    // Find dividers
    // Add checkbox, to select all divider children
    if (BRVUtil.checkValue(app.activateLiCheckboxes)) {
        $('#' + screenID + ' [data-role="list-divider"]').each(function(i, item) {
            var curLabel = $(item).text();
            var chkBox = $('<input/>').attr({ type: 'checkbox', name: 'checkbox' }).addClass('li-ListDivider0').change(function() { checkDividerCheckbox(this, curLabel, screenID); });
            $(item).prepend(chkBox);
        });
    }

    // Activate checkboxes in UL-LI on screenID
    $('#' + screenID + ' li a ').each(function(i, item) {
        if (BRVUtil.checkValue(app.activateLiCheckboxes)) {
            $(item).removeClass('li-ListText10');
            $(item).addClass('li-ListText30');
        } else {
            $(item).addClass('li-ListText10');
            $(item).removeClass('li-ListText30');
        }
    });

    if (BRVUtil.checkValue(app.activateLiCheckboxes)) {
        $('#' + screenID + ' li .li-checkBoxLeft ').each(function(i, item) {
            $(item).show();
            $(item).change(function() { checkCheckbox(this, screenID); });
        });

        $('#' + screenID + ' li ').each(function(i, item) {
            // Add swipe left/right to row
            $(this).on("swipeleft",
                function() {
                    if (!$(this).find('.li-checkBoxLeft [name="checkbox"]').prop("disabled")) { // Only when not disabled!
                        $(this).find('.li-checkBoxLeft [name="checkbox"]').prop("checked", true);
                        $(this).find('.li-checkBoxLeft [name="checkbox"]').change();
                    }
                }
            );
            $(this).on("swiperight",
                function() {
                    if (!$(this).find('.li-checkBoxLeft [name="checkbox"]').prop("disabled")) { // Only when not disabled!
                        $(this).find('.li-checkBoxLeft [name="checkbox"]').prop("checked", false);
                        $(this).find('.li-checkBoxLeft [name="checkbox"]').change();
                    }
                }
            );
        });
    }
}

function checkDividerCheckbox(item, dividerValue, screenID) {
    // Check all checkboxes for current divider
    if ($(item).prop('checked')) {
        $('#' + screenID + ' [dividervalue="' + dividerValue + '"]').each(function() {
            if (!$(this).find('.li-checkBoxLeft [name="checkbox"]').prop("disabled")) { // Only when not disabled!
                $(this).find('.li-checkBoxLeft [name="checkbox"]').prop("checked", true);
                $(this).find('.li-checkBoxLeft [name="checkbox"]').change();
            }
        });
    } else {
        $('#' + screenID + ' [dividervalue="' + dividerValue + '"]').each(function() {
            if (!$(this).find('.li-checkBoxLeft [name="checkbox"]').prop("disabled")) { // Only when not disabled!
                $(this).find('.li-checkBoxLeft [name="checkbox"]').prop("checked", false);
                $(this).find('.li-checkBoxLeft [name="checkbox"]').change();
            }
        });
    }
}




function checkCheckbox(item, screenID) {
    app.debug('FUNCTION: checkCheckbox, item:' + item + ', screenID:' + screenID);
    var hasCheckedValues = false;

    // Clear all header _<fieldname>_sum fields.
    $('#' + screenID + ' li .li-checkBoxLeft [name="checkbox"]').each(function() {
        // $(this).parent().parent().parent().find('[sumfield]').each(function () {
        // 	var sumfldName = $(this).attr("sumfield") ;
        // 	if ( $('#'+sumfldName).text() != '') {
        // 		$('#'+sumfldName).text('');
        // 	}
        // });

        $(this).parent().parent().parent().find('[sumfield]').each(function() {
            var sumfldName = $(this).attr("sumfield");
            var hdrFld = $('#headerinfodiv span').find('[sumFldName="' + sumfldName + '"]');
            if ($(hdrFld).text() != '') {
                $(hdrFld).text('');
            }
        });

    });

    // Check if there are record checked, and calc headerinfo _<fieldname>_sum fields
    $('#' + screenID + ' li .li-checkBoxLeft [name="checkbox"]').each(function() {
        if ($(this).prop('checked')) {
            hasCheckedValues = true;

            // Do some summing in header
            $(this).parent().parent().parent().find('[sumfield]').each(function() {
                var sumfldName = $(this).attr("sumfield");
                var sumfldValue = $(this).attr("sumvalue");
                var sumfldDecimals = $(this).attr("decimals");

                if (sumfldName && sumfldValue) {
                    try {
                        // var fldValue =  $('#'+sumfldName).text(); 
                        var fldValue = $('#headerinfodiv span').find('[sumFldName="' + sumfldName + '"]').text();

                        if (fldValue) {
                            fldValue = parseFloat(BRVUtil.curToInt(fldValue)) + parseFloat(BRVUtil.curToInt(sumfldValue));
                        } else {
                            fldValue = parseFloat(BRVUtil.curToInt(sumfldValue));
                        }
                        // $('#'+sumfldName).text( BRVUtil.number_format(fldValue, (sumfldDecimals)?sumfldDecimals:0, ',', '.') );
                        $('#headerinfodiv span').find('[sumFldName="' + sumfldName + '"]').text(BRVUtil.number_format(fldValue, (sumfldDecimals) ? sumfldDecimals : 0, ',', '.'));

                    } catch (e) {}
                }
            });
        }
    });


    // Set headerinfofield width
    var maxTitleWidth = 0;
    $('#headerinfodiv span[name=headerinfotitle]').each(function() {
        maxTitleWidth = Math.max(maxTitleWidth, $(this).width());
    }).width(maxTitleWidth);

    var maxFieldWidth = 0;
    $('#headerinfodiv span[name=headerinfospan]').each(function() {
        maxFieldWidth = Math.max(maxFieldWidth, $(this).width());
    }).width(maxFieldWidth);


    $('#' + screenID + ' li .li-checkBoxLeft [name="checkbox"]').each(function() {
        if (hasCheckedValues) {
            var that = $(this).parent().parent().parent().find('a');
            /*			that.attr("data", that.attr("onclick")).removeAttr("onclick");*/

            if (that.hasClass('ui-icon-carat-r')) {
                that.attr("data", that.attr("onclick")).removeAttr("onclick");
                that.removeClass('ui-icon-carat-r');
                that.attr("hasiconrightremoved", true);
            }

        } else {
            var that = $(this).parent().parent().parent().find('a');
            /*			that.attr("onclick", that.attr("data")).removeAttr("data");*/

            // Check if row was clickable then restore icon
            if (that.attr("hasiconrightremoved")) {
                /*					that.removeClass('ui-state-disabled');*/

                if (!that.hasClass('ui-icon-carat-r')) {
                    that.attr("onclick", that.attr("data")).removeAttr("data");
                    that.addClass('ui-icon-carat-r');
                    that.attr("hasiconrightremoved", false);
                }

            }
        }
    });
}


function showFieldsFormResult(data, status, req) {
    // app.debug('FUNCTION: showFieldsFormResult, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showFieldsFormResult, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];

        var jsonData = returnjsonData(req);

        app.screenJSONData = jsonData; // Save current screendata, so we can use this in buffered queries.

        // var output = '';

        jQuery.each(jsonData.response.queryresults, function(key, value) {
            valueName = value.name.toLowerCase();
            valueValue = value.recordset;
            switch (valueName) {
                case "webquery":
                    showFieldsFormResultFromWebQuery(JSONObject, valueValue, false);
                    break;

                case (valueName.match(/^buttonbubble_/) || {}).input:
                    setButtonBubbleValue(valueValue);
                    break;

                case (valueName.match(/^select_/) || {}).input:
                    setSelectValue(valueValue, valueName, JSONObject.content.fields, false);
                    break;

                case (valueName.match(/^selectdoc_/) || {}).input:
                    setDocumentValue(valueValue, valueName, JSONObject.content.fields);
                    break;

                default:
                    break;
            }
        });
    }
    // app.stopLoading();
}

function showFieldsFormResultFromWebQuery(JSONObject, jsonRecords, checkSubQueryresults) {
    // app.debug('FUNCTION: showFieldsFormResultFromWebQuery, JSONObject:'+JSONObject+', jsonRecords:'+jsonRecords+', checkSubQueryresults:'+checkSubQueryresults);
    app.debug('FUNCTION: showFieldsFormResultFromWebQuery, JSONObject:' + JSONObject);

    if (jsonRecords.length > 0) {
        // if (checkSubQueryresults) {
        if (checkSubQueryresults && JSONObject.content.fields) {
            var prevfldName = null;
            for (var fld in jsonRecords) {
                for (var i = 0; i < JSONObject.content.fields.length; i++) {
                    var fldID = [fld][0];
                    var fldName = JSONObject.content.fields[i].name;
                    var fldType = JSONObject.content.fields[i].type;
                    var keyfield = JSONObject.content.fields[i].keyfield;

                    // Fill Select fields
                    if (fldType == 'select') {
                        if (prevfldName != fldName) {
                            setSelectValue(jsonRecords, keyfield, JSONObject.content.fields, true);
                        }
                        prevfldName = fldName;
                    }
                    // Fill Select fields

                    // Fill Documents fields
                    if (fldType == 'selectdoc') {
                        if (prevfldName != fldName) {
                            setDocumentValue(jsonRecords, keyfield, JSONObject.content.fields);
                        }
                        prevfldName = fldName;
                    }
                    // Fill Documents fields

                }
            }
        }

        if (JSONObject.content.fields) {
            for (var fld in jsonRecords[0]) {
                var fldID = [fld][0];
                var fldValue = jsonRecords[0][fld];
                var fldName = '';
                var fldType = '';
                var fldLength = '';
                var fldPrefix = '';
                var fldSuffix = '';
                var fldDecimals = '';
                var fldHideWhenEmpty = false;
                var fldsetFocus = false;
                var fldClearOnFocus = false;
                var fldEditable = 'true';

                for (var i = 0; i < JSONObject.content.fields.length; i++) {
                    // Try to find the field in the screen JSON to get some settings

                    if (fldID == JSONObject.content.fields[i].id) {
                        fldName = JSONObject.content.fields[i].name;
                        fldType = JSONObject.content.fields[i].type;
                        fldEditable = JSONObject.content.fields[i].editable;
                        fldLength = JSONObject.content.fields[i].length;
                        fldPrefix = JSONObject.content.fields[i].prefix;
                        fldSuffix = JSONObject.content.fields[i].suffix;
                        fldDecimals = JSONObject.content.fields[i].decimals;
                        fldNavigate = JSONObject.content.fields[i].navigate;
                        fldHideWhenEmpty = JSONObject.content.fields[i].hidewhenempty;
                        fieldDispValue = JSONObject.content.fields[i].fielddispvalue;
                        fldsetFocus = JSONObject.content.fields[i].setfocus;
                        fldClearOnFocus = JSONObject.content.fields[i].clearonfocus;
                        break;
                    }

                    // Check for button
                    if (JSONObject.content.fields[i].type == 'button') {
                        // Check for button labels
                        if (BRVUtil.checkValue(JSONObject.content.fields[i].buttonlabel)) {
                            if (fldID == JSONObject.content.fields[i].buttonlabel && BRVUtil.checkValue(fldValue)) {
                                $('#' + JSONObject.content.fields[i].id).html(fldValue);
                            }
                        }
                    }
                }

                switch (fldType) {

                    case "checkbox":
                        // For checkboxes we need to do something else, see below
                        break;

                    case "text":
                        // Do some styling??
                        if (app.screenMode == 'show') {
                            BRVUtil.checkValue(fldPrefix) ? fldValue = fldPrefix + fldValue : '';
                            BRVUtil.checkValue(fldSuffix) ? fldValue = fldValue + fldSuffix : '';
                        }
                        break;

                    case "textarea":
                        // Do some styling??
                        if (app.screenMode == 'show') {
                            fldValue = fldValue.replace(/\r?\n|\r/g, '<br />'); // Replace all CRLF
                        }
                        break;

                        // case "phone":
                        // 	// Do some styling??
                        // 	if (app.screenMode == 'show') {
                        // 		var fldValueOrg = fldValue; 
                        // 		fldValue = fldValue.replace(/[^0-9#*+]/g, '');  // Strip all non-digits, except '+', '*' and '#'-signs!
                        // 		fldValue = '<a href="tel:' + fldValue + '">' + fldValueOrg + '</a>';
                        // 	}
                        // 	break;

                    case "phone":
                        if (app.screenMode == 'show') {
                            var fldValueOrg = fldValue;
                            fldValue = fldValue.replace(/[^0-9#*+]/g, ''); // Strip all non-digits, except '+', '*' and '#'-signs!
                            if (BRVUtil.isBrowser()) {
                                fldValue = fldValueOrg;
                            } else {
                                fldValue = '<a href="tel:' + fldValue + '">' + fldValueOrg + '</a>';
                            }

                            var showSMS = BRVUtil.isBool(JSONObject.content.fields[i].sms) ? JSONObject.content.fields[i].sms : false;
                            var showWhatsapp = BRVUtil.isBool(JSONObject.content.fields[i].whatsapp) ? JSONObject.content.fields[i].whatsapp : false;

                            if (showSMS && !BRVUtil.isBrowser()) {
                                var smsValue = fldValueOrg.replace(/[^0-9+]/g, ''); // Strip all non-digits, except '+'-signs!
                                smsValue = BRVUtil.alltrim(smsValue);
                                (BRVUtil.Left(smsValue, 2) == '06') ? smsValue = '+31' + BRVUtil.Right(smsValue, (smsValue.length) - 1): '';
                                if (fldValueOrg) {
                                    fldValue += '<a href="sms:' + smsValue + '"><span class="icon_input_sms">&nbsp;</span></a>';
                                } else {
                                    fldValue += '<a href="javascript:void(0);"><span class="icon_input_sms">&nbsp;</span></a>';
                                }
                            }
                            if (showWhatsapp && !BRVUtil.isBrowser()) {
                                var whatsappValue = fldValueOrg.replace(/[^0-9]/g, ''); // Strip all non-digits!
                                whatsappValue = BRVUtil.alltrim(whatsappValue);
                                (BRVUtil.Left(whatsappValue, 2) == '06') ? whatsappValue = '31' + BRVUtil.Right(whatsappValue, (whatsappValue.length) - 1): '';
                                if (fldValueOrg) {
                                    fldValue += '<a href="whatsapp://send?phone=' + whatsappValue + '&text="><span class="icon_input_whatsapp">&nbsp;</span></a>';
                                } else {
                                    fldValue += '<a href="javascript:void(0);"><span class="icon_input_whatsapp">&nbsp;</span></a>';
                                }
                            }
                        }
                        break;

                    case "sms":
                        if (app.screenMode == 'show' && !BRVUtil.isBrowser()) {
                            var fldValueOrg = fldValue;
                            var smsValue = fldValue.replace(/[^0-9+]/g, ''); // Strip all non-digits, except '+'-signs!
                            smsValue = BRVUtil.alltrim(smsValue);
                            (BRVUtil.Left(smsValue, 2) == '06') ? smsValue = '+31' + BRVUtil.Right(smsValue, (smsValue.length) - 1): '';
                            fldValue = '<span class="icon_sms">&nbsp;</span><a href="sms:' + smsValue + '">' + fldValueOrg + '</a>';
                        }
                        break;

                    case "whatsapp":
                        if (app.screenMode == 'show' && !BRVUtil.isBrowser()) {
                            var fldValueOrg = fldValue;
                            var whatsappValue = fldValue.replace(/[^0-9]/g, ''); // Strip all non-digits!
                            whatsappValue = BRVUtil.alltrim(whatsappValue);
                            (BRVUtil.Left(whatsappValue, 2) == '06') ? whatsappValue = '31' + BRVUtil.Right(whatsappValue, (whatsappValue.length) - 1): '';
                            fldValue = '<span class="icon_whatsapp">&nbsp;</span><a href="whatsapp://send?phone=' + whatsappValue + '&text=">' + fldValueOrg + '</a>';
                        }
                        break;

                    case "navigate":
                        // Do some styling??
                        if (app.screenMode == 'show') {
                            var navValue = '';
                            if (BRVUtil.checkValue(fldNavigate)) {
                                var navFields = fldNavigate.split('|');
                                // Find navigate fields and create parameter string for Google maps
                                for (a = 0; a < navFields.length; a++) {
                                    if (navFields[a] != '') {
                                        // Check if navigate field is in JSON records
                                        for (var fldTmp in jsonRecords[0]) {
                                            if ('<' + [fldTmp][0] + '>' == navFields[a]) {
                                                navValue += jsonRecords[0][fldTmp] + ',';
                                            }
                                        }
                                    }
                                }
                                // Strip last ','
                            }
                            if (BRVUtil.checkValue(navValue)) {
                                navValue = BRVUtil.Left(navValue, navValue.length - 1);
                                // fldValue = '<a href="https://maps.google.nl/maps?q=' + encodeURIComponent(navValue) + '" target="_blank">' + fldValue + '</a>';

                                // Navigation to native app
                                // ---------------------------------------------------------------
                                // iOS: <a href="maps:q=street address, city state">Map</a>
                                // Android: <a href="geo:0,0?q=street address, city state">Map</a>
                                if (device.platform.toLowerCase() == 'ios') {
                                    fldValue = '<a href="maps:q=' + encodeURIComponent(navValue) + '" target="_blank">' + fldValue + '</a>';
                                } else
                                if (device.platform.toLowerCase() == 'android') {
                                    fldValue = '<a href="geo:0,0?q=' + encodeURIComponent(navValue) + '" target="_blank">' + fldValue + '</a>';
                                } else {
                                    fldValue = '<a href="https://maps.google.nl/maps?q=' + encodeURIComponent(navValue) + '" target="_blank">' + fldValue + '</a>';
                                }
                            }
                        }
                        break;

                    case "email":
                        // Do some styling??
                        if (app.screenMode == 'show') {
                            fldValue = '<a href="mailto:' + fldValue + '">' + fldValue + '</a>';
                        }
                        break;

                    case "www":
                        if (BRVUtil.checkValue(fldValue)) {
                            // Check if there's an other value to display instead of the original field value (url).
                            if (BRVUtil.checkValue(fieldDispValue)) {
                                dispValue = replaceVars(jsonRecords[0], fieldDispValue);
                            } else {
                                dispValue = fldValue;
                            }

                            if (app.screenMode == 'show') {
                                fldValue = (BRVUtil.checkValue(dispValue)) ? '<a href="' + BRVUtil.linkify(fldValue) + '" target="_blank">' + dispValue + '</a>' : '';
                            } else {
                                fldValue = dispValue;
                            }
                        }
                        break;

                    case "date":
                        // Do some styling??
                        fldValue = (fldValue.substr(0, 4) != '0000') ? BRVUtil.ISOdateToStr(fldValue) : '';
                        break;

                    case "datetime":
                        // 2017-09-08T15:05:57+02:00
                        if (fldValue.indexOf('T') > -1) {
                            // 2016-06-21T00:00:00+02:00
                            if (app.screenMode == 'show') {
                                fldValue = BRVUtil.ISOdatetimeToStr(fldValue);
                            } else {
                                fldValue = BRVUtil.ISOdateToStr(fldValue);
                            }
                        }
                        break;

                        // case "number":
                        // // Do some styling??
                        // BRVUtil.checkValue(fldDecimals) ? fldValue = BRVUtil.formatNumber(fldValue, fldDecimals, true) : fldValue;
                        // break;

                        //Handle number fields the same as currency fields
                    case "number":
                    case "currency":
                        // Below code same as in 'formatFieldToShow'

                        // Do some styling??
                        // BRVUtil.checkValue(fldDecimals) ? fldValue = BRVUtil.formatNumber(fldValue, fldDecimals, true) : fldValue;
                        if ($('#' + fldID).attr('data-role') == 'spinbox') {
                            // When it's a spinbox we need to remove thousands separator and change decimals separator to '.'
                            fldValue = BRVUtil.number_format(fldValue, fldDecimals, '.', '');
                        } else {
                            fldValue = BRVUtil.number_format(fldValue, fldDecimals, ',', '.');

                            // Only add prefix and suffix when it's not a spinbox.
                            if (app.screenMode == 'show') {
                                BRVUtil.checkValue(fldPrefix) ? fldValue = fldPrefix + fldValue : '';
                                BRVUtil.checkValue(fldSuffix) ? fldValue = fldValue + fldSuffix : '';
                            }
                        }
                        break;

                    case "image":
                        // ToDo: Why only visible in 'show' modus?
                        // Make also visible in 'edit' modus!
                        // if (app.screenMode == 'show') {
                        fldValue = (BRVUtil.checkImageB64(fldValue));
                        $('#' + fldID).attr('src', fldValue);
                        // }
                        break;

                    default:
                        break;
                }

                // Set values to formfield
                if (typeof $('#' + fldID) == 'object' && BRVUtil.checkValue($('#' + fldID)[0])) {
                    var tagName = $('#' + fldID)[0].tagName.toLowerCase();
                    switch (tagName) {
                        case "p":
                            // if ( (fldValue == '' || fldValue == '0,00') && fldHideWhenEmpty) {
                            if ((fldValue == '' || fldValue == '0,00') && fldHideWhenEmpty && fldEditable == 'false' && !app.isBuilder) {
                                $("#" + fldID).parent().hide();
                            } else {
                                $('#' + fldID).html(fldValue);
                            }
                            break;

                        case "select":
                            BRVUtil.addToArray(app.SelectList, fldID, fldValue);
                            break;

                        default:
                            // if ( (fldValue == '' || fldValue == '0,00') && fldHideWhenEmpty) {
                            if ((fldValue == '' || fldValue == '0,00') && fldHideWhenEmpty && fldEditable == 'false' && !app.isBuilder) {
                                $("#" + fldID).parent().hide();
                            } else {
                                $('#' + fldID).val(fldValue).change();
                            }


                            //Save initial value to valuebackup property of object
                            //console.log('fldID: ', fldID);
                            //$('#' + fldID).attr("valuebackup", fldValue); // Backup initial value 

                            break;
                    }
                }

                if (fldType == 'checkbox') { // In case of a Checkbox
                    $('#' + fldID).prop('checked', BRVUtil.isBool(fldValue)).checkboxradio('refresh');
                    $('#' + fldID).val(fldValue).change();
                } else { // Else: Do default
                    $('#' + fldID).val(fldValue).change();
                }

                // Check fldClearOnFocus
                if (fldClearOnFocus && fldsetFocus) {
                    $('#' + fldID).val(''); // Clear old input
                }

                if (fldClearOnFocus) {
                    //				 $('#' + fldID).focus(function() { // Focus causes some strange behaviour, so we use onClick.
                    $('#' + fldID).click(function() {
                        $(this).val(''); // Clear old input
                    });
                }

                //Replace vars in bodytoptext en bodybottomtext;
                replaceVarInDiv('bodytoptext', '#' + fldID + '#', fldValue);
                replaceVarInDiv('bodybottomtext', '#' + fldID + '#', fldValue);

            } //endfor
        }


        if (!JSONObject.content.fields) {
            for (var fld in jsonRecords[0]) {
                var fldID = [fld][0];
                var fldValue = jsonRecords[0][fld];
                //Replace vars in bodytoptext en bodybottomtext;
                replaceVarInDiv('bodytoptext', '#' + fldID + '#', fldValue);
                replaceVarInDiv('bodybottomtext', '#' + fldID + '#', fldValue);
            }
        }


        //ToDo: Find better solution for this. Now we need to timeout cause select list isn't 100% finished when it was buffered!
        //When loaded by multi QUERY_GENERAL, it doesn't need a timeout.
        //Moved to function 'doBufferedQuerys'
        // setTimeout(function () {
        // 	setSelectList();
        // }, 100);
    }

    // Get header data
    //Moved to function 'doBufferedQuerys'
    // GetBufferedHeaderInfoQuery();


    // Moved to BuildScreenFromJSON
    // replaceVarsInDivWithDataFromStorage('bodytoptext');
    // replaceVarsInDivWithDataFromStorage('bodybottomtext');
}


function replaceVars(jsonObj, varsString) {
    if (BRVUtil.checkValue(varsString)) {
        var tmpQueryFields = varsString.split('|');
        var newVarsString = '';
        for (a = 0; a < varsString.length; a++) {
            if (BRVUtil.checkValue(tmpQueryFields[a])) {

                var tmpField = tmpQueryFields[a];
                newVarsString = newVarsString + tmpField;
                if (tmpField.substr(0, 1) == '<') {
                    tmpField = tmpField.replace('<', '');
                    tmpField = tmpField.replace('>', '');

                    tmpFieldNew = (BRVUtil.checkValue(jsonObj[tmpField])) ? jsonObj[tmpField] : '';
                    tmpFieldNew = BRVUtil.alltrim(tmpFieldNew);
                    newVarsString = BRVUtil.replaceAll(newVarsString, '<' + tmpField + '>', tmpFieldNew);
                }
            }
        }
        varsString = newVarsString;
    }
    return varsString;
}


function setButtonBubbleValue(ValuesJSON) {
    // app.debug('FUNCTION: setButtonBubbleValue, ValuesJSON:'+ValuesJSON);
    app.debug('FUNCTION: setButtonBubbleValue');
    // Set button bubble value from json
    jQuery.each(ValuesJSON, function(key, value) {
        jQuery.each(value, function(fldID, fldValue) {

            var hidewhennull = BRVUtil.parseBoolean($('#' + fldID).attr("hidewhennull"));

            if (hidewhennull && (fldValue == 0 || fldValue == '')) {
                // Remove Bubblecounter
                $('#' + fldID).remove();
            } else {

                $('#' + fldID).html(fldValue);

                if (BRVUtil.checkValue($('#' + fldID).attr("bgcol")) || BRVUtil.checkValue($('#' + fldID).attr("bgcolnull"))) {
                    var bgCol = $('#' + fldID).attr("bgcol");
                    var bgColNull = $('#' + fldID).attr("bgcolnull");

                    var bgColor = bgCol;
                    if ((fldValue == 0 || fldValue == '')) {
                        bgColor = bgColNull;
                    }

                    if (BRVUtil.checkValue(bgColor)) {
                        $('#' + fldID).css({
                            "background-color": bgColor
                        });
                    }
                }

                if (BRVUtil.checkValue($('#' + fldID).attr("txtcol")) || BRVUtil.checkValue($('#' + fldID).attr("txtcolnull"))) {
                    var txtCol = $('#' + fldID).attr("txtcol");
                    var txtColNull = $('#' + fldID).attr("txtcolnull");

                    var txtColor = txtCol;
                    if ((fldValue == 0 || fldValue == '')) {
                        txtColor = txtColNull;
                    }

                    $('#' + fldID).css({
                        "color": txtColor
                    });
                }
                $('#' + fldID).show();
            }

        });
    });
}

function setDocumentValue(ValuesJSON, targetID, JSONObject) {
    // app.debug('FUNCTION: setDocumentValue, ValuesJSON:'+ValuesJSON+', targetID:'+targetID+', JSONObject:'+JSONObject);
    app.debug('FUNCTION: setDocumentValue, targetID:' + targetID);
    var targetID = targetID.replace("selectdoc_", "");
    var fldKeyField = '';
    var fldKeyDesc = '';
    var tmpArray = new Array();
    var enableDelete = false;
    // Find keyfield in json

    // Is no doc's found and it's builder, then create dummydoc
    if (ValuesJSON.length == 0 && app.isBuilder) {
        // ValuesJSON = JSON.parse('[{"cng_date":"01-01-1980","doc_desc":"dummydoc.pdf","link_file":"dummydoc.pdf","link_type":"USR_LINK_FILEMAP","rec_id":"DUMMY","tbl_name":"dummy"}]');
        ValuesJSON = BRVUtil.parseJSON('[{"cng_date":"01-01-1980","doc_desc":"dummydoc.pdf","link_file":"dummydoc.pdf","link_type":"USR_LINK_FILEMAP","rec_id":"DUMMY","tbl_name":"dummy"}]');
    }

    if (ValuesJSON.length > 0) {

        for (var i = 0; i < JSONObject.length; i++) {
            if (JSONObject[i].id == targetID) {
                // fldKeyField = JSONObject[i].keyfield;
                // fldKeyDesc = JSONObject[i].keydesc;
                // fldKeyDescSep = JSONObject[i].keydescseparator;
                fldKeyField = (JSONObject[i].keyfield) ? JSONObject[i].keyfield : '';
                fldKeyDesc = (JSONObject[i].keydesc) ? JSONObject[i].keydesc : '';
                fldKeyDescSep = (JSONObject[i].keydescseparator) ? JSONObject[i].keydescseparator : ' ';
                enableDelete = (JSONObject[i].enabledelete) ? (BRVUtil.isBool(JSONObject[i].enabledelete)) : false;
                break;
            }
        }

        // "doc_desc": "Factuur",
        // "link_file": "https://my.newviews.nl/ArchiveReader.aspx?fn=1706071152370279144867.pdf",
        // "link_type": "NOTE",
        // "rec_id": "_4YG0TKWJ7",
        // "tbl_name": "DJ_PAGE"

        // "doc_desc": "SI201630013",
        // "link_file": "SI201630013.PDF",
        // "link_type": "USR_LINK_FILEMAP",
        // "rec_id": "_4M10U8Z8R",
        // "tbl_name": "OPENITEM"

        var output = '';
        var tmpKey = '';
        var tmpValue = '';
        var tmpLink = '';
        var tmpLinkType = '';
        var tmpFileExt = '';

        for (var i = 0; i < ValuesJSON.length; i++) {
            tmpKey = '';
            tmpValue = '';
            tmpLink = '';
            tmpLinkType = '';
            tmpFileExt = '';
            for (var fld in ValuesJSON[i]) {
                var field = [fld][0];
                var fieldvalue = ValuesJSON[i][fld];
                if (field == fldKeyField) {
                    tmpKey = fieldvalue;
                }
                if (fldKeyDesc.indexOf(field) >= 0) {
                    BRVUtil.addToArray(tmpArray, fldKeyDesc.indexOf(field), fieldvalue);
                }
            }

            if (ValuesJSON[i].link_type == 'BASECONE') {
                tmpFileExt = 'basecone';
            } else
            if (ValuesJSON[i].link_type == 'NEWVIEWS') {
                tmpFileExt = 'newviews';
            } else
            if (ValuesJSON[i].link_type == 'SCANB') {
                tmpFileExt = 'scanboeken';
            } else {
                tmpFileExt = BRVUtil.file_get_ext(ValuesJSON[i].link_file);
            }

            tmpArray = BRVUtil.ArraySortByColumn(tmpArray, 0, true); // Sort array
            for (var a = 0; a < tmpArray.length; a++) { // Create sorted tmpValue
                tmpValue += tmpArray[a][1];
                tmpValue += (a < tmpArray.length - 1) ? (fldKeyDescSep != '') ? fldKeyDescSep : '' : '';
            }

            output += '<div class="ui-controlgroup-controls " data-type="horizontal" style="display: flex; margin-bottom:4px;" id="' + ValuesJSON[i].rec_id + '">';
            if (app.isBuilder && ValuesJSON[i].rec_id == 'DUMMY') {
                output += '<a href="javascript:void(0)" data-role="button" data-mini="true" class="file_' + tmpFileExt + '" style="width:100%; border-width:1px; margin-right:5px;">';
            } else {
                output += '<a href="javascript:getUsrLinkDocument(\'' + str_to_b64(JSON.stringify(ValuesJSON[i])) + '\')"  data-role="button" data-mini="true" class="file_' + tmpFileExt + '" style="width:100%; border-width:1px; margin-right:5px;">';
            }
            output += tmpValue;
            output += '</a>';

            // Only when link_type = 'USR_LINK_FILEMAP' AND enableDelete = true add delete button!
            if (ValuesJSON[i].link_type == 'USR_LINK_FILEMAP' && enableDelete) {
                if (app.isBuilder && ValuesJSON[i].rec_id == 'DUMMY') {
                    output += '<a href="javascript:void(0)" data-role="button" data-mini="true" data-icon="delete" data-iconpos="notext" data-inline="true" style="border-width:1px;"></a>';
                } else {
                    output += '<a href="javascript:delUsrLinkDocument(\'' + str_to_b64(JSON.stringify(ValuesJSON[i])) + '\', \'' + ValuesJSON[i].rec_id + '\' )"  data-role="button" data-mini="true" data-icon="delete" data-iconpos="notext" data-inline="true" style="border-width:1px;"></a>';
                }
            }
            output += '</div>';

            tmpArray = new Array(); // Clear tmp array
        }

        $("#" + targetID + "_container").show();

        $("#" + targetID).append(output);
        $("#" + targetID).trigger("create"); // Recreate the object, apply styles

        // Remove some classes from controlgroup and buttons
        $('[data-role="controlgroup"]').each(function() {
            //			$(this).removeClass('ui-corner-all');
            $(this).removeClass('readonly');
        });
        $('[data-role="button"]').each(function() {
            //			$(this).removeClass('ui-corner-all');
            $(this).removeClass('readonly');
        });

    } else {
        $("#" + targetID + "_container").hide();
    }
}


function addSelectFieldsToQuery(xQuery) {
    var QueryObj = null;
    var QueryJSONString = '';
    var selectedItems = 0;

    // If empty xQuery create empty JSON object.
    if (!BRVUtil.checkValue(xQuery)) {
        xQuery = new Object();
    }

    // Check fo xQuery
    if (BRVUtil.checkValue(xQuery)) {
        // Convert  string input to JSON object
        if (typeof xQuery == 'string') {
            // QueryObj = JSON.parse(xQuery);
            QueryObj = BRVUtil.parseJSON(xQuery);
        } else
        if (typeof xQuery == 'object') {
            QueryObj = xQuery;
        }

        var jsonParam = new Array();
        var jsonParamTmp = new Object();
        var params = '';

        var ListViewCheckboxes = $('[data-role="listview"] li:not([data-role="list-divider"])').find('input[name="checkbox"]');
        if (ListViewCheckboxes.length > 0) { // Get from listview checkboxes
            $(ListViewCheckboxes).each(function() {
                if ($(this).prop('checked') == true) {
                    var checkboxValue = $(this).val();
                    checkboxValue = checkboxValue.split('|');
                    // screenID = checkboxValue[0];
                    params = (checkboxValue[1] == 'b64') ? b64_to_str(checkboxValue[2]) : checkboxValue[1];

                    // Example:	
                    // |sub_nr=20002|inv_nr=201630012|
                    // |sub_nr=20003|inv_nr=201630015|
                    // Output:
                    // [{"inv_nr": "201630012", "sub_nr": "20002"}, {"inv_nr": "201630015", "sub_nr": "20003"}]

                    tmpPar1 = params.split('|');
                    for (var i = 0; i < tmpPar1.length; i++) {
                        var tmpPar2 = tmpPar1[i].split('=');
                        if (tmpPar2[0] != '') {
                            var key = tmpPar2[0];
                            var value = tmpPar2[1];
                            jsonParamTmp[key] = value;
                        }
                    }
                    jsonParam[jsonParam.length] = jsonParamTmp;
                    jsonParamTmp = new Object();

                    selectedItems++;
                }
            });
        } else { // Get from app.paramObject.selecteditems
            if (app.paramObject) {
                if (BRVUtil.checkValue(app.paramObject.selecteditems)) {
                    // jsonParam = JSON.parse(app.paramObject.selecteditems);
                    jsonParam = BRVUtil.parseJSON(app.paramObject.selecteditems);
                }
            }
        }

        // Check if it's demo APP
        // var demoValue = (app.GetFromPhoneStorage('isdemo') == 'true')?true:false;
        var demoValue = (app.GetFromPhoneStorage('isdemo') == 'true') ? true : false;

        // Check if button already has query with Setoption!
        if (jsonParam.length > 0) {
            // Check if SetOption is there, else create it.
            if (!QueryObj.SetOption) {
                QueryObj["SetOption"] = [];
            }
            if (QueryObj.SetOption) {
                QueryObj.SetOption.push({ "Name": "selecteditems", "Value": (jsonParam.length > 0) ? jsonParam : "" });
                // QueryObj.SetOption.push({"Name":"isdemo","Value":demoValue});
                QueryObj.SetOption.push({ "Name": "isdemo", "Value": app.isdemo });
            }
        }

        if (JSON.stringify(QueryObj) != '{}') {
            QueryJSONString = JSON.stringify(QueryObj);
        }
    }
    // return QueryJSONString	

    return [QueryJSONString, selectedItems];
}

function getPageHelp() {
    var JSONObject = app.JSONObject['screen'];
    var helpurl = (JSONObject.content.helpurl) ? JSONObject.content.helpurl : '';
    if (BRVUtil.checkValue(helpurl)) {
        getExternalPagePopup(helpurl, 'Help');
    }
}

function getExternalPage(buttonID, useFormFieldButtons) {
    // Get app JSON from app vars
    var objID = app.JSONObject['screen'].id;
    var JSONObject = app.JSONObject['screen'];

    var buttonName = '';
    var buttonExternalUrl = '';
    var buttonOBJ = (useFormFieldButtons) ? JSONObject.content.fields : JSONObject.content.buttons;
    if (typeof buttonOBJ != 'undefined') {
        for (var btni = 0; btni < buttonOBJ.length; btni++) {
            if (buttonID == buttonOBJ[btni].id) {
                buttonName = buttonOBJ[btni].name;
                buttonExternalUrl = buttonOBJ[btni].onclick.externalurl;
                break;
            }
        }
    }

    if (BRVUtil.checkValue(buttonExternalUrl) && BRVUtil.checkValue(buttonName)) {
        getExternalPagePopup(buttonExternalUrl, buttonName);
    }
}

function getExternalPagePopup(url, popupname) {
    var popupname = (popupname) ? popupname : '';
    if (BRVUtil.checkValue(url)) {

        // First remove old popup!
        $("#popupExternalPage").remove(); // Remve sensormenu first!

        // Create popup!
        setTimeout(function() {
            var popuptest = '';
            if (app.isBuilder) {
                popuptest += '<div data-role="popup" data-dialog="true" id="popupExternalPage">';
            } else {
                popuptest += '<div data-role="popup" data-dialog="true" id="popupExternalPage" data-dismissible="false" data-tolerance="0">';
            }
            popuptest += '    <div data-role="header">';
            popuptest += '    	<h1>' + popupname + '</h1>';
            popuptest += '    	<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-left">Close</a>';
            popuptest += '    </div>';
            popuptest += '    <div role="content" id="contentlist">';
            popuptest += '        <div>';
            popuptest += '			<iframe src="" name="iframe_popupExternalPage" id="iframe_popupExternalPage" style="border: 0px; overflow: scroll; overflow-x: hidden; overflow-y: hidden; display: block; "></iframe>';
            popuptest += '        </div>';
            popuptest += '    </div>';
            popuptest += '</div>';

            $('#page-home').append(popuptest);

            $('#popupExternalPage').trigger("create");

            $("[data-role=popup]").on("popupafterclose", function() {
                $(this).remove();
            }).on("popupafteropen", function() {}).popup({
                beforeposition: function() {
                    if (app.isBuilder) {
                        $(this).css({
                            width: $("#page-home").innerWidth() - 50,
                            height: $("#page-home").innerHeight() - 50,
                            maxheight: $("#page-home").innerHeight() - 50,
                            top: $("#toolbar").height()
                        });
                    } else {
                        var horizSpacing = 15;
                        var vertSpacing = 15;
                        var horizPaddingBorderSize = $(this).outerWidth() - $(this).width();
                        var vertPaddingBorderSize = $(this).outerHeight() - $(this).height();

                        $(this).css({
                            left: horizSpacing,
                            top: vertSpacing,
                            width: window.innerWidth - (horizSpacing * 2) - horizPaddingBorderSize,
                            height: window.innerHeight - (vertSpacing * 2) - vertPaddingBorderSize
                        });
                    }

                    /*					setTimeout(function (buttonExternalUrl) {
                    						var appHeight = $(window).height();
                    						var headerHeight = $('#header').height();
                    						var footerHeight = $('#footer').height();
                    						var popupHeight = appHeight - headerHeight - footerHeight;
                    			
                    						$('#iframe_popupExternalPage').css({
                    							left: 0,
                    							top: 0,
                    							width: '100%',
                    							height: popupHeight
                    						});
                    			
                    						$('#iframe_popupExternalPage').attr('src', buttonExternalUrl);
                    			
                    					}, 100, buttonExternalUrl);
                    */
                },
                x: 0,
                y: 0,
                // positionTo: "window",
                dismissible: false,
                history: false,
                transition: "slide",
                modal: true
                    //}).popup("open");
            }).popup(); // Do not open at this time, let's open it when some data has been loaded!


            setTimeout(function(url) {
                var appHeight = $(window).height();
                var headerHeight = $('#header').height();
                var footerHeight = $('#footer').height();
                var popupHeight = appHeight - headerHeight - footerHeight;

                $('#iframe_popupExternalPage').css({
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: popupHeight
                });

                $('#iframe_popupExternalPage').attr('src', url);

                // Open the hidden popup
                $("[data-role=popup]").popup("open");

            }, 150, url);

        }, 250);

    }

}

// function getExternalPage_old(buttonID, useFormFieldButtons) {
// 	// Get app JSON from app vars
// 	var objID 	   = app.JSONObject['screen'].id;
// 	var JSONObject = app.JSONObject['screen'];

// 	var buttonName = '';
// 	var buttonExternalUrl = '';
// 	var buttonOBJ = (useFormFieldButtons) ? JSONObject.content.fields : JSONObject.content.buttons;
// 	if (typeof buttonOBJ != 'undefined') {
// 		for (var btni = 0; btni < buttonOBJ.length; btni++) {
// 			if (buttonID == buttonOBJ[btni].id) {
// 				buttonName		  = buttonOBJ[btni].name;
// 				buttonExternalUrl = buttonOBJ[btni].onclick.externalurl;
// 				break;
// 			}
// 		}
// 	}


// 	if ( BRVUtil.checkValue(buttonExternalUrl) ) {
// 		$("#popupExternalPage").remove(); 

// 		var output = '';
// //			output += '<div data-role="page" data-dialog="true" id="externalPage" isPopupScreen="true">';
// 			output += '<div data-role="popup" data-dialog="true" id="popupExternalPage" data-dismissible="false" data-tolerance="0">';
// 			output += '    <div data-role="header">';
// 			output += '    	<h2>'+buttonName+'</h2>';
// 			output += '    </div>';
// 			// output += '    <div class="ui-content" role="main">';
// 			output += '    <div class="" role="main">';
// 			output += '        <div>';
// 			output += '			<iframe src="" name="iframe_popupExternalPage" id="iframe_popupExternalPage" style="border: 0px; overflow: scroll; overflow-x: hidden; overflow-y: hidden; display: block; "></iframe>';
// 			output += '        </div>';
// 			output += '    </div>';
// 			output += '</div>';
// 		($('#popupExternalPage').length == 0) ? $("body").append(output) : '';
// 		$(":mobile-pagecontainer").pagecontainer("change", "#popupExternalPage");
// //		$('#'+buttonName).attr('src', buttonExternalUrl);

// 		setTimeout(function (buttonExternalUrl) {

// 			var popupWidth = $('#content_table').width();

// 			var appHeight = $(window).height();
// 			var headerHeight = $('#header').height();
// 			var footerHeight = $('#footer').height();
// 			var popupHeight = appHeight - headerHeight - footerHeight;

// 			$('#iframe_popupExternalPage').css({
// 				left: 0,
// 				top: 0,
// 				width: '100%',
// 				height: popupHeight
// 			});

// 			$('#iframe_popupExternalPage').attr('src', buttonExternalUrl);

// 		}, 100, buttonExternalUrl);
// 	}
// }



function getUsrLinkDocument(jsonObj) {
    // var jsonObj = JSON.parse(b64_to_str(jsonObj));
    var jsonObj = BRVUtil.parseJSON(b64_to_str(jsonObj));
    var rec_id = jsonObj.rec_id;
    var tbl_name = jsonObj.tbl_name;
    var doc_desc = jsonObj.doc_desc;
    var link_file = jsonObj.link_file;
    var link_type = jsonObj.link_type;

    app.debug('FUNCTION: getUsrLinkDocument, link_type:' + link_type);

    switch (link_type) {
        case "EXTERNAL":
            /*
            {
            	"cng_date": "05-02-2020",
            	"doc_desc": "Factuur_202030023.pdf",
            	"link_file": "D:\\_BrancheView\\AV100_BRV_Gateway\\MOBGRD20\\documents\\Factuur_202030023.pdf",
            	"link_type": "EXTERNAL",
            	"rec_id": "_5W80LA348",
            	"tbl_name": "EXTERNAL"
            }
            */
            getDocumentFromServerFolder(link_file);
            break;

        case "USR_LINK_FILEMAP":
            getUsrLinkDocumentFromAV(rec_id);
            break;

        case "NEWVIEWS":
            getNewViewsDocument(link_file);
            break;

        case "BASECONE":
            getBaseconeDocument(link_file);
            break;

        case "SCANB":
            getScanboekenDocument(link_file);
            break;

        default:
            getUsrLinkDocumentFromAV(rec_id);
            break;
    }
}

function getBaseconeDocument(docUrl) {
    app.debug('FUNCTION: getBaseconeDocument, docUrl:' + docUrl);
    // https://secure.basecone.com/Lookup?guid=AAWrKw==B18AD24F382F47E88695AD184D735076
    // https://secure.basecone.com/Lookup/GetDocumentImage?id=AAWrKw==B18AD24F382F47E88695AD184D735076
    // https://secure.basecone.com/Lookup/Download?externalId=AAWrKw==B18AD24F382F47E88695AD184D735076
    // var guid = BRVUtil.strExtract(docUrl, 'guid=', '');
    // docUrl = 'https://secure.basecone.com/Lookup/Download?externalId=' + guid
    var filename = app.defaultDocumentName; // Allways use the same filename
    BRVUtil.downloadFile(docUrl, filename, true);
}

function getNewViewsDocument(docUrl) {
    app.debug('FUNCTION: getNewViewsDocument, docUrl:' + docUrl);
    // https://my.newviews.nl/ArchiveReader.aspx?fn=1706071152370279144867.pdf
    var NVuser = app.GetFromPhoneStorage('nvuser');
    var NVpwd = app.GetFromPhoneStorage('nvpwd');
    var NVclnt = app.GetFromPhoneStorage('nvclnt');
    // var filename = docUrl.replace('https://my.newviews.nl/ArchiveReader.aspx?fn=', '');
    // var filename = BRVUtil.strExtract(docUrl, 'fn=', '');
    var filename = app.defaultDocumentName; // Allways use the same filename

    if (!BRVUtil.checkValue(NVuser) || !BRVUtil.checkValue(NVpwd) || !BRVUtil.checkValue(NVclnt)) {
        doNewViewsLogin(docUrl);
    } else {
        // jQuery.post( "https://my.newviews.nl/default.aspx", { Username: "brancheview", Password: "wachtwoord", Clientname: "nvdemo", Securitycode: "389&*aT" } )
        jQuery.post("https://my.newviews.nl/default.aspx", { Username: NVuser, Password: NVpwd, Clientname: NVclnt, Securitycode: "389&*aT" })
            .done(function(data) {
                var body = BRVUtil.strExtract(data, '<body', '</body>').toLowerCase();
                if (body.indexOf('_username') >= 0 && body.indexOf('_password') >= 0 && body.indexOf('_clientname') >= 0) { // Check if body of html page does contain one of these labels.
                    // Remove Newviews credentials
                    app.RemoveFromPhoneStorage('nvuser');
                    app.RemoveFromPhoneStorage('nvpwd');
                    app.RemoveFromPhoneStorage('nvclnt');
                    app.debug("DizzyData login failed!!!");
                    app.showMessage('INVALID_CREDENTIALS');
                    setTimeout(function() {
                        // Reload Newviews login screen
                        doNewViewsLogin(docUrl);
                    }, 1000);
                } else {
                    // Open document
                    app.debug("DizzyData login success!!!");
                    app.debug("Get document");
                    app.debug(docUrl);
                    BRVUtil.downloadFile(docUrl, filename, true);
                }
            });
    }
}

function doNewViewsLogin(docUrl) {
    app.debug('FUNCTION: doNewViewsLogin, docUrl:' + docUrl);
    var NewViewsLogin = '';
    NewViewsLogin += '<div data-role="page" data-dialog="true" id="newviewslogin" isPopupScreen="true">';
    NewViewsLogin += '    <div data-role="header">';
    NewViewsLogin += '    	<h2>DizzyData login</h2>';
    NewViewsLogin += '    </div>';
    NewViewsLogin += '    <div class="ui-content" role="main">';
    NewViewsLogin += '    <form>';
    NewViewsLogin += '        <div>';
    NewViewsLogin += '            <p>Voer hier uw DizzyData gegevens in om het document op te halen.</p>';
    NewViewsLogin += '            <label for="nvclnt" class="ui-hidden-accessible">Client:</label>';
    NewViewsLogin += '            <input name="client" id="nvclnt" value="" placeholder="client" data-theme="a" type="text">';
    NewViewsLogin += '            <label for="nvuser" class="ui-hidden-accessible">Gebruikersnaam:</label>';
    NewViewsLogin += '            <input name="user" id="nvuser" value="" placeholder="gebruikersnaam" data-theme="a" type="text">';
    NewViewsLogin += '            <label for="nvpwd" class="ui-hidden-accessible">Wachtwoord:</label>';
    NewViewsLogin += '            <input name="pass" id="nvpwd" value="" placeholder="wachtwoord" data-theme="a" type="password">';
    NewViewsLogin += '            <button id="nvloginbutton" type="button" onclick="javascript:tryNewViewsLogin(\'' + docUrl + '\')">Inloggen</button>';
    NewViewsLogin += '        </div>';
    NewViewsLogin += '    </form>';
    NewViewsLogin += '    </div>';
    NewViewsLogin += '</div>';
    ($('#newviewslogin').length == 0) ? $("body").append(NewViewsLogin): '';
    $(":mobile-pagecontainer").pagecontainer("change", "#newviewslogin");
    //	$('#nvloginbutton').removeClass('ui-corner-all');
}

function tryNewViewsLogin(docUrl) {
    app.debug('FUNCTION: tryNewViewsLogin, docUrl:' + docUrl);
    // jQuery.mobile.back();	// Go back one page

    var NVuser = $('#nvuser').val();
    var NVpwd = $('#nvpwd').val();
    var NVclnt = $('#nvclnt').val();

    app.AddToPhoneStorage('nvuser', NVuser);
    app.AddToPhoneStorage('nvpwd', NVpwd);
    app.AddToPhoneStorage('nvclnt', NVclnt);

    if (!BRVUtil.checkValue(NVuser) || !BRVUtil.checkValue(NVpwd) || !BRVUtil.checkValue(NVclnt)) {
        app.showMessage('EMPTY_CREDENTIALS');
    } else {
        jQuery.mobile.back(); // Go back one page
        setTimeout(function() {
            getNewViewsDocument(docUrl);
        }, 500);
    }
}


function getScanboekenDocument(docID) {
    app.debug('FUNCTION: getScanboekenDocument, docID:' + docID);
    app.loadMessage = 'DOWNLOADFILE';
    var query = '    {' +
        '        "SetOption": [' +
        '		{"Name": "doc_id", "Value": "' + docID + '"}' +
        '        ]' +
        '    }';
    if (BRVUtil.checkValue(docID)) {
        app.wsErrorCode = 'A007';
        app.doRequestGWRWAW(query, app.WEPID_MOBILE, 'GET_SCANBOEKEN_DOCUMENT', showgetScanboekenDocument, showWSError);
    }
}

function showgetScanboekenDocument(data, status, req) {
    // app.debug('FUNCTION: showgetScanboekenDocument, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showgetScanboekenDocument, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {
        var jsonData = returnjsonData(req);
        var jsonRecords = jsonData.response.responsedata;

        // Document data
        var doc_id = jsonRecords.doc_id;
        // var link_file = jsonRecords.link_file;
        var link_file = app.defaultDocumentName; // Allways use the same filename
        var content = jsonRecords.content;
        BRVUtil.saveToLocalFileAndOpen(link_file, content);
    }
}


function getDocumentFromServerFolder(link_file) {
    app.debug('FUNCTION: getDocumentFromServerFolder, link_file:' + link_file);
    app.loadMessage = 'DOWNLOADFILE';

    // In this case link_file will contain full path to file, '\' signs seems to be getting lost in WS communication.
    // so, convert link_file to B64 string and add '~' add start of string. WEP checks for '~' sign at beginning of link_file param.
    link_file = '~' + str_to_b64(link_file);

    var query = '    {' +
        '        "SetOption": [' +
        '		{"Name": "link_file", "Value": "' + link_file + '"}' +
        '        ]' +
        '    }';
    if (BRVUtil.checkValue(link_file)) {
        app.wsErrorCode = 'A016';
        app.doRequestGWRWAW(query, app.WEPID_MOBILE, 'GET_SERVER_DOCUMENT', showgetDocumentFromServerFolder, showWSError);

        // Just for testing!!
        //app.doRequestGWRWAW(query, 'MOBILETEST', 'GET_SERVER_DOCUMENT', showgetDocumentFromServerFolder, showWSError);
    }

}

function showgetDocumentFromServerFolder(data, status, req) {
    app.debug('FUNCTION: showgetDocumentFromServerFolder, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {
        var jsonData = returnjsonData(req);
        var jsonRecords = jsonData.response.responsedata;

        // Document data
        //var file_ext = BRVUtil.file_get_ext(jsonRecords.link_file);
        //var link_file = app.defaultDocumentNameWOext+'.'+file_ext;
        var link_file = jsonRecords.link_file;
        var content = jsonRecords.content;

        BRVUtil.saveToLocalFileAndOpen(link_file, content);
    }
}

function getUsrLinkDocumentFromAV(docID) {
    app.debug('FUNCTION: getUsrLinkDocument, docID:' + docID);
    app.loadMessage = 'DOWNLOADFILE';
    var query = '    {' +
        '        "SetOption": [' +
        '		{"Name": "doc_id", "Value": "' + docID + '"}' +
        '        ]' +
        '    }';
    if (BRVUtil.checkValue(docID)) {
        // clearTimeout(this.timeoutHandler);	// Clear timeouthandler, find other solution for big documents on slow connections.
        app.wsErrorCode = 'A008';
        app.doRequestGWRWAW(query, app.WEPID_MOBILE, 'GET_LINKED_DOCUMENT', showgetUsrLinkDocument, showWSError);
    }
}

function showgetUsrLinkDocument(data, status, req) {
    // app.debug('FUNCTION: showgetUsrLinkDocument, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showgetUsrLinkDocument, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {
        var jsonData = returnjsonData(req);
        var jsonRecords = jsonData.response.responsedata;

        // Document data
        var doc_id = jsonRecords.doc_id;
        // var link_file = jsonRecords.link_file;
        // var link_file = app.defaultDocumentName;	// Allways use the same filename

        var file_ext = BRVUtil.file_get_ext(jsonRecords.link_file);
        var link_file = app.defaultDocumentNameWOext + '.' + file_ext;
        var content = jsonRecords.content;

        BRVUtil.saveToLocalFileAndOpen(link_file, content);
    }
}

function delUsrLinkDocument(jsonObj) {
    app.debug('FUNCTION: delUsrLinkDocument');
    var message = app.translateMessage('DELETEUSRLINKQ');
    jQuery.confirm({
        title: '&nbsp;',
        content: message,
        buttons: {
            ja: function() {
                delUsrLink(jsonObj);
            },
            nee: function() {}
        }
    });
}

function delUsrLink(jsonObj) {
    // var jsonObj = JSON.parse(b64_to_str(jsonObj));
    var jsonObj = BRVUtil.parseJSON(b64_to_str(jsonObj));
    var rec_id = jsonObj.rec_id;
    // var tbl_name = jsonObj.tbl_name;
    // var doc_desc = jsonObj.doc_desc;
    // var link_file = jsonObj.link_file;
    // var link_type = jsonObj.link_type;

    app.debug('FUNCTION: delUsrLink, docID:' + rec_id);
    app.loadMessage = 'DELETEUSRLINK';

    var query = '    {' +
        '        "SetOption": [' +
        '		{"Name": "rec_id", "Value": "' + rec_id + '"}' +
        '        ]' +
        '    }';
    if (BRVUtil.checkValue(rec_id)) {
        // clearTimeout(this.timeoutHandler);	// Clear timeouthandler, find other solution for big documents on slow connections.
        app.wsErrorCode = 'A009';
        app.doRequestGWRWAW(query, app.WEPID_MOBILE, 'DEL_LINKED_DOCUMENT', showdelUsrLinkDocument, showWSError);
    }
}

function showdelUsrLinkDocument(data, status, req) {
    // app.debug('FUNCTION: showdelUsrLinkDocument, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showdelUsrLinkDocument, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {
        var jsonData = returnjsonData(req);
        var jsonRecords = jsonData.response.responsedata;
        var responseValue = jsonRecords.responsevalue;
        if (responseValue.toUpperCase() == 'OK') {
            var rec_id = jsonRecords.rec_id;
            $('#' + rec_id).remove();
        } else {
            app.showMessage('DELETEUSRLINKFAILED');
        }
    }
}

function success() {
    app.debug('FUNCTION: success');
}

function error(code) {
    app.debug('FUNCTION: error, code:' + code);
    if (code === 1) {
        app.showError('NO_FILE_HANDLER_FOUND', 'function: openLocalFile');
    } else {
        app.showError('UNDEFINED_ERROR', 'function: openLocalFile');
    }
}

function setSelectValue(ValuesJSON, targetID, JSONObject, hideKeyValue, initValue) {
    // app.debug('FUNCTION: setSelectValue, ValuesJSON:'+ValuesJSON+', targetID:'+targetID+', JSONObject:'+JSONObject+', hideKeyValue:'+hideKeyValue+', initValue:'+initValue);
    app.debug('FUNCTION: setSelectValue, targetID:' + targetID + ', hideKeyValue:' + hideKeyValue + ', initValue:' + initValue);

    // Set select list value from json
    var targetID = targetID.replace("select_", "");
    var fldKeyField = '';
    var fldDispField = '';
    // Find keyfield in json

    for (var i = 0; i < JSONObject.length; i++) {
        if (JSONObject[i].id == targetID) {

            fldKeyField = JSONObject[i].keyfield;
            fldDispField = JSONObject[i].dispfield;
            hideKeyValue = BRVUtil.checkValue(JSONObject[i].hidekeyvalue) ? BRVUtil.isBool(JSONObject[i].hidekeyvalue) : hideKeyValue;

            $("#" + targetID).find('option:not(:first)').remove();
            $("#" + targetID).find('option:first').attr("selected", "selected");
            break;
        }
    }

    var output = '';
    var tmpKey = '';
    var tmpValue = '';
    var tmpValue2 = '';

    for (var i = 0; i < ValuesJSON.length; i++) {
        tmpKey = '';
        tmpValue = '';
        tmpValue2 = '';
        for (var fld in ValuesJSON[i]) {
            var field = [fld][0];
            var fieldvalue = ValuesJSON[i][fld];
            if (field == fldKeyField) {
                tmpKey = fieldvalue;
            } else
            if (field == fldDispField) {
                tmpValue = fieldvalue;
            } else {
                tmpValue2 = fieldvalue;
            }
        }
        if (tmpValue == '') {
            tmpValue = tmpValue2;
        }

        // if ( BRVUtil.isBool(hideKeyValue) ) {
        if (hideKeyValue) {
            output = output + '<option value="' + tmpKey + '" jsonValues="' + str_to_b64(JSON.stringify(ValuesJSON[i])) + '">' + tmpValue + '</option>';
        } else {
            output = output + '<option value="' + tmpKey + '" jsonValues="' + str_to_b64(JSON.stringify(ValuesJSON[i])) + '">' + tmpKey + ' | ' + tmpValue + '</option>';
        }
    }

    $("#" + targetID).append(output);
    $("#" + targetID).trigger("create"); // Recreate the object, apply styles
    $("#" + targetID).find('option[value="' + initValue + '"]').attr("selected", "selected");
    try {
        //		$("#" + targetID).selectmenu('refresh', true);
        $("#" + targetID).selectmenu('refresh');
    } catch (e) {}

    // Find selectboxes
    // $('[type=select]').each(function () {
    // var curId = '#' +  this.id;
    // $(curId).parent().css({"border-radius":"3px !important"});
    // });
    //
}

// function setSelectList(callBack) {
// 	app.debug('FUNCTION: setSelectList');
// 	for (var fldi = 0; fldi < app.SelectList.length; fldi++) {
// 		var fldID = app.SelectList[fldi][0];
// 		var fldValue = app.SelectList[fldi][1];
// 		$('#' + fldID).val(fldValue).selectmenu('refresh');
// 	}
// 	app.SelectList = new Array();

// 	// Get result from buffered queries
// 	GetBufferedObjectQuery(callBack);
// }


function SaveFormData(buttonID, onFormSaveSuccessB64, useFormFieldButtons) {
    //
    // ToDo:  Add function so we can ask question before saving formdata!!
    //
    app.debug('FUNCTION: onFormSaveSuccessB64');
    app.loadMessage = 'SAVE_FORM_DATA';


    if (!checkButtonEmptyMandatoryFields(buttonID)) {

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];

        // var onFormSaveSuccess = JSON.parse(b64_to_str(onFormSaveSuccessB64));
        var onFormSaveSuccess = (onFormSaveSuccessB64) ? BRVUtil.parseJSON(b64_to_str(onFormSaveSuccessB64)) : null;

        var query = '';
        try {
            query = (BRVUtil.checkValue(JSONObject.content.querysave.query)) ? b64_to_str(JSONObject.content.querysave.query) : null;
        } catch (e) {}

        if (BRVUtil.checkValue(query)) {

            query = app.validateQuery(query); // Check if query does contain a valid select or setoption/setfield

            var queryAppID = JSONObject.content.querysave.appid;
            var queryReqID = JSONObject.content.querysave.wepid;
            var queryFields = JSONObject.content.querysave.queryfields;

            // Get question from button
            var buttonQuestion = '';
            var buttonCancelMsg = '';

            var buttonOBJ = (useFormFieldButtons) ? JSONObject.content.fields : JSONObject.content.buttons;

            if (typeof buttonOBJ != 'undefined') {
                for (var btni = 0; btni < buttonOBJ.length; btni++) {
                    if (buttonID == buttonOBJ[btni].id) {
                        buttonQuestion = buttonOBJ[btni].onclick.question;
                        buttonCancelMsg = buttonOBJ[btni].onclick.cancelmsg;
                        break;
                    }
                }
            }

            var objID = app.JSONObject['screen'].id;
            app.screenFormSaveSuccess[objID] = (BRVUtil.checkValue(onFormSaveSuccess)) ? onFormSaveSuccess : null;

            var fields = JSONObject.content.fields;
            var nfields = fields.length;
            for (var fldi = 0; fldi < nfields; fldi++) {
                var fldID = fields[fldi].id;
                // var fldName = fields[fldi].name;
                var fldType = fields[fldi].type;
                // var fldLength = fields[fldi].length;

                // Check if it's <p> then get text, else get val
                // if ( $('#' + fldID).is("p") ) {
                // 	fldValue = $('#' + fldID).text();
                // } else {
                // 	fldValue = $('#' + fldID).val();
                // }

                if ($('#' + fldID).is("p")) {
                    fldValue = $('#' + fldID).text();
                } else if ($('#' + fldID).is(':checkbox')) {
                    fldValue = $('#' + fldID).prop('checked') ? 'on' : 'off';
                } else {
                    fldValue = $('#' + fldID).val();
                }

                // switch (fldType) {
                // 	case "date":
                // 		if ( BRVUtil.checkValue(fldValue) ) {
                // 			if (fldValue.indexOf('T') > -1) {
                // 				// 2016-06-21T00:00:00+02:00
                // 				fldValue = BRVUtil.ISOdateToStr(fldValue);
                // 			}

                // 			// Format date to yyyy-mm-dd hh:mm:ss
                // 			// var sDay 		= fldValue.substr(0, 2);
                // 			// var sMonth	= fldValue.substr(3, 2);
                // 			// var sYear		= fldValue.substr(6);

                // 			var tmpDate = fldValue.split('-');
                // 			var sDay 	= BRVUtil.padl(tmpDate[0], '0', 2);
                // 			var sMonth	= BRVUtil.padl(tmpDate[1], '0', 2);
                // 			var sYear	= tmpDate[2];
                // 			fldValue = ""+sYear+"-"+sMonth+"-"+sDay+" 00:00:00";
                // 		}
                // 		break;
                // 	default:
                // 		break;
                // }

                if (fldType == 'number' || fldType == 'currency') {
                    //Value has been formatted to be displayed correctly.
                    //But to save number or currency values we need to change xxx,xxx to xxx.xxx
                    //AV does only like decimals with . separator
                    //**************************************************************************
                    // console.log('fldID: ', fldID );
                    // console.log('fldValue: ', fldValue );

                    if (BRVUtil.checkValue(fldValue)) {
                        fldValue = BRVUtil.replaceAll(fldValue.toString(), ',', '.');
                    }

                    // console.log('fldValueNew: ', fldValue );
                }

                if (fldType == 'date') {
                    if (BRVUtil.checkValue(fldValue)) {
                        if (fldValue.indexOf('T') > -1) {
                            // 2016-06-21T00:00:00+02:00
                            fldValue = BRVUtil.ISOdateToStr(fldValue);
                        }

                        // Format date to yyyy-mm-dd hh:mm:ss
                        // var sDay 		= fldValue.substr(0, 2);
                        // var sMonth	= fldValue.substr(3, 2);
                        // var sYear		= fldValue.substr(6);

                        var tmpDate = '';
                        if (fldValue.indexOf('/') > 0) {
                            tmpDate = fldValue.split('/');
                        } else {
                            tmpDate = fldValue.split('-');
                        }

                        // var tmpDate = fldValue.split('-');
                        var sDay = BRVUtil.padl(tmpDate[0], '0', 2);
                        var sMonth = BRVUtil.padl(tmpDate[1], '0', 2);
                        var sYear = tmpDate[2];
                        fldValue = "" + sYear + "-" + sMonth + "-" + sDay + " 00:00:00";
                    }
                }

                fldValue = BRVUtil.checkUnicode(fldValue);

                //Escape quotes
                fldValue = BRVUtil.escapeQuotes(fldValue);

                //Trim spaces
                fldValue = BRVUtil.alltrim(fldValue);

                query = BRVUtil.replaceAll(query, '<' + fldID + '>', fldValue);
            }


            //---

            // Replace vars from storage
            if (BRVUtil.checkValue(queryFields)) {
                var tmpQueryFields = queryFields.split('|');
                for (a = 0; a < tmpQueryFields.length; a++) {
                    if (BRVUtil.checkValue(tmpQueryFields[a])) {
                        var tmpQueryField = tmpQueryFields[a].split('=');
                        var searchFld = tmpQueryField[0];
                        var lcFldValue = '';
                        if (searchFld.substr(0, 1) == '*') { // Check if we need to find the field value in the localstorage
                            searchFld = searchFld.substr(1, searchFld.length);
                            lcFldValue = app.GetFromPhoneStorage(searchFld);
                            query = BRVUtil.replaceAll(query, '<' + searchFld + '>', lcFldValue);
                        }
                    }
                }
            }

            // Escape HTML-entities and CR/LF
            query = BRVUtil.escapeCRLF(query);
            query = BRVUtil.escapeHtmlEntities(query);

            if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID) && BRVUtil.checkValue(query)) {
                if (BRVUtil.checkValue(buttonQuestion)) {
                    jQuery.confirm({
                        title: '&nbsp;',
                        content: buttonQuestion,
                        buttons: {
                            ja: function() {
                                app.wsErrorCode = 'A010';
                                app.doRequestGWRWAW(query, queryAppID, queryReqID, SaveFormDataResult, showWSError);
                            },
                            nee: function() {
                                if (BRVUtil.checkValue(buttonCancelMsg)) {
                                    app.showMessage(buttonCancelMsg);
                                }
                            }
                        }
                    });
                } else {
                    app.wsErrorCode = 'A010';
                    app.doRequestGWRWAW(query, queryAppID, queryReqID, SaveFormDataResult, showWSError);
                }
            }
        }
    } else {
        // Do nothing!!!
    }
}

function SaveFormDataResult(data, status, req) {
    // app.debug('FUNCTION: SaveFormDataResult, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: SaveFormDataResult, status:' + status);

    // if (!CheckGWRWAWError(data, status, req) || app.isBuilder ) { 
    if (!CheckGWRWAWError(data, status, req)) {
        // Get app JSON from app vars
        // var JSONObject = app.JSONObject['screen'];
        var objID = app.JSONObject['screen'].id;

        var jsonData = returnjsonData(req);
        var jsonResponse = jsonData.response;

        var jsonRecords = jsonData.response.responsedata;
        var message = jsonRecords.message;
        var messagedetail = jsonRecords.messagedetail;
        var unmark = '';
        var doSuccess = true;

        if (BRVUtil.checkValue(message)) {
            message = app.translateMessage(message);
        }

        if (BRVUtil.checkValue(messagedetail)) {
            messagedetail = messagedetail.split(',');
            var returnMessage = '';
            for (var i = 0; i < messagedetail.length; i++) {
                returnMessage += (messagedetail.length > 1) ? '- ' : '';
                returnMessage += app.translateMessage(messagedetail[i]);
                returnMessage += '<br>';
            }
            message += '<br><br>';
            message += returnMessage;
            message += '<br>';
        }

        if (BRVUtil.checkValue(jsonRecords.result)) {
            switch (jsonRecords.result.toUpperCase()) {
                case "ERROR":
                    if (!BRVUtil.checkValue(message)) {
                        message = 'FAIL';
                    }
                    doSuccess = false;
                    break;

                case "DONE":
                    if (!BRVUtil.checkValue(message)) {
                        message = 'DONE';
                    }
                    break;

                default:
                    break;
            }
        }

        if (BRVUtil.checkValue(message)) {
            app.showMessage(message, null, false);
        }

        if (doSuccess) {
            var onFormSaveSuccess = '';
            var onFormSaveSuccessAction = '';
            var onFormSaveSuccessScreen = '';
            var onFormSaveSuccessScreenMode = '';
            var onFormSaveSuccessScreenParams = '';
            if (typeof app.screenFormSaveSuccess[objID] == 'object') {
                onFormSaveSuccess = app.screenFormSaveSuccess[objID];
                if (BRVUtil.checkValue(onFormSaveSuccess)) {
                    onFormSaveSuccessAction = BRVUtil.checkValue(onFormSaveSuccess.action) ? onFormSaveSuccess.action : '';
                    onFormSaveSuccessScreen = BRVUtil.checkValue(onFormSaveSuccess.screen) ? onFormSaveSuccess.screen : '';
                    onFormSaveSuccessScreenMode = BRVUtil.checkValue(onFormSaveSuccess.screenmode) ? onFormSaveSuccess.screenmode : '';
                    onFormSaveSuccessScreenParams = BRVUtil.checkValue(onFormSaveSuccess.screenparam) ? onFormSaveSuccess.screenparam : '';

                }
            }

            if (onFormSaveSuccessAction == 'GotoScreen' && onFormSaveSuccessScreen != '') {

                app.removeLastPageRoute(objID); // Remove current screen first.

                // Replace parameters with response values
                for (var fld in jsonResponse.responsedata) {
                    var fldID = fld;
                    var fldValue = jsonResponse.responsedata[fld];
                    onFormSaveSuccessScreenParams = onFormSaveSuccessScreenParams.replace('<' + fldID + '>', fldValue);
                }

                // Replace some vars in onFormSaveSuccessScreenParams with values from app.paramObject
                if (app.paramObject) {
                    var buttonScreenParams = onFormSaveSuccessScreenParams.split('|');
                    for (a = 0; a < buttonScreenParams.length; a++) {
                        if (BRVUtil.checkValue(buttonScreenParams[a])) {
                            var buttonScreenParam = buttonScreenParams[a].split('=');
                            var searchFld = buttonScreenParam[0];
                            onFormSaveSuccessScreenParams = onFormSaveSuccessScreenParams.replace('<' + searchFld + '>', app.paramObject[searchFld]);
                        }
                    }
                }
                var param = (onFormSaveSuccessScreenParams != '') ? 'b64|' + str_to_b64(onFormSaveSuccessScreenParams) : '';
                // Goto screen with new parameters
                getScreenFromJSON(onFormSaveSuccessScreen, param, '' + onFormSaveSuccessScreenMode + '');
            } else {
                // It was success and we don't need to go to other screen.
                // Check if we need to set focus to a field in this form!
                ResetFieldFocus();
            }
        }
    }
}


function GetBindObjectPopup(obj) {
    app.debug('FUNCTION: GetBindObjectPopup');
    app.curObj = obj;

    obj.blur(); // First blur the object, so popup will resize to full screen instead of fullscreen-keypadheight!!

    // Restore orig footer height
    /*	var footerHeight = $("#footer").attr("origheight");
    	if (typeof footerHeight != 'undefined') {
    		//console.log('footerHeight: ', footerHeight); 
    		$('#footer').css({
    			height: footerHeight
    		});
    	}*/

    setTimeout(function() {
        popupLiveGrid();
    }, 200);

}

function popupLiveGrid() {
    app.debug('FUNCTION: popupLiveGrid');
    obj = app.curObj;
    app.tmpFrmData = new Array();

    var orientation = '';
    if (BRVUtil.isBrowser()) {
        orientation = parent.$("#tabletDiv").attr('class');
    }

    // var srcFld 			= $('#'+obj.id);
    var srcValue = $('#' + obj.id).val();
    // var targetFld 		= $('#'+obj.id+ '_result');
    var objectKey = $('#' + obj.id).attr('objectKey');

    // Save some formdata to pp.tmpFrmData so we can use this later!!!
    var tmpCheckFields = app.BindObjectQueries[objectKey][1][0].checkfield;

    if (BRVUtil.checkValue(tmpCheckFields)) {
        tmpCheckFields = tmpCheckFields.split('|');
        for (a = 0; a < tmpCheckFields.length; a++) {
            if (BRVUtil.checkValue(tmpCheckFields[a])) {
                var tmpCheckField = tmpCheckFields[a].split('=');
                var searchFld = tmpCheckField[0];
                var formFldValue = $('#' + searchFld).val();
                BRVUtil.addToArray(app.tmpFrmData, searchFld, formFldValue);
            }
        }
    }
    app.resetLiveScrolling();


    // First remove old popup!
    $("#popupLiveGrid").remove(); // Remve sensormenu first!

    // Create popup!
    setTimeout(function() {
        var popupname = app.BindObjectQueries[objectKey][1][0].name;
        var popuptest = '';
        if (app.isBuilder) {
            popuptest += '<div data-role="popup" data-dialog="true" id="popupLiveGrid">';
        } else {
            popuptest += '<div data-role="popup" data-dialog="true" id="popupLiveGrid" data-dismissible="false" data-tolerance="0">';
        }
        popuptest += '    <div data-role="header">';
        popuptest += '    	<h1>Selecteer ' + popupname + '</h1>';
        popuptest += '    	<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-left">Close</a>';
        popuptest += '    </div>';
        if (BRVUtil.checkValue(app.BindObjectQueries[objectKey][1][0].query.search)) {
            popuptest += '	<div id="searchdiv">';
            popuptest += '		<input type="search" id="' + obj.id + '_search" name="' + obj.id + '_search" value="' + srcValue + '" data-mini="true" class="ui-shadow">';
            popuptest += '	</div>';
        }
        popuptest += '    <div role="content" id="contentlist">';
        popuptest += '		<ul data-role="listview" id="' + obj.id + '_result" name="' + obj.id + '_result" data-scroll="true" data-autodividers="false">';
        popuptest += '		</ul>';
        popuptest += '    </div>';
        popuptest += '</div>';

        $('#page-home').append(popuptest);

        $('#popupLiveGrid').trigger("create"); // Just create of trigger 'maps_popup'! 

        $("[data-role=popup]").on("popupafterclose", function() {
            $(this).remove();
        }).on("popupafteropen", function() {

            /*            $('#popupLiveGrid-popup').css("z-index","10000");*/


            // If it's browser version in landscape mode, then put popup to the right!
            if (BRVUtil.isBrowser()) {
                if (orientation == 'landscape') {
                    $('#popupLiveGrid-popup').css({ left: 'initial' });
                    $('#popupLiveGrid-popup').css({ right: '0px' });

                    var resizeTimer;
                    $(window).on('resize', function(e) {
                        clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(function() {
                            $('#popupLiveGrid-popup').css({ left: 'initial' });
                            $('#popupLiveGrid-popup').css({ right: '0px' });
                        }, 250);
                    });
                }
            }

        }).popup({
            beforeposition: function() {
                if (app.isBuilder) {
                    $(this).css({
                        width: $("#page-home").innerWidth() - 50,
                        height: $("#page-home").innerHeight() - 50,
                        maxheight: $("#page-home").innerHeight() - 50,
                        top: $("#toolbar").height()
                    });
                } else {

                    if (BRVUtil.isBrowser()) {

                        $(this).css({
                            width: (orientation == 'landscape') ? window.innerWidth / 2.2 : window.innerWidth,
                            height: window.innerHeight - 0,
                            top: 0
                        });

                    } else {
                        var horizSpacing = 15;
                        var vertSpacing = 15;
                        var horizPaddingBorderSize = $(this).outerWidth() - $(this).width();
                        var vertPaddingBorderSize = $(this).outerHeight() - $(this).height();

                        $(this).css({
                            left: horizSpacing,
                            top: vertSpacing,
                            width: window.innerWidth - (horizSpacing * 2) - horizPaddingBorderSize,
                            height: window.innerHeight - (vertSpacing * 2) - vertPaddingBorderSize
                        });
                    }

                }
            },
            x: 0,
            y: 0,
            //positionTo: "window",
            dismissible: false,
            history: false,
            transition: "slide",
            modal: true
                // }).popup("open");
        }).popup(); // Do not open at this time, let's open it when some data has been loaded!

        // Load first set of data
        setTimeout(function(obj) {
            var page = (app.isBuilder) ? $("#page-home").height() : jQuery.mobile.getScreenHeight();
            var header = $(".ui-header").outerHeight();
            var search = $(".ui-input-search").outerHeight();

            //				 page = (page/100)*90;
            page = (page / 100) * 95;
            var maxHeight = page - header - search;

            $('#contentlist').css('min-height', maxHeight + 'px');
            $('#contentlist').css('max-height', maxHeight + 'px');
            $('#contentlist').css('overflow-y', 'scroll');

            $("#contentlist").unbind('scroll'); // First unbind event

            $("#contentlist").scroll(function() {
                var scrollTop = $(this).scrollTop();
                if (Math.round(scrollTop) + Math.round($(this).innerHeight()) >= Math.round(this.scrollHeight)) {
                    // Call function to get data from Webservice
                    app.iOffset = app.iOffset + app.iPageSize;
                    if ((app.iOffset <= app.iRecordCount) && (app.iCurrentPage <= app.iPageCount - 1)) {
                        getPopupLiveGridData();
                    }
                } else if (scrollTop <= 0) {}
            });
            getPopupLiveGridData();

            //Bind event on search box
            var srcField = obj.id + "_search";
            $('#' + srcField).bind("change", function(event, ui) {
                // Reset the livescolling vars
                app.resetLiveScrolling();

                // Clear grid
                $("#" + obj.id + '_result').html('');

                // Get new grid data
                getPopupLiveGridData();

                setTimeout(function(srcField) {
                    $("#" + srcField).blur(); // To hide the keyboard.
                }, 100, srcField);
            });

        }, 100, obj);

    }, 250);
}

// function popupLiveGrid_old() {
// 	app.debug('FUNCTION: popupLiveGrid');
// 	obj = app.curObj;
// 	app.tmpFrmData = new Array();

// 	// var srcFld 			= $('#'+obj.id);
// 	var srcValue 		= $('#'+obj.id).val();
// 	// var targetFld 		= $('#'+obj.id+ '_result');
// 	var objectKey 	= $('#'+obj.id).attr('objectKey');

// 	// Save some formdata to pp.tmpFrmData so we can use this later!!!
// 	var tmpCheckFields	= app.BindObjectQueries[objectKey][1][0].checkfield;

// 	if (BRVUtil.checkValue(tmpCheckFields)) {
// 		tmpCheckFields = tmpCheckFields.split('|');
// 		for (a = 0; a < tmpCheckFields.length; a++) {
// 			if (BRVUtil.checkValue(tmpCheckFields[a])) {
// 				var tmpCheckField = tmpCheckFields[a].split('=');
// 				var searchFld = tmpCheckField[0];
// 				var formFldValue = $('#' + searchFld).val();
// 				BRVUtil.addToArray(app.tmpFrmData, searchFld, formFldValue);
// 			}
// 		}
// 	}

// 	app.resetLiveScrolling();

// 	var popupname = app.BindObjectQueries[objectKey][1][0].name;
// 	var popuptest = '';
// 			popuptest += '<div data-role="page" data-dialog="true" id="popupLiveGrid"  isPopupScreen="true">';
// 			popuptest += '    <div data-role="header">';
// 			popuptest += '    	<h1>Selecteer '+popupname+'</h1>';
// 			popuptest += '    </div>';
// 			if (BRVUtil.checkValue(app.BindObjectQueries[objectKey][1][0].query.search)) {
// 				popuptest += '	<div id="searchdiv">';
// 				popuptest += '		<input type="search" id="' +obj.id+ '_search" name="' +obj.id+ '_search" value="'+srcValue+'" data-mini="true" class="ui-shadow">';
// 				popuptest += '	</div>';
// 			}
// 			popuptest += '    <div role="content" id="contentlist">';
// 			popuptest += '		<ul data-role="listview" id="' +obj.id+ '_result" name="' +obj.id+ '_result" data-scroll="true" data-autodividers="false">';
// 			popuptest += '		</ul>';
// 			popuptest += '    </div>';
// 			popuptest += '</div>';

// 	if ($('#popupLiveGrid').length == 0) {
// 		$("body").append(popuptest);	// Create new list
// 	} else {
// 		$('#popupLiveGrid').remove();	// Remove old list.
// 		$("body").append(popuptest);	// Create new list
// 	}

// 	var page  = jQuery.mobile.getScreenHeight();
// 	var header = $(".ui-header").outerHeight();
// 	var search = $(".ui-input-search").outerHeight();
// 	page = (page/100)*90;
// 	var maxHeight = page - header - search;

// 	$('#contentlist').css('min-height', maxHeight + 'px');
// 	$('#contentlist').css('max-height', maxHeight + 'px');
// 	$('#contentlist').css('overflow-y', 'scroll'); 

// 	$("#contentlist").unbind('scroll'); // First unbind event

// 	$("#contentlist").scroll(function () {
// 		var scrollTop = $(this).scrollTop();
// 		if (scrollTop + $(this).innerHeight() >= this.scrollHeight) {
// 			// Call function to get data from Webservice
// 			app.iOffset = app.iOffset + app.iPageSize;
// 			if ((app.iOffset <= app.iRecordCount) && (app.iCurrentPage <= app.iPageCount - 1)) {
// 				getPopupLiveGridData();
// 			}
// 		} else if (scrollTop <= 0) {
// 		}
// 	});
// 	$(":mobile-pagecontainer").pagecontainer("change", "#popupLiveGrid");

// 	getPopupLiveGridData();

// 	//Bind event on search box
// 	var srcField = obj.id + "_search";
// 	$('#' + srcField).bind("change", function (event, ui) {
// 		// Reset the livescolling vars
// 		app.resetLiveScrolling();

// 		// Clear grid
// 		$("#" + obj.id+ '_result').html('');

// 		// Get new grid data
// 		getPopupLiveGridData();

// 		setTimeout(function () {
// 			$("#"+srcField).blur();	// To hide the keyboard.
// 		}, 100);
// 	});
// }
function getPopupLiveGridData() {
    app.debug('FUNCTION: getPopupLiveGridData');
    obj = app.curObj;

    // var srcFld 			= $('#'+obj.id);
    // var srcValue 		= $('#'+obj.id).val();
    // var targetFld 		= $('#'+obj.id+ '_result');
    var objectKey = $('#' + obj.id).attr('objectKey');

    var fldID = app.BindObjectQueries[objectKey][1][0].id;
    // var fldType 		= app.BindObjectQueries[objectKey][1][0].type;
    // var fldKeyField		= app.BindObjectQueries[objectKey][1][0].keyfield;
    var fldqueryObj = app.BindObjectQueries[objectKey][1][0].query;
    var tmpCheckFields = app.BindObjectQueries[objectKey][1][0].checkfield;
    // var fldquery = '';
    var queryWhere = '';

    var query = null;
    var queryWhere = null;
    var queryFileFields = '';
    if (BRVUtil.checkValue(fldqueryObj.query)) {
        query = (BRVUtil.checkValue(fldqueryObj.query)) ? b64_to_str(fldqueryObj.query) : '';
        queryAppID = fldqueryObj.appid;
        queryReqID = fldqueryObj.wepid;
        queryFields = fldqueryObj.queryfields;
        queryFileFields = queryFileFields + fldqueryObj.filefields;
        queryWhere = (BRVUtil.checkValue(fldqueryObj.querywhere)) ? b64_to_str(fldqueryObj.querywhere) : '';

        // Get formdata from app.tmpFrmData
        if (BRVUtil.checkValue(tmpCheckFields)) {
            tmpCheckFields = tmpCheckFields.split('|');
            for (a = 0; a < tmpCheckFields.length; a++) {
                if (BRVUtil.checkValue(tmpCheckFields[a])) {
                    var tmpCheckField = tmpCheckFields[a].split('=');
                    var searchFld = tmpCheckField[0];
                    var formFldValue = BRVUtil.getValueFromArray(app.tmpFrmData, searchFld);
                    queryWhere = BRVUtil.replaceAll(queryWhere, '<' + searchFld + '>', formFldValue);

                    // Also replace values in query ????
                    query = BRVUtil.replaceAll(query, '<' + searchFld + '>', formFldValue);

                }
            }
        }

        if (app.paramObject) {
            if (BRVUtil.checkValue(queryFields)) {
                var tmpQueryFields = queryFields.split('|');
                for (a = 0; a < tmpQueryFields.length; a++) {
                    if (BRVUtil.checkValue(tmpQueryFields[a])) {
                        var tmpQueryField = tmpQueryFields[a].split('=');
                        var searchFld = tmpQueryField[0];
                        var lcFldValue = '';
                        if (searchFld.substr(0, 1) == '*') { // Check if we need to find the field value in the localstorage
                            searchFld = searchFld.substr(1, searchFld.length);
                            lcFldValue = app.GetFromPhoneStorage(searchFld);
                        } else { // Get field value from form
                            lcFldValue = app.paramObject[searchFld];
                        }
                        queryWhere = BRVUtil.replaceAll(queryWhere, '<' + searchFld + '>', lcFldValue);

                        // Also replace values in query ????
                        query = BRVUtil.replaceAll(query, '<' + searchFld + '>', lcFldValue);
                    }
                }
            }
        }

        // Add search values to queryWhere
        if (BRVUtil.checkValue(fldqueryObj.search)) {
            if (fldqueryObj.search.searchfields.length > 0) {
                var srcField = fldID + "_search";
                var srcFieldValue = $('#' + srcField).val();
                srcFieldValue = BRVUtil.checkUnicode(srcFieldValue);
                srcFieldValue = BRVUtil.escapeQuotes(srcFieldValue);

                // var tmpSrcFields = fldqueryObj.search.searchfields.split('|');
                var tmpSrcFields = fldqueryObj.search.searchfields;

                //Add (multi)search to queryWhere
                queryWhere = AddSearchToQueryWhere(queryWhere, srcFieldValue, tmpSrcFields);

                // if (srcFieldValue != '') {
                // 	if (queryWhere == '') {
                // 		queryWhere = ' .T. ';
                // 	}
                // 	queryWhere = queryWhere + ' AND ( ';
                // 	for (a = 0; a < tmpSrcFields.length; a++) {
                // 		if (BRVUtil.checkValue(tmpSrcFields[a])) {
                // 			if (a == 1) {
                // 				//queryWhere = queryWhere + ' AND ';
                // 			} else {
                // 				queryWhere = queryWhere + ' OR ';
                // 			}
                // 			queryWhere = queryWhere + "  UPPER([" + srcFieldValue + "]) $ UPPER(" + tmpSrcFields[a] + ") ";
                // 		}
                // 	}
                // 	queryWhere = queryWhere + ' ) ';
                // }
            }
        }
        query = query.replace('<where>', queryWhere);
    }

    if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID) && BRVUtil.checkValue(query)) {
        app.curObj = obj;
        app.wsErrorCode = 'A011';
        app.doRequestGWRWAW(query, queryAppID, queryReqID, showPopupLiveGridData, showWSError, '', queryFileFields);
    }
}

function showPopupLiveGridData(data, status, req) {
    // app.debug('FUNCTION: showPopupLiveGridData, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showPopupLiveGridData, status:' + status);
    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {

        var jsonData = returnjsonData(req);
        var output = '';

        app.setLiveScrolling(jsonData, getPopupLiveGridData);

        obj = app.curObj;
        // var srcFld 			= $('#'+obj.id);
        // var srcValue 		= $('#'+obj.id).val();
        // var targetFld 		= $('#'+obj.id+ '_result');
        var objectKey = $('#' + obj.id).attr('objectKey');

        var fldID = app.BindObjectQueries[objectKey][1][0].id;
        // var fldType 		= app.BindObjectQueries[objectKey][1][0].type;
        var fldKeyField = app.BindObjectQueries[objectKey][1][0].keyfield;
        var fldDispField = app.BindObjectQueries[objectKey][1][0].dispfield;
        // var fldqueryObj	= app.BindObjectQueries[objectKey][1][0].query;
        // var tmpCheckFields	= app.BindObjectQueries[objectKey][1][0].checkfield;
        var fldOnChange = BRVUtil.checkValue(app.BindObjectQueries[objectKey][1][0].onchange) ? app.BindObjectQueries[objectKey][1][0].onchange : '';
        fldOnChangeParam = BRVUtil.checkValue(fldOnChange) ? str_to_b64(JSON.stringify(fldOnChange.param)) : '';

        var disableautoclose = true;

        // var fldquery = '';
        // var queryWhere = '';

        var jsonRecords = jsonData.response.queryresults[0].recordset;
        var output = '';

        if (app.iRecordCount >= 1) { // Build list of gridrecords
            jQuery.each(jsonRecords, function(i, val) {
                output += '<li key="' + val[fldKeyField] + '" data-icon="false">';
                output += '<a href="#" onclick="selectBindObjectQueryResult(\'' + fldID + '\', \'' + val[fldKeyField] + '\', \'\', \'' + fldOnChangeParam + '\', \'' + str_to_b64(JSON.stringify(val)) + '\'); " data-rel="back">';
                output += val[fldDispField];
                output += '</a>';
                output += '</li>';
            });
        } else {
            output += '<li>Geen data gevonden!</li>';
        }

        //If there's just one record check if we need to close the popup
        if (app.iRecordCount == 1) {
            disableautoclose = BRVUtil.isBool(app.BindObjectQueries[objectKey][1][0].disableautoclose) ? BRVUtil.parseBoolean(app.BindObjectQueries[objectKey][1][0].disableautoclose) : false;
        }

        if (disableautoclose) {
            // Set popup grid content
            $('#' + fldID + '_result').append(output);
            $('#' + fldID + '_result').listview().listview('refresh');
            // Open the hidden popup
            $("[data-role=popup]").popup("open");
        } else {
            // Select current record
            selectBindObjectQueryResult(fldID, jsonRecords[0][fldKeyField], '', fldOnChangeParam, str_to_b64(JSON.stringify(jsonRecords[0])));

            //Remove hidden popup
            $("#popupLiveGrid").remove(); // Remve sensormenu first!
        }

    }
}


function checkAttachedFields(curfld, obj) {
    // Check attached fields: 'Uitvoeren bij wijzigen'

    //    if (BRVUtil.checkValue(curfld.onchange)) {
    if (BRVUtil.checkValue(curfld.onchange) && !curfld.clearonfocus) {
        BRVUtil.tryFunction(curfld.onchange.action, str_to_b64(JSON.stringify(curfld.onchange.param)), obj);
    }

}


function bindObjectQuery(object, fldID, fldType, fldKeyField) {
    // app.debug('FUNCTION: bindObjectQuery, object:'+object+', fldID:'+fldID+', fldType:'+fldType+', fldKeyField:'+fldKeyField);
    app.debug('FUNCTION: bindObjectQuery, fldID:' + fldID + ', fldType:' + fldType + ', fldKeyField:' + fldKeyField);
    BRVUtil.addToArray(app.BindObjectQueries, fldID, [object, BRVUtil.alltrim(fldType), BRVUtil.alltrim(fldKeyField)]);
}

function GetBindObjectQuery() {
    app.debug('FUNCTION: GetBindObjectQuery');

    if (app.BindObjectQueries.length > 0) {

        for (var i = 0; i < app.BindObjectQueries.length; i++) {

            var curfld = app.BindObjectQueries[i][1][0];

            var fldID = app.BindObjectQueries[i][1][0].id;
            var fldType = app.BindObjectQueries[i][1][0].type;
            var timeOutVar = null;
            $("#" + fldID).attr('objectKey', i); // set BindObjectQueries index as attribute
            $("#" + fldID).parent().css({ "border": '0px' }); // remove border from parent div 

            var thisObj = app.BindObjectQueries[i][1][0];

            if (app.selectInputTimeout == 0) {
                if (fldType == 'selectfiltered') {
                    var startPopup = false;
                    $("#" + fldID).keyup(function(e) {
                        startPopup = false;
                        var that = this;
                        var code = (e.keyCode) ? e.keyCode : e.which;
                        switch (code) {
                            case 10:
                            case 13:
                                startPopup = true;
                                clearTimeout(timeOutVar);
                                timeOutVar = setTimeout(function() { GetBindObjectQuery2(that); }, 500);
                                break;

                            default:

                        }
                    });

                    $("#" + fldID).blur(function() {
                        var curId = $(this).attr("id");
                        var curValue = $(this).val();
                        if (curValue == '') { // Clear result field
                            $("#" + curId + '_result').html('');

                            (startPopup) ? '' : checkAttachedFields(curfld, this);
                        }
                        startPopup = false;
                    });

                }

            } else {
                // Check for user input and automatically trigger request instead of waiting for 'enter/go'
                if (fldType == 'selectfiltered') {
                    var startPopup = false;
                    $("#" + fldID).keyup(function(e) {
                        startPopup = false;
                        var that = this;
                        var code = (e.keyCode) ? e.keyCode : e.which;
                        if (code != 9 && code != 16) {
                            clearTimeout(timeOutVar);
                            if ($(that).val().length > 0) {
                                startPopup = true;

                                // Check if only a space was entered
                                if ($(that).val().length == 1 && BRVUtil.Left($(that).val(), 1) == " ") {
                                    $(that).val('');
                                }

                                //                            timeOutVar = setTimeout(function() { GetBindObjectQuery2(that); }, 800);
                                timeOutVar = setTimeout(function() { GetBindObjectQuery2(that); }, app.selectInputTimeout);
                            }
                        }
                    });

                    $("#" + fldID).blur(function() {
                        var curId = $(this).attr("id");
                        var curValue = $(this).val();
                        if (curValue == '') { // Clear result field
                            $("#" + curId + '_result').html('');

                            (startPopup) ? '' : checkAttachedFields(curfld, this);

                        }
                        startPopup = false;
                    });
                }
            }


            if (app.selectInputTimeout == 0) {

                // Check there's at least one character abd add some delay between keyups before calling popup
                // This way user is able to clear fields without triggering popup each time.
                if (fldType == 'selectpopup') {
                    var startPopup = false;
                    $("#" + fldID).keyup(function(e) {

                        startPopup = false;

                        var that = this;
                        var code = (e.keyCode) ? e.keyCode : e.which;

                        switch (code) {
                            case 10:
                            case 13:
                                startPopup = true;
                                clearTimeout(timeOutVar);
                                timeOutVar = setTimeout(function() { GetBindObjectPopup(that); }, 500);
                                break;

                            default:

                        }
                    });


                    $("#" + fldID).blur(function() {
                        var curId = $(this).attr("id");
                        var curValue = $(this).val();
                        if (curValue == '') { // Clear result field
                            $("#" + curId + '_result').html('');

                            (startPopup) ? '' : checkAttachedFields(curfld, this);
                        }
                        startPopup = false;
                    });

                }

            } else {

                // Check for user input and automatically trigger request instead of waiting for 'enter/go'
                if (fldType == 'selectpopup') {
                    var startPopup = false;

                    $("#" + fldID).keyup(function(e) {
                        startPopup = false;
                        var that = this;
                        var code = (e.keyCode) ? e.keyCode : e.which;
                        if (code != 9 && code != 16) {
                            clearTimeout(timeOutVar);
                            if ($(that).val().length > 0) {
                                startPopup = true;

                                // Check if only a space was entered
                                if ($(that).val().length == 1 && BRVUtil.Left($(that).val(), 1) == " ") {
                                    $(that).val('');
                                }

                                //timeOutVar = setTimeout(function() { GetBindObjectPopup(that); }, 800);
                                timeOutVar = setTimeout(function() { GetBindObjectPopup(that); }, app.selectInputTimeout);
                            }
                        }

                    });


                    $("#" + fldID).blur(function() {
                        var curId = $(this).attr("id");
                        var curValue = $(this).val();
                        if (curValue == '') { // Clear result field
                            $("#" + curId + '_result').html('');

                            (startPopup) ? '' : checkAttachedFields(curfld, this);
                        }
                        startPopup = false;
                    });



                }

            }

        }
    }
    app.isUserInput = false;
}

function GetBindObjectQuery2(obj, exec) {
    // app.debug('FUNCTION: GetBindObjectQuery2, obj:'+obj+', exec:'+exec);
    app.debug('FUNCTION: GetBindObjectQuery2');
    // var srcFld 			= $('#'+obj.id);
    var srcValue = $('#' + obj.id).val();
    var targetFld = $('#' + obj.id + '_result');
    var objectKey = $('#' + obj.id).attr('objectKey');

    if (app.BindObjectQueries.length > 0) {
        // var fldID 		= app.BindObjectQueries[objectKey][1][0].id;
        // var fldType 		= app.BindObjectQueries[objectKey][1][0].type;
        // var fldKeyField	= app.BindObjectQueries[objectKey][1][0].keyfield;
        var fldqueryObj = app.BindObjectQueries[objectKey][1][0].query;
        var tmpCheckFields = app.BindObjectQueries[objectKey][1][0].checkfield;
        var fldquery = '';
        var queryWhere = '';

        targetFld.html("");
        // if ( srcValue && srcValue.length >= 1 ) {
        // if ( srcValue && srcValue.length >= 0 ) {
        if (srcValue.length >= 0) {
            srcObj = obj; // Set srcObj for use within 'GetBindObjectQueryResult'
            targetFld.html("<li>" + app.translateMessage('GET_DATA') + "</li>");
            targetFld.listview("refresh");

            // Do request
            if (BRVUtil.checkValue(fldqueryObj)) {
                fldquery = (BRVUtil.checkValue(fldqueryObj.query)) ? b64_to_str(fldqueryObj.query) : '';
                queryWhere = (BRVUtil.checkValue(fldqueryObj.querywhere)) ? b64_to_str(fldqueryObj.querywhere) : '';
                queryFields = fldqueryObj.queryfields;
                fldqueryAppID = fldqueryObj.appid;
                fldqueryReqID = fldqueryObj.wepid;

                // Add search values to queryWhere
                if (BRVUtil.checkValue(fldqueryObj.search)) {
                    if (fldqueryObj.search.searchfields.length > 0) {
                        // srcFieldValue = BRVUtil.checkUnicode(srcValue);
                        // srcFieldValue = BRVUtil.escapeQuotes(srcFieldValue);
                        // var tmpSrcFields = fldqueryObj.search.searchfields.split('|');
                        var tmpSrcFields = fldqueryObj.search.searchfields;

                        //Add (multi)search to queryWhere
                        queryWhere = AddSearchToQueryWhere(queryWhere, srcValue, tmpSrcFields);

                        // if (srcFieldValue != '') {
                        // 	if (queryWhere == '') {
                        // 		queryWhere = ' .T. ';
                        // 	}
                        // 	queryWhere = queryWhere + ' AND ( ';
                        // 	for (a = 0; a < tmpSrcFields.length; a++) {
                        // 		if (BRVUtil.checkValue(tmpSrcFields[a])) {
                        // 			if (a == 1) {
                        // 				//queryWhere = queryWhere + ' AND ';
                        // 			} else {
                        // 				queryWhere = queryWhere + ' OR ';
                        // 			}
                        // 			queryWhere = queryWhere + "  UPPER([" + srcFieldValue + "]) $ UPPER(" + tmpSrcFields[a] + ") ";
                        // 		}
                        // 	}
                        // 	queryWhere = queryWhere + ' ) ';
                        // }
                    }
                }

                if (BRVUtil.checkValue(queryFields)) {
                    var tmpQueryFields = queryFields.split('|');
                    for (a = 0; a < tmpQueryFields.length; a++) {
                        if (BRVUtil.checkValue(tmpQueryFields[a])) {
                            var tmpQueryField = tmpQueryFields[a].split('=');
                            var searchFld = tmpQueryField[0];
                            var lcFldValue = '';
                            if (searchFld.substr(0, 1) == '*') { // Check if we need to find the field value in the localstorage
                                searchFld = searchFld.substr(1, searchFld.length);
                                lcFldValue = app.GetFromPhoneStorage(searchFld);
                            } else { // Get field value from form
                                lcFldValue = app.paramObject[searchFld];
                            }
                            queryWhere = queryWhere.replace('<' + searchFld + '>', lcFldValue);

                            // Also replace in fldquery?
                            fldquery = fldquery.replace('<' + searchFld + '>', lcFldValue);
                        }
                    }
                }

                if (BRVUtil.checkValue(tmpCheckFields)) {
                    tmpCheckFields = tmpCheckFields.split('|');
                    for (a = 0; a < tmpCheckFields.length; a++) {
                        if (BRVUtil.checkValue(tmpCheckFields[a])) {
                            var tmpCheckField = tmpCheckFields[a].split('=');
                            var searchFld = tmpCheckField[0];
                            var formFldValue = $('#' + searchFld).val();
                            queryWhere = BRVUtil.replaceAll(queryWhere, '<' + searchFld + '>', formFldValue);
                        }
                    }
                }

                fldquery = fldquery.replace('<where>', queryWhere);

                setTimeout(function() {
                    app.resetLiveScrolling();
                    app.iPageSize = 100;
                    if (BRVUtil.checkValue(fldqueryAppID) && BRVUtil.checkValue(fldqueryReqID) && BRVUtil.checkValue(fldquery)) {
                        app.wsErrorCode = 'A012';
                        app.doRequestGWRWAW(fldquery, fldqueryAppID, fldqueryReqID, GetBindObjectQueryResult, showWSError);
                    }
                }, 250);
            }
        }
    }
}

function GetBindObjectQueryResult(data, status, req) {
    // app.debug('FUNCTION: GetBindObjectQueryResult, status:'+status+', req:'+JSON.stringify(req));
    app.debug('FUNCTION: GetBindObjectQueryResult, status:' + status);
    // var srcFld 			= $('#'+srcObj.id);
    // var srcValue 		= $('#'+srcObj.id).val();
    // var targetFld 		= $('#'+srcObj.id+ '_result');
    var objectKey = $('#' + srcObj.id).attr('objectKey');

    var fldID = app.BindObjectQueries[objectKey][1][0].id;
    // var fldType 		= app.BindObjectQueries[objectKey][1][0].type;
    var fldKeyField = app.BindObjectQueries[objectKey][1][0].keyfield;
    var fldDispField = app.BindObjectQueries[objectKey][1][0].dispfield;
    // var fldqueryObj		= app.BindObjectQueries[objectKey][1][0].query;

    var fldOnChange = BRVUtil.checkValue(app.BindObjectQueries[objectKey][1][0].onchange) ? app.BindObjectQueries[objectKey][1][0].onchange : '';
    fldOnChangeParam = BRVUtil.checkValue(fldOnChange) ? str_to_b64(JSON.stringify(fldOnChange.param)) : '';

    // First clear target fields
    try {
        if (BRVUtil.checkValue(fldOnChange)) {
            for (var i = 0; i < fldOnChange.param.length; i++) {
                $('#' + fldOnChange.param[i].fieldid).val('');
            }
        }
    } catch (e) {}
    //

    var jsonData = returnjsonData(req);

    var targetFieldID = fldID.replace('selectfiltered_', '') + '_result';
    var srcFieldID = fldID.replace('selectfiltered_', '');

    $("#" + srcFieldID).blur(); // To hide the keyboard.

    if (jsonData.response.queryresults[0].recordset.length == 1) { // If it's just one record, then select it
        var val = jsonData.response.queryresults[0].recordset[0];
        selectBindObjectQueryResult(fldID, val[fldKeyField], targetFieldID, fldOnChangeParam, str_to_b64(JSON.stringify(val)));
    } else
    if (jsonData.response.queryresults[0].recordset.length > 0) { // Show list of records
        var jsonRecords = jsonData.response.queryresults[0].recordset;
        var html = '';
        $('#' + targetFieldID).html("");
        jQuery.each(jsonRecords, function(i, val) {
            // html += '<li key="'+val[fldKeyField]+'" onclick="selectBindObjectQueryResult(\''+fldID+'\', \''+val[fldKeyField]+'\', \''+targetFieldID+'\', \''+fldOnChangeParam+'\', \''+str_to_b64(JSON.stringify(val))+'\'); ">' + val[fldDispField] + '</li>';

            var fullbgcolor = '';
            if (BRVUtil.checkValue(jsonRecords[i].fullbackgroundcolor)) {
                fullbgcolor = (BRVUtil.Left(jsonRecords[i].fullbackgroundcolor, 1) == '#') ? jsonRecords[i].fullbackgroundcolor : BRVUtil.FoxColorToHex(jsonRecords[i].fullbackgroundcolor);
            }
            var fontcolor = '';
            if (BRVUtil.checkValue(jsonRecords[i].fontcolor)) {
                fontcolor = (BRVUtil.Left(jsonRecords[i].fontcolor, 1) == '#') ? jsonRecords[i].fontcolor : BRVUtil.FoxColorToHex(jsonRecords[i].fontcolor);
            }

            html += '<li ';
            html += (fullbgcolor) ? ' fullbgcolor="' + fullbgcolor + '" ' : '';
            html += (fontcolor) ? ' fontcolor="' + fontcolor + '" ' : '';
            html += ' key="' + val[fldKeyField] + '" onclick="selectBindObjectQueryResult(\'' + fldID + '\', \'' + val[fldKeyField] + '\', \'' + targetFieldID + '\', \'' + fldOnChangeParam + '\', \'' + str_to_b64(JSON.stringify(val)) + '\'); ">' + val[fldDispField] + '</li>';
        });
        $('#' + targetFieldID).append(html);
        $('#' + targetFieldID).listview("refresh");
        $('#' + targetFieldID).trigger("create");
        $('#' + targetFieldID).show();

        $('[name="' + targetFieldID + '"] li').each(function() {
            $(this).css("text-shadow", "none"); // Remove text shadow!

            var fullbgcolor = $(this).attr("fullbgcolor");
            if (BRVUtil.checkValue(fullbgcolor)) {
                $(this).css({
                    backgroundColor: fullbgcolor
                });
            }

            var fontcolor = $(this).attr("fontcolor");
            if (BRVUtil.checkValue(fontcolor)) {
                // $(this).find('a').css("color", fontcolor);
                $(this).css({
                    color: fontcolor
                });
            }
        });

    } else {
        var html = '<li>Geen resultaten gevonden.</li>';
        $('#' + targetFieldID).html(html);
        $('#' + targetFieldID).listview("refresh");
        $('#' + targetFieldID).trigger("create");
        $('#' + targetFieldID).show();

        //console.log('RESET FOCUS TO FIELD : ', fldID);
        $('#' + fldID).focus();

    }
}

function selectBindObjectQueryResult(fldID, value, clrfldID, onSelectParams, onSelectData) {
    // app.debug('FUNCTION: selectBindObjectQueryResult, fldID:'+fldID+', value:'+value+', clrfldID:'+clrfldID+', onSelectParams:'+onSelectParams+', onSelectData:'+onSelectData);
    app.debug('FUNCTION: selectBindObjectQueryResult, fldID:' + fldID);
    $('#' + fldID).val(value);
    // var onSelectParams = (BRVUtil.checkValue(onSelectParams)) ? JSON.parse(b64_to_str(onSelectParams)) : '';
    var onSelectParams = (BRVUtil.checkValue(onSelectParams)) ? BRVUtil.parseJSON(b64_to_str(onSelectParams)) : '';
    // var onSelectData = (BRVUtil.checkValue(onSelectData)) ? JSON.parse(b64_to_str(onSelectData)) : '';
    var onSelectData = (BRVUtil.checkValue(onSelectData)) ? BRVUtil.parseJSON(b64_to_str(onSelectData)) : '';
    for (var i = 0; i < onSelectParams.length; i++) {
        var fldIDTmp = onSelectParams[i].fieldid;
        var fldValueFld = onSelectParams[i].fieldvalue;

        switch (fldIDTmp) {
            case "_showmessage":
                // If fieldid is '_showmessage' then display fieldvalue.  
                (BRVUtil.checkValue(onSelectData[fldValueFld])) ? app.showMessage(onSelectData[fldValueFld], null, false): '';
                break;
            case "_beep":
                // If fieldid is '_beep' then beep x-times.  
                try {
                    var newValue = (BRVUtil.checkValue(onSelectData[fldValueFld])) ? onSelectData[fldValueFld] : fldValueFld;
                    var times = parseInt(newValue);
                    (BRVUtil.checkValue(times) && times > 0) ? navigator.notification.beep(times): '';
                } catch (err) {}
                break;
            default:
                var elemType = $('#' + fldIDTmp).attr('type');
                if (elemType == 'checkbox') {
                    $('#' + fldIDTmp).prop('checked', onSelectData[fldValueFld]).checkboxradio('refresh');
                } else {
                    //$('#' + fldIDTmp).val(onSelectData[fldValueFld]);

                    // Check if we need to buffer some data
                    var newValue = onSelectData[fldValueFld];
                    if ($('#' + fldIDTmp).attr("_type") == 'textbuffer') {
                        newValue = updateTextBuffer(fldID, fldIDTmp, onSelectData[fldValueFld]);
                    }

                    newValue = formatFieldToShow(fldIDTmp, newValue);

                    $('#' + fldIDTmp).val(newValue);
                    //

                    //Save initial value to valuebackup property of object
                    //console.log('fldIDTmp: ', fldIDTmp);
                    //$('#' + fldIDTmp).attr("valuebackup", newValue); // Backup initial value 


                }

                // Trigger change event
                $('#' + fldIDTmp).change();
                break;
        }
    }

    // Enable/Disable Footer buttons!!
    setFooterButtonStatus();

    setTimeout(function() {
        $('#' + clrfldID).html("");
        $('#' + clrfldID).hide();
    }, 100);
}



function formatFieldToShow(fldIDTmp, fldValue) {
    // Format field value to correct display value.
    // Try to find field in current screenobject, then use it's properties
    // to define the correct format.
    var JSONObject = app.JSONObject['screen'];
    var fields = JSONObject.content.fields;
    var nfields = fields.length;
    for (var fldi = 0; fldi < nfields; fldi++) {
        var fldID = fields[fldi].id;
        if (fldID == fldIDTmp) {
            var fldPrefix = JSONObject.content.fields[fldi].prefix;
            var fldSuffix = JSONObject.content.fields[fldi].suffix;
            var fldDecimals = JSONObject.content.fields[fldi].decimals;

            var fldType = $('#' + fldIDTmp).attr("fldtype"); // Get fldtype from form object itself!

            // Number or Currency
            if (fldType == 'number' || fldType == 'currency') {
                if ($('#' + fldIDTmp).attr('data-role') == 'spinbox') {
                    // When it's a spinbox we need to remove thousands separator and change decimals separator to '.'
                    fldValue = BRVUtil.number_format(fldValue, fldDecimals, '.', '');
                } else {
                    fldValue = BRVUtil.number_format(fldValue, fldDecimals, ',', '.');

                    // Only add prefix and suffix when it's not a spinbox.
                    if (app.screenMode == 'show') {
                        BRVUtil.checkValue(fldPrefix) ? fldValue = fldPrefix + fldValue : '';
                        BRVUtil.checkValue(fldSuffix) ? fldValue = fldValue + fldSuffix : '';
                    }
                }
            }

            // ....
            // Next type..			

            break; // We did find the field so we can exit the for loop
        }

    }

    return fldValue;
}




function bufferHeaderInfoQuery(object) {
    // app.debug('FUNCTION: bufferHeaderInfoQuery, object:'+object);
    app.debug('FUNCTION: bufferHeaderInfoQuery');

    if (object.query && BRVUtil.checkValue(object.query.wepid) && BRVUtil.checkValue(object.query.appid) && BRVUtil.checkValue(object.query.query)) {
        var ID = BRVUtil.strTimeStamp();

        // ---------------------------------------------------------------------
        // MOVED TO : function 'buildQueryFromJSON'
        // Add filter to header query
        // Get app JSON from app vars
        // var JSONObject = app.JSONObject['screen'];
        // var queryWhere = '';

        // var objectTmp = JSON.parse(JSON.stringify(object)); // Copy current object to TMP object

        // // Get headerinfo query
        // var query = (BRVUtil.checkValue(objectTmp.query.query)) ? b64_to_str(objectTmp.query.query) : '';
        // query = app.validateQuery(query); // Check if query does contain a valid select or setoption/setfield

        // // Add filter values to queryWhere
        // if (BRVUtil.checkValue(JSONObject.content.queryfilter)) {
        // 	if (JSONObject.content.queryfilter.length > 0) {
        // 		var queryWhereTMP = '';
        // 		var filterNr = 0;
        // 		queryWhereTMP = queryWhereTMP + ' AND ( ';
        // 		var srcField = JSONObject.id + "_filter";
        // 		$('#' + srcField).find('[type="checkbox"]').each(function() {
        // 			var filterID = this.id;
        // 			var filterStorageID = srcField + '_' + filterID ; 
        // 			var state = $(this).prop('checked')?true:false; 
        // 			if (state) {
        // 				if (filterNr == 0) {
        // 				} else {
        // 					queryWhereTMP = queryWhereTMP + ' AND ';
        // 				}
        // 				var condition = b64_to_str( $('#'+filterID).val() ); 
        // 				queryWhereTMP = queryWhereTMP + condition;
        // 				filterNr++;
        // 			}
        // 		});
        // 		queryWhereTMP = queryWhereTMP + ' ) ';
        // 		if (queryWhere == '') {
        // 			queryWhere = ' .T. ';
        // 		}
        // 		queryWhere += (filterNr > 0)?queryWhereTMP:'';
        // 	}
        // }

        // // Replace <where> with new queryWhere
        // query = query.replace('<where>', queryWhere);
        // objectTmp.query.query = str_to_b64(query); 
        // // ---------------------------------------------------------------------

        BRVUtil.addToArray(app.HeaderInfoQueries, ID, object);
        // BRVUtil.addToArray(app.HeaderInfoQueries, ID, objectTmp);
    }
}

function GetBufferedHeaderInfoQuery() {
    app.debug('FUNCTION: GetBufferedHeaderInfoQuery');
    if (app.HeaderInfoQueries.length > 0) {

        var queryObj = app.HeaderInfoQueries[0][1].query;
        if (BRVUtil.checkValue(queryObj)) {

            // Backup orig header once with vars to new attribute!
            // So lateron we can restore header so replace with refreshed data!
            if (!$('#headerinfohtml').attr('backup') && $('#headerinfohtml').html()) {
                var orgHTML = str_to_b64($('#headerinfohtml').html());
                $('#headerinfohtml').attr('backup', orgHTML);
            }

            // Remember current paging settings
            var curiRecordCount = app.iRecordCount;
            var curiPageSize = app.iPageSize;
            var curiCurrentPage = app.iCurrentPage;
            var curiOffset = app.iOffset;
            var curiPageCount = app.iPageCount;
            var curexecFunction = app.execFunction;

            // Reset current paging settings
            app.iRecordCount = 0;
            app.iPageSize = 35;
            app.iCurrentPage = 1;
            app.iOffset = 1;
            app.iPageCount = 0;
            app.execFunction = null;

            // Exec buffered query with default paging settings
            var queryAppID = queryObj.appid;
            var queryReqID = queryObj.wepid;
            var query = buildQueryFromJSON(queryObj, app.paramObject, true);

            if (BRVUtil.checkValue(queryAppID) && BRVUtil.checkValue(queryReqID) && BRVUtil.checkValue(query)) {
                app.wsErrorCode = 'A013';
                app.doRequestGWRWAW(query, queryAppID, queryReqID, GetBufferedHeaderInfoResult, showWSError);
            }

            // Restore paging settings
            app.iRecordCount = curiRecordCount;
            app.iPageSize = curiPageSize;
            app.iCurrentPage = curiCurrentPage;
            app.iOffset = curiOffset;
            app.iPageCount = curiPageCount;
            app.execFunction = curexecFunction;
        }
    } else {
        // Check if headerinfo already has been resized, just resize once.
        if ($('#headerinfodiv').attr("resizedone") == '0') {
            // Set headerinfofield width
            var maxWidth = 0;
            $('#headerinfodiv span[name=headerinfotitle]').each(function() {
                maxWidth = Math.max(maxWidth, $(this).width() + 5);
            }).width(maxWidth);

            var maxWidth = 0;
            $('#headerinfodiv span[name=headerinfospan]').each(function() {
                maxWidth = Math.max(maxWidth, $(this).width() + 15);
            }).width(maxWidth);

            // Set resizedone
            $('#headerinfodiv').attr("resizedone", "1");
        }
        $('#headerinfodiv').css('visibility', 'visible');
    }
}

function GetBufferedHeaderInfoResult(data, status, req) {
    // app.debug('FUNCTION: GetBufferedObjectQueryResult, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: GetBufferedObjectQueryResult, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {

        // Restore orig header html so we can set refreshed data
        if ($('#headerinfohtml').attr('backup')) {
            var orgHTML = b64_to_str($('#headerinfohtml').attr('backup'));
            $('#headerinfohtml').html(orgHTML);
        }

        if (app.HeaderInfoQueries.length > 0) {
            var headerInfoObj = app.HeaderInfoQueries[0][1].fields;
            var HeaderInfoQueriesID = app.HeaderInfoQueries[0][0];

            try {
                var jsonData = returnjsonData(req);
                var jsonRecords = jsonData.response.queryresults[0].recordset;


                if (jsonRecords.length > 0) {
                    // Replace vars in apptitle
                    jQuery.each(jsonRecords, function(key, value) {
                        jQuery.each(value, function(fldID, fldVal) {
                            $('#apptitle').html($('#apptitle').html().replace('&lt;' + fldID + '&gt;', fldVal));

                            if ($('#headerinfohtml').length) {
                                $('#headerinfohtml').html($('#headerinfohtml').html().replace('#' + fldID + '#', fldVal));
                            }

                        });
                    });

                } else {
                    // No records!!
                    //if ( $('#headerinfohtml').attr('backup') ) { 
                    if ($('#headerinfohtml').html()) {
                        // Try to find all #-tags and replace with empty value
                        var curHTML = $('#headerinfohtml').html();
                        var tagArray = curHTML.match(/#(.+)\#/ig);
                        if (tagArray) {
                            for (var a = 0; a < tagArray.length; a++) {
                                $('#headerinfohtml').html($('#headerinfohtml').html().replace(tagArray[a], ''));
                            }
                        }
                    }
                }

                // Make apptitle visible!
                $('#apptitle').css('visibility', 'visible');

                if (BRVUtil.checkValue(headerInfoObj)) {
                    for (var i = 0; i < headerInfoObj.length; i++) {
                        var headerFldID = headerInfoObj[i].id;
                        var headerFldName = headerInfoObj[i].name;
                        var headerFldtype = headerInfoObj[i].type;
                        var headerFlddecimals = headerInfoObj[i].decimals;
                        var headerFldPrefix = headerInfoObj[i].prefix;
                        var headerFldSuffix = headerInfoObj[i].suffix;
                        var fldValue = '';
                        //					var fldValue = app.isBuilder ? '[____]' : '';
                        var stopSearch = false;
                        jQuery.each(jsonRecords, function(key, value) {
                            jQuery.each(value, function(fldID, fldVal) {
                                if (fldID == headerFldName) {
                                    fldValue = fldVal;
                                    stopSearch = true;
                                }
                            });
                            if (stopSearch) {
                                return false;
                            }
                        });
                        switch (headerFldtype) {
                            case "number":
                            case "currency":
                                fldValue = BRVUtil.number_format(fldValue, headerFlddecimals, ',', '.');
                                break;
                            default:
                                break;
                        }
                        fldValue = (BRVUtil.alltrim(fldValue.toString()) == '' && app.isBuilder) ? '[____]' : BRVUtil.alltrim(fldValue.toString());
                        $('#' + headerFldID).html(fldValue);
                    }
                }
            } catch (e) {}

            BRVUtil.removeFromArray(app.HeaderInfoQueries, HeaderInfoQueriesID);
            GetBufferedHeaderInfoQuery();
        }
    }


}

function bufferObjectQuery(object, fldID, fldType, fldKeyField) {
    // app.debug('FUNCTION: bufferObjectQuery, object:'+object+', fldID:'+fldID+', fldType:'+fldType+', fldKeyField:'+fldKeyField);
    app.debug('FUNCTION: bufferObjectQuery');
    BRVUtil.addToArray(app.ObjectQueries, fldID, [object, BRVUtil.alltrim(fldType), BRVUtil.alltrim(fldKeyField)]);
}

function GetBufferedObjectQuery(callBack) {
    app.debug('FUNCTION: GetBufferedObjectQuery');
    var oldPageSize = app.iPageSize;
    app.resetLiveScrolling();
    app.iPageSize = 100;

    if (app.ObjectQueries.length > 0) {
        var fldqueryObj = app.ObjectQueries[0][1][0].query;
        if (BRVUtil.checkValue(fldqueryObj)) {
            if (BRVUtil.checkValue(fldqueryObj.appid) && BRVUtil.checkValue(fldqueryObj.wepid)) {
                fldqueryAppID = fldqueryObj.appid;
                fldqueryReqID = fldqueryObj.wepid;
                fldquery = buildQueryFromJSON(fldqueryObj, app.paramObject, true);
                app.wsErrorCode = 'A014';
                app.doRequestGWRWAW(fldquery, fldqueryAppID, fldqueryReqID, GetBufferedObjectQueryResult, showWSError);
            }
        }
    } else {
        if (jQuery.isFunction(callBack)) { callBack(); }
    }
    app.iPageSize = oldPageSize;
}

function GetBufferedObjectQueryResult(data, status, req) {
    // app.debug('FUNCTION: GetBufferedObjectQueryResult, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: GetBufferedObjectQueryResult, status:' + status);

    if (!CheckGWRWAWError(data, status, req) || app.isBuilder) {
        if (app.ObjectQueries.length > 0) {
            var fldID = app.ObjectQueries[0][1][0].id;
            var fldType = app.ObjectQueries[0][1][0].type;
            // var fldKeyField = app.ObjectQueries[0][1][0].keyfield;

            var jsonData = returnjsonData(req);

            if (BRVUtil.checkValue(jsonData.response.queryresults)) {
                var elemKey = BRVUtil.findElemInArray(jsonData.response.queryresults, "name", "WebQuery");
                elemKey = (elemKey < 0) ? 0 : elemKey;
                var jsonRecords = jsonData.response.queryresults[elemKey].recordset;

                switch (fldType) {
                    case "select":
                        var initValue = '';
                        // ToDo: Find better solution for this.
                        try {
                            initValue = app.screenJSONData.response.queryresults["0"].recordset["0"][fldID];
                        } catch (err) {}
                        //
                        setSelectValue(jsonRecords, fldID, app.ObjectQueries[0][1], true, initValue);
                        break;

                    case "selectdoc":
                        setDocumentValue(jsonRecords, fldID, app.ObjectQueries[0][1]);
                        break;

                    default:
                        break;
                }
            }

            BRVUtil.removeFromArray(app.ObjectQueries, fldID);
            GetBufferedObjectQuery();
        }
    }
}

function getAdminData(screenID, param, mode, skipChecks) {
    app.debug('FUNCTION: getAdminData');
    app.loadMessage = 'GET_ADMIN_DATA';
    app.lastScreenCall = new Object();
    app.lastScreenCall['screenid'] = screenID;
    app.lastScreenCall['param'] = param;
    app.lastScreenCall['mode'] = mode;
    app.lastScreenCall['skipChecks'] = skipChecks;

    var query = '	{' +
        '		"SetOption": [' +
        '		{"Name": "xxx", "xxx": ""}' +
        '		]' +
        '		}';

    app.wsErrorCode = 'A015';
    app.doRequestGWRWAW(query, app.WEPID_MOBILE, 'GET_AVADMINDATA', showgetAdminData, showWSError);
}

function showgetAdminData(data, status, req) {
    //****
    //ToDo: Check if we can open the admin. No need to organise, etc...
    //****


    // app.debug('FUNCTION: showgetAdminData, status:' + status + ', req:' + JSON.stringify(req));
    app.debug('FUNCTION: showgetAdminData, status:' + status);
    var hasError = CheckGWRWAWError(data, status, req);
    if (!hasError) {
        var screenID = app.lastScreenCall['screenid'];
        var param = app.lastScreenCall['param'];
        var mode = app.lastScreenCall['mode'];
        var skipChecks = app.lastScreenCall['skipChecks'];
        app.lastScreenCall = new Object();
        app.lastScreenCall['screenid'] = screenID;
        app.lastScreenCall['param'] = param;
        app.lastScreenCall['mode'] = mode;
        app.lastScreenCall['skipChecks'] = skipChecks;

        var jsonData = returnjsonData(req);
        var jsonRecords = jsonData.response.responsedata;

        jQuery.each(jsonRecords, function(key, value) {
            app.AddToPhoneStorage(key, value);
        });
        setTimeout(function() {
            app.clearPageRoute();
            getScreenFromJSON(screenID, param, mode, skipChecks);
        }, 200);
    }
}


function ValidatePincode(pinCode) {
    app.debug('FUNCTION: ValidatePincode');
    app.loadMessage = 'VALIDATE_PINCODE';

    //		activationServiceResponse validatePassword(
    //				@WebParam(name = "apiKey") String apiKey,
    //				@WebParam(name = "productCode") String productCode,
    //				@WebParam(name = "deviceId") String deviceId,
    //				@WebParam(name = "password") String password)

    var xmlRequest = '<productCode>' + app.productcode + '</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId><password>' + pinCode + '</password>';
    app.wsErrorCode = 'OAS005';
    app.doRequestWS('OAS', 'ActivationService', 'validatePassword', xmlRequest, showValidatePincodeResult, showWSError);
}

function showValidatePincodeResult(xhttp) {
    app.debug('FUNCTION: showValidatePincodeResult');

    CheckWSError(xhttp);

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['app'];

    // ** Error **
    //<code>F</code>
    //<message>RELATION_NOT_FOUND</message>
    //<jsonData></jsonData>

    // ** Succes **
    // <code>S</code>
    // <message>DEVICE_REGISTERD</message>
    // <jsonData>
    // {
    // ....
    // }
    // </jsonData>
    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');

    if (succes.toUpperCase() == 'S') { // Succes
        switch (message) {
            case "VALID_PASSWORD":
                app.deviceloggedin = true;
                app.startScreen = getAppStartScreen(JSONObject.startscreen);
                getScreenFromJSON(app.startScreen);
                break;
            default:
                break;
        }
    } else { // Failed
        switch (message) {
            case "INVALID_PASSWORD":
                app.deviceloggedin = false;
                break;

            default:
                break;
        }
        app.showMessage(message);
    }
}

function ChangePincode() {
    app.debug('FUNCTION: ChangePincode');
    app.loadMessage = 'CHANGE_PINCODE';

    //		activationServiceResponse setPassword(
    //			@WebParam(name = "apiKey") String apiKey,
    //			@WebParam(name = "productCode") String productCode,
    //			@WebParam(name = "deviceId") String deviceId,
    //			@WebParam(name = "oldPassword") String oldPassword,
    //			@WebParam(name = "newPassword") String newPassword)
    var deviceid = app.deviceid;

    if (app.checkPassword && !app.checkPincode) {
        var deviceoldpincode = BRVUtil.checkValue(app.newPincodeObj.oldPassword) ? app.newPincodeObj.oldPassword : '';
    } else {
        var deviceoldpincode = BRVUtil.checkValue(app.newPincodeObj.oldPin) ? app.newPincodeObj.oldPin : '';
    }
    // var deviceoldpincode	= BRVUtil.checkValue(app.newPincodeObj.oldPin) ? app.newPincodeObj.oldPin : '';
    var devicenewpincode1 = BRVUtil.checkValue(app.newPincodeObj.newPin1) ? app.newPincodeObj.newPin1 : '';
    var devicenewpincode2 = BRVUtil.checkValue(app.newPincodeObj.newPin2) ? app.newPincodeObj.newPin2 : '';

    if (!app.checkPincode && app.checkPassword && (devicenewpincode1 == '' && devicenewpincode2 == '')) {
        //User must change old password to new pincode!
        app.showMessage('PINCODE_MANDATORY');
    } else
    if (app.pincodeMandatory && devicenewpincode1 == '' && devicenewpincode2 == '') {
        //User must set a pincode!
        app.showMessage('PINCODE_MANDATORY');
    } else
    if (devicenewpincode1 == devicenewpincode2) {
        var xmlRequest = '<productCode>' + app.productcode + '</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + deviceid + '</deviceId><oldPassword>' + deviceoldpincode + '</oldPassword><newPassword>' + devicenewpincode2 + '</newPassword>';
        app.wsErrorCode = 'OAS008';
        app.doRequestWS('OAS', 'ActivationService', 'setPassword', xmlRequest, showChangePincodeResult, showWSError);
    } else {
        app.showMessage('PINCODE_MISMATCH');
    }
}

function showChangePincodeResult(xhttp) {
    app.debug('FUNCTION: showChangePincodeResult');

    CheckWSError(xhttp);

    // ** Error **
    //<code>F</code>
    //<message>RELATION_NOT_FOUND</message>
    //<jsonData></jsonData>

    // ** Succes **
    // <code>S</code>
    // <message>DEVICE_REGISTERD</message>
    // <jsonData>
    // {
    // ....
    // }
    // </jsonData>
    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');

    if (succes.toUpperCase() == 'S') { // Succes
        app.showMessage(message);
        startApplication('init'); // Restart APP
    } else { // Failed
        switch (message) {
            case "INVALID_PASSWORD":
                message = 'INVALID_OLD_PASSWORD';
                break;

            case "DUMMY":
                message = '';
                break;

            default:
                break;
        }
        app.showMessage(message);

        //Recall changepincode screen
        getScreenFromJSONDefault('changepincode', false);

    }
}


function ValidatePassword(fldID, screenID, mode) {
    app.debug('FUNCTION: ValidatePassword, fldID:' + fldID + ', screenID:' + screenID + ', mode:' + mode);
    app.loadMessage = 'VALIDATE_PASSWORD';
    //		activationServiceResponse validatePassword(
    //				@WebParam(name = "apiKey") String apiKey,
    //				@WebParam(name = "productCode") String productCode,
    //				@WebParam(name = "deviceId") String deviceId,
    //				@WebParam(name = "password") String password)
    // var deviceid = app.deviceid;

    // var username = $('#username').val();
    var devicepassword = $('#password').val();

    // var srcFldJson = $("#username option:selected").attr("jsonValues");
    // var jsonObj = (BRVUtil.checkValue(srcFldJson)) ? JSON.parse(b64_to_str(srcFldJson)) : '';
    // // var deviceid = (BRVUtil.checkValue(jsonObj.deviceId))?jsonObj.deviceId:app.deviceid;
    // var deviceid = jsonObj.deviceId;

    var xmlRequest = '<productCode>' + app.productcode + '</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + app.deviceid + '</deviceId><password>' + devicepassword + '</password>';
    app.wsErrorCode = 'OAS005';
    app.doRequestWS('OAS', 'ActivationService', 'validatePassword', xmlRequest, showValidatePasswordResult, showWSError);
}

function showValidatePasswordResult(xhttp) {
    app.debug('FUNCTION: showValidatePasswordResult');

    CheckWSError(xhttp);

    // Get app JSON from app vars
    var JSONObject = app.JSONObject['app'];

    // ** Error **
    //<code>F</code>
    //<message>RELATION_NOT_FOUND</message>
    //<jsonData></jsonData>

    // ** Succes **
    // <code>S</code>
    // <message>DEVICE_REGISTERD</message>
    // <jsonData>
    // {
    // ....
    // }
    // </jsonData>
    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    // var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');
    if (succes.toUpperCase() == 'S') { // Succes
        switch (message) {
            case "VALID_PASSWORD":
                app.deviceloggedin = true;

                // app.startScreen = getAppStartScreen(JSONObject.startscreen);
                // getScreenFromJSON(app.startScreen);

                // Check if we need to set pincode!!!
                if (!app.checkPincode) {
                    getScreenFromJSONDefault('changepincode', false);
                } else { // Goto app startscreen
                    app.startScreen = getAppStartScreen(JSONObject.startscreen);
                    getScreenFromJSON(app.startScreen);
                }

            case "DUMMY":
                message = '';
                break;

                break;
            default:
                break;
        }
    } else { // Failed
        switch (message) {
            case "INVALID_PASSWORD":
                app.deviceloggedin = false;
                //message = 'INVALID_PASSWORD';
                break;

            case "DUMMY":
                message = '';
                break;

            default:
                break;
        }
        app.showMessage(message);
    }
}

function ChangePassword() {
    app.debug('FUNCTION: ChangePassword');
    app.loadMessage = 'CHANGE_PASSWORD';

    //		activationServiceResponse setPassword(
    //			@WebParam(name = "apiKey") String apiKey,
    //			@WebParam(name = "productCode") String productCode,
    //			@WebParam(name = "deviceId") String deviceId,
    //			@WebParam(name = "oldPassword") String oldPassword,
    //			@WebParam(name = "newPassword") String newPassword)
    var deviceid = app.deviceid;
    var deviceoldpassword = BRVUtil.alltrim($('#oldpassword').val());
    var devicenewpassword1 = BRVUtil.alltrim($('#newpassword1').val());
    var devicenewpassword2 = BRVUtil.alltrim($('#newpassword2').val());
    if (devicenewpassword1 == devicenewpassword2) {
        var xmlRequest = '<productCode>' + app.productcode + '</productCode><apiKey>' + app.apikeyOAS + '</apiKey><deviceId>' + deviceid + '</deviceId><oldPassword>' + deviceoldpassword + '</oldPassword><newPassword>' + devicenewpassword2 + '</newPassword>';
        app.wsErrorCode = 'OAS006';
        app.doRequestWS('OAS', 'ActivationService', 'setPassword', xmlRequest, showChangePasswordResult, showWSError);
    } else {
        var message = 'PASSWORD_MISMATCH';
        app.showMessage(message);
    }

}

function showChangePasswordResult(xhttp) {
    app.debug('FUNCTION: showChangePasswordResult');

    CheckWSError(xhttp);

    // ** Error **
    //<code>F</code>
    //<message>RELATION_NOT_FOUND</message>
    //<jsonData></jsonData>

    // ** Succes **
    // <code>S</code>
    // <message>DEVICE_REGISTERD</message>
    // <jsonData>
    // {
    // ....
    // }
    // </jsonData>
    var response = b64_to_str(xhttp.response);
    var succes = BRVUtil.strExtract(response, '<code>', '</code>');
    var message = BRVUtil.strExtract(response, '<message>', '</message>');
    // var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');
    if (succes.toUpperCase() == 'S') { // Succes
        app.showMessage(message);
        startApplication('init'); // Restart APP
    } else { // Failed
        switch (message) {
            case "INVALID_PASSWORD":
                message = 'INVALID_OLD_PASSWORD';
                break;

            case "DUMMY":
                message = '';
                break;

            default:
                break;
        }
        app.showMessage(message);
    }
}

function showWSError(xhttp) {
    app.debug('FUNCTION: showWSError');
    app.showError(xhttp.result, 'function: showWSError');
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------
// Generic functions
//---------------------------------------------------------
function CheckWSError(xhttp) {
    // ERROR: class java.io.IOException: Server returned HTTP response code: 500 for URL: http://xx.xx.xx.xx
    // ERROR: class java.net.SocketException: Too many open files
    // etc...
    var returnValue = false;
    var response = b64_to_str(xhttp.response);
    if (BRVUtil.Left(response, 6) == 'ERROR:') {

        // Remember reponse for errorlogging!!
        app.lastdoRequestWS['wsXMLResponse'] = response;

        app.showError('UNDEFINED_ERROR', 'function: CheckWSError');

        app.lastErrorMsg = response;

        getScreenFromJSONDefault('errorscreen');

        returnValue = false;
    } else {
        app.wsErrorCode = '';
        // app.stopLoading();

        // var JSONObject = app.JSONObject['screen'];
        // if ( !BRVUtil.checkValue(JSONObject) ) {
        // 	app.lastErrorMsg = response;
        // 	getScreenFromJSONDefault('errorscreen');

        // }
    }
    return returnValue;
}


function CheckGWRWAWError(data, status, req) {
    // app.debug('FUNCTION: CheckGWRWAWError, data:' + JSON.stringify(data) + ', status:' + status + ', req:' + JSON.stringify(req));

    var returnValue = false;

    var data = data;

    if (BRVUtil.Left(data, 1) == '~') {
        data = data.substr(1, data.length);
        data = BVW_Cryptor.DecryptString(data);
    }

    // data = ( typeof data == 'string' ) ? JSON.parse(data) : data;
    data = (typeof data == 'string') ? BRVUtil.parseJSON(data) : data;

    //Todo: Better errorhandling
    // > Sequence error
    // > ...

    // Convert data keys to lowercase, errors from different applications use their own capitalised jsonobj keys!
    // var data = lowerObjKeys(data);
    var data = BRVUtil.lowerObjKeys(data);

    // clearTimeout(this.timeoutHandler);
    if (status == "success") {
        app.debug('FUNCTION: CheckGWRWAWError');
        var error = data.response.error;
        // error: "1"
        // erroraction: "CHECK ACCESS SUBSCRIPTION"
        // errormessage: "ADMIN ERROR"
        // errorreason: "APP/ADMIN/DEVICE NOT FOUND IN SUBSCRIPTION"
        // errorstate: "REQUEST CANCELLED"
        // pitag: ""
        // version: "1.00"		
        if (error == '1') {

            // Remember reponse for errorlogging!!
            app.lastdoRequestWS['BRVjsonResponse'] = JSON.stringify(data);

            // app.debug('FUNCTION: CheckGWRWAWError, status:' + status + ', req:' + JSON.stringify(req));
            app.debug('FUNCTION: CheckGWRWAWError, status:' + status);
            // var erroraction = data.response.erroraction;
            // var errormessage = data.response.errormessage;
            // var errorreason = data.response.errorreason;
            // var errorstate = data.response.errorstate;

            // var erroraction 	= (BRVUtil.checkValue(data.response.erroraction)) 	? data.response.erroraction		: 'UNDEFINED_ERROR';
            var errormessage = (BRVUtil.checkValue(data.response.errormessage)) ? data.response.errormessage : 'UNDEFINED_ERROR';
            var errorreason = (BRVUtil.checkValue(data.response.errorreason)) ? data.response.errorreason : 'UNDEFINED_ERROR';

            // var errorstate 		= (BRVUtil.checkValue(data.response.errorstate))	? data.response.errorstate		: 'UNDEFINED_ERROR';
            var errorinfo = (BRVUtil.checkValue(data.response.errorinfo)) ? data.response.errorinfo.message : '';
            (errorreason == 'REQUEST CANCELLED') ? errorreason = '': '';

            if (typeof errormessage == 'object') {
                var temperrormessage = errormessage;
                errormessage = temperrormessage.message;
                errorreason = temperrormessage.procedure;
            }
            if (BRVUtil.checkValue(errorreason)) {
                switch (errorreason) {
                    case "REQUEST CANCELLED":
                        returnValue = false;
                        break;

                    case "NO ACCESS TO SPECIFIED ADMIN":
                        // Clear adm_code
                        app.adm_code = '';
                        // Render first screen
                        getScreenFromJSON('adminselect');
                        break;
                    case "APP/ADMIN/DEVICE NOT FOUND IN SUBSCRIPTION":
                        errorreason = "ADMIN ERROR";

                        app.adm_code = '';
                        setTimeout(function() {
                            getScreenFromJSON('adminselect');
                        }, 500);

                        break;
                    default:
                        if (errormessage != 'UNDEFINED_ERROR') {
                            if (errorreason != 'UNDEFINED_ERROR') {
                                // errorreason = errorreason;
                            } else {
                                errorreason = errormessage;
                            }
                        }

                        app.lastErrorMsg = app.translateMessage(errorreason);
                        returnValue = true;
                        break;
                }

                if (app.isBuilder) {
                    // errorreason = errorreason + '<br>' + JSON.stringify( errorinfo,null,2 );
                    errorreason = errorreason + '<br>' + errorinfo;
                }
                // app.showError(errorreason, data);
                try {
                    (errorreason) ? app.showError(errorreason, JSON.stringify(data)): '';
                } catch (err) {}

                // returnValue = true;

                //When there's no screenobj goto errorscreen.
                var JSONObject = app.JSONObject['screen'];
                if (!BRVUtil.checkValue(JSONObject)) {
                    // app.lastErrorMsg = errorreason;
                    app.lastErrorMsg = app.translateMessage(errorreason);
                    getScreenFromJSONDefault('errorscreen');
                }

            } else
            if (BRVUtil.checkValue(errormessage)) {
                // switch (errormessage) {
                // case "DOCUMENT NOT PRESENT":
                // errormessage = 'Document niet gevonden!';
                // break;
                // default:
                // errormessage = app.translateMessage(errormessage); 
                // // ...
                // }

                // app.showError(errormessage, data);
                try {
                    app.showError(errorreason, JSON.stringify(data));
                } catch (err) {}

                returnValue = true;
            }
        }
    } else {
        // app.debug('FUNCTION: CheckGWRWAWError, status:' + status + ', req:' + JSON.stringify(req));
        app.debug('FUNCTION: CheckGWRWAWError, status:' + status);
        // app.request.abort();
        // app.showError(req);
        app.lastErrorMsg = req;

        // Remember reponse for errorlogging!!
        app.lastdoRequestWS['BRVjsonResponse'] = JSON.stringify(data);

        if (BRVUtil.checkValue(app.wsErrorCode)) {
            app.lastErrorMsg += ' ' + app.wsErrorCode;
        }

        getScreenFromJSONDefault('errorscreen');
        returnValue = true;
    }

    return returnValue;
}


function checkButtonAccess(buttonObj, skipAccessChk) {
    var buttonVisible = false;
    var buttonAccess = buttonObj.access;
    var buttonChkData = buttonObj.checkfordata;

    // var hasAccess	  = true;
    var hasAccess = false; // Default false!!
    var hasChkData = true;

    if (!app.isBuilder) {
        // Check Access
        // app.adminAccess = ["ACCESS","FINANCE","RELATIONS","OPENITEM","PEOPLE","ACTION","DASHBOARD","ARTICLE","DEBTORS","CREDITORS","HOURS","SALESINVOICES","SALESORDERS"]
        // if (BRVUtil.checkValue(app.adminAccess)) {
        if (BRVUtil.checkValue(app.adminAccess) && !skipAccessChk) {

            var adminAccess = '|' + app.adminAccess.join('|') + '|';
            adminAccess = adminAccess.toUpperCase();
            if (BRVUtil.checkValue(adminAccess)) {
                if (BRVUtil.checkValue(buttonAccess)) {
                    hasAccess = false;
                    var tmpAccessGrp = buttonAccess.split('|');
                    // Check access group
                    for (var a = 0; a < tmpAccessGrp.length; a++) {
                        if (BRVUtil.checkValue(tmpAccessGrp[a])) {
                            var grpAccess = true;
                            var tmpAccessGrpList = tmpAccessGrp[a].split(',');
                            // Check access groupitem
                            for (var b = 0; b < tmpAccessGrpList.length; b++) {
                                if (BRVUtil.checkValue(tmpAccessGrpList[b])) {
                                    var tmpAccessGrpListItem = BRVUtil.alltrim(tmpAccessGrpList[b]).toUpperCase();
                                    if (adminAccess.indexOf("|" + tmpAccessGrpListItem + "|") < 0) {
                                        grpAccess = false;
                                    }
                                }
                            }
                            if (grpAccess) {
                                hasAccess = true;
                            }
                        }
                    }
                } else {
                    // Button requires no access check.
                    hasAccess = true;
                }
            }

        }

        if (skipAccessChk) {
            hasAccess = true;
        }


        // Check Data
        if (BRVUtil.checkValue(buttonChkData)) {
            hasChkData = false;
            var tmpAccessGrp = buttonChkData.split('|');
            // Check access group
            for (var a = 0; a < tmpAccessGrp.length; a++) {
                if (BRVUtil.checkValue(tmpAccessGrp[a])) {
                    var grpAccess = true;
                    var tmpAccessGrpList = tmpAccessGrp[a].split(',');
                    // Check access groupitem
                    for (var b = 0; b < tmpAccessGrpList.length; b++) {
                        if (BRVUtil.checkValue(tmpAccessGrpList[b])) {
                            var tmpAccessGrpListItem = tmpAccessGrpList[b];
                            var lcFldValue = '';

                            // Check if we need to find the field value in the localstorage
                            // *fieldname
                            if (!BRVUtil.checkValue(lcFldValue)) {
                                if (tmpAccessGrpListItem.substr(0, 1) == '*' || tmpAccessGrpListItem.substr(1, 1) == '*') {
                                    tmpAccessGrpListItem = tmpAccessGrpListItem.replace('<', '');
                                    tmpAccessGrpListItem = tmpAccessGrpListItem.replace('>', '');
                                    tmpAccessGrpListItem = tmpAccessGrpListItem.replace('*', '');
                                    lcFldValue = app.GetFromPhoneStorage(tmpAccessGrpListItem);
                                }
                            }

                            // Check if we need to find the field value in the screenparameters
                            // <fieldname>
                            // if (app.paramObject) {
                            if (!BRVUtil.checkValue(lcFldValue) && app.paramObject) {
                                if (tmpAccessGrpListItem.substr(0, 1) == '<') {
                                    tmpAccessGrpListItem = tmpAccessGrpListItem.replace('<', '');
                                    tmpAccessGrpListItem = tmpAccessGrpListItem.replace('>', '');
                                    if (BRVUtil.checkValue(app.paramObject[tmpAccessGrpListItem])) {
                                        lcFldValue = app.paramObject[tmpAccessGrpListItem];
                                    }
                                }
                            }

                            // If field does not contain data then return false.
                            if (!BRVUtil.checkValue(lcFldValue)) {
                                grpAccess = false;
                            }
                        }
                    }
                    if (grpAccess) {
                        hasChkData = true;
                    } else {
                        hasChkData = false;
                    }
                }
            }
        }
    } else {
        // BUILDER
        hasAccess = true;
    }

    buttonVisible = hasAccess && hasChkData;
    return buttonVisible;
}

// function resizeContent(foo) {
// 	app.debug('FUNCTION: resizeContent, foo:'+foo);
// 	var the_height = ($(window).height() - $(foo).find('[data-role="header"]').height() - $(foo).find('[data-role="footer"]').height());
// 	//the_height = the_height - 35;
// 	$(foo).height($(window).height()).find('[data-role="content"]').height(the_height);
// }

// function listViewRefresh(elem) {
// 	app.debug('FUNCTION: listViewRefresh, elem:'+elem);
// 	try {
// 		$(elem).listview("refresh");
// 	} catch (err) {}
// }

// function setContentHeight() {	// Not used!!
// 	app.debug('FUNCTION: setContentHeight');

// 	// deprecated: jQuery.mobile.getScreenHeight(), change to : $( window ).height()
// 	var screen = jQuery.mobile.getScreenHeight(),
// 	header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
// 	footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
// 	contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
// 	content = screen - header - footer - contentCurrent;
// 	$(".ui-content").height(content);
// }

// function disablelistviewclick() {
// 	var listViewhref = $('[data-role="listview"] li:not([data-role="list-divider"])').find('a');
// 	$(listViewhref).each(function () {
// 		if (BRVUtil.checkValue($(this).attr("onclick"))) {
// 			$(this).attr("onclickbackup", $(this).attr("onclick"));
// 			$(this).attr("onclick", "");
// 		}
// 	});
// }
// function enablelistviewclick() {
// 	var listViewhref = $('[data-role="listview"] li:not([data-role="list-divider"])').find('a');
// 	$(listViewhref).each(function () {
// 		if (BRVUtil.checkValue($(this).attr("onclickbackup"))) {
// 			$(this).attr("onclick", $(this).attr("onclickbackup"));
// 			$(this).attr("onclickbackup", "");
// 		}
// 	});
// }

function checkButtonEmptyMandatoryFields(buttonID) {
    app.debug('FUNCTION: checkButtonEmptyMandatoryFields');

    var returnValue = false;
    var buttonFound = false;
    var mandatorymessage = null;
    var checkmandatory = false;

    var doContinue = true;

    try {
        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];
        // Get formfields obj
        var formFields = JSONObject.content.fields;
        // Get footer buttons obj
        var footerButtons = JSONObject.content.buttons;
    } catch (e) {
        doContinue = false;
        returnValue = false;
    }

    // Check if we are in screen with fields and buttons, otherwise just continue!
    if (doContinue && BRVUtil.checkValue(buttonID)) {

        // Try to find a button in footer with this id
        if (!buttonFound && typeof footerButtons != 'undefined') {
            for (var btni = 0; btni < footerButtons.length; btni++) {
                if (buttonID == footerButtons[btni].id) {
                    checkmandatory = BRVUtil.parseBoolean(footerButtons[btni].onclick.checkmandatory) ? true : false;
                    mandatorymessage = BRVUtil.checkValue(footerButtons[btni].onclick.mandatorymessage) ? footerButtons[btni].onclick.mandatorymessage : '';
                    buttonFound = true;
                    break;
                }
            }
        }

        // Try to find a button in form with this id
        if (!buttonFound && typeof formFields != 'undefined') {
            for (var btni = 0; btni < formFields.length; btni++) {
                if (buttonID == formFields[btni].id) {
                    checkmandatory = BRVUtil.parseBoolean(formFields[btni].onclick.checkmandatory) ? true : false;
                    mandatorymessage = BRVUtil.checkValue(formFields[btni].onclick.mandatorymessage) ? formFields[btni].onclick.mandatorymessage : '';
                    buttonFound = true;
                    break;
                }
            }
        }

        if (checkmandatory) {
            var nfields = formFields.length;
            for (var fldi = 0; fldi < nfields; fldi++) {
                var fldID = formFields[fldi].id;
                var fldType = formFields[fldi].type;
                var fldName = formFields[fldi].name;
                var fldMandatory = BRVUtil.parseBoolean(formFields[fldi].mandatory) ? true : false;

                if ($('#' + fldID).is("p")) {
                    fldValue = $('#' + fldID).text();
                } else if ($('#' + fldID).is(':checkbox')) {
                    fldValue = $('#' + fldID).prop('checked') ? 'on' : '';
                } else {
                    fldValue = $('#' + fldID).val();
                }

                // Check if field is hidden, then do not check!!
                if (fldMandatory && ($('#' + fldID).hasClass('builderhidden') || $('#' + fldID).is(":hidden"))) {
                    fldMandatory = false;
                }

                if (fldMandatory && !BRVUtil.checkValue(fldValue)) {
                    returnValue = true;
                    if ($('#' + fldID).is("select") || $('#' + fldID).is("textarea")) {
                        $('#' + fldID).css("border-color", "#ff0000");
                    } else if ($('#' + fldID).is(":checkbox")) {
                        $("label[for=" + $('#' + fldID).attr("id") + "]").css("border-color", "#ff0000");
                    } else {
                        $('#' + fldID).parent().css("border-color", "#ff0000");
                    }
                } else {
                    if ($('#' + fldID).is("select") || $('#' + fldID).is("textarea")) {
                        $('#' + fldID).css("border-color", "#8c8c8c");
                    } else if ($('#' + fldID).is(":checkbox")) {
                        $("label[for=" + $('#' + fldID).attr("id") + "]").css("border-color", "#8c8c8c");
                    } else {
                        $('#' + fldID).parent().css("border-color", "#8c8c8c");
                    }
                }
            }

            // Check if there's a message to show
            if (returnValue && BRVUtil.checkValue(mandatorymessage)) {
                app.showMessage(mandatorymessage, 0, false);
            }
        }
    }

    return returnValue;
}

function disableuserinput() {
    app.debug('EVENT: disableuserinput');
    app.screenloaddone = false;
    try {
        $('body').on('vclick', function(e) {
            app.debug('disableduserinput');
            e.preventDefault();
        });
    } catch (err) {}
}

function enableuserinput() {
    app.debug('EVENT: enableuserinput');
    app.screenloaddone = true;
    setTimeout(function() {
        app.debug('enableduserinput');
        try {
            $('body').off('vclick');
        } catch (err) {}
    }, 50);
}

function disablefooterbuttons() {
    if (!app.isBuilder) { // only when it's not appbuilder
        app.debug('EVENT: disablefooterbuttons');
        $('[data-role="footer"] li a').each(function() {
            if (BRVUtil.checkValue($(this).attr("onclick"))) {
                $(this).attr("onclickbackup", $(this).attr("onclick"));
                $(this).attr("onclick", "");
            }
        });
    }
}

function enablefooterbuttons() {
    if (!app.isBuilder) { // only when it's not appbuilder
        app.debug('EVENT: enablefooterbuttons');
        $('[data-role="footer"] li a').each(function() {
            if (BRVUtil.checkValue($(this).attr("onclickbackup"))) {
                $(this).attr("onclick", $(this).attr("onclickbackup"));
                $(this).attr("onclickbackup", "");
            }
        });
    }
}

function str_to_b64(str) {
    str = str.replace(/\u20AC/g, '\u0080'); // Convert Euro sign to UTF!
    str = BRVUtil.checkUnicode(str);
    return window.btoa(str);
}

function b64_to_str(str) {
    try {
        if (BRVUtil.checkValue(str)) {
            //			str = str.replace(/\s/g, '');
            str = window.atob(str);
            str = str.replace(/\u0080/g, '\u20AC'); // Convert UTF to Euro sign!
            return str;
        } else {
            return str;
        }
    } catch (e) {
        // app.lastErrorMsg = e.toString();
        // getScreenFromJSONDefault('errorscreen');
        //		return str;	// This causes issues, somehow query select gets exta emoty {}. Find way to solve this issue!
    }

}

function base64ToUint8Array(base64) {
    var raw = atob(base64);
    var uint8Array = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
}

function utf8_to_b64(str) {
    return str_to_b64(str);
}

function b64_to_utf8(str) {
    // if (BRVUtil.checkValue(str)) {
    // 	// return decodeURIComponent(escape(window.atob(str)));
    // 	str = str.replace(/\s/g, '');
    // 	return window.atob(str);
    // } else {
    // 	return str;
    // }
    return b64_to_str(str);
}


//----------------------------------------------------------

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------
// APP
//---------------------------------------------------------
var app = {
    //---------------------------------------------------------
    // Check these settings before build!!!
    //---------------------------------------------------------
    doDebug: false, // For debugging only!!!  (debug to console)
    doDebugToScreen: false, // For debugging only!!!  (debug to App screen)
    doConsoleErrors: false, // Show script errors to console

    // Do not kill demo on startup. So we don't need to load JSON definition on every startup!
    // In APP settings menu demo kan be killed by user.
    killDemoOnStartup: false, // Reset demo on startup ?

    nameApp: '',
    // APP VERSION : 119.001.0001
    versionBuilder: '1.1.9', // App version 
    versionApp: '1.1.9', // App version 
    versionBuild: '101.202.303', // DON'T CHANGE. WILL BE REPLACED BY IONIC BUILD PROCESS!!!!! 
    versionJSON: '', // JSON version
    versionJSONStatus: '',
    encryptrequest: true, // Encrypt/Decrypt requests

    LoadLocalDefinition: false, // Load local app definition '_BRVDemoApp.js'
    demoAvailable: true, // Disable DEMO-login. Do not use!! Cause Apple will not be able to validate the Themed App without demo!!!!
    demoActivationUser: '',
    demoActivationCode: '',
    includeJs: '',
    isdemo: false,

    loginMethod: null,
    loginMethods: new Object(),
    logintype: '',

    loginScreenMessage: '',

    demoActivations: new Array(),
    userregistration: new Object(),

    WEPID_MOBILE: '_MOBILE', // FINAL!!
    wdsurl: 'https://wds.brancheview.com/', // FINAL!!

    productcode: 'MOBILE', // Productcode in themedconfig.js can overwrite this setting!!
    officecode: '',
    clientcode: '',
    userToken: '',

    FidesqueAPI: 'https://my.fidesque.com/fidesque-oauth/oauth/token',
    // FidesqueAPI: 'https://my.fidesque.net/oauth-server/oauth/token',

    FidesqueAuthToken: 'brancheview-app:22d82$9870#bg$$5fg5',

    FidesqueBaseUrl: 'https://my.fidesque.com',
    // FidesqueBaseUrl: 'https://my.fidesque.net',


    QUERY_GENERAL: 'QUERY_GENERAL',
    //---------------------------------------------------------
    //---------------------------------------------------------

    defaultDocumentName: 'document.pdf',

    defaultDocumentNameWOext: 'document',

    deviceStatus: 9, // 1: Development, 2: Test, 9: Productie	

    wsErrorMsg: '',
    wsErrorCode: '',

    isOnline: true,

    isBuilder: false,

    hasError: false,
    lastErrorMsg: '',
    lastErrorMsgTmp: '',

    startScreen: '',
    currentScreen: '',

    screenloaddone: true,

    updateJSON: false,
    screenJSONData: new Object(),

    JSONObject: new Object(),
    JSONObjectDefault: new Object(),
    screenMode: new Object(),
    screenFormSaveSuccess: new Object(),
    screenSaveSuccess: new Object(),
    paramObject: new Object(),
    ObjectQueries: new Array(),
    ObjectQueriesTmp: new Array(),

    BindObjectQueries: new Array(),

    HeaderInfoQueries: new Array(),

    disableFooterButtons: new Array(),

    // BubbleCountQueryObj: new Array(),
    BufferedQueryObj: new Array(),
    BufferedWidgetObj: new Array(),

    SelectList: new Array(),
    targetObject: null,
    targetObjectType: null,
    targetObjectKeyFld: null,

    appPageRoute: new Array(),

    maxServiceRetry: 2,
    currentRetry: 0,
    lastdoRequestWS: new Object(),

    activated: false,
    isnewactivation: false,
    multiuser: false,

    userActivationInit: true,

    askForDefinitionUpdate: true,

    showWhatsNewOnStart: false,

    appBlocked: false,
    appBlockedMsg: null,

    wsurl: '',
    wsuser: '',
    wspwd: '',
    adm_code: '',
    adminAccess: '',
    adminList: '',
    oasurl: '',
    apikeyOAS: '',


    sendGridUrl: 'https://scanboeken-emailgateway.azurewebsites.net/emailgateway',
    sendGridApi: 'MiZc2zuuzFBnir0tXnIV',

    License: '',

    checkPassword: false,
    checkPincode: false,
    newPincodeObj: new Object(),
    pincodeMandatory: false,

    avserial: '',
    deviceid: '',
    devicename: '',
    deviceloggedin: false,
    deviceStartApp: '',
    activationcode: '',
    activationuser: '',
    activeusername: '',

    ImpersionationUserID: '',
    IsAfUser: false,

    request: null,
    // timeout: 20000,
    timeout: 25000,
    // timeout: 90000,

    LastTimeoutHandler: 0,

    successCallback: null,
    errorCallback: null,

    phoneStorage: window.localStorage,
    tempStorage: window.sessionStorage,

    // Vars for live scrolling
    iRecordCount: 0,
    iPageSize: 35,
    iCurrentPage: 1,
    iOffset: 1,
    iPageCount: 0,
    // cPiTag            					: '',
    execFunction: null,
    // -----------------------

    activateLiCheckboxes: null,

    contentHeight: 0,

    activeRequestCount: 0,

    // selectInputTimeout: 800,
    selectInputTimeout: 0, // 0 = disabled, use 'Enter instead'

    initialize: function() {

        console.log('initialize App test');
        app.debug('FUNCTION: initialize');
        this.bindEvents();

        // Check for themedconfig file.
        try {

            // Include themedconfig file, only when it's not Browser mode.
            if (!BRVUtil.isBrowser()) {
                //      require("js/themedconfig.js");
                if (typeof builder == 'undefined' && !BRVUtil.isDeviceEmulator()) {
                    // It's App on mobile device
                    require("../theme/app/themedconfig.js");
                } else {
                    // It's App Builder
                    require("js/themedconfig.js");
                }
            }

            // Set Themed App settings!
            if (BRVUtil.checkValue(themedconfig)) {
                BRVUtil.checkValue(themedconfig.productcode) ? app.productcode = themedconfig.productcode.toUpperCase() : '';
                BRVUtil.checkValue(themedconfig.officecode) ? app.officecode = themedconfig.officecode.toUpperCase() : '';
                BRVUtil.checkValue(themedconfig.clientcode) ? app.clientcode = themedconfig.clientcode.toUpperCase() : '';
                BRVUtil.checkValue(themedconfig.identifier) ? app.identifier = themedconfig.identifier.toLowerCase() : '';

                // // Check if there's a productcode in storage, so use it!!
                // var tmpProductCode = app.GetFromPhoneStorage('productcode');
                // (tmpProductCode) ? app.productcode = tmpProductCode : '';

            }
        } catch (e) {}

        // this.bindEvents();
    },

    debug: function(message) {
        if (this.doDebug) {
            console.log(message);
            // $("#content_table").append("<font size='1'>- " + message + "</font><br>");
        }
    },

    debugToScreen: function(message) {
        if (this.doDebugToScreen) {
            $("#content_table").append("<font size='1'>- " + message + "</font><br>");
        }
    },

    bindEvents: function() {
        app.debug('FUNCTION: bindEvents');
        // document.addEventListener('deviceready', app.onDeviceReady(), false);
        setTimeout(function() {
            document.addEventListener('deviceready', app.beforeOnDeviceReady(), false);
        }, 200);
    },

    beforeOnDeviceReady: function() {
        setTimeout(function() {
            app.onDeviceReady();
        }, 500);
    },

    exitApp: function() {
        // if (device.platform.toLowerCase() == 'ios') {
        if (device.platform.toLowerCase() == 'ios' || BRVUtil.isBrowser()) {
            // When it's iOS device or BrowserApp we cannot close app, so we just logout!

            var label = 'Naar beginscherm?';
            (app.checkmultiuser() && app.activated) ? label = 'Gebruiker uitloggen?': '';

            app.ExitMsgActive = true;
            jQuery.confirm({
                title: '&nbsp;',
                content: label,
                buttons: {
                    ja: function() {
                        var action = (app.checkmultiuser() && app.activated) ? 'activateduserlogin' : 'init';
                        startApplication(action);
                    },
                    nee: function() {
                        app.ExitMsgActive = false;
                    }
                }
            });
        } else {
            app.ExitMsgActive = true;
            if (app.checkmultiuser() && app.activated) {
                jQuery.confirm({
                    title: '&nbsp;',
                    content: 'Afsluiten',
                    buttons: {
                        ja: function() {
                            navigator.app.exitApp();
                        },
                        nee: function() {
                            app.ExitMsgActive = false;
                        },
                        uitloggen: function() {
                            app.deviceloggedin = false;

                            startApplication('activateduserlogin');
                        }
                    }
                });
            } else {
                jQuery.confirm({
                    title: '&nbsp;',
                    content: 'Afsluiten',
                    buttons: {
                        ja: function() {
                            navigator.app.exitApp();
                        },
                        nee: function() {
                            app.ExitMsgActive = false;
                        }
                    }
                });
            }
        }

    },


    onOnline: function() {
        app.isOnline = true;
        $('#offlineFooter').remove();
    },
    onOffline: function() {
        if (app.isOnline) {
            app.isOnline = false;
            var lblOffline = app.translateMessage('NO_INTERNET_CONNECTION');
            $('#page-home').append('<div data-role="footer" data-position="fixed" data-tap-toggle="false" data-hide-during-focus="" id="offlineFooter"><center><i>' + lblOffline + '</i></center></div>').trigger("create");
            $('#offlineFooter').css("background-color", "#FF0000");
            $('#offlineFooter').css("border-color", "#FF0000");
            try {
                navigator.vibrate([200, 100, 200]);
            } catch (err) {}
        }
    },


    onDeviceReady: function() {

        // Builder	
        try {
            if (builder) app.isBuilder = true;
        } catch (err) {}

        // Check online status!
        document.addEventListener("offline", app.onOffline, false);
        document.addEventListener("online", app.onOnline, false);
        //

        // Prevent doubleclick for AppInBrowser
        if (BRVUtil.isBrowser()) {
            document.addEventListener('dblclick', (event) => {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }, true);
        }

        setTimeout(function() {
            if (app.isOnline && app.checkNetwork()) {
                // First check if we need to build the SWL database!
                BRVDatabase.successCallBack = function() { app.onDeviceReady_step1(); };
                BRVDatabase.init();
                BRVDatabase.createTableUserActivations();
            } else {
                app.stopLoading();
                app.wsErrorMsg = '';
                app.lastErrorMsg = app.translateMessage('NO_INTERNET_CONNECTION');
                getScreenFromJSONDefault('errorscreen', false);
                // app.showMessage('NO_INTERNET_CONNECTION', null, false);
                // app.onOffline();
            }
        }, 200);

    },

    onDeviceReady_step1: function() {
        var activated = app.GetFromPhoneStorage('activated');
        var avkey = app.GetFromPhoneStorage('avkey');
        var subscription = app.GetFromPhoneStorage('subscription');
        var userActivations = app.GetFromPhoneStorage('userActivations');

        var oaswsurl = app.GetFromPhoneStorage('oaswsurl');
        var apikeyoas = app.GetFromPhoneStorage('apikeyoas');

        if (BRVUtil.checkValue(avkey) && BRVUtil.checkValue(subscription) && BRVUtil.checkValue(userActivations) && BRVUtil.checkValue(oaswsurl) && BRVUtil.checkValue(apikeyoas)) {
            BRVDatabase.successCallBack = function() { app.onDeviceReady_step2(); };
            BRVDatabase.updateUserActivations(userActivations);
        } else {
            BRVDatabase.successCallBack = function() { app.onDeviceReady_step2(); };
            BRVDatabase.getUserActivations();
        }
    },

    onDeviceReady_step2: function() {
        BRVDatabase.successCallBack = null;
        app.onDeviceReady_step3();

        // Check if App has been activated or just lost it's activation data!!
        // app.checkValidActivation(app.onDeviceReady_step3);
    },

    onDeviceReady_step3: function() {
        if (BRVUtil.checkValue(app.GetFromPhoneStorage('avkey'))) {} else {
            app.encryptrequest = false;
        }

        app.debug('FUNCTION: onDeviceReady');

        app.stopLoading();

        // // Builder	
        // try {
        // 	if (builder) app.isBuilder = true;
        // } catch (err) { }

        window.onerror = function(msg, url, lineNo, columnNo, error) {
            app.debug("Window error: " + msg + ", " + url + ", line " + lineNo);

            if (app.doConsoleErrors) {
                console.log("Window error: " + msg + ", " + url + ", line " + lineNo);
            }

            // app.showError(msg);
            app.lastErrorMsg = msg;
            //app.lastErrorMsg = "Window error: " + msg + ", " + url + ", lineNo " + lineNo;
            getScreenFromJSONDefault('errorscreen', true);
            return true;
        };

        // When activated as demo, remove some settings.
        app.debug('Killdemo: ' + app.killDemoOnStartup);
        // app.debug('isDemo: ' + app.GetFromPhoneStorage('isdemo'));
        app.debug('isDemo: ' + app.isdemo);

        // if (app.killDemoOnStartup && app.GetFromPhoneStorage('isdemo') == 'true') {
        if (app.killDemoOnStartup && app.isdemo) {
            app.debug('Kill demo vars');
            app.ClearPhoneStorage();
            app.subscription = '';
            app.YOBsubscription = '';
            // Now device needs new activation

            setTimeout(function() {
                app.onDeviceReady(); // After clearing demo settings restart onDeviceReady with a short timeout
            }, 500);

        } else {

            try {
                jQuery.mobile.phonegapNavigationEnabled = false;
                jQuery.mobile.allowCrossDomainPages = true;
            } catch (err) {}

            // Set dialog defaults
            jconfirm.defaults = {
                alignMiddle: true,
                backgroundDismissAnimation: 'shake',
                // theme: 'supervan',
                theme: 'brancheview',
                animationBounce: 2.5,
                boxWidth: '85%',
                useBootstrap: false
            };

            // Set datepicker default regional settings
            jQuery.datepicker.setDefaults(jQuery.datepicker.regional["nl"]);

            // Disable the Go Button on the Android and iOS Virtual Keyboard
            // $('input').keypress(function (e) {
            // 	var code = (e.keyCode ? e.keyCode : e.which);
            // 	if ((code == 13) || (code == 10)) {
            // 		$(this).blur();
            // 		return false;
            // 	}
            // });

            // Bind event on tophold
            // $(function(){
            // 	$( "#page-home" ).bind( "taphold", tapholdHandler );
            // 	function tapholdHandler( event ){
            // 	}
            // });

            // Bind event on swiperight, goBack -1
            // $(function(){
            // 	$( "#page-home" ).on( "swiperight", swiperightHandler );
            // 	function swiperightHandler( event ){
            // 		var panelActive = $('[data-role="panel"]').hasClass('ui-panel-open'); // Find panel
            // 		var popupLiveGridActive = $('[data-url="popupLiveGrid"]').hasClass('ui-page-active'); // Find popupLiveGrid
            // 		var NewViewsloginActive = $('[data-url="newviewslogin"]').hasClass('ui-page-active'); // Find NewViewsLogin
            // 		var SignatureScreenActive = $('[data-url="SignatureScreen"]').hasClass('ui-page-active'); // Find Signaturescreen
            // 		var jconfirmActive = $('div').hasClass('jconfirm'); // Find jconfirm popup
            // 		// ToDo: check for attr isPopupScreen="true"
            // 		if (panelActive) {
            // 			// If panel is active close it.
            // 			var panelID = $('[data-role="panel"]')[0].id;
            // 			$("#" + panelID).panel("close");
            // 		} else
            // 			if (popupLiveGridActive) {
            // 				// If popupLiveGrid is active close it!
            // 				var popupID = $('[data-url="popupLiveGrid"]')[0].id;
            // 				$("#" + popupID).find('a[data-rel="back"]')[0].click();
            // 			} else
            // 				if (NewViewsloginActive) {
            // 					// If newviewslogin is active close it!
            // 					var popupID = $('[data-url="newviewslogin"]')[0].id;
            // 					$("#" + popupID).find('a[data-rel="back"]')[0].click();
            // 				} else
            // 					if (SignatureScreenActive) {
            // 						// If SignatureScreen is active close it!
            // 						var popupID = $('[data-url="SignatureScreen"]')[0].id;
            // 						$("#" + popupID).find('a[data-rel="back"]')[0].click();
            // 					} else
            // 						if (jconfirmActive) {
            // 							// do nothing!!!
            // 						} else
            // 							if (app.startScreen == '' || app.startScreen == app.currentScreen) {
            // 								// Only when on home (infoscreen) close the app
            // 								if (!app.ExitMsgActive) {
            // 									app.exitApp();
            // 								}
            // 							} else {
            // 								// Go back one page.
            // 								try {
            // 									app.goPageRoute(-1);
            // 								} catch (err) { }
            // 							}
            // 	}
            // });

            if (!app.isBuilder && !BRVUtil.isBrowser()) {
                // Detect keyboard ga,go,done,enter keyboard buttons
                // then blur current field.
                document.addEventListener("keypress", function(e) {
                    var code = (e.keyCode) ? e.keyCode : e.which;
                    if ((code == 13) || (code == 10)) {
                        try {
                            // var fieldId = e.srcElement.id;
                            var fieldId = e.target.id;
                            if ($('#' + fieldId).is("textarea")) {
                                // It's textarea so do nothing!!!
                            } else {
                                // $('#'+fieldId).blur();

                                var isInputSearch = $('#' + fieldId).parents().hasClass('ui-input-search'); // Check if it's input search fiel which triggers popupLiveGrid!
                                if (isInputSearch) {
                                    // Do nothing at this point!!!
                                } else {
                                    $('#' + fieldId).blur();
                                }

                            }
                        } catch (e) {}
                        return false;
                    }
                });
            }

            document.addEventListener("backbutton", function(e) {

                if (device.platform.toLowerCase() == 'android') {
                    e.preventDefault();
                }


                // if (app.startScreen == '' || app.startScreen == app.currentScreen) {
                // 	// Only when on home (infoscreen) close the app
                // 	if (!app.ExitMsgActive) {
                // 		app.exitApp();
                // 	}
                // }

                // // Check device back-button click
                // var panelActive = $('[data-role="panel"]').hasClass('ui-panel-open'); // Find panel
                // var popupLiveGridActive = $('[data-url="popupLiveGrid"]').hasClass('ui-page-active'); // Find popupLiveGrid
                // var NewViewsloginActive = $('[data-url="newviewslogin"]').hasClass('ui-page-active'); // Find NewViewsLogin
                // var SignatureScreenActive = $('[data-url="SignatureScreen"]').hasClass('ui-page-active'); // Find Signaturescreen
                // var jconfirmActive = $('div').hasClass('jconfirm'); // Find jconfirm popup
                // // ToDo: check for attr isPopupScreen="true"
                // if (panelActive) {
                // 	// If panel is active close it.
                // 	var panelID = $('[data-role="panel"]')[0].id;
                // 	$("#" + panelID).panel("close");
                // } else
                // 	if (popupLiveGridActive) {
                // 		// If popupLiveGrid is active close it!
                // 		var popupID = $('[data-url="popupLiveGrid"]')[0].id;
                // 		$("#" + popupID).find('a[data-rel="back"]')[0].click();
                // 	} else
                // 		if (NewViewsloginActive) {
                // 			// If newviewslogin is active close it!
                // 			var popupID = $('[data-url="newviewslogin"]')[0].id;
                // 			$("#" + popupID).find('a[data-rel="back"]')[0].click();
                // 		} else
                // 			if (SignatureScreenActive) {
                // 				// If SignatureScreen is active close it!
                // 				var popupID = $('[data-url="SignatureScreen"]')[0].id;
                // 				$("#" + popupID).find('a[data-rel="back"]')[0].click();
                // 			} else
                // 				if (jconfirmActive) {
                // 					// do nothing!!!
                // 				} else
                // 					if (app.startScreen == '' || app.startScreen == app.currentScreen) {
                // 						// Only when on home (infoscreen) close the app
                // 						if (!app.ExitMsgActive) {
                // 							app.exitApp();
                // 						}
                // 					} else {
                // 						// Go back one page.
                // 						try {
                // 							app.goPageRoute(-1);
                // 						} catch (err) { }
                // 					}
            }, false);


            // Set 'cordova-plugin-inappbrowser' to window.open
            // try {
            // window.open = cordova.InAppBrowser.open;
            // } catch (err) { }

            // // Check for a href links.
            // $(document).on('click', 'a[href^="http"], a[href^="https"]', function(e){
            // // $(document).on('click', 'a[href^="http"], a[href^="https"], :not(a[href*="maps.google"]) ', function(e){
            // // $(document).on('click', 'a[href^="htt"]:not([href*="maps.google"])  ', function(e){
            // 	e.preventDefault();
            // 	var $this = $(this); 
            // 	var target = $this.data('inAppBrowser') || '_blank';
            // 	// window.open($this.attr('href'), target, 'location=no');
            // 	// window.open($this.attr('href'), target, 'location=yes, hideurlbar=yes, scrollbars=yes');
            // 	// cordova.InAppBrowser.open($this.attr('href'), target, 'location=yes, hideurlbar=yes, scrollbars=yes');
            // 	// window.open($this.attr('href'), '_system', 'location=no');

            // });

            // -----------------------------------------------------------------------
            // Fetch all ahref links, except those who start with 'javascript:' or '#'
            // -----------------------------------------------------------------------
            // = is exactly equal
            // != is not equal
            // ^= is starts with
            // $= is ends with
            // *= is contains
            // ~= is contains word
            // |= is starts with prefix (i.e., |= "prefix" matches "prefix-...")
            // $(document).on('click', ' a:not([href^="javascript:"],[href^="\#"]) ', function(e){

            try {
                $(document).on('click', ' a:not([href^="javascript:"],[href^="\#"],[class*="datepicker"]) ', function(e) {
                    if ((typeof $(this).attr('href')) !== 'undefined') { // Check if <a> has href attribute (Builder has some without href)
                        e.preventDefault();
                        var $this = $(this);
                        if (app.isBuilder || BRVUtil.isBrowser() || BRVUtil.isRippleEmulator()) {
                            window.open($this.attr('href'), '_system', 'location=no');
                        } else {
                            cordova.InAppBrowser.open($this.attr('href'), '_system', 'location=no');
                        }
                    }
                });
            } catch (err) {}

            app.bindAjaxEvents();

            // Check if there's a productcode in storage, so use it!!
            var tmpProductCode = app.GetFromPhoneStorage('productcode');
            (tmpProductCode) ? app.productcode = tmpProductCode: '';


            app.oasurl = app.GetFromPhoneStorage('oaswsurl');
            app.appJSON = b64_to_str(app.GetFromPhoneStorage('appjson'));

            app.versionJSON = app.GetFromPhoneStorage('appjsonversion');
            app.versionJSONStatus = app.GetFromPhoneStorage('appjsonversionstatus');

            app.appJSONDefault = defaultJSONObject;

            app.activated = app.GetFromPhoneStorage('activated');
            app.apikeyOAS = app.GetFromPhoneStorage('apikeyoas');
            app.subscription = app.GetFromPhoneStorage('subscription');
            app.YOBsubscription = app.GetFromPhoneStorage('YOBsubscription');

            app.deviceid = app.getDeviceID();

            // var deviceModel = (BRVUtil.checkValue(device.model)) ? device.model : 'Unknown';
            // var devicePlatform = (BRVUtil.checkValue(device.platform)) ? device.platform : 'Unknown';
            // var deviceVersion = (BRVUtil.checkValue(device.version)) ? device.version : 'Unknown';
            // app.devicename = deviceModel + ' ' + devicePlatform + ' ' + deviceVersion;
            app.devicename = app.getDeviceName();

            // if ( app.isBuilder) { app.devicename = 'AppBuilder'; }
            // if ( BRVUtil.isDeviceEmulator() ) {	app.devicename = 'Device emulator'; }
            // if ( BRVUtil.isRippleEmulator() ) { app.devicename = 'Browser Ripple Emulator'; }
            // if ( BRVUtil.isBrowser() ) { app.devicename = 'Browser App'; }

            try {
                // Set IOS status bar
                StatusBar.overlaysWebView(false);
                // StatusBar.backgroundColorByName( "white" );
                // StatusBar.hide();
            } catch (err) {}

            app.bindWindowScroll();


            // When its App Browser then resize some elements when user resizes browser!!
            if (BRVUtil.isBrowser()) {
                $(window).resize(function() { setContentTableSize(); });
            }


            app.receivedEvent('deviceready');
        }
    },

    bindAjaxEvents: function() {
        $(document).bind("ajaxStart", function() {
            app.debug('EVENT: ajaxStart');
            app.startLoading();
            app.activeRequestCount = 0;
            // Disable footer buttons
            // disablefooterbuttons();
            disableuserinput();
        }).bind("ajaxStop", function() {
            app.debug('EVENT: ajaxStop ');
            app.activeRequestCount = 0;
            enableuserinput();
            setTimeout(function() {
                app.stopLoading();
            }, 100); // Add small delay for hiding loading thing!
        }).bind("ajaxSend", function() {
            app.debug('EVENT: ajaxSend');
            app.activeRequestCount++;
            app.startLoading();
        }).bind("ajaxSuccess", function() {
            app.debug('EVENT: ajaxSuccess');
        }).bind("ajaxError", function() {
            app.debug('EVENT: ajaxError');
            if (app.activeRequestCount > 0) {
                app.activeRequestCount--;
            }
            if (app.activeRequestCount == 0) {
                app.stopLoading();
                // Enable footer buttons
                // enablefooterbuttons();
            }
        }).bind("ajaxComplete", function() {
            app.debug('EVENT: ajaxComplete');
            (app.activeRequestCount > 0) ? app.activeRequestCount--: '';
            if (app.activeRequestCount == 0) {
                setTimeout(function() {
                    app.stopLoading();
                }, 100);
            }
        }).bind("beforeSend", function() {
            app.debug('EVENT: ajax beforeSend');
        }).bind("success", function() {
            app.debug('EVENT: ajax success');
        }).bind("error", function() {
            app.debug('EVENT: ajax error');
        }).bind("complete", function() {
            app.debug('EVENT: ajax complete');
        });
    },


    bindWindowScroll: function() {
        if (BRVUtil.isBrowser()) {
            $('#content_table').unbind('scroll'); // First unbind event
            $('#content_table').scroll(function() {
                // Check if panel is opened, then close before scrolling.
                var panelActive = $('[data-role="panel"]').hasClass('ui-panel-open'); // Find panel
                if (panelActive) {
                    // If panel is active close it.
                    var panelID = $('[data-role="panel"]')[0].id;
                    $("#" + panelID).panel("close");
                }

                var scrollTop = Math.round(document.getElementById("content_table").scrollTop);
                var scrollPos = Math.round(document.getElementById("content_table").scrollHeight - document.getElementById("content_table").offsetHeight);

                if (scrollTop >= scrollPos) {
                    app.iOffset = app.iOffset + app.iPageSize;
                    if ((app.iOffset <= app.iRecordCount) && (app.iCurrentPage <= app.iPageCount - 1)) {
                        BRVUtil.tryFunction(app.execFunction);
                    } else {
                        //						console.log('END OF PAGE!!!');
                        // Detect end of listview scroll
                        //						var listViewID = $('[data-role="listview"]')[0].id;
                        //						console.log('listview: ', listViewID);
                    }
                }

            });
        } else {
            $(window).unbind('scroll'); // First unbind event
            $(window).scroll(function() {

                // Check if panel is opened, then close before scrolling.
                var panelActive = $('[data-role="panel"]').hasClass('ui-panel-open'); // Find panel
                if (panelActive) {
                    // If panel is active close it.
                    var panelID = $('[data-role="panel"]')[0].id;
                    $("#" + panelID).panel("close");
                }

                // // if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                // if ( Math.round($(window).scrollTop()) >= Math.round($(document).height() - $(window).height())) {
                // 	app.iOffset = app.iOffset + app.iPageSize;
                // 	if ((app.iOffset <= app.iRecordCount) && (app.iCurrentPage <= app.iPageCount - 1)) {
                // 		BRVUtil.tryFunction(app.execFunction);
                // 	}
                // }

                var isPopup = $('[data-role="popup"]').hasClass('ui-popup'); // Find panel
                var listView = $('[data-role="listview"]').hasClass('ui-listview'); // Find panel
                var listViewCols = $('[data-role="listviewcols"]').hasClass('ui-listview'); // Find panel

                if (!isPopup && (listView || listViewCols)) {
                    if (Math.round($(window).scrollTop()) >= Math.round($(document).height() - $(window).height())) {
                        app.iOffset = app.iOffset + app.iPageSize;
                        if ((app.iOffset <= app.iRecordCount) && (app.iCurrentPage <= app.iPageCount - 1)) {
                            BRVUtil.tryFunction(app.execFunction);
                        }
                    }
                }
            });
        }
    },

    receivedEvent: function(id) {
        app.debug('FUNCTION: receivedEvent, id:' + id);
        // startApplication('init');

        // var action = (app.multiuser && app.activated) ? 'activateduserlogin' : 'init';
        var action = (app.checkmultiuser() && app.activated) ? 'activateduserlogin' : 'init';
        startApplication(action);
    },

    checkNetwork: function() {
        var returnValue = true;
        try {
            var connectionType = navigator.network.connection.type;
            connectionType = connectionType.toUpperCase();
            if (connectionType == 'NONE') {
                // app.showError('NETWORK_NONE', 'function: checkNetwork');
                // app.lastErrorMsg = 'NETWORK_NONE';	
                returnValue = false;
            }
        } catch (err) {}
        return returnValue;
    },

    getDeviceName: function() {
        var devicename = 'Unknown device';
        try {
            var deviceModel = (BRVUtil.checkValue(device.model)) ? device.model : 'Unknown';
            var devicePlatform = (BRVUtil.checkValue(device.platform)) ? device.platform : 'Unknown';
            var deviceVersion = (BRVUtil.checkValue(device.version)) ? device.version : 'Unknown';
            devicename = deviceModel + ' ' + devicePlatform + ' ' + deviceVersion;

            if (app.isBuilder) { devicename = 'AppBuilder'; }
            if (BRVUtil.isDeviceEmulator()) { devicename = 'Device emulator'; }
            if (BRVUtil.isRippleEmulator()) { devicename = 'Browser Ripple Emulator'; }
            if (BRVUtil.isBrowser()) { devicename = 'Browser App'; }

        } catch (err) {}

        return devicename;
    },

    getDeviceID: function(action) {
        var deviceID = '';
        switch (action) {
            case "new":
                var TimeStamp = BRVUtil.strTimeStamp();

                // Create new deviceID
                if (app.checkmultiuser()) {
                    var TimeStampMU = BRVUtil.strTimeStamp();
                    deviceID = BRVUtil.padr(device.uuid, '0', 10) + "-" + TimeStampMU + "_" + TimeStamp;
                } else {
                    deviceID = BRVUtil.padr(device.uuid, '0', 10) + "_" + TimeStamp;
                }
                app.AddToPhoneStorage('deviceID', deviceID);

                // // Add deviceID to keychain
                // if  (device.platform.toLowerCase() == 'ios') {
                // }


                break;

            case 'DUMMY': // color
                var dummy = '';
                break;

            default:
                var TimeStamp = BRVUtil.strTimeStamp();
                // Get current deviceID
                deviceID = app.GetFromPhoneStorage('deviceID');
                deviceID = BRVUtil.alltrim(deviceID);

                // // Get deviceID from keychain
                // if  (device.platform.toLowerCase() == 'ios') {
                // }

                // Use deviceID from storage othewhise get new deviceID + timestamp
                deviceID = (BRVUtil.checkValue(deviceID)) ? BRVUtil.padr(deviceID, '0', 10) : BRVUtil.padr(device.uuid, '0', 10) + "_" + TimeStamp;
                app.AddToPhoneStorage('deviceID', deviceID);
                break;
        }

        return deviceID;
    },



    //---------------------------------------------------------
    // Live Scrolling functions
    //---------------------------------------------------------
    resetLiveScrolling: function() {
        app.iRecordCount = 0;
        app.iPageSize = 35;
        app.iCurrentPage = 1;
        app.iOffset = 1;
        app.iPageCount = 0;
        app.execFunction = null;

        // $(window).scrollTop(0);	// Scroll back to top op screen.
        // $('#content_table').scrollTop(0);	// Scroll back to top op screen.

        app.bindWindowScroll(); // Rebind scroll event.
    },
    setLiveScrolling: function(jsonData, doFunction) {
        app.getresponseHeader(jsonData);
        app.execFunction = doFunction;
    },
    getresponseHeader: function(jsonData) {
        app.iCurrentPage = jsonData.response.queryresults[0].currentpage;
        app.iOffset = jsonData.response.queryresults[0].offset;
        app.iPageCount = jsonData.response.queryresults[0].pagecount;
        app.iPageSize = jsonData.response.queryresults[0].pagesize;
        app.iRecordCount = jsonData.response.queryresults[0].recordcount;
    },
    //---------------------------------------------------------

    //---------------------------------------------------------
    // Phone Storage functions
    //---------------------------------------------------------
    AddToPhoneStorage: function(key, value) {
        app.debug('FUNCTION: AddToPhoneStorage, key:' + key + ', value:' + value);
        var returnValue = true;
        this.phoneStorage.removeItem(key);
        this.phoneStorage.setItem(key, value);
        if (this.phoneStorage.getItem(key) != value) {
            returnValue = false;
        }
        return returnValue;
    },
    GetFromPhoneStorage: function(key) {
        app.debug('FUNCTION: GetFromPhoneStorage, key:' + key);
        var returnValue = this.phoneStorage.getItem(key);
        if (returnValue == null || returnValue == '') {
            returnValue = '';
        }
        return returnValue;
    },
    RemoveFromPhoneStorage: function(key) {
        app.debug('FUNCTION: RemoveFromPhoneStorage, key:' + key);
        var returnValue = true;
        this.phoneStorage.removeItem(key);
        return returnValue;
    },
    ClearPhoneStorage: function() {
        app.debug('FUNCTION: ClearPhoneStorage');
        var returnValue = true;
        this.phoneStorage.clear();
        return returnValue;
    },
    ClearExternal: function() {
        // Clear Newviews (DizzyData)
        app.RemoveFromPhoneStorage('nvuser');
        app.RemoveFromPhoneStorage('nvpwd');
        app.RemoveFromPhoneStorage('nvclnt');
        return true;
    },
    ClearDizzyData: function() {
        // Clear Newviews (DizzyData)
        app.RemoveFromPhoneStorage('nvuser');
        app.RemoveFromPhoneStorage('nvpwd');
        app.RemoveFromPhoneStorage('nvclnt');
        return true;
    },
    //---------------------------------------------------------

    //---------------------------------------------------------
    // Temp Storage functions
    //---------------------------------------------------------
    AddToTempStorage: function(key, value) {
        var returnValue = true;
        this.tempStorage.removeItem(key);
        this.tempStorage.setItem(key, value);
        if (this.tempStorage.getItem(key) != value) {
            returnValue = false;
        }
        return returnValue;
    },
    GetFromTempStorage: function(key) {
        var returnValue = this.tempStorage.getItem(key);
        if (returnValue == null || returnValue == '') {
            returnValue = '';
        }
        return returnValue;
    },
    RemoveFromTempStorage: function(key) {
        var returnValue = true;
        this.tempStorage.removeItem(key);
        return returnValue;
    },
    ClearTempStorage: function() {
        var returnValue = true;
        this.tempStorage.clear();
        return returnValue;
    },
    //---------------------------------------------------------

    //---------------------------------------------------------
    // Loading icon
    //---------------------------------------------------------
    startLoading: function(message) {
        message = (app.loadMessage) ? app.loadMessage : message;
        app.loadMessage = '';
        message = app.translateMessage(message);

        try {
            jQuery.mobile.loading('show', {
                text: message,
                textVisible: (message) ? true : false,
                theme: 'a',
                html: ""
            });
        } catch (err) {}

    },
    stopLoading: function() {
        // clearTimeout(this.timeoutHandler);

        // Clear all timers
        // try {
        // 	for(i=0; i<100; i++) {window.clearTimeout(i); }
        // } catch (err) {}

        try {
            jQuery.mobile.loading('hide');
        } catch (err) {}

        enableuserinput();
    },
    //---------------------------------------------------------

    //---------------------------------------------------------
    // Message functions
    //---------------------------------------------------------
    showError: function(errorMsg, details) {
        // if ( BRVUtil.checkValue(errorMsg) && errorMsg != app.lastErrorMsg ) {
        app.stopLoading();
        if (BRVUtil.checkValue(errorMsg)) {
            // errorMsg = app.translateMessage(errorMsg);
            app.lastErrorMsg = app.translateMessage(errorMsg);
            app.showMessage(errorMsg, 5000);
            //getScreenFromJSONDefault('errorscreen');

            app.addWDSLogging('error', errorMsg, details);
        }
    },
    showMessage: function(message, Delay, autoclose) {
        app.stopLoading();
        message = app.translateMessage(message);
        if (BRVUtil.checkValue(message)) {
            if (Delay == null) {
                Delay = 1000;
            }
            if (autoclose == null) {
                autoclose = true;
            }
            if (autoclose) {
                jQuery.confirm({
                    title: '&nbsp;',
                    content: message,
                    autoClose: 'ok|' + Delay,
                    buttons: {
                        ok: function(e) {}
                    }
                });
            } else {
                jQuery.confirm({
                    title: '&nbsp;',
                    content: message,
                    buttons: {
                        ok: function(e) {}
                    }
                });
            }
        }
    },

    translateMessage: function(message) {
        var message = (message) ? message : '';
        // var tempMessage = (message) ? BRVUtil.alltrim(message.toUpperCase()) : '';
        var tempMessage = (typeof message == 'string' && message) ? BRVUtil.alltrim(message.toUpperCase()) : '';
        switch (tempMessage) {
            // case "":

            case "DEVELOPMODE":
                message = "Let op!";
                message += "<br>Dit is een ontwikkeldevice.";
                break;
            case "TESTMODE":
                message = "Let op!";
                message += "<br>Dit is een testdevice.";
                break;
            case "UNDEFINED_ERROR":
                message = "Onbekende error.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "RUN ERROR":
                message = "Onbekende error. (run error)";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "NO ACCESS TO SPECIFIED ADMIN":
                message = "Geen toegang tot deze administratie.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "DOCUMENT NOT PRESENT":
                message = "Document niet gevonden.";
                break;
            case "SCANBOEKEN SETTINGS NOT VALID NOT PRESENT":
                // message = "Scanboeken instellingen niet correct.";
                message = "Instellingen voor het ophalen van Scanboeken documenten zijn niet correct.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "ERR_NOT_LOGGED_IN1":
                message = "Inloggen niet mogelijk.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "NO_LOGINMETHODS":
                message = "<br><center>Inloggen niet mogelijk.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.</center><br>";
                break;
            case "APP_JSON_ERROR":
                // message = "Error in APP definitie.";
                message = "Error in App data.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "NO_FILE_HANDLER_FOUND":
                message = "Error tijdens openen bestand.";
                break;
            case "INCOMPLETE_SETTINGS":
                message = "Applicatie instellingen zijn nog niet compleet.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "WEBSERVICE_TIMEOUT":
                message = "Timeout<br>De backoffice heeft niet op tijd gereageerd!";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "UPDATE_APP_DEFINITION":
                message = "Nieuwe versie is geïnstalleerd.";
                break;
            case "LOCAL_APP_DEFINITION":
                message = "Locale versie wordt geladen.";
                break;
            case "INITIAL_APP_DEFINITION":
                message = "Nieuwe versie wordt gedownload. Even geduld a.u.b.";
                break;
            case "ENTER_ACTIVATION_CODE":
                message = "Gebruikersnaam en wachtwoord moeten worden ingevoerd.";
                break;
            case "ACTIVATION_DEMO":
                message = "Wilt u inloggen als DEMO?";
                break;
            case "ENTER_USER_CREDENTIALS":
            case "ENTER_USER_ACTIVATION_CODE":
                message = "Voer uw gebruikersnaam en wachtwoord in.";
                break;
            case "NO_ACCESS":
                message = "Geen toegang!";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "MAX_MARKED_RECORDS":
                message = "Teveel regels gemarkeerd. Maximaal <1> toegestaan.";
                break;
            case "NO_MARKED_RECORDS":
                message = "Geen regels gemarkeerd.";
                break;
            case "NO_ADMIN_SELECTED":
                message = "Geen administratie geselecteerd.";
                break;
            case "OPEN_ADMIN_FIRST":
                message = "Er moet eerst een administratie worden geopend.";
                break;
            case "INVALID_PASSWORD":
                message = "Ongeldig toegangscode.";
                break;
            case "INVALID_OLD_PASSWORD":
                message = "Oude toegangscode is niet juist.";
                break;
            case "PASSWORD_MISMATCH":
                message = "Toegangscodes komen niet overeen.";
                break;
            case "PASSWORD_UPDATED":
                message = "Toegangscode is gewijzigd.";
                break;
            case "DEVICE_REGISTERD":
                message = "Registratie gelukt.";
                break;
            case "INVALID_PRODUCT":
                message = "Er is geen product gekoppeld.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "NO ACCESS TO WEP":
                message = "De backoffice is niet correct ingericht. (WEP)";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "USER_NOT_FOUND":
            case "BAD CREDENTIALS":
            case "INVALID_DEVICEID":
            case "INVALID_PREFIX":
            case "INVALID_CODE":
            case "INVALID_ACTIVATIONCODE":
                message = "Onjuiste gebruikersnaam of wachtwoord.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                // getScreenFromJSONDefault('errorscreen');
                break;
            case "DEVICE_ENDDATE":
                message = "De ingevoerde activatie is reeds verlopen.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "DONE":
            case "READY":
                message = "Gereed.";
                break;
            case "FAIL":
                message = "Niet gelukt.";
                break;
            case "SEND_MAIL_ERROR":
                message = "E-mail kon niet worden verstuurd:";
                break;
            case "INVALID_OPENITEMS":
                message = "Een of meerdere posten kunnen niet worden aangemaand vanwege de volgende oorzaken:";
                break;
            case "DEBTOR_NO_EMAIL":
                message = "Geen email bekend.";
                break;
            case "DEBTOR_BLOCKED":
                message = "Klant geblokkeerd.";
                break;
            case "DEBTOR_REM_BLOCKED":
                message = "Geblokkeerd voor aanmaningen.";
                break;
            case "DEBTOR_DIRECTDEBIT":
                message = "Klant mag worden geïncasserd.";
                break;
            case "DEBTOR_NOT_FOUND":
                message = "Klant onbekend.";
                break;
            case "INVOICE_BLOCKED":
                message = "Factuur geblokkeerd.";
                break;
            case "INVOICE_REM_BLOCKED":
                message = "Factuur geblokkeerd voor aanmaning.";
                break;
            case "INVOICE_NOT_EXPIRED":
                message = "Factuur niet vervallen.";
                break;
            case "INVOICE_NOT_RECEIVABLE":
                message = "Creditfactuur.";
                break;
            case "INVOICE_NOT_FOUND":
                message = "Factuur niet gevonden.";
                break;
            case "MISSING_EMAIL_ADMINSETTINGS":
                message = "Geen emailadres vastgelegd in de administratieinstellingen.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "MAILER_NOT_LOADED":
                // message = "Email object kan niet worden gestart.";
                message = "Email kan niet worden verzonden.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "REQUEST NOT FOUND":
                message = "Aktie kan niet worden uitgevoerd.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                // getScreenFromJSONDefault('errorscreen');
                break;
            case "NETWORK_NONE":
                message = "Er kan geen data worden opgehaald.";
                message += "<br>Controleer uw internetverbinding.";
                break;
            case "REMINDERS_SEND":
                message = "Aanmaningen zijn verstuurd.";
                break;
            case "RECORDS_UNMARKED":
                message = "Regels worden gedemarkeerd.";
                break;

            case "NO_WDS":
                message = "Communicatie met Backoffice is mislukt!";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "NO_OAS":
                message = "Communicatie met Backoffice is mislukt!";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "NO_BACKOFFICE":
                message = "Backoffice is niet beschikbaar.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                // getScreenFromJSONDefault('errorscreen');
                break;
            case "ERROR_DEFAULTDEF_LOAD":
                message = "Standaard app kan niet worden geladen.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "RECORD ADDED":
            case "RECORD UPDATED":
                // message = "Gegevens bijgewerkt.";
                message = ''; // Do not return a message!
                break;
            case "RECORD CLEANED":
                message = "Gegevens opgeschoond.";
                break;
            case "RECORD DELETED":
                // message = "Gegevens verwijderd.";
                message = ''; // Do not return a message!
                break;
            case "RECORD DELETE FAILED":
                message = "Verwijderen niet gelukt.";
                break;
            case "PAGE IS EMPTY":
                message = "Bladzijde is leeg.";
                break;
            case "RECORD NOT FOUND":
                message = "Gegevens niet gevonden.";
                break;
            case "RECORD INSERT FAILED":
                message = "Gegevens opslaan niet gelukt.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "RECORD INSERT IS DISABLED":
                message = "Gegevens opslaan niet toegestaan.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "GET_PRODUCTLIST":
            case "GET_DATA":
                message = "Ophalen gegevens.";
                break;
            case "RESET_APP":
                message = "Wilt u de huidige gebruiker afmelden?";
                // message += "<br>U dient dan opnieuw te registreren.";
                break;
            case "RESET_APP_CHK":
                message = "Weet u het zeker?";
                message += "<br>U dient dan opnieuw te registreren.";
                break;
            case "RESET_EXT":
                message = "Wilt u de externe koppelingen afmelden?";
                break;
            case "RESET_DIZZYDATA":
                message = "Wilt u de DizzyData koppelingen afmelden?";
                break;
            case "RESET_USERVIEW":
                message = "Wilt u alle gebruiker weergaven herstellen?";
                break;
            case "REACTIVATE_APP":
                message = "Wilt u heractiveren?";
                break;
            case "ACTION_ERROR":
                message = "Aktie kan niet worden uitgevoerd.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "ACTIVATE_DEMO":
                message = "Inloggen als DEMO?";
                break;

            case "USEDPRODUCTS_FOUND":
                message = 'Hoe wenst u de app nu te gebruiken?';
                break;
            case "ACTIVATION_FOUND":
                message = "<br>Er zijn gegevens gevonden van een eerdere registratie,";
                message += "<br>wenst u deze gegevens te gebruiken?";
                // message += "<br>Het toestel wordt dan automatisch geregistreerd.";
                break;
            case "ACTIVATION_FOUND_OFFICECLIENT":
                message = "<br>Er zijn gegevens gevonden van een eerdere registratie bij <1>,";
                message += "<br>wenst u deze gegevens te gebruiken?";
                // message += "<br>Het toestel wordt dan automatisch geregistreerd.";
                break;
            case "DEVICE_NOT_REGISTERD":
            case "DEVICE_NOT_REGISTERED":
                message = "Deze gebruiker is niet gekoppeld aan een abonnement (1).";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "ADMIN ERROR":
                message = "U heeft geen toegang meer tot deze administratie.<br>";
                message += "Selecteer een andere administratie.<br>";
                // message += "<br>Of neem contact op met uw Applicatie beheerder.";
                break;
            case "DEVICE_NOT_FOUND":
                message = "Deze gebruiker is niet gekoppeld aan een abonnement (3).";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "DELETE_DEVICE":
                message = "Deze gebruiker verwijderen?";
                break;
            case "ACCOUNTVIEW_ERROR":
                message = "Backoffice is niet bereikbaar.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "EMPTY_CREDENTIALS":
                message = "Inloggegevens niet compleet";
                break;
            case "INVALID_CREDENTIALS":
                message = "Inloggegevens niet correct.";
                break;
            case "DOWNLOAD_FAILED":
                message = "Download is mislukt.";
                break;
            case "DOWNLOADFILE":
                message = "Bestand downloaden.";
                break;
            case "SAVEANDOPEN":
                message = "Bestand openen.";
                break;
            case "UNABLE_CONVERT_FILE":
                message = "Bestand kan niet worden geconverteerd.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "UNABLE_CREATE_FILE":
                message = "Bestand kan niet worden aangemaakt.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "UNABLE_CREATE_DOC_DIR":
                message = "Documenten map kan niet worden aangemaakt.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "ADMIN_DIR_NOT_FOUND":
                message = "Administratie map niet gevonden.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "UPDATE_DEFINITION":
                message = "Er is een nieuwe versie beschikbaar. Wilt u deze ophalen?";
                break;
            case "START_APP":
                message = "Applicatie starten";
                break;
            case "BUILD_APP":
                message = "Gegevens ophalen";
                break;
            case "LOAD_DEVICE_INFO":
            case "GET_LIVEGRID_DATA":
            case "GET_BUFFEREDQUERY_DATA":
            case "CALLWEBSERVICE":
            case "CHANGE_PASSWORD":
            case "GET_SCREEN_DATA":
            case "GET_SCREEN":
            case "BUILD_SCREEN":
                message = "";
                break;
            case "GET_OAS_SETTINGS":
            case "GET_AV_LICENSE":
                message = "Ophalen licentiegegevens";
                break;
            case "GET_ADMIN_DATA":
                message = "Ophalen administratie data";
                break;
            case "SAVE_PICTURE_DATA":
            case "SAVE_FORM_DATA":
                message = "Gegevens opslaan";
                break;
            case "VALIDATE_PASSWORD":
                message = "Login valideren";
                break;
            case "ACTIVATE_DEVICE":
                message = "Registreren";
                break;
            case "LOAD_ADMIN_ROLES":
                message = "Administratie rechten ophalen";
                break;
            case "DELETEUSRLINK":
                message = "Documentkoppeling verwijderen";
                break;
            case "DELETEUSRLINKQ":
                message = "Documentkoppeling verwijderen?";
                break;
            case "DELETEUSRLINKFAILED":
                message = "Verwijderen niet gelukt.";
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
                // case "INVALID DATE":
                // 	message = "Ongeldige datum";
                // 	break;
                // case "UNKNOWN_SERCODE":
                // case "NO_SERCODE":
                // 	message = "Ongeldig afdrukscenario";
                // 	break;
                // case "UNKNOWN_OBJECTCODE":
                // case "NO_OBJECTCODE":
                // 	message = "Ongeldige objectcode";
                // 	break;
                // case "RECORD_NOT_FOUND":
                // 	message = "Niet gevonden";
                // 	break;
                // case "DOCUMENTMANAGER_NOT_AVAILABLE":
                // 	message = "Documentmanager niet beschikbaar";
                // 	break;
            case "NOT_AVAILABLE_IN_BUILDER":
                message = "Niet beschikbaar in de AppBuilder.";
                break;
            case "NOT_AVAILABLE_IN_BROWSER":
                message = "Niet beschikbaar in de Browser.";
                break;
            case "INVALID_QR_ACTIVATION":
                message = "Ongeldige QR-registratiecode.";
                break;
            case "RECONNECT":
                message = "Opnieuw verbinding maken.";
                break;
            case "NO_INTERNET_CONNECTION":
                message = "Geen internet verbinding!.";
                break;

            case "INVALID_ACTIVATIONCODE_OFFICE":
                message = "Onbekende kantoorcode: " + app.officecode;
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;
            case "INVALID_ACTIVATIONCODE_CLIENT":
                message = "Onbekende clientcode: " + app.clientcode;
                // message += "<br>Neem contact op met uw Applicatie beheerder.";
                break;

            case "REMOVE_RECORD":
                message = "Regel verwijderen?";
                break;

            case "SUCCESS_SENDUSERREGCONFIRMATION":
                message = "Uw aanvraag is verzonden!";
                break;

            case "ERROR_SENDUSERREGCONFIRMATION":
                message = "Versturen van de aanvraag is niet gelukt.<br>Probeer het later opnieuw.";
                break;

            case "MAINTENANCE":
                message = "<br><br><br><br><center><b>Er wordt momenteel onderhoud uitgevoerd.<br>Hierdoor is de app nu niet beschikbaar.<br><br>Probeer het later opnieuw.</b></center>";
                break;

            case "CHANGEPWDTEXT":
                message = "<br>Om technische redenen dient u uw huidige wachtwoord om te zetten naar een pincode.<br><br>";
                break;

            case "PINCODE_MISMATCH":
                message = "De ingevoerde toegangscodes komen niet overeen!";
                break;

            case "ENTER_PINCODE":
                message = "Voer uw toegangscode in";
                break;

            case "PINCODE_MANDATORY":
                message = "Een toegangscode is verplicht!";
                break;

            case "INVALID_REGISTRATION":
                message = "Uw aanmelding is niet meer geldig. U dient zich opnieuw aan te melden!";
                break;

            default:
                // message = tempMessage;
                message = message;
                break;
        }

        // Replace some AccountView messages!
        message = BRVUtil.replaceAll(message, 'Verzenddebiteur', 'Klant');
        message = BRVUtil.replaceAll(message, 'Error Dit is een demonstratieversie van AccountView', 'Dit is een demonstratieversie');
        message = BRVUtil.replaceAll(message, 'demonstratieversie van AccountView', 'demonstratieversie');
        return message;
    },
    //---------------------------------------------------------

    //---------------------------------------------------------
    // Webservice functions
    //---------------------------------------------------------
    // WDS / OAS
    doRequestWS: function(wsType, wsService, wsAction, wsXMLRequest, successCallback, errorCallback, ntimeout, noTimeout) {
        if (app.isOnline && app.checkNetwork()) {
            app.doRequestWS_step1(wsType, wsService, wsAction, wsXMLRequest, successCallback, errorCallback, ntimeout, noTimeout);
        }
    },
    doRequestWS_step1: function(wsType, wsService, wsAction, wsXMLRequest, successCallback, errorCallback, ntimeout, noTimeout) {
        // WDS		: http://www.domainname.xx/?????
        // OAS		: http://www.domainname.xx/?????
        app.debug('FUNCTION: doRequestWS');

        var wsURL = '';
        if (BRVUtil.checkValue(wsType)) {
            switch (wsType) {
                case "WDS":
                    wsURL = BRVUtil.addfs(app.wdsurl) + 'REST/wds/?service=' + wsService + '&action=' + wsAction;
                    // app.wsErrorMsg = 'Communicatie met WDS is mislukt!';
                    app.wsErrorMsg = app.translateMessage('NO_WDS');
                    break;
                case "OAS":
                    wsURL = BRVUtil.addfs(app.oasurl) + 'REST/oas/?service=' + wsService + '&action=' + wsAction;
                    // app.wsErrorMsg = 'Communicatie met OAS is mislukt!';
                    app.wsErrorMsg = app.translateMessage('NO_OAS');
                    break;
                default:
                    break;
            }
        } else {
            app.showError("INCOMPLETE_SETTINGS");
            return;
        }

        // app.debug(wsXMLRequest);

        var timeoutHandler = null;
        if (!ntimeout) {
            ntimeout = app.timeout;
        }
        if (ntimeout) {
            // timeoutHandler = setTimeout(this.handleTimedOut.bind(this), parseInt(ntimeout));
            timeoutHandler = setTimeout(function() { app.handleTimedOut(timeoutHandler); }, parseInt(ntimeout));

            app.LastTimeoutHandler = timeoutHandler;

        }

        if (wsAction == 'addLog') {
            // Do not store last request!
        } else {
            app.lastdoRequestWS = new Object();
            app.lastdoRequestWS['service'] = 'doRequestWS';
            app.lastdoRequestWS['wsType'] = wsType;
            app.lastdoRequestWS['wsService'] = wsService;
            app.lastdoRequestWS['wsAction'] = wsAction;
            app.lastdoRequestWS['wsXMLRequest'] = wsXMLRequest;
            app.lastdoRequestWS['successCallback'] = successCallback;
            app.lastdoRequestWS['errorCallback'] = errorCallback;
            app.lastdoRequestWS['ntimeout'] = ntimeout;
            app.lastdoRequestWS['startTime'] = new Date();
        }

        wsXMLRequest = str_to_b64(wsXMLRequest);

        app.request = jQuery.ajax({
            // headers: { 'setSSLCertMode': 'nocheck' },
            type: "POST",
            url: wsURL,
            crossDomain: true,
            data: wsXMLRequest,
            contentType: 'application/json',
            dataType: 'json',
            // success: successCallback,
            // error: app.processError
            success: function(data, status, req) {
                app.wsErrorCode = '';
                app.lastErrorMsg = '';
                app.lastdoRequestWS = new Object();

                clearTimeout(timeoutHandler); // Clear this.timeoutHandler before binding it again.
                successCallback(data, status, req);
            },
            error: function(data, status, req) {
                clearTimeout(timeoutHandler); // Clear this.timeoutHandler before binding it again.
                app.processError(data, status, req);
            }
        });

    },

    // Gateway / Rest WAW
    doRequestGWRWAW: function(BRVjsonParams, appID, requestID, successCallback, errorCallback, ntimeout, queryFileFields) {
        if (app.isOnline && app.checkNetwork()) {
            app.doRequestGWRWAW_step1(BRVjsonParams, appID, requestID, successCallback, errorCallback, ntimeout, queryFileFields);
        }
    },
    doRequestGWRWAW_step1: function(BRVjsonParams, appID, requestID, successCallback, errorCallback, ntimeout, queryFileFields) {
        // Gateway 	: http://staging.brancheview.net/WGWREST/wrapper
        // Gateway 	: http://www.domainname.xx/WGWREST/wrapper

        // Gateway 	: http://staging.brancheview.net/WGWSOAP/rest

        // RWAW		: http://pc2013010:8081/rwaw
        // RWAW		: http://192.168.21.29:8081/rwaw
        // RWAW		: http://www.domainname.xx/rwaw

        app.debug('FUNCTION: doRequestGWRWAW');

        // if (app.wsurl == '' || app.wsuser == '' || app.wspwd == '' || app.avserial == '') {
        if (app.wsurl == '' || app.wsuser == '' || app.wspwd == '' || app.avserial == '' || app.subscription == '' || app.deviceid == '') {
            // app.showError("Instellingen zijn nog niet compleet!");

            // Reset all registration data
            // resetRegistrationData();

            // Restart app.
            app.onDeviceReady();
        } else {
            if (app.isBuilder) {
                if (!BRVUtil.checkValue(appID) || !BRVUtil.checkValue(requestID)) {
                    return;
                }
            }

            // Allways set wsseq
            var newSeq = parseInt(getUserData(app.activeusername, 'wsseq')) + 1;
            updateUserData(app.activeusername, newSeq);
            //

            queryFileFields = (BRVUtil.checkValue(queryFileFields)) ? queryFileFields : '';

            // Set default appID
            appID = (appID != '') ? appID : app.WEPID_MOBILE;
            appID = (appID == '_MOBILE' || appID == 'MOBILE') ? app.WEPID_MOBILE : appID;

            //TESTING
            //appID = (appID == '_BAPP') ? 'BAPP' : app.WEPID_MOBILE; // Just for development!!!


            // var execmode = (app.isBuilder)?"DEVELOP":"";

            var jsonRequest = '' +
                '{' +
                '  "request": {' +
                // ToDo: 'offset' and 'pagesize' needs to be set on main query only !!
                '    "responseinfo": "encoding=\\"Windows-1252\\" htmlencode=\\"off\\" offset=\\"' + app.iOffset + '\\" pagesize=\\"' + app.iPageSize + '\\" filefields=\\"' + queryFileFields + '\\" ", ' +
                //
                '    "sequence": "' + newSeq + '",' +
                '    "version": "1.00",' +
                '    "admcode": "' + app.adm_code + '",' +
                '    "userid": "' + app.wsuser + '",' +
                '    "password": "' + app.wspwd + '",' +
                '    "appid": "' + appID + '",' +
                '    "requestid": "' + requestID + '",' +
                '    "subscription": "' + app.subscription + '",' +
                '    "deviceid": "' + app.deviceid + '",' +
                //				'    "execmode": 		"DEVELOP",' +
                //				'    "execmode": 		"' + execmode + '",' +
                '    "parameters": ' + BRVjsonParams +
                '  }' +
                '}';

            jsonRequest = jsonRequest.replace(/\t/g, ''); // Remove 'tabs'

            // app.debug(JSON.parse(jsonRequest));

            if (app.encryptrequest) {
                // encrypt request
                // ~<deviceId>|<appcode>|<keyHash>|<requestHash>|<encrypted request>
                // encKeyHash = BVW_Cryptor.getKeyMD5();
                encKeyHash = BRVUtil.Left(BRVUtil.alltrim(BVW_Cryptor.getKey()), 1);
                jsonRequest = BVW_Cryptor.EncryptString(jsonRequest);
                // jsonRequest = '~' + app.deviceid + '|MOBILE|' + encKeyHash + '||' + jsonRequest;
                jsonRequest = '~' + app.deviceid + '|' + app.productcode + '|' + encKeyHash + '||' + jsonRequest;
                // var wsUrl = BRVUtil.addfs(app.wsurl) + 'json/' + app.apikey + '/' + app.avserial + '/' + app.deviceid + '/false/false/';
                var wsUrl = BRVUtil.addfs(app.wsurl) + 'json/' + app.apikey + '/' + app.avserial + '/false/false/';
            } else {
                jsonRequest = str_to_b64(jsonRequest);
                // var wsUrl = BRVUtil.addfs(app.wsurl) + 'json/' + app.apikey + '/' + app.avserial + '/' + app.deviceid + '/true/false/';
                var wsUrl = BRVUtil.addfs(app.wsurl) + 'json/' + app.apikey + '/' + app.avserial + '/true/false/';
            }


            app.wsErrorMsg = 'Communicatie met backoffice is mislukt!';

            var timeoutHandler = null;
            if (!ntimeout) {
                ntimeout = app.timeout;
            }
            if (ntimeout) {


                // timeoutHandler = setTimeout(this.handleTimedOut.bind(this), parseInt(ntimeout));
                timeoutHandler = setTimeout(function() { 
                    app.handleTimedOut(timeoutHandler); 
                }, 
                parseInt(ntimeout));

                app.LastTimeoutHandler = timeoutHandler;

            }

            app.lastdoRequestWS = new Object();
            app.lastdoRequestWS['service'] = 'doRequestGWRWAW';
            app.lastdoRequestWS['BRVjsonParams'] = BRVjsonParams;
            app.lastdoRequestWS['appID'] = appID;
            app.lastdoRequestWS['requestID'] = requestID;
            app.lastdoRequestWS['successCallback'] = successCallback;
            app.lastdoRequestWS['errorCallback'] = errorCallback;
            app.lastdoRequestWS['ntimeout'] = ntimeout;
            app.lastdoRequestWS['queryFileFields'] = queryFileFields;
            app.lastdoRequestWS['startTime'] = new Date();

            app.request = jQuery.ajax({
                // headers: { 'setSSLCertMode': 'nocheck' },
                type: "POST",
                url: wsUrl,
                crossDomain: true,
                data: jsonRequest,
                contentType: 'application/json',
                dataType: (app.encryptrequest) ? 'text' : 'json',
                // success: successCallback,
                // error: app.processError
                success: function(data, status, req) {
                    // Clear the errormessage
                    app.wsErrorCode = '';
                    app.lastErrorMsg = '';
                    app.lastdoRequestWS = new Object();

                    // Call can be success but BRV WS could have error!!!
                    if (app.CheckForBRVWSErrors(data, status, req)) {
                        clearTimeout(timeoutHandler); // Clear this.timeoutHandler before binding it again.
                        successCallback(data, status, req);
                    }

                    // clearTimeout(timeoutHandler); // Clear this.timeoutHandler before binding it again.
                    // successCallback(data, status, req);
                },
                error: function(data, status, req) {
                    clearTimeout(timeoutHandler); // Clear this.timeoutHandler before binding it again.
                    app.processError(data, status, req);
                }
            });

        }
    },


    CheckForBRVWSErrors: function(data, status, req) {
        var returnValue = true;
        var tmpData = '';
        var errormessage = '';



        try {
            // tmpData = BRVUtil.parseJSON(data);
            tmpData = JSON.parse(data); // DO NOT USE BRVUtil.parseJSON here !!!!
            errormessage = tmpData.response.errormessage;
        } catch (err) {
            //			console.log('err: ', err);
        }


        try {
            errormessage = (errormessage != '') ? errormessage : req.responseJSON.response.errormessage;
        } catch (err) {
            //			console.log('err: ', err);
        }


        if (BRVUtil.checkValue(errormessage)) {
            switch (errormessage) {
                case "DECRYPTION ERROR":
                    app.stopLoading();

                    // Clear timers
                    clearTimeout(app.LastTimeoutHandler);

                    if (!app.isBuilder) {
                        var message = 'INVALID_REGISTRATION';
                        app.showMessage(message, 0, false);

                        if (app.isdemo) {
                            resetApp();
                        } else {
                            if (app.checkmultiuser()) {
                                BRVDatabase.successCallBack = function() { startApplication('activateduserlogin'); };
                                removeUserActivation(app.activeusername);
                            } else {
                                resetApp();
                            }
                        }
                    }
                    returnValue = false;
                    break;

                case "RUN ERROR":
                    app.stopLoading();

                    // Clear timers
                    clearTimeout(app.LastTimeoutHandler);


                    var message = 'RUN ERROR';
                    try {
                        message = req.responseJSON.response.errorinfo.message;
                    } catch (err) {
                        //			console.log('err: ', err);
                    }

                    app.showMessage(message, 0, false);


                    returnValue = false;
                    break;


                case "DUMMY":
                    // Dummy!!
                    break;

                    // case "WEP LOOKUP ERROR":
                    // 	console.log( 'We have some WEP Decryption error!' );
                    // 	returnValue = false;
                    // 	break;

                default:
                    break;

            }
        }

        return returnValue;
    },

    // Errorhandling
    processError: function(data, status, req) {
        // clearTimeout(this.timeoutHandler);
        var status = data.status;
        var statusText = data.statusText;

        // Remember reponse for errorlogging!!
        app.lastdoRequestWS['wsXMLResponse'] = data;

        app.lastErrorMsg = status + ': ' + statusText;
        if (BRVUtil.checkValue(app.wsErrorCode)) {
            app.lastErrorMsg += ' ' + app.wsErrorCode;
        }
        app.lastErrorMsg += '<br>' + app.wsErrorMsg;

        // var maxTimeOutSeconds = Math.abs(app.lastdoRequestWS['ntimeout'])/1000; 
        var startTime = app.lastdoRequestWS['startTime'];
        var curTime = new Date();
        var diffSeconds = (Math.abs(startTime - curTime) / 1000) % 60;
        // var errorreason 	= (BRVUtil.checkValue(data.response.errorreason))	? data.response.errorreason		: 'UNDEFINED_ERROR';
        var errorreason = (BRVUtil.checkValue(data.response)) ? data.response.errorreason : 'UNDEFINED_ERROR';

        // var maxTry = (errorreason == 'REQUEST CANCELLED') ? 0 : app.maxServiceRetry; 
        var maxTry = (errorreason == 'REQUEST CANCELLED' || errorreason == 'UNDEFINED_ERROR') ? 0 : app.maxServiceRetry;

        if ((diffSeconds < 10) && (maxTry > 0 && app.currentRetry < maxTry)) {
            // if ( (diffSeconds < 10) && (app.maxServiceRetry > 0 && app.currentRetry < app.maxServiceRetry)) {
            app.debug('FUNCTION: doRequestGWRWAW');
            app.debug('Retry ' + app.lastdoRequestWS['service'] + ': ' + app.currentRetry);
            app.showMessage('RECONNECT', 1000, true);

            if (app.lastdoRequestWS['service'] == 'doRequestWS') {
                app.currentRetry++;
                setTimeout(function() {
                    app.doRequestWS(app.lastdoRequestWS['wsType'], app.lastdoRequestWS['wsService'], app.lastdoRequestWS['wsAction'], app.lastdoRequestWS['wsXMLRequest'], app.lastdoRequestWS['successCallback'], app.lastdoRequestWS['errorCallback'], app.lastdoRequestWS['ntimeout']);
                }, 2000);
            }

            if (app.lastdoRequestWS['service'] == 'doRequestGWRWAW') {
                app.currentRetry++;
                setTimeout(function() {
                    app.doRequestGWRWAW(app.lastdoRequestWS['BRVjsonParams'], app.lastdoRequestWS['appID'], app.lastdoRequestWS['requestID'], app.lastdoRequestWS['successCallback'], app.lastdoRequestWS['errorCallback'], app.lastdoRequestWS['ntimeout'], app.lastdoRequestWS['queryFileFields']);
                }, 2000);
            }

        } else {

            // var details = app.genLastRequestDetails();
            // var errorMsg = BRVUtil.checkValue(app.lastErrorMsg) ? app.lastErrorMsg : 'CONNECTION_ERROR';
            // app.showError(errorMsg, details);

            app.currentRetry = 0;
            // app.showError('Niet gelukt om verbinding te maken. Mogelijk is uw internetverbinding verbroken!');
            getScreenFromJSONDefault('errorscreen');
            app.lastdoRequestWS = new Object();
        }

    },
    handleTimedOut: function(timeoutHandler) {
        //server did not respond in n seconds... assume that there could have been
        //an error or something, and allow requests to be processed again...
        app.request.abort();
        app.activeRequestCount = 0;

        clearTimeout(timeoutHandler);

        var details = app.genLastRequestDetails();
        app.showError('WEBSERVICE_TIMEOUT', details);
    },
    //---------------------------------------------------------

    genLastRequestDetails: function() {
        var details = 'UNKNOWN';
        if (app.lastdoRequestWS['service'] == 'doRequestWS') {
            details = '';
            details += 'service: ' + app.lastdoRequestWS['service'];
            details += '\\nwsType: ' + app.lastdoRequestWS['wsType'];
            details += '\\nwsService: ' + app.lastdoRequestWS['wsService'];
            details += '\\nwsAction: ' + app.lastdoRequestWS['wsAction'];
            details += '\\nwsXMLRequest: ' + b64_to_str(app.lastdoRequestWS['wsXMLRequest']);
            details += '\\nwsXMLResponse: ' + app.lastdoRequestWS['wsXMLResponse'];
        } else
        if (app.lastdoRequestWS['service'] == 'doRequestGWRWAW') {
            details = '';
            details += 'service: ' + app.lastdoRequestWS['service'];
            details += '\\nappID: ' + app.lastdoRequestWS['appID'];
            details += '\\nrequestID: ' + app.lastdoRequestWS['requestID'];
            details += '\\nBRVjsonParams: ' + app.lastdoRequestWS['BRVjsonParams'];
            details += '\\nqueryFileFields: ' + app.lastdoRequestWS['queryFileFields'];
            details += '\\nBRVjsonResponse: ' + app.lastdoRequestWS['BRVjsonResponse'];
            details += '\\ndecryptedResponse: ' + app.lastdoRequestWS['decryptedResponse'];
        }
        return details;
    },

    addWDSLogging: function(logtype, message, details, info) {
        // {
        // 	"app": "MOBILE",
        // 	"user": "Gert",
        // 	"device": "DeviceID",
        // 	"type": "error",
        // 	"message": "something went wrong",
        // 	"info" : "versie 1.5, build 782782, blahblah....",
        // 	"details": "error 1234 at line 23 of somesource.txt, parameters: x1=7, x2=null"
        // }

        if (!BRVUtil.isDevice()) {
            // Do nothing if it's not device !!
        } else {
            var App = app.productcode;
            App += BRVUtil.checkValue(app.officecode) ? '_' + app.officecode : '';
            App += BRVUtil.checkValue(app.clientcode) ? '_' + app.clientcode : '';

            var AppInfo = '';
            AppInfo += 'App: ' + app.nameApp;
            AppInfo += '\\nVersion: ' + app.versionBuild;
            AppInfo += '\\nJSON: ' + app.versionJSON;
            AppInfo += '\\nJSONStatus: ' + app.versionJSONStatus;
            AppInfo += '\\nDevice: ' + app.devicename;

            var info = BRVUtil.checkValue(info) ? info : AppInfo;

            var details = BRVUtil.replaceAll(details, '"', '\\"');

            var logging = '{"app":"' + App + '", "user":"' + app.activeusername + '", "device":"' + app.deviceid + '", "type":"' + logtype + '", "message":"' + message + '", "info":"' + info + '", "details":"' + details + '" }';
            var xmlRequest = '<appCode>' + app.productcode + '</appCode><log>base64:' + str_to_b64(logging) + '</log>';
            app.doRequestWS('WDS', 'AppServices', 'addLog', xmlRequest, app.addWDSLoggingResult, showWSError, null, true);
        }
    },
    addWDSLoggingResult: function(xhttp) {
        // console.log( b64_to_str(xhttp.response) );
    },

    validateQuery: function(query) {
        // Validate query and check for empty "Select", "SetOption" and "SetField" and other things!!!
        try {
            // Parse query to an object so we can find elements.
            // var queryJson = JSON.parse(query);
            var queryJson = BRVUtil.parseJSON(query);

            // Check if there's a where element and it's not empty.
            if (BRVUtil.checkValue(queryJson.Select)) {
                if (!BRVUtil.checkValue(queryJson.Select.Where)) {
                    queryJson.Select.Where = '<where>';
                }
            }

            // Check if Select does contain a From and QryField, else delete the Select
            if (BRVUtil.checkValue(queryJson.Select)) {
                if (!BRVUtil.checkValue(queryJson.Select.From) || !BRVUtil.checkValue(queryJson.Select.QryField)) {
                    delete queryJson["Select"];
                }
            }

            // Check if SetOption does contain a name/value, else delete the SetOption
            if (BRVUtil.checkValue(queryJson.SetOption)) {
                // If first Name element doesn't contain a value, then delete SetOption 
                if (!BRVUtil.checkValue(queryJson.SetOption[0].Name)) {
                    delete queryJson["SetOption"];
                }
            }

            // Check if SetField does contain a name/value, else delete the SetField
            if (BRVUtil.checkValue(queryJson.SetField)) {
                // If first Name element doesn't contain a value, then delete SetField 
                if (!BRVUtil.checkValue(queryJson.SetField[0].Name)) {
                    delete queryJson["SetField"];
                }
            }

            // Stringify query object so we can return a JSON string.
            query = JSON.stringify(queryJson);

            app.debug('FUNCTION: validateQuery');
            // app.debug(queryJson);

        } catch (err) {}

        return query;
    },

    SavePageRoute: function(screenID, param, mode, skipChecks) {
        var param = BRVUtil.checkValue(param) ? param : '';
        var mode = BRVUtil.checkValue(mode) ? mode : '';
        var skipChecks = BRVUtil.checkValue(skipChecks) ? skipChecks : false;

        if (app.appPageRoute.length > 0) {
            // When current screen is same als previous screen, delete previous screen first.
            // Case after saving a form we could return back to the same screen (with new params) as before starting the edit/add screen.
            var prevscreenID = app.appPageRoute[app.appPageRoute.length - 1][0];
            if (prevscreenID == screenID) {
                app.appPageRoute.pop();
            } else {
                var prevKey = app.appPageRoute.length - 1;
                if (prevKey > 0) {
                    // var curScrollPos = $(window).scrollTop();
                    // var curScrollPos = $('#content_table').scrollTop();

                    // Remember curScrollPos to previous screen
                    // app.appPageRoute[prevKey][1][3] = curScrollPos;

                    // Remember current livescrolling settings
                    app.appPageRoute[prevKey][1][4] = app.iRecordCount;
                    app.appPageRoute[prevKey][1][5] = app.iPageSize;
                    app.appPageRoute[prevKey][1][6] = app.iCurrentPage;
                    app.appPageRoute[prevKey][1][7] = app.iOffset;
                    app.appPageRoute[prevKey][1][8] = app.iPageCount;
                }
            }
        }

        // When there is history and we return to the startscreen, then clear the page history!!
        if (app.appPageRoute.length > 0 && screenID == app.startScreen) {
            app.clearPageRoute();
        }

        // BRVUtil.addToArray(app.appPageRoute, screenID, {param, mode, skipChecks}); // Has issue in Phonegap emulator
        BRVUtil.addToArray(app.appPageRoute, screenID, [param, mode, skipChecks, 0, 0, 25, 1, 1, 0]);
    },

    removeLastPageRoute: function(screenID) {
        // Remove the last screen
        app.appPageRoute.pop();
    },

    clearPageRoute: function() {
        app.appPageRoute = new Array();
    },

    goPageRoute: function(steps) {
        steps = Math.abs(steps) * -1; // Allways negative.
        var newKey = app.appPageRoute.length;
        newKey = newKey + steps;
        if (newKey > 0) {
            app.appPageRoute.splice(newKey);

            var screenID = app.appPageRoute[app.appPageRoute.length - 1][0];
            var param = app.appPageRoute[app.appPageRoute.length - 1][1][0];
            var mode = app.appPageRoute[app.appPageRoute.length - 1][1][1];
            var skipChecks = app.appPageRoute[app.appPageRoute.length - 1][1][2];
            // var curScrollPos= app.appPageRoute[app.appPageRoute.length - 1][1][3];

            // var iRecordCount= app.appPageRoute[app.appPageRoute.length - 1][1][4];
            // var iPageSize	= app.appPageRoute[app.appPageRoute.length - 1][1][5];
            // var iCurrentPage= app.appPageRoute[app.appPageRoute.length - 1][1][6];
            // var iOffset		= app.appPageRoute[app.appPageRoute.length - 1][1][7];
            // var iPageCount	= app.appPageRoute[app.appPageRoute.length - 1][1][8];

            // Goto screenID, but don't save that screen to appPageRoute!
            getScreenFromJSON(screenID, param, mode, skipChecks, true);
        }
    },

    // OpenAdmin: function (adm_code) {
    // 	// Strip all | signs from adm_code, can be caused by AppBuilder!!!
    // 	adm_code = adm_code.replace(/[|]/g, '');

    // 	app.debug('FUNCTION: OpenAdmin, adm_code:' + adm_code);
    // 	GetDeviceAdminRoles(adm_code);
    // },

    OpenAdmin: function(adm_code, userID) {
        // Strip all | signs from adm_code, can be caused by AppBuilder!!!
        adm_code = adm_code.replace(/[|]/g, '');

        app.debug('FUNCTION: OpenAdmin, adm_code:' + adm_code);
        GetDeviceAdminRoles(adm_code, userID);
    },


    ConvertValue: function(inputValue, valueType) {
        var tmpValue = inputValue;
        switch (valueType) {
            case "currency":
            case "number":
                tmpValue = parseFloat(tmpValue);
                break;
            case "text":
                tmpValue = tmpValue.toString();
                tmpValue = BRVUtil.alltrim(tmpValue);
                break;
            default:
                break;
        }
        return tmpValue;
    },

    GetDefaultvalue: function(inputValue, valueType) {
        var tmpValue = inputValue;
        if (BRVUtil.checkValue(tmpValue)) {
            var tmpValueFields = tmpValue.split('|');
            var tmpValueNew = '';
            var d = new Date();
            for (a = 0; a < tmpValueFields.length; a++) {
                tmpValue = tmpValueFields[a];

                if (BRVUtil.Left(tmpValue, 1) == '<') {
                    tmpValue = replaceVarsInText(tmpValue);
                }

                tmpValue = tmpValue.replace('<', '');
                tmpValue = tmpValue.replace('>', '');
                switch (tmpValue) {
                    case "curdate":
                        // var d = new Date();
                        tmpValue = BRVUtil.padl(d.getDate().toString(), '0', 2) + "-" + BRVUtil.padl((d.getMonth() + 1).toString(), '0', 2) + "-" + d.getFullYear().toString();
                        break;
                    case "curyear":
                        // var d = new Date();
                        tmpValue = d.getFullYear();
                        break;
                    case "curmonth":
                        // var d = new Date();
                        tmpValue = d.getMonth() + 1;
                        break;
                    case "curweek":
                        // var d = new Date();
                        tmpValue = d.getWeek();
                        break;
                    case "curmonthname":
                        var monthNames = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "October", "November", "December"];
                        // var d = new Date();
                        tmpValue = monthNames[d.getMonth()];
                        break;
                    case "curdayname":
                        var dayNames = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
                        // var d = new Date();
                        tmpValue = dayNames[d.getDay()];
                        break;

                        // OLD
                    case "yearnr":
                        tmpValue = (new Date()).getFullYear();
                        break;
                    case "weeknr":
                        tmpValue = (new Date()).getWeek();
                        break;
                    case "monthnr":
                        tmpValue = (new Date()).getMonth() + 1;
                        break;
                        //
                    default:
                        if (tmpValue.substr(0, 1) == '*') { // Check if we need to find the field value in the localstorage
                            tmpValue = tmpValue.substr(1, tmpValue.length);
                            tmpValue = app.GetFromPhoneStorage(tmpValue);
                        } else { // Get field value from screenparameters
                            if (BRVUtil.checkValue(app.paramObject[tmpValue])) {
                                tmpValue = app.paramObject[tmpValue];
                            }
                            // else just return tmpValue!
                        }
                        break;
                }
                (BRVUtil.checkValue(tmpValue)) ? tmpValueNew += tmpValue + ' ': '';
            }
            // tmpValue = tmpValueNew;
            tmpValue = BRVUtil.alltrim(tmpValueNew); // Trim value

            // Check if the value needs to be converted.
            if (BRVUtil.checkValue(valueType)) {
                tmpValue = app.ConvertValue(tmpValue, valueType);
            }
        }
        return tmpValue;
    },

    GetParams: function(inputValue) {
        var tmpValue = '';
        var paramChanged = false;

        if (BRVUtil.checkValue(inputValue)) {
            tmpValue = inputValue;

            var tmpValueParams = tmpValue.split('|');
            var tmpValueNew = '';
            for (var a = 0; a < tmpValueParams.length; a++) {
                if (BRVUtil.checkValue(tmpValueParams[a])) {
                    tmpValueNew = tmpValueParams[a];
                    var tmpValueFields = tmpValueNew.split('=');
                    var tmpOrigFld = '';

                    //Change for adding formfield values to footer button parameters
                    for (var b = 0; b < tmpValueFields.length; b++) {
                        paramChanged = false;

                        if (BRVUtil.checkValue(tmpValueFields[1])) {
                            tmpOrigFld = tmpValueFields[1];

                            // Check if we need to find the field value in the system vars
                            if (!paramChanged && BRVUtil.Left(tmpValueFields[1], 1) == '<') {
                                tmpValueFields[1] = replaceVarsInText(tmpValueFields[1]);
                                if (tmpOrigFld != tmpValueFields[1]) {
                                    paramChanged = true;
                                }
                            }

                            // Check if we need to find the field value in the localstorage
                            if (!paramChanged && (tmpValueFields[1].substr(0, 1) == '*' || tmpValueFields[1].substr(1, 1) == '*')) {
                                var fldName = tmpValueFields[1].replace('<', '').replace('>', '').replace('*', '');
                                var fldValue = app.GetFromPhoneStorage(fldName);
                                if (BRVUtil.checkValue(fldValue)) {
                                    tmpValueFields[1] = fldValue;
                                    paramChanged = true;
                                }
                            }

                            // Check if we need to find the field value in the screenparameters
                            if (!paramChanged && app.paramObject) {
                                if (tmpValueFields[1].substr(0, 1) == '<') {
                                    var fldName = tmpValueFields[1].replace('<', '').replace('>', '');
                                    if (BRVUtil.checkValue(app.paramObject[fldName])) {
                                        tmpValueFields[1] = app.paramObject[fldName];
                                        paramChanged = true;
                                    }
                                }
                            }

                            // Still not found, then save the param for screendata.
                            if (paramChanged) {
                                tmpValue = tmpValue.replace(tmpOrigFld, tmpValueFields[1]);
                                tmpValue = BRVUtil.alltrim(tmpValue);
                            }
                        }
                    }


                    // for (var b = 0; b < tmpValueFields.length; b++) {
                    // 	if (BRVUtil.checkValue(tmpValueFields[1])) {
                    // 		tmpOrigFld = tmpValueFields[1];

                    // 		// Check if we need to find the field value in the system vars
                    // 		if (BRVUtil.Left(tmpValueFields[1], 1) == '<') {
                    // 			tmpValueFields[1] = replaceVarsInText(tmpValueFields[1]);
                    // 		} 

                    // 		// Check if we need to find the field value in the localstorage
                    // 		if (tmpValueFields[1].substr(0, 1) == '*' || tmpValueFields[1].substr(1, 1) == '*') {
                    // 			tmpValueFields[1] = tmpValueFields[1].replace('<', '');
                    // 			tmpValueFields[1] = tmpValueFields[1].replace('>', '');
                    // 			tmpValueFields[1] = tmpValueFields[1].replace('*', '');
                    // 			tmpValueFields[1] = app.GetFromPhoneStorage(tmpValueFields[1]);
                    // 		}

                    // 		// Check if we need to find the field value in the screenparameters
                    // 		if (app.paramObject) {
                    // 			if (tmpValueFields[1].substr(0, 1) == '<') {
                    // 				tmpValueFields[1] = tmpValueFields[1].replace('<', '');
                    // 				tmpValueFields[1] = tmpValueFields[1].replace('>', '');
                    // 				if ( BRVUtil.checkValue(app.paramObject[tmpValueFields[1]]) ) {
                    // 					tmpValueFields[1] = app.paramObject[tmpValueFields[1]];
                    // 				}
                    // 			}
                    // 		}
                    // 		tmpValue = tmpValue.replace(tmpOrigFld, tmpValueFields[1]);
                    // 		tmpValue = BRVUtil.alltrim(tmpValue);

                    // 		// *************************************************************
                    // 		// Check this new code below, causes some troubles with screenparams.
                    // 		// *************************************************************
                    // 		// tmpOrigFld = tmpValueFields[1];
                    // 		// // Check if we need to find the field value in the system vars
                    // 		// if (BRVUtil.Left(tmpValueFields[1], 1) == '<') {
                    // 		// 	var tmpValue = tmpValueFields[1];
                    // 		// 	tmpValueFields[1] = replaceVarsInText(tmpValue);
                    // 		// } 

                    // 		// // Check if we need to find the field value in the localstorage
                    // 		// if (tmpValueFields[1].substr(0, 1) == '*' || tmpValueFields[1].substr(1, 1) == '*') {
                    // 		// 	var tmpValue = tmpValueFields[1];
                    // 		// 	tmpValue = tmpValue.replace('<', '');
                    // 		// 	tmpValue = tmpValue.replace('>', '');
                    // 		// 	tmpValue = tmpValue.replace('*', '');
                    // 		// 	tmpValueFields[1] = app.GetFromPhoneStorage(tmpValue);
                    // 		// }

                    // 		// // Check if we need to find the field value in the screenparameters
                    // 		// if (app.paramObject) {
                    // 		// 	if (tmpValueFields[1].substr(0, 1) == '<') {
                    // 		// 		var tmpValue = tmpValueFields[1];
                    // 		// 		tmpValue = tmpValue.replace('<', '');
                    // 		// 		tmpValue = tmpValue.replace('>', '');
                    // 		// 		if ( BRVUtil.checkValue(app.paramObject[tmpValue]) ) {
                    // 		// 			tmpValueFields[1] = app.paramObject[tmpValue];
                    // 		// 	}
                    // 		// }
                    // 		// }
                    // 		// var tmpValue = tmpValueFields[1];
                    // 		// tmpValue = tmpValue.replace('<', '');
                    // 		// tmpValue = tmpValue.replace('>', '');
                    // 		// // tmpValue = BRVUtil.alltrim(tmpValue);
                    // 		// tmpValue = tmpValue.replace(tmpOrigFld, tmpValue);
                    // 		// *************************************************************
                    // 	}
                    // }
                }
            }
        }

        return tmpValue;
    },

    newactivation: function() {
        app.isnewactivation = true;
        // startApplication('init');
        // getScreenFromJSONDefault('activatedevice');

        startApplication('newactivation');
    },


    loginactivateduser: function(jsonObjB64) {
        // {
        // 	activationuser: "tijssena@gmail.com",
        // 	username: "tijssena@gmail.com",
        // 	deviceId: "4200000000",
        // 	subscriptionNumber: "0995862722",
        // 	avkey: "118056112054080105084055065100053048082122090076070108097066088081049069047085078067107075068052113"
        // }

        // var username = $('#username').val();
        // var srcFldJson = $("#username option:selected").attr("jsonValues");
        // var jsonObj = (BRVUtil.checkValue(srcFldJson)) ? JSON.parse(b64_to_str(srcFldJson)) : '';

        // var jsonObj = (BRVUtil.checkValue(jsonObjB64)) ? JSON.parse(b64_to_str(jsonObjB64)) : '';
        var jsonObj = (BRVUtil.checkValue(jsonObjB64)) ? BRVUtil.parseJSON(b64_to_str(jsonObjB64)) : '';
        var username = jsonObj.username;

        if (BRVUtil.checkValue(username)) {
            app.AddToPhoneStorage('deviceID', jsonObj.deviceId);
            app.AddToPhoneStorage('avkey', jsonObj.avkey);
            app.AddToPhoneStorage('subscription', jsonObj.subscriptionNumber);
            app.AddToPhoneStorage('YOBsubscription', jsonObj.yobSubscriptionNumber);
            app.AddToPhoneStorage('activeusername', username);
            app.AddToPhoneStorage('logintype', jsonObj.logintype);

            app.adm_code = '';
            app.subscription = jsonObj.subscriptionNumber;
            app.YOBsubscription = jsonObj.yobSubscriptionNumber;
            app.deviceid = jsonObj.deviceId;
            app.activeusername = jsonObj.username;
            app.logintype = jsonObj.logintype;

            startApplication('init');
        } else {
            // Do nothing!!!
        }
    },

    checkmultiuser: function() {
        var returnValue = false;

        // ToDo: Need check for builder ?
        //

        returnValue = (BRVUtil.isBool(app.GetFromPhoneStorage('multiuser')) ? true : false) || app.multiuser;
        return returnValue;
    },

    activateduserlogin: function() {
        app.isnewactivation = false;
        startApplication('activateduserlogin');
    },


    checkValidActivation: function() {
        var activated = app.GetFromPhoneStorage('activated');
        var avkey = app.GetFromPhoneStorage('avkey');
        var subscription = app.GetFromPhoneStorage('subscription');
        var userActivations = app.GetFromPhoneStorage('userActivations');
        var resetByUser = BRVUtil.parseBoolean(app.GetFromPhoneStorage('resetByUser')); // App activation has been reset by user.
        if (!resetByUser) {
            var deviceid = app.getDeviceID();
            // var xmlRequest = '<appCode>'+app.productcode+'</appCode><appVersion>'+app.versionApp+'</appVersion><deviceId>'+deviceid+'</deviceId>';
            // var xmlRequest = '<appCode>'+app.productcode+'</appCode><appVersion>'+app.versionApp+'</appVersion><deviceId>'+deviceid+'</deviceId><officeCode>'+app.officecode+'</officeCode><clientCode>'+app.clientcode+'</clientCode>';
            var xmlRequest = '<appCode>' + app.productcode + '</appCode><appVersion>' + app.versionApp + '</appVersion><deviceId>' + deviceid + '</deviceId><officeCode>' + app.officecode + '</officeCode><clientCode>' + app.clientcode + '</clientCode><devicePrefix>' + ((BRVUtil.isBrowser()) ? 'BROWSER' : 'APP') + '</devicePrefix>';
            app.wsErrorCode = 'WDS005';
            app.doRequestWS('WDS', 'AppServices', 'getDeviceActivation', xmlRequest, app.checkValidActivationResult, showWSError);
        }
    },

    checkValidActivationResult: function(xhttp) {
        var response = b64_to_str(xhttp.response);

        // <code>F</code>
        // <message>INVALID_DEVICEID</message>
        // <jsonData/>

        // <code>F</code>
        // <message>NOT_FOUND</message>
        // <jsonData/>

        // <code>S</code>
        // <message>ACTIVATION</message>
        // <jsonData>
        // {
        // 	"activationCode": "ST1qkqwn5sjpdr",
        // 	"email": "tijssena@gmail.com",
        // 	"deviceId": "4200000000_1550665145087",
        // 	"deviceName": "Unknown Generic Generic"
        // }
        // </jsonData>
        if (BRVUtil.checkValue(response)) {
            var succes = BRVUtil.strExtract(response, '<code>', '</code>');
            var message = BRVUtil.strExtract(response, '<message>', '</message>');
            var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

            if (succes.toUpperCase() == 'S') { // Succes
                // jsondata = JSON.parse(jsondata);
                jsondata = BRVUtil.parseJSON(jsondata);

                if (BRVUtil.checkValue(jsondata.Name)) {
                    var message = app.translateMessage('ACTIVATION_FOUND_OFFICECLIENT');
                    message = BRVUtil.replaceAll(message, '<1>', jsondata.Name);
                } else {
                    var message = app.translateMessage('ACTIVATION_FOUND');
                }

                jQuery.confirm({
                    title: '&nbsp;',
                    content: message,
                    buttons: {
                        ja: function() {
                            // $('#activationcode').val(jsondata.activationCode);
                            // $('#activationuser').val(jsondata.email);

                            app.deviceid = jsondata.deviceId;
                            app.AddToPhoneStorage('deviceID', app.deviceid);

                            app.loginMethod = "loginActivationCode";
                            ActivateDevice(jsondata.email, jsondata.activationCode);
                        },
                        nee: function() {
                            // Do nothing!
                        }
                    }
                });
            } else { // Failed
                // No previous registration found, so do nothing. User has to manually register device!
            }
        }
    },

    checkValidFidesqueLogin: function() {
        var Fidesqueusername = app.activationuser;
        var Fidesquepassword = app.activationcode;

        if (BRVUtil.checkValue(Fidesqueusername) && BRVUtil.checkValue(Fidesquepassword)) {
            var AuthToken = window.btoa(app.FidesqueAuthToken); // Base64 encoded client_id : client_secret
            var requestPayload = {
                'grant_type': 'password',
                'username': Fidesqueusername, // Fidesque username
                'password': Fidesquepassword // Fidesque userpassword
            };
            jQuery.ajax({
                type: 'POST',
                url: app.FidesqueAPI,
                data: requestPayload,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                headers: {
                    Authorization: 'Basic ' + AuthToken
                },
                success: app.checkValidFidesqueLoginSuccess,
                error: app.checkValidFidesqueLoginError
            });
        } else {
            var message = 'ENTER_USER_CREDENTIALS';
            app.showMessage(message);
        }
    },
    checkValidFidesqueLoginSuccess: function(xhttp) {
        app.stopLoading();
        // {
        // 	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJle...",
        // 	"token_type": "bearer",
        // 	"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1...",
        // 	"expires_in": 36000,
        // 	"scope": "read write",
        // 	"jti": "dd0035e2-53bb-4942-b424-e8c82f163cf1"
        // }			
        if (BRVUtil.checkValue(xhttp)) {
            app.getUserActivationsFromOAS(xhttp.access_token);
        } else {
            var message = 'Inloggen met Fidesque niet gelukt!';
            app.showMessage(message);
        }
    },
    checkValidFidesqueLoginError: function(data, status, req) {
        app.request.abort();
        clearTimeout(this.timeoutHandler);

        if (BRVUtil.checkValue(data.responseText)) {
            var responseJSON = JSON.parse(data.responseText);

            var error_description = BRVUtil.checkValue(responseJSON.error_description) ? app.translateMessage(responseJSON.error_description, responseJSON.error_description) : (BRVUtil.checkValue(responseJSON.message) ? app.translateMessage(responseJSON.message, responseJSON.message) : (BRVUtil.checkValue(responseJSON.error) ? app.translateMessage(responseJSON.error, responseJSON.error) : app.translateMessage('unknown_error', 'Onbekende error!.')));

            app.wsErrorCode = '';
            app.lastErrorMsg = '';
            app.lastdoRequestWS = new Object();
            app.showError(error_description);

        } else {
            // Check status
            // abort, 
            switch (status) {
                case "abort":
                    break;

                case 'DUMMY': // color
                    var dummy = '';
                    break;

                default:
                    app.lastErrorMsg = status;
                    app.showError(app.lastErrorMsg);
            }
        }



    },


    getUserActivationsFromOAS: function(userToken) {
        app.debug('FUNCTION: getUserActivationsFromOAS');
        // <userToken>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsidGVzdGp3dHJlc291cmNlaWQiXSwidXNlcl9uYW1lIjoiaHR0cHM6Ly9teS5maWRlc3F1ZS5uZXQvb3BlbmlkL1BpZXRqZVZpc3NlciIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1NTg2NjI1OTUsImF1dGhvcml0aWVzIjpbIlNUQU5EQVJEX1VTRVIiXSwianRpIjoiZGNlMTQwYjEtOWI5Ny00N2YwLWEyNzgtNGE4NTE1NTkwZDUyIiwiY2xpZW50X2lkIjoiZmlkZXNxdWUtb2F1dGgifQ==.Tiejckn3EPCeYsaAehIfeWPOo74h2loJPpZrqrwQU50</userToken>
        // <appCode>MOBILE</appCode>
        // <appVersion>1.0.7</appVersion>
        // <officeCode></officeCode>
        // <clientCode></clientCode>

        app.userToken = userToken;
        var xmlRequest = '<userToken>' + app.userToken + '</userToken><appCode>' + app.productcode + '</appCode><appVersion>' + app.versionApp + '</appVersion><officeCode>' + app.officecode + '</officeCode><clientCode>' + app.clientcode + '</clientCode><devicePrefix>' + ((BRVUtil.isBrowser()) ? 'BROWSER' : 'APP') + '</devicePrefix>';
        app.wsErrorCode = 'WDS006';
        app.doRequestWS('WDS', 'AppServices', 'getUserActivation', xmlRequest, app.getUserActivationsFromOASResult, showWSError);
    },
    getUserActivationsFromOASResult: function(xhttp) {
        app.debug('FUNCTION: getUserActivationsFromOASResult');

        CheckWSError(xhttp);

        var response = b64_to_str(xhttp.response);

        //	<code>S</code>
        //	<message>ACTIVATION</message>
        //	<jsonData>
        //	{
        //		"OasApiKey": "6db384786f71d30b56d0fd12112fbc95",
        //		"OasUrl": "http://staging.brancheview.net",
        //		"activations": [{
        //			"subscriptionNumber": "4936217656",
        //			"productCode": "MOBILE_HOUR",
        //			"productName": "Mobile App - Urenregistratie",
        //			"clientName": "ATY Test",
        //			"activationCode": "STu63cj18mxlj",
        //			"email": "tijssena@gmail.com",
        //			"deviceId": "",
        //			"deviceName": "",
        //			"deviceStatus": 9
        //		},
        //		{
        //			"subscriptionNumber": "0995862722",
        //			"productCode": "MOBILE",
        //			"productName": "Mobile app",
        //			"clientName": "ATY Test",
        //			"activationCode": "STy2juodu11kw3",
        //			"email": "tijssena@gmail.com",
        //			"deviceId": "ODAwMTgwNA",
        //			"deviceName": "AppBuilder",
        //			"deviceStatus": 9
        //		}]
        //	}
        //	</jsonData>

        var succes = BRVUtil.strExtract(response, '<code>', '</code>');
        var message = BRVUtil.strExtract(response, '<message>', '</message>');
        var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

        if (succes.toUpperCase() == 'S') { // Succes
            var resultJSON = BRVUtil.parseJSON(jsondata);
            var totActivations = resultJSON.activations.length;

            if (totActivations == 1) {
                // Just one activation found, so continue with this one!!
                registerDeviceUserId(resultJSON.activations[0], resultJSON.OasApiKey, resultJSON.OasUrl);
            } else {

                // Create popupbuttons
                var buttons = [];
                for (var i = 0; i < totActivations; i++) {
                    // Check for deviceId ??
                    // 			var deviceId = resultJSON.activations[i].deviceId; 
                    app.addUserActivationButton(buttons, resultJSON.activations[i], resultJSON.OasApiKey, resultJSON.OasUrl);
                }

                var button = {};
                button['annuleren'] = {};
                button.text = 'Annuleren';
                button.btnClass = 'btn-default btn-brv btn-block';
                button.action = function() {};
                buttons.push(button);

                // 		var message = '<h1>Selecteer de gewenste activatie</h1>';
                // var message = '<p>Er zijn gegevens gevonden van een eerdere registratie.<br>Selecteer de gewenste registratie.</p>';
                var message = app.translateMessage('USEDPRODUCTS_FOUND');
                jQuery.confirm({
                    title: false,
                    content: '<p>' + message + '</p>',
                    buttons: buttons
                });
            }
        } else { // Failed
            (message == 'NOT_FOUND') ? message = 'USER_NOT_FOUND': '';
            app.showMessage(message);
        }

        // $('#activationsList_container').remove();

        // if (succes.toUpperCase() == 'S') { // Succes
        // 	var resultJSON = BRVUtil.parseJSON(jsondata);
        // 	var totActivations = resultJSON.activations.length; 

        // 	if (totActivations == 1) {
        // 		// Just one activation found, so continue with this one!!
        // 		registerDeviceUserId(resultJSON.activations[0], resultJSON.OasApiKey, resultJSON.OasUrl);
        // 	} else {

        // 		// Multiple activations found, let user choose which one!!
        // 		var output = '';
        // 		output += '<div id="activationsList_container">';
        // 		output += '<p>Er zijn gegevens gevonden van een eerdere registratie.<br>Selecteer de gewenste registratie.</p>';
        // 		output += '<ul name="activationsList" id="activationsList" data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-shadow">';
        // 		for (var i = 0; i < totActivations; i++) {
        // 			// var deviceId = resultJSON.activations[i].deviceId; 
        // 			// if (deviceId) {
        // 				var activationsObjB64 = 'b64|' + str_to_b64( JSON.stringify(resultJSON.activations[i]) );
        // 				var deviceStatus = resultJSON.activations[i].deviceStatus;
        // 				deviceStatus = ( deviceStatus==1 ) ? 'DEVELOP' : ( (deviceStatus==2) ? 'TEST' : '' );

        // 				output += '<li>';
        // 				output += '	<a href="#" onclick="javascript:registerDeviceUserId(\''+activationsObjB64+'\', \''+resultJSON.OasApiKey+'\', \''+resultJSON.OasUrl+'\');">';
        // 				output += '		<h2 class="ui-li-heading"><span name="">' + resultJSON.activations[i].productName + '</span></h2>';
        // 				output += '		<p class="ui-li-desc">';
        // 				// output += '			<span>Abonnement: ' + resultJSON.activations[i].subscriptionNumber + '</span><br>';
        // 				if (deviceStatus) {
        // 					output += '			<span>Status: ' + deviceStatus + '</span>';
        // 				}
        // 				output += '		</p>';
        // 				output += '	</a>';
        // 				output += '</li>';
        // 			// }
        // 		}
        // 		output += '</ul>';
        // 		output += '</div>';
        // 		$('#content_table').append(output);
        // 		$('#activationsList').listview().listview('refresh');
        // 	}
        // } else {
        // 	(message == 'NOT_FOUND') ? message = 'USER_NOT_FOUND' : '';
        // 	app.showMessage(message);
        // }
    },
    addUserActivationButton: function(btnArr, activationsObj, OasApiKey, OasUrl) {
        var button = {};
        var buttonCode = activationsObj.activationCode;

        var deviceStatus = activationsObj.deviceStatus;
        deviceStatus = (deviceStatus == 1) ? 'DEVELOP' : ((deviceStatus == 2) ? 'TEST' : '');

        button[buttonCode] = {};
        button.text = activationsObj.productName + ((deviceStatus) ? '<br>Status: ' + deviceStatus + '' : '');
        button.btnClass = 'btn-default btn-brv btn-brv-blue btn-block';
        button.action = function() { registerDeviceUserId(activationsObj, OasApiKey, OasUrl); };
        btnArr.push(button);
    },
    // setUserActivation: function(activationsObj, OasApiKey, OasUrl) {
    // 	registerDeviceUserId(activationsObj, OasApiKey, OasUrl );
    // },


    getAppConfig: function() {
        // var activated 		= app.GetFromPhoneStorage('activated');		
        // var avkey 			= app.GetFromPhoneStorage('avkey');		
        // var subscription 	= app.GetFromPhoneStorage('subscription');		
        // var userActivations	= app.GetFromPhoneStorage('userActivations');
        // var resetByUser		= BRVUtil.parseBoolean( app.GetFromPhoneStorage('resetByUser') );	// App activation has been reset by user.

        var xmlRequest = '<appCode>' + app.productcode + '</appCode><storeId>' + app.identifier + '</storeId>';
        app.wsErrorCode = 'WDS007';
        app.doRequestWS('WDS', 'AppServices', 'getAppConfig', xmlRequest, app.getAppConfigResult, showWSError);
    },
    getAppConfigResult: function(xhttp) {

        // <code>S</code>
        // <message>CONFIG_DATA</message>
        // <jsonData>
        // {
        // 	"demoActivationCode": "STzxmr57da9nj",
        // 	"demoActivationUser": "gert.van.lijssel@yob.nl",
        // 	"loginActivationCode": "true",
        // 	"loginDemo": "true",
        // 	"loginFidesque": "false",
        // 	"loginOasUserCode": "false",
        // 	"loginQrCode": "true"
        // }
        // </jsonData>

        var response = b64_to_str(xhttp.response);
        if (BRVUtil.checkValue(response)) {
            var succes = BRVUtil.strExtract(response, '<code>', '</code>');
            var message = BRVUtil.strExtract(response, '<message>', '</message>');
            var jsondata = BRVUtil.strExtract(response, '<jsonData>', '</jsonData>');

            if (succes.toUpperCase() == 'S') { // Succes
                jsondata = BRVUtil.parseJSON(jsondata);
                //Add all demo activations per product to app.demoActivations array
                app.demoActivations = new Array();
                jQuery.each(jsondata, function(key, value) {
                    if (key.indexOf('demoActivationCode') >= 0) {
                        var tmpCode = key;
                        var tmpCodeValue = value;

                        var tmpKey = tmpCode.split(/_(.*)/); // Only split on first '_' occurence!!
                        var tmpUser = 'demoActivationUser' + ((tmpKey[1]) ? '_' + tmpKey[1] : '');
                        // var tmpUserValue = eval('jsondata.'+tmpUser);
                        var tmpUserValue = jsondata[tmpUser];

                        var newObj = {};
                        newObj.product = ((tmpKey[1])) ? (tmpKey[1]) : 'DEFAULT';
                        newObj.activationuser = tmpUserValue;
                        newObj.activationcode = tmpCodeValue;

                        app.demoActivations.push(newObj);
                    }
                });
                //

                //Check if userregistration is available
                if (jsondata.userRegistrationActive) {
                    // app.userregistration
                    // var regObj = {};
                    // regObj.active 				= BRVUtil.parseBoolean(jsondata.userregistrationActive);
                    // regObj.EmailBackoffice 		= jsondata.userregistrationEmailBackoffice;
                    // regObj.EmailBackofficeBody	= jsondata.userregistrationEmailBackofficeBody;
                    // regObj.EmailBody	   		= jsondata.userregistrationEmailBody;
                    // app.userregistration.push( regObj );

                    app.userregistration['active'] = BRVUtil.parseBoolean(jsondata.userRegistrationActive);
                    app.userregistration['registertext'] = BRVUtil.checkValue(jsondata.userRegistrationText) ? jsondata.userRegistrationText : 'Registreer als nieuwe gebruiker';
                    app.userregistration['SendGridApi'] = BRVUtil.checkValue(jsondata.SendGridApi) ? jsondata.SendGridApi : '';
                    app.userregistration['EmailBackoffice'] = BRVUtil.checkValue(jsondata.userRegistrationEmailBackoffice) ? jsondata.userRegistrationEmailBackoffice : '';
                    app.userregistration['EmailBackofficeName'] = BRVUtil.checkValue(jsondata.userRegistrationEmailBackofficeName) ? jsondata.userRegistrationEmailBackofficeName : '';
                    app.userregistration['EmailTemplateID'] = BRVUtil.checkValue(jsondata.userRegistrationEmailTemplateID) ? jsondata.userRegistrationEmailTemplateID : '';
                    app.userregistration['EmailBackofficeTemplateID'] = BRVUtil.checkValue(jsondata.userRegistrationEmailBackofficeTemplateID) ? jsondata.userRegistrationEmailBackofficeTemplateID : '';
                }

                // Check if DEMO login is available!
                // if ( jsondata.demoActivationUser && jsondata.demoActivationCode ) {
                if (jsondata.loginDemo) {
                    // app.demoAvailable		= true;
                    app.demoAvailable = (jsondata.loginDemo) ? BRVUtil.parseBoolean(jsondata.loginDemo) : true;
                    // app.demoActivationUser	= jsondata.demoActivationUser;	
                    // app.demoActivationCode	= jsondata.demoActivationCode;

                    // Get demo useractivation from storage!
                    var userActivations = app.GetFromPhoneStorage('userActivations');
                    if (BRVUtil.checkValue(userActivations)) {
                        // userActivations = JSON.parse(userActivations);
                        userActivations = BRVUtil.parseJSON(userActivations);
                        // app.activeusername = userActivations.activations[0].username;
                        app.demoActivationUser = userActivations.activations[0].activationuser;
                        app.demoActivationCode = userActivations.activations[0].activationcode;
                    }

                } else {
                    app.demoAvailable = false;
                    app.demoActivationUser = '';
                    app.demoActivationCode = '';
                }

                if (jsondata.includeJs) {
                    app.includeJs = jsondata.includeJs;
                }

                // Define default messages for loginscreen!
                app.loginScreenMessage = (jsondata.loginScreenMessage) ? jsondata.loginScreenMessage : '';
                app.loginDisabledMessage = (jsondata.loginDisabledMessage) ? jsondata.loginDisabledMessage : '';

                // Define available login methods!
                app.loginMethods['loginActivationCode'] = (jsondata.loginActivationCode) ? BRVUtil.parseBoolean(jsondata.loginActivationCode) : false;
                app.loginMethods['loginDemo'] = (jsondata.loginDemo) ? BRVUtil.parseBoolean(jsondata.loginDemo) : false;
                app.loginMethods['loginFidesque'] = (jsondata.loginFidesque) ? BRVUtil.parseBoolean(jsondata.loginFidesque) : false;
                app.loginMethods['loginFidesqueSSO'] = (jsondata.loginFidesqueSSO) ? BRVUtil.parseBoolean(jsondata.loginFidesqueSSO) : false;
                app.loginMethods['loginFidesqueSSOdirect'] = (jsondata.loginFidesqueSSOdirect) ? BRVUtil.parseBoolean(jsondata.loginFidesqueSSOdirect) : false;
                app.loginMethods['loginOasUserCode'] = (jsondata.loginOasUserCode) ? BRVUtil.parseBoolean(jsondata.loginOasUserCode) : false;
                app.loginMethods['loginQrCode'] = (jsondata.loginQrCode) ? BRVUtil.parseBoolean(jsondata.loginQrCode) : false;

                app.askForDefinitionUpdate = (jsondata.askForDefinitionUpdate) ? BRVUtil.parseBoolean(jsondata.askForDefinitionUpdate) : app.askForDefinitionUpdate;
            } else { // Failed

            }

            // Continue startApplication
            startApplication_step2('init');
        }
    },



    nop: function() {}
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// BVW Encryptor
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var BVW_Cryptor = {
    cKey: '',
    initialize: function() {},

    getKey: function() {
        return this.cKey;
    },

    getKeyMD5: function() {
        // return this.MD5(this.cKey);
        return jQuery.md5(this.cKey);
    },

    setKey: function(keyNum) {
        var encKey = this.NumToKey(keyNum);
        this.cKey = encKey;
        return encKey;
    },

    EncryptString: function(str) {
        return this.EncryptStringBase64(this.Base64Encode(str));
    },
    EncryptStringBase64: function(str) {
        var lcString = '';
        var lnOffset = (str.length % 11);
        for (var i = 0; i < str.length; i++) {
            lnOffset++;
            lcString += this.EncryptChar(str.substr(i, 1), lnOffset);
        }
        return lcString;
    },
    DecryptString: function(str) {
        return this.Base64Decode(this.DecryptStringBase64(str));
    },
    DecryptStringBase64: function(str) {
        var lcString = '';
        var lnOffset = (str.length % 11);
        for (var i = 0; i < str.length; i++) {
            lnOffset++;
            lcString += this.DecryptChar(str.substr(i, 1), lnOffset);
        }
        return lcString;
    },
    EncryptChar: function(cChar, nOffset) {
        var nAsc = cChar.charCodeAt(0);
        var nChr = -1;
        var cChar = cChar;
        if (nAsc >= 48 && nAsc <= 57) { // 0-9 = 48 t/m 57
            nChr = nAsc - 48 + 1; // Positie 1 t/m 10
        } else
        if (nAsc >= 65 && nAsc <= 90) { // A-Z = 65 t/m 90
            nChr = nAsc - 65 + 11; // Positie 11 t/m 36
        } else
        if (nAsc >= 97 && nAsc <= 122) { // a-z = 97 t/m 122
            nChr = nAsc - 97 + 37; // Positie 37 t/m 62
        } else
        if (nAsc == 43) { // +   = 43
            nChr = 63; // Positie 63
        } else
        if (nAsc == 47) { // /   = 47
            nChr = 64; // Positie 64
        }
        if (nChr > 0) {
            cChar = this.cKey.substr((nChr + nOffset) % 64, 1);
        }
        return cChar;
    },
    DecryptChar: function(cChar, nOffset) {
        //var nPos = this.cKey.indexOf(cChar) + 1 + 64;
        var nPos = this.cKey.indexOf(cChar) + 1;
        var nChr = -1;
        var cChar = cChar;

        if (nPos > 0) {
            nPos = ((nPos - 1 - nOffset) % 64);
            nPos = (nPos < 0) ? nPos + 64 : nPos;
            if (nPos >= 1 && nPos <= 10) { // Positie 1 t/m 10
                nChr = 48 - 1 + nPos; // 0-9 = 48 t/m 57
            } else
            if (nPos >= 11 && nPos <= 36) { // Positie 11 t/m 36
                nChr = 65 - 11 + nPos; // A-Z = 65 t/m 90
            } else
            if (nPos >= 37 && nPos <= 62) { // Positie 37 t/m 62
                nChr = 97 - 37 + nPos; // a-z = 97 t/m 122
            } else
            if (nPos == 63) { // Positie 63
                nChr = 43; // +
            } else
            if (nPos == 0) { // Positie 64
                nChr = 47; // /
            }
        }
        if (nChr > 0) {
            cChar = String.fromCharCode(nChr);
        }
        return cChar;
    },

    NumToKey: function(key) {
        var lcKey = '';
        var lcKeyTmp = '';
        var lcKeyTmp2 = '';
        var lnI;
        lcKeyTmp = BRVUtil.Right(key, 117);
        lcKeyPart1 = BRVUtil.Right(lcKeyTmp, 54);
        lcKeyPart2 = BRVUtil.Left(lcKeyTmp, 63);
        lcKeyPart3 = key.replace(lcKeyTmp, '');
        lcKeyTmp2 = lcKeyPart1 + lcKeyPart2 + lcKeyPart3;
        for (lnI = 0; lnI < lcKeyTmp2.length; lnI += 3) {
            lcKey += String.fromCharCode(lcKeyTmp2.substr(lnI, 3));
        }
        return lcKey;
    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) |
                    ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    },

    // Encode string to Base64
    Base64Encode: function(str) {
        str = str.replace(/\u20AC/g, '\u0080'); // Convert Euro sign to UTF!
        return window.btoa(str);
    },
    // Decode Base64 string
    Base64Decode: function(str) {
            // return window.atob(str);
            str = window.atob(str);
            str = str.replace(/\u0080/g, '\u20AC'); // Convert UTF to Euro sign!
            return str;
        }
        // Generate MD5 hash
        // MD5: function (s) {
        // 	function L(k, d) {
        // 		return (k << d) | (k >>> (32 - d));
        // 	}
        // 	function K(G, k) {
        // 		var I,
        // 			d,
        // 			F,
        // 			H,
        // 			x;
        // 		F = (G & 2147483648);
        // 		H = (k & 2147483648);
        // 		I = (G & 1073741824);
        // 		d = (k & 1073741824);
        // 		x = (G & 1073741823) + (k & 1073741823);
        // 		if (I & d) {
        // 			return (x ^ 2147483648 ^ F ^ H);
        // 		}
        // 		if (I | d) {
        // 			if (x & 1073741824) {
        // 				return (x ^ 3221225472 ^ F ^ H);
        // 			} else {
        // 				return (x ^ 1073741824 ^ F ^ H);
        // 			}
        // 		} else {
        // 			return (x ^ F ^ H);
        // 		}
        // 	}
        // 	function r(d, F, k) {
        // 		return (d & F) | ((~d) & k);
        // 	}
        // 	function q(d, F, k) {
        // 		return (d & k) | (F & (~k));
        // 	}
        // 	function p(d, F, k) {
        // 		return (d ^ F ^ k);
        // 	}
        // 	function n(d, F, k) {
        // 		return (F ^ (d | (~k)));
        // 	}
        // 	function u(G, F, aa, Z, k, H, I) {
        // 		G = K(G, K(K(r(F, aa, Z), k), I));
        // 		return K(L(G, H), F);
        // 	}
        // 	function f(G, F, aa, Z, k, H, I) {
        // 		G = K(G, K(K(q(F, aa, Z), k), I));
        // 		return K(L(G, H), F);
        // 	}
        // 	function D(G, F, aa, Z, k, H, I) {
        // 		G = K(G, K(K(p(F, aa, Z), k), I));
        // 		return K(L(G, H), F);
        // 	}
        // 	function t(G, F, aa, Z, k, H, I) {
        // 		G = K(G, K(K(n(F, aa, Z), k), I));
        // 		return K(L(G, H), F);
        // 	}
        // 	function e(G) {
        // 		var Z;
        // 		var F = G.length;
        // 		var x = F + 8;
        // 		var k = (x - (x % 64)) / 64;
        // 		var I = (k + 1) * 16;
        // 		var aa = Array(I - 1);
        // 		var d = 0;
        // 		var H = 0;
        // 		while (H < F) {
        // 			Z = (H - (H % 4)) / 4;
        // 			d = (H % 4) * 8;
        // 			aa[Z] = (aa[Z] | (G.charCodeAt(H) << d));
        // 			H++
        // 		}
        // 		Z = (H - (H % 4)) / 4;
        // 		d = (H % 4) * 8;
        // 		aa[Z] = aa[Z] | (128 << d);
        // 		aa[I - 2] = F << 3;
        // 		aa[I - 1] = F >>> 29;
        // 		return aa;
        // 	}
        // 	function B(x) {
        // 		var k = "",
        // 			F = "",
        // 			G,
        // 			d;
        // 		for (d = 0; d <= 3; d++) {
        // 			G = (x >>> (d * 8)) & 255;
        // 			F = "0" + G.toString(16);
        // 			k = k + F.substr(F.length - 2, 2)
        // 		}
        // 		return k;
        // 	}
        // 	function J(k) {
        // 		k = k.replace(/rn/g, "n");
        // 		var d = "";
        // 		for (var F = 0; F < k.length; F++) {
        // 			var x = k.charCodeAt(F);
        // 			if (x < 128) {
        // 				d += String.fromCharCode(x)
        // 			} else {
        // 				if ((x > 127) && (x < 2048)) {
        // 					d += String.fromCharCode((x >> 6) | 192);
        // 					d += String.fromCharCode((x & 63) | 128)
        // 				} else {
        // 					d += String.fromCharCode((x >> 12) | 224);
        // 					d += String.fromCharCode(((x >> 6) & 63) | 128);
        // 					d += String.fromCharCode((x & 63) | 128)
        // 				}
        // 			}
        // 		}
        // 		return d;
        // 	}
        // 	var C = Array();
        // 	var P,
        // 		h,
        // 		E,
        // 		v,
        // 		g,
        // 		Y,
        // 		X,
        // 		W,
        // 		V;
        // 	var S = 7,
        // 		Q = 12,
        // 		N = 17,
        // 		M = 22;
        // 	var A = 5,
        // 		z = 9,
        // 		y = 14,
        // 		w = 20;
        // 	var o = 4,
        // 		m = 11,
        // 		l = 16,
        // 		j = 23;
        // 	var U = 6,
        // 		T = 10,
        // 		R = 15,
        // 		O = 21;
        // 	s = J(s);
        // 	C = e(s);
        // 	Y = 1732584193;
        // 	X = 4023233417;
        // 	W = 2562383102;
        // 	V = 271733878;
        // 	for (P = 0; P < C.length; P += 16) {
        // 		h = Y;
        // 		E = X;
        // 		v = W;
        // 		g = V;
        // 		Y = u(Y, X, W, V, C[P + 0], S, 3614090360);
        // 		V = u(V, Y, X, W, C[P + 1], Q, 3905402710);
        // 		W = u(W, V, Y, X, C[P + 2], N, 606105819);
        // 		X = u(X, W, V, Y, C[P + 3], M, 3250441966);
        // 		Y = u(Y, X, W, V, C[P + 4], S, 4118548399);
        // 		V = u(V, Y, X, W, C[P + 5], Q, 1200080426);
        // 		W = u(W, V, Y, X, C[P + 6], N, 2821735955);
        // 		X = u(X, W, V, Y, C[P + 7], M, 4249261313);
        // 		Y = u(Y, X, W, V, C[P + 8], S, 1770035416);
        // 		V = u(V, Y, X, W, C[P + 9], Q, 2336552879);
        // 		W = u(W, V, Y, X, C[P + 10], N, 4294925233);
        // 		X = u(X, W, V, Y, C[P + 11], M, 2304563134);
        // 		Y = u(Y, X, W, V, C[P + 12], S, 1804603682);
        // 		V = u(V, Y, X, W, C[P + 13], Q, 4254626195);
        // 		W = u(W, V, Y, X, C[P + 14], N, 2792965006);
        // 		X = u(X, W, V, Y, C[P + 15], M, 1236535329);
        // 		Y = f(Y, X, W, V, C[P + 1], A, 4129170786);
        // 		V = f(V, Y, X, W, C[P + 6], z, 3225465664);
        // 		W = f(W, V, Y, X, C[P + 11], y, 643717713);
        // 		X = f(X, W, V, Y, C[P + 0], w, 3921069994);
        // 		Y = f(Y, X, W, V, C[P + 5], A, 3593408605);
        // 		V = f(V, Y, X, W, C[P + 10], z, 38016083);
        // 		W = f(W, V, Y, X, C[P + 15], y, 3634488961);
        // 		X = f(X, W, V, Y, C[P + 4], w, 3889429448);
        // 		Y = f(Y, X, W, V, C[P + 9], A, 568446438);
        // 		V = f(V, Y, X, W, C[P + 14], z, 3275163606);
        // 		W = f(W, V, Y, X, C[P + 3], y, 4107603335);
        // 		X = f(X, W, V, Y, C[P + 8], w, 1163531501);
        // 		Y = f(Y, X, W, V, C[P + 13], A, 2850285829);
        // 		V = f(V, Y, X, W, C[P + 2], z, 4243563512);
        // 		W = f(W, V, Y, X, C[P + 7], y, 1735328473);
        // 		X = f(X, W, V, Y, C[P + 12], w, 2368359562);
        // 		Y = D(Y, X, W, V, C[P + 5], o, 4294588738);
        // 		V = D(V, Y, X, W, C[P + 8], m, 2272392833);
        // 		W = D(W, V, Y, X, C[P + 11], l, 1839030562);
        // 		X = D(X, W, V, Y, C[P + 14], j, 4259657740);
        // 		Y = D(Y, X, W, V, C[P + 1], o, 2763975236);
        // 		V = D(V, Y, X, W, C[P + 4], m, 1272893353);
        // 		W = D(W, V, Y, X, C[P + 7], l, 4139469664);
        // 		X = D(X, W, V, Y, C[P + 10], j, 3200236656);
        // 		Y = D(Y, X, W, V, C[P + 13], o, 681279174);
        // 		V = D(V, Y, X, W, C[P + 0], m, 3936430074);
        // 		W = D(W, V, Y, X, C[P + 3], l, 3572445317);
        // 		X = D(X, W, V, Y, C[P + 6], j, 76029189);
        // 		Y = D(Y, X, W, V, C[P + 9], o, 3654602809);
        // 		V = D(V, Y, X, W, C[P + 12], m, 3873151461);
        // 		W = D(W, V, Y, X, C[P + 15], l, 530742520);
        // 		X = D(X, W, V, Y, C[P + 2], j, 3299628645);
        // 		Y = t(Y, X, W, V, C[P + 0], U, 4096336452);
        // 		V = t(V, Y, X, W, C[P + 7], T, 1126891415);
        // 		W = t(W, V, Y, X, C[P + 14], R, 2878612391);
        // 		X = t(X, W, V, Y, C[P + 5], O, 4237533241);
        // 		Y = t(Y, X, W, V, C[P + 12], U, 1700485571);
        // 		V = t(V, Y, X, W, C[P + 3], T, 2399980690);
        // 		W = t(W, V, Y, X, C[P + 10], R, 4293915773);
        // 		X = t(X, W, V, Y, C[P + 1], O, 2240044497);
        // 		Y = t(Y, X, W, V, C[P + 8], U, 1873313359);
        // 		V = t(V, Y, X, W, C[P + 15], T, 4264355552);
        // 		W = t(W, V, Y, X, C[P + 6], R, 2734768916);
        // 		X = t(X, W, V, Y, C[P + 13], O, 1309151649);
        // 		Y = t(Y, X, W, V, C[P + 4], U, 4149444226);
        // 		V = t(V, Y, X, W, C[P + 11], T, 3174756917);
        // 		W = t(W, V, Y, X, C[P + 2], R, 718787259);
        // 		X = t(X, W, V, Y, C[P + 9], O, 3951481745);
        // 		Y = K(Y, h);
        // 		X = K(X, E);
        // 		W = K(W, v);
        // 		V = K(V, g)
        // 	}
        // 	var i = B(Y) + B(X) + B(W) + B(V);
        // 	return i.toLowerCase();
        // }
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


/*----------------------------------------------------------------
BRV SQL DB Functions
-------------------------------------------------------------------*/
var BRVDatabase = {
    database: 'BrancheViewApp',
    version: '1.0',
    db: null,

    curTable: null,
    // callBack	: null,
    successCallBack: null,

    init: function() {
        // Open DB, if not exists create new one!
        if (!app.isBuilder && !BRVUtil.isBrowser() && !(device.platform.toLowerCase() == 'ios')) {
            
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                console.log('device ready');
                
                // Now safe to use device APIs
            }

            var permissions = cordova.plugins.permissions;
            permissions.checkPermission(permissions.CAMERA, function( status ){
                if (status.hasPermission ) {
                    console.log("Yes :D ", status);
                }
                else {
                 permissions.requestPermission(permissions.CAMERA);
                }
              });   
            this.db = window.openDatabase(this.database, this.version, this.database, 1000000);
        }
    },

    createTableUserActivations: function() {
        if (!app.isBuilder && !BRVUtil.isBrowser() && !(device.platform.toLowerCase() == 'ios')) {
            this.db.transaction(this.dbCreateTableUserActivations, this.errorCB, this.successCB);
        } else {
            this.successCB();
        }
    },
    dbCreateTableUserActivations: function(tx) {
        if (!app.isBuilder && !BRVUtil.isBrowser() && !(device.platform.toLowerCase() == 'ios')) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS userActivations (id INT, value TEXT NOT NULL)');
        }
    },

    updateUserActivations: function(userActivations) {
        if (!app.isBuilder && !BRVUtil.isBrowser() && !(device.platform.toLowerCase() == 'ios')) {
            // Check if DB is open.
            if (!BRVUtil.checkValue(this.db)) {
                this.db = window.openDatabase(this.database, this.version, this.database, 1000000);
            }

            // Write userActivations from localstorage to SQL db
            if (BRVUtil.checkValue(userActivations)) {
                this.db.transaction(function(tx) {
                    tx.executeSql("SELECT * FROM userActivations", [], function(tx, result) {
                        if (result.rows.length == 0) { // No records found!
                            tx.executeSql("INSERT INTO userActivations(id, value) VALUES (1, '" + userActivations + "')");
                        } else { // Record found!
                            tx.executeSql("UPDATE userActivations SET value='" + userActivations + "' WHERE id=1");
                        }

                    }, this.errorCB);
                }, this.errorCB, this.successCB);
            }
        } else {
            this.successCB();
        }
    },

    getUserActivations: function() {
        if (!app.isBuilder && !BRVUtil.isBrowser() && !(device.platform.toLowerCase() == 'ios')) {
            // Check if DB is open.
            if (!BRVUtil.checkValue(this.db)) {
                this.db = window.openDatabase(this.database, this.version, this.database, 1000000);
            }

            // Get current userActivations from SQL db
            this.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM userActivations WHERE id=1", [], function(tx, result) {
                    if (result.rows.length == 0) { // No records found!

                    } else { // Record found!
                        var userActivations = result.rows[0].value;
                        app.AddToPhoneStorage('userActivations', userActivations);
                        app.AddToPhoneStorage('activated', 'true');

                        // {
                        // 	"activations": [{
                        // 		"activationuser": "tijssena@gmail.com",
                        // 		"username": "tijssena@gmail.com",
                        // 		"activationcode": "ST01fogjewmru",
                        // 		"deviceId": "4200000000_1542285047976",
                        // 		"subscriptionNumber": "0995862722",
                        // 		"avkey": "053106077086102055049090083120065114117105098078087118050071115112084047067100111122075080056082052119099074121076069108081057101104109116097089085066079048068088070110073103113054051107072043",
                        // 		"wsseq": 5
                        // 	}]
                        // }					

                        // userActivationsObj = JSON.parse(userActivations);
                        userActivationsObj = BRVUtil.parseJSON(userActivations);
                        // if ( userActivationsObj.activations.length == 1 ) {
                        app.AddToPhoneStorage('activationcode', userActivationsObj.activations[0].activationcode);
                        app.AddToPhoneStorage('activationuser', userActivationsObj.activations[0].activationuser);
                        app.AddToPhoneStorage('activeusername', userActivationsObj.activations[0].activationuser);
                        app.AddToPhoneStorage('avkey', userActivationsObj.activations[0].avkey);
                        app.AddToPhoneStorage('deviceID', userActivationsObj.activations[0].deviceId);
                        app.AddToPhoneStorage('subscription', userActivationsObj.activations[0].subscriptionNumber);
                        app.AddToPhoneStorage('YOBsubscription', userActivationsObj.activations[0].yobSubscriptionNumber);
                        app.AddToPhoneStorage('wsseq', userActivationsObj.activations[0].wsseq);
                        app.AddToPhoneStorage('logintype', userActivationsObj.activations[0].logintype);

                        if (BRVUtil.checkValue(userActivationsObj.activations[0].oasurl)) {
                            app.AddToPhoneStorage('oaswsurl', userActivationsObj.activations[0].oasurl);
                            app.oasurl = userActivationsObj.activations[0].oasurl;
                        }
                        if (BRVUtil.checkValue(userActivationsObj.activations[0].apikeyoas)) {
                            app.AddToPhoneStorage('apikeyoas', userActivationsObj.activations[0].apikeyoas);
                            app.apikeyOAS = userActivationsObj.activations[0].apikeyoas;
                        }

                        if (BRVUtil.checkValue(userActivationsObj.activations[0].productcode)) {
                            app.AddToPhoneStorage('productcode', userActivationsObj.activations[0].productcode);
                            app.productcode = userActivationsObj.activations[0].productcode;
                        }

                        app.activationuser = userActivationsObj.activations[0].activationuser;
                        app.activeusername = userActivationsObj.activations[0].activeusername;
                        app.deviceid = userActivationsObj.activations[0].deviceId;
                        app.subscription = userActivationsObj.activations[0].subscription;
                        app.YOBsubscription = userActivationsObj.activations[0].yobSubscriptionNumber;

                        // app.adm_code = userActivationsObj.activations[0].lstadmcode; // Niet hier zetten, wordt door OAS aangeleverd!!!

                        if (userActivationsObj.activations.length > 1) {
                            app.AddToPhoneStorage('multiuser', 'true');
                            app.multiuser = true;
                        }

                    }
                }, this.errorCB);
            }, this.errorCB, this.successCB);
        } else {
            this.successCB();
        }
    },


    deleteUserActivations: function() {
        if (!app.isBuilder && !BRVUtil.isBrowser() && !(device.platform.toLowerCase() == 'ios')) {
            // Check if DB is open.
            if (!BRVUtil.checkValue(this.db)) {
                this.db = window.openDatabase(this.database, this.version, this.database, 1000000);
            }

            // Delete userActivations from SQL db
            this.db.transaction(function(tx) {
                tx.executeSql("DELETE FROM userActivations WHERE id=1");
            }, this.errorCB, this.successCB);
        } else {
            this.successCB();
        }
    },

    successCB: function() {
        if (typeof BRVDatabase.successCallBack === 'function') {
            var newCallback = BRVDatabase.successCallBack;
            BRVDatabase.successCallBack = null;
            if (jQuery.isFunction(newCallback)) { newCallback(); }
        }
    },

    errorCB: function(err) {
        BRVDatabase.successCallBack = null;
        app.showError(err, 'class: BRVDatabase');
    },

    nop: function() {}
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------




var FidesqueSSOLogin = {
    checkUserSessionUrl: app.FidesqueBaseUrl + '/checkUserSession?callbackFunc=FidesqueSSOLogin.checkResponse',
    providerUrl: app.FidesqueBaseUrl,
    fidesqueUrl: app.FidesqueBaseUrl + '/OpenIdRelyingParty?userName=<username>&providerUrl=<providerurl>&returnUrl=<returnurl>&officeLogo=<officelogo>',
    successCallBack: null,
    SSOobj: null,
    SSOToken: null,
    claimed_id: '',

    init: function() {
        this.SSOobj = null;
        this.claimed_id = '';
    },

    FidesqueLogin: function(userName) {
        var userName = (userName) ? unescape(userName.substring((userName.lastIndexOf("/")) + 1), userName.length) : '';
        //var returnUrl		= escape( window.location.href ) + '&callBack=FidesqueSSOLogin.checkValidLogin';
        // Check if there's already a '?' sign in the url.
        var returnUrl = '';
        if (window.location.href.indexOf('?') >= 0) {
            returnUrl = escape(window.location.href + '&callBack=FidesqueSSOLogin.checkValidLogin');
        } else {
            returnUrl = escape(window.location.href + '?callBack=FidesqueSSOLogin.checkValidLogin');
        }

        var providerUrl = escape(this.providerUrl);
        var fidesqueUrl = this.fidesqueUrl;

        var officeLogoUrl = window.location.href;
        officeLogoUrl = officeLogoUrl.substring(0, officeLogoUrl.lastIndexOf("/") + 1);
        officeLogoUrl = officeLogoUrl + '_themes/' + BRVUtil.getSubdomain() + '/OfficeLogo.png';
        officeLogoUrl = escape(officeLogoUrl);

        fidesqueUrl = fidesqueUrl.replace('<username>', userName);
        fidesqueUrl = fidesqueUrl.replace('<providerurl>', providerUrl);
        fidesqueUrl = fidesqueUrl.replace('<returnurl>', returnUrl);
        fidesqueUrl = fidesqueUrl.replace('<officelogo>', officeLogoUrl);
        window.location.href = fidesqueUrl;
    },

    checkValidLogin: function(claimed_id) {
        this.claimed_id = claimed_id;
        this.checkFidesque(FidesqueSSOLogin.checkUserSessionUrl);
    },

    checkFidesque: function(checkUrl) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', checkUrl);
        document.getElementsByTagName('head')[0].appendChild(script);
    },

    checkResponse: function(status, message, openid) {
        this.SSOobj = {};
        this.SSOobj.aud = [];
        this.SSOobj.aud[0] = "testjwtresourceid";
        this.SSOobj.user_name = openid;
        this.SSOobj.scope = [];
        this.SSOobj.scope[0] = "read";
        this.SSOobj.scope[1] = "write";
        this.SSOobj.exp = 1558662595;
        this.SSOobj.authorities = [];
        this.SSOobj.authorities[0] = "STANDARD_USER";
        this.SSOobj.jti = "dce140b1-9b97-47f0-a278-4a8515590d52";
        this.SSOobj.client_id = "brancheview-app";
        this.SSOToken = str_to_b64(this.SSOobj.client_id) + "." + str_to_b64(JSON.stringify(this.SSOobj)) + "." + str_to_b64(this.SSOobj.user_name);

        this.claimed_id = openid;

        switch (status) {
            case "USER_VLD":
                app.getUserActivationsFromOAS(this.SSOToken);
                break;

            case "USER_INV":
                this.init();
                this.FidesqueLogin();
                break;

            default:
                this.init();
                this.FidesqueLogin();
                break;
        }
    },

    nop: function() {

    }
};



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// BRV PDFViewer
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var BRVPDFViewer = {

    base64doc: null,
    pdfData: null,
    pdfjsLib: null,
    docFilename: null,

    rotation: 0,
    pdfScale: 1,

    curPage: 1,
    totPages: 1,

    successCallBack: null,

    resetPopupSize: function() {
        if ($('#PDFViewPopup').length) {
            var tmpHdrHeight = $('.ui-header').height();
            var tmpHeight = $('#PDFViewPopup').innerHeight() - tmpHdrHeight;
            var tmpWidth = $('#PDFViewPopup').innerWidth();

            /*			$('#PDFViewPopup').find('.ui-content').css({height:'auto'});*/
            /*			$('#PDFViewPopup').find('.ui-content').css({height:'100%'});*/

            $('#PDFViewPopup').find('.ui-content').css({ height: tmpHeight + 'px' });

            $('#PDFViewPopup').find('.ui-content').css({ width: tmpWidth + 'px' });
            $('#PDFViewPopup').find('.ui-content').css({ padding: '0px' });

            $('#PDFViewPopup').find('.ui-content').css('overflow', 'visible');
            $('#PDFViewPopup').find('.ui-content').css('overflow-x', 'auto');
            $('#PDFViewPopup').find('.ui-content').css('overflow-y', 'auto');


            /*				$('#pdfview').css({height:'auto'});*/
            /*				$('#pdfview').css({width:'100%'});*/

            /*			$('#PDFViewPopup-popup').css({left:'0px'});*/

            var orientation = parent.$("#tabletDiv").attr('class');
            if (orientation == 'landscape') {
                $('#PDFViewPopup-popup').css({ left: 'initial' });
                $('#PDFViewPopup-popup').css({ right: '0px' });
            }

            // Set pagenr's in popup header
            // var curPageText = (BRVPDFViewer.curPage).toString() + '/' + (BRVPDFViewer.totPages).toString();
            // $('#docPageNr').html( curPageText );
        }
    },

    clearCanvas: function() {
        if ($('#PDFViewPopup').length) {
            var canvas = document.getElementById('pdfview');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    },

    init: function(base64str, filename) {

        var orientation = parent.$("#tabletDiv").attr('class');
        BRVPDFViewer.orientation = orientation;

        BRVPDFViewer.curPage = 1;
        BRVPDFViewer.totPages = 1;
        BRVPDFViewer.base64doc = base64str;
        BRVPDFViewer.pdfData = null;
        BRVPDFViewer.docFilename = filename;

        var binary = atob(BRVPDFViewer.base64doc.replace(/\s/g, ''));
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var pdfData = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            pdfData[i] = binary.charCodeAt(i);
        }
        BRVPDFViewer.pdfData = pdfData;

        // // Loaded via <script> tag, create shortcut to access PDF.js exports.
        // BRVPDFViewer.pdfjsLib = window['pdfjs-dist/build/pdf'];

        // // The workerSrc property shall be specified.
        // BRVPDFViewer.pdfjsLib.GlobalWorkerOptions.workerSrc = 'PDFjs/build/pdf.worker.js';

        // Create popup window for PDF document
        setTimeout(function() {
            var output = '';
            output += '<div data-role="popup" id="PDFViewPopup">';
            output += '    <div data-role="header">';
            output += '    	<h2 id="docPageNr">&nbsp;</h2>';
            output += '     <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-left">Close</a>';
            output += '    </div>';
            //			output += '		<div style="position: absolute; top: 0px; right: 5px;"><input type="text" id="pages" value="'+(BRVPDFViewer.curPage+1) + '/' + (BRVPDFViewer.totPages+1)+'"></div>';


            /*			output += '		<div style="position: absolute; top: 42px; right: 167px;"><span id="pdf-page-zoom">n/a</span> <span>%</span></div>';*/
            /*			output += '		<div style="position: absolute; top: 20px; right: 250px;"><a href="#" onclick="BRVPDFViewer.zoomIn();" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-plus ui-btn-icon-notext ui-btn-left">In</a></div>';*/
            /*			output += '		<div style="position: absolute; top: 20px; right: 170px;"><a href="#" onclick="BRVPDFViewer.zoomOut();" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-minus ui-btn-icon-notext ui-btn-left">Out</a></div>';*/

            output += '		<div style="position: absolute; top: 20px; right: 210px;"><a href="#" onclick="BRVPDFViewer.downloadDocument();" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-arrow-d ui-btn-icon-notext ui-btn-left">Download</a></div>';
            output += '		<div style="position: absolute; top: 20px; right: 170px;"><a href="#" onclick="BRVPDFViewer.showPreviousPage();" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-arrow-l ui-btn-icon-notext ui-btn-left">Download</a></div>';
            output += '		<div style="position: absolute; top: 20px; right: 130px;"><a href="#" onclick="BRVPDFViewer.showNextPage();" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-arrow-r ui-btn-icon-notext ui-btn-left">Download</a></div>';

            output += '		<div style="position: absolute; top: 9px; right: 23px; color:#FFFFFF;"><span id="pdf-page-zoom">n/a</span> <span>%</span></div>';

            output += '		<div style="position: absolute; top: 20px; right: 90px;"><a href="#" onclick="BRVPDFViewer.zoomOut();" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-minus ui-btn-icon-notext ui-btn-left">Out</a></div>';
            output += '		<div style="position: absolute; top: 20px; right: 50px;"><a href="#" onclick="BRVPDFViewer.zoomIn();" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-plus ui-btn-icon-notext ui-btn-left">In</a></div>';



            /*			output += '    <div class="ui-content" role="main">';*/
            output += '    <div class="ui-content" role="main">';
            output += '    		<canvas id="pdfview"></canvas>';
            output += '    </div>';

            output += '</div>';
            $('#page-home').append(output);
            $('#PDFViewPopup').trigger("create"); // Just create of trigger 'maps_popup'! 

            //			$('#pages').parent().removeClass('ui-corner-all');
            //			$('#pages').parent().css({width:'50px'});

            $('#download').parent().removeClass('ui-corner-all');
            $('#download').parent().css({ height: '10px', width: '10px' });

            $('#prevPage').parent().removeClass('ui-corner-all');
            $('#prevPage').parent().css({ height: '10px', width: '10px' });
            $('#nextPage').parent().removeClass('ui-corner-all');
            $('#nextPage').parent().css({ height: '10px', width: '10px' });

            $('#pdf-page-zoom').text(Math.round(BRVPDFViewer.pdfScale * 100));

            /*			$('#PDFViewPopup').css('overflow-y', 'auto');*/

            $("[data-role=popup]").on("popupafterclose", function() {
                $(this).remove();
            }).on("popupafteropen", function() {

                BRVPDFViewer.resetPopupSize();
                BRVPDFViewer.showDocumentPage();

                var resizeTimer;
                $(window).on('resize', function(e) {

                    BRVPDFViewer.clearCanvas();

                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function() {
                        BRVPDFViewer.resetPopupSize();
                        BRVPDFViewer.showDocumentPage();
                    }, 250);
                });

            }).popup({
                beforeposition: function() {
                    $(this).css({
                        width: (BRVPDFViewer.orientation == 'landscape') ? window.innerWidth / 2.2 : window.innerWidth,
                        height: window.innerHeight - 0,
                        /*						left: 0,*/
                        top: 0
                    });
                },
                /*				x: 0,*/
                y: 0,
                positionTo: "page-home",
                dismissible: false,
                history: false,
                transition: "slide",
                modal: true
            }).popup("open");

        }, 200);

        //
    },

    downloadDocument: function() {
        BRVUtil.BrowserDownloadFile(BRVPDFViewer.docFilename, BRVPDFViewer.base64doc);
    },

    showDocumentPage: function(pageNumber, rotate) {
        if ($('#PDFViewPopup').length) {
            //var canvas = document.getElementById('pdfview');

            var pdfData = BRVPDFViewer.pdfData;
            pdfjsLib.disableWorker = true;

            pageNumber = (pageNumber) ? pageNumber : 1;
            BRVPDFViewer.curPage = pageNumber;

            var loadingTask = pdfjsLib.getDocument({ data: pdfData, nativeImageDecoderSupport: 'none' });
            loadingTask.promise.then(function(pdf) {

                // Set total pages.
                BRVPDFViewer.totPages = pdf.numPages;

                if (rotate) {
                    if (rotate == 'left') {
                        BRVPDFViewer.rotation = BRVPDFViewer.rotation - 90;
                    }
                    if (rotate == 'right') {
                        BRVPDFViewer.rotation = BRVPDFViewer.rotation + 90;
                    }
                    if (rotate == 'reset') {
                        BRVPDFViewer.rotation = 0;
                    }
                }

                pdf.getPage(pageNumber).then(function(page) {
                    var scale = BRVPDFViewer.pdfScale;
                    //var viewport = page.getViewport({scale:1, rotation:BRVPDFViewer.rotation, dontFlip:false});
                    var viewport = page.getViewport({ scale: scale, rotation: BRVPDFViewer.rotation, dontFlip: false });

                    // Prepare canvas using PDF page dimensions
                    var canvas = document.getElementById('pdfview');
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Render PDF page into canvas context
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    var renderTask = page.render(renderContext);
                    renderTask.promise.then(function() {
                        //Do nothing!!
                    });

                });

                // Set pagenr's in popup header
                var curPageText = (BRVPDFViewer.curPage).toString() + '/' + (BRVPDFViewer.totPages).toString();
                $('#docPageNr').html(curPageText);

            }, function(reason) {
                // PDF loading error
                // console.error(reason);
            });
        }
    },

    showFirstPage: function() {
        if (BRVPDFViewer.curPage > 1) {
            BRVPDFViewer.curPage = 1;
            BRVPDFViewer.showDocumentPage(BRVPDFViewer.curPage);
        }
    },
    showLastPage: function() {
        if (BRVPDFViewer.curPage > 1 && BRVPDFViewer.curPage < BRVPDFViewer.totPages) {
            BRVPDFViewer.curPage = BRVPDFViewer.totPages;
            BRVPDFViewer.showDocumentPage(BRVPDFViewer.curPage);
        }
    },
    showNextPage: function() {
        if (BRVPDFViewer.curPage < BRVPDFViewer.totPages) {
            BRVPDFViewer.curPage++;
            BRVPDFViewer.showDocumentPage(BRVPDFViewer.curPage);
        }
    },
    showPreviousPage: function() {
        if (BRVPDFViewer.curPage > 1 && BRVPDFViewer.curPage <= BRVPDFViewer.totPages) {
            BRVPDFViewer.curPage--;
            BRVPDFViewer.showDocumentPage(BRVPDFViewer.curPage);
        }
    },

    rotatePageLeft: function() {
        BRVPDFViewer.showDocumentPage(BRVPDFViewer.curPage, 'left');
    },

    rotatePageRight: function() {
        BRVPDFViewer.showDocumentPage(BRVPDFViewer.curPage, 'right');
    },

    zoomIn: function(val) {
        BRVPDFViewer.pdfScale = Number((BRVPDFViewer.pdfScale + 0.1).toFixed(1));
        BRVPDFViewer.showDocumentPage(BRVPDFViewer.curPage);
        $('#pdf-page-zoom').text(Math.round(BRVPDFViewer.pdfScale * 100));
    },

    zoomOut: function(val) {
        if (BRVPDFViewer.pdfScale <= 0.1) {
            return;
        }
        BRVPDFViewer.pdfScale = Number((BRVPDFViewer.pdfScale - 0.1).toFixed(1));
        BRVPDFViewer.showDocumentPage(BRVPDFViewer.curPage);
        $('#pdf-page-zoom').text(Math.round(BRVPDFViewer.pdfScale * 100));
    },


    successCB: function() {
        if (typeof BRVPDFViewer.pdfData === 'object') {
            var newCallback = BRVPDFViewer.successCallBack;
            BRVPDFViewer.successCallBack = null;
            if (jQuery.isFunction(newCallback)) { newCallback(); }
        }
    },

    errorCB: function(err) {
        BRVPDFViewer.successCallBack = null;
    },


    nop: function() {}
};


/*----------------------------------------------------------------
BRV Formatfunctions
-------------------------------------------------------------------*/
var BRVUtil = {
    checkImageB64: function(value) {
        var noImgFound = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAMAAAAshD+zAAAAY1BMVEX////e3t6vr698fHzQ0NB5eXmsrKy7u7vT09O3t7d2dna0tLTAwMBxcXGxsbGWlpbJycn4+PiIiIjr6+vl5eXExMTz8/Pv7+/a2tqNjY2CgoKmpqadnZ2Tk5OioqJsbGxkZGQYvFUnAAAMNUlEQVR4nO2diZqyOhKGiSGCbBKWsLjN/V/lVGWBsNht94wt/E++c2ZEDJ56qaQqG7bnOTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5Of1GHPVpI96kKvTDsK3KphH/HKNoQyVEJBVAin8HsUEqwweClxYgm3+CsAwX8rWgsjb7bo/VDEzjyUODKOvqDhl5668pXJxoCQHGfRHyBcZXwvbY7qc9/gxuVPVpw18R/x2bHzaftvwFicEVomkq0r7syD24rpp4gnPRlK8hlp+2/AWZYBkK6yQwlsAIkE8pJ+W3qjCXtubh2ofSj1VFkDGXMmx5u4eIORj7RRlZWYHSqq05+TML/wdJd8D/XjEWEEmutRu4HxjLTfk9BMufGitM+T0Ey/KHxg7l9xAsyc+M5UP5PQTLVtvqv2YsD035N9v1f5FOX+tpbilhyn+VObYi7tc/MrbRbPUeMoEwcC8aW+aqfL2HYNnktdSrmaDU5es9DHgqbeurmcCUr3eRCbSt/mue4K25GbvIBNrY8Htjm5J7IjQ3YwdwEE+kkm+bHK8SqIqm/KaDJee8BEdAT3EFTizbkyB5Utd8iD/JZoMl5w2MPwkBuKZOlCy40p83KF75WA5O6/KbhRM4fSC1Dkfg1LQFQkOTZQCu1MW3mOaE4UJVQFDNjS1z+d6aQxChLoPIQ/mNpbnRYxYc0cbqMYFotSdr7UkuiPEtEENwnZbfihoyFwQUbryiIrt2m6ST1sMAZ2QDYJ5Pym9G1RIOjNemB7LbTOpgIAlwSCPyxDoDVXFafjtawkGz4cZwgh2rIEgCAxMEIcmD4S1CQlXkBnZjaW4JBzWLB1oEnBJMhYATQbAUY/lNqZyzYTwxxkImqILvBO3M3IzvOzR/q0VAQfuq0VjyLRxkgvKky28sE3hrcKG2G2JF+BTK3AAylt/cmGDe6DBt63Z2ghrnn76DKyETmPKfhplr3uiwZiWjsfk3cCfoNoskkKVOL84m/Z3EDA6z9Ck4SbUI95WgXA7tVhePNxYsvUW9xFOxNrYFp8Rf0km40pTfXrd5CccNEKQ5H6oomP0cDqpuZeC21bNENQs4bWwcQOTkJWl9GIpik1qFhHZGYvVJvLVgiUPOeSZoY6VEe4LjanEV5sqJSsMreDc0xx/lWFc5h8szDYf7n6Zb9Xgp/ZiMlA30o035DwF8pUm9lGMCbXecxaegznE74mw/IlTWECAxBeAwXMNtLs15s2QAaQ4iZJzFg7IMGZPan27y4nJBHNtoFajS2cZ6lkp2o8MJlCCzBaD6QDGGZLavtDrpktsLlt6k0cluc6yYMkM11eFwyKC2+pUQas8libcM10zhyCrTCiQy5m3pGxdvLxN4OCUyzQQvsS0VbBLOanQYLH2seb/Q5gY8SqUNJ+ofeuygXzc2O2Q0JoMGg+XvHHfY3phAauyBCezj/45tm2nOG+slzg6Vv2xy2fYGPEqNBVctzD7CP9/qGGxtdsjI1Eu8+VV2/JW2uxxejnCi/h3cRjOBN9RLtZ+5JH59ig8/hNvc7NAgYcHpM5Ua1cTZi5QbTXPe0OiqedXictd9WAfgyMvlK7bNZgJvaHTV+oNHHPdrkzYJINg8Ycy2Giw9e2SA4+4nD1fB8LRqfXAjBtTLlPK02XgynyZSkIvZhaGwqMIc2uMJHXlUjFucQBm0XKgb/PjsoVWc9gt9iKwQcg4bbnIrC3UTxPKLDC2DzqbZVlb+X2Tbg5aNzlTLDYfBl7Xiut09rvlUYumyf4TMm0wToc/+HTCpcnDZzsPHmnB7W7WfJ4Z/KL7PJ9qdnJycnJycnJycnJycnJycnJycnJz+VF2aPpLh+DHskufhpUijc0bmU83HR/ofdUQoXHs25+NHmtJxz8kJ3j6mW1B4dTjDJfSmNyni9Vr0PdsWzxTEzXFktvuE54hRBv9G8013MaOpOiIFXBoZeHzT5wMIfi+L7QvDK3yfVHQbr1cq3gdnjBjh8h5Od5drD3jnKd0cTvu6TCdw8Fnf07N9HX5XVHRdEaWn4Xp4jzq/Z+lceq4op3AtnvMF59UdbvZ5UjNHuBYB2EW9SRjAjHA1pdez7ZAAvig9VAJU6YcFAY7lQuk96yxgwRks5BM4BNZrcUdGo8M6HLj3emXqxvCOXa+U1roQv7Aiv1AamKt8qArdzD0AF7131xvA1R3tfXWs/mMJVCDjAw5WMfsCG47FGVOXtgULTmxoZFVHuzKg7K5vUQMVpJu3q7+A60nGVNUzcGjJsIiKrrPNGuESyoKcsgyPA9qHAWPmYTIfKrMX9rTQzmp7y4tGfwEXhSKlrPYGuBLawmFoBCSizH4AboQDTwVgNQacBqvnCMeP6ET8ntwUXQmIfwPngeswpGs4CBTREBk80VMTNKQmcCcOVRqyGcHAAu9V2/VEIb19YfQuT3CISzf1EefDXzvAaHlXT3S9iVEClb1MBxoOAoV1R0VHpyF9gINbkgAAg/pWR5ASwD0aLoxkO80Z7Zvpd1S4qe9yzw0c5FJQNEmI/2c4DNTQPH4GJ+4MQn8egXcgOILnRziolehsEek0OH4HKWTPIDZwkVSavRMOohuNDRwEgmh8WBGrpZ0LBjggAjhor70QPbuq1KC2TMElAW7OhDByl99xHuCw/6UbscxzjdSb9oAYb0HWrk5MHuN/NJ4EFHvP5MxzHjavEGslwqneTBuB/egRqHayLASYIXBCUxzh/iKgyL4gCw4Kjt8ovX2fCkrIIrJGswCynbDgoH4qOHhV5tfQ+kyCF38O57Up7a4KDiPFJIn39gUWHMPwXkX0fGMYFQc4qIR3+Tca4Aw7ag56az4G552h5ujjJpp2v2r7gjmcuNFeFQkLlcywWqvvxBTQIRO0T2qiDf8AHLZ+c1xj59J0nNlxveNMFAsHP6tuoz4BvRV60w0Mq6P8yuoGX0RzfJq1vNsBhb+342zuXjDCyWN6k0Meen0y5AHbOvwIgquslQPtZUjmsjrq8U0H1SGi18u96Ec4M+Qp3rPNe4QrbyMczws5soQEe5ptiJ3ANfI6pkYDOIZrVVoxtgoYKej0UMU9jn9l1k4DA6cVvecXDqyphSS1phlEcKUpvQaLh98OZprBf6Sy/8Hj7iprIeQwvD5/WNMN2SNl5k1TXzqadudjojZtWtMMjzd1UZycnJycnJyc9qAyML/dFVsPsLd1EOft+D6MT8PMR3bS81cVHJnnwqs4ll1O/Esa+Ptu9Sb+7hDpmVZ0M13L/Azjk6gvbsPYLovYwxw/WKRAw5RFZj7BT9VqTnntYcAHnWa4+vMPsGJvvZfSI2vo3EeU9QXw0eiq7Run+DwvNQtFIc6e3If5PTkpVMLAvMdhDU7M00//TBYOIg/6z5aoaniFkco1JyTBNaGLOvcUzoybbLhL2TQkvzP67rH3t1oM/5OIRgeJBKNoM1h7Btf1tDPHBk5Ps4ugH6dSPqQ5HI4+rzqSVDh6lsfP4C5XGiX6eAYHQ79oHMh+RnM4XDcMrTdqxvYZXBZSNUe5AidH++eP/vjLDA5nrkaDykivizyDu/MrpbhItAaHs4bzNci/FcJZ+xAaMO4yhnBcLMfXZ3Bnr+7lRNEqHM6rffRnNjAVdGeUzGpydn38FKeR8PU5nOjkdOAq3HSR5QOaLS0hnDU5ddPz/8/h8P/T8Ckc+zic5TkIlrbnIHRSfP0CDm9A96Ra9nL673NCV9VNicKgj8ZZk85Mr0Z9BddC1SWkX4GLtxBQrKoj7na0rFK9XJdHNpxeZ9ZwGGCvpGALuOYKXZ2PZvF5nkvouOjjHeGNvPVtNMTU8dBURajKxXEFLqfjXpXPaNFDwfUn7boWqqzqOotiWHE9MN1rGeBwsQH62XM42Zq31f3ygsjsACMQKgrlJFwtVRtsMLzriDPA4cLWvM3xEIJRmnsf1XLd7Ayjgi7z80thbcXDjTP90c/vEN1NkBjgvDrq6TgquIehn53hTHr8K4onWlkUPPZyIRhS37h3zfMLJk9SdjPryiOcTBkDHO5agIvp7dPDORiJR+nMCO5fuj5ixTmzl8eJOnkbf2fIf+i9lOBY4DYjcbn4X9wuG/jbQwLq0MIKUbVhSGYdej4/2fjhkKLho1YVIrg+3i5/Gc3JycnJycnJycnJycnJycnJycnJycnJycnJ1n8BC0n3hVLzq0IAAAAASUVORK5CYII=';
        var imgB64String = noImgFound;
        if (this.checkValue(value)) {
            if (value.indexOf('FILE NOT FOUND') > -1) {
                imgB64String = noImgFound;
            } else {
                // imgB64String = 'data:image;base64,' + value;
                imgB64String = value; // Do not add 'data:image/xxx;base64,' cause now WS will do this for us ;-)
            }
        }
        return imgB64String;
    },

    isBool: function(par) {
        if (typeof par == 'boolean') {
            return par;
        } else {
            // return (par==null||par==undefined||par==0||par=='0'||par==''||par.toUpperCase()=='NAN'||par.toUpperCase()=='FALSE'||par.toUpperCase()=='ONWAAR'||!par)?false:true;
            return BRVUtil.parseBoolean(par);
        }
    },

    parseBoolean: function(string) {
        switch (BRVUtil.alltrim(String(string).toLowerCase())) {
            case "waar":
            case "true":
            case "1":
            case "yes":
            case "y":
            case "on":
            case ".t.":
            case "ja":
                return true;
            case "onwaar":
            case "false":
            case "0":
            case "no":
            case "n":
            case "off":
            case ".f.":
            case "nee":
                return false;
            default:
                //you could throw an error, but 'false' seems a more logical reply
                return false;
        }
    },

    checkValue: function(value) {
        var returnValue = false;
        try {
            if (value != undefined && value != 'undefined' && value != '' && value != null) {
                returnValue = true;
            }
        } catch (err) {}
        return returnValue;
    },

    checkFieldClass: function(fldID, className) {
        return ($('#' + fldID).hasClass(className)) ? true : false;
    },
    checkReadOnly: function(fldType, editable, screenmode) {
        // fldType    : text, select, ...
        // editable   : true, false, insert
        // screenmode : add, edit
        var returnValue = false;
        if (editable == 'insert' && screenmode != 'add') {
            returnValue = true;
        }
        if (editable == 'false') {
            returnValue = true;
        }
        if (screenmode == 'show') {
            returnValue = true;
        }

        // When field is editable, then do not make readonly.
        if (editable == 'true') {
            returnValue = false;
        }
        return returnValue;
    },
    setElementReadonly: function(fldobj, state) {
        var fld = (typeof fldobj == 'object') ? "#" + fldobj.id : fldobj;
        if (fldobj.type == 'checkbox') {
            $(fld).parent().find("label").css({ "border-radius": "3px", "background-color": "#E0E0E0 !important" });
            if (state == 'off') {
                $(fld).prop('disabled', false);
            } else {
                $(fld).prop('disabled', true);
            }
        } else {
            if (state == 'off') {
                $(fld).removeClass('readonly');
                $(fld).prop('readonly', false);
                $(fld + '_function').removeClass('readonly');
                $(fld + '_function').prop('readonly', false);
            } else {
                $(fld).addClass('readonly');
                $(fld).prop('readonly', true);
                $(fld + '_function').addClass('readonly');
                $(fld + '_function').prop('readonly', true);
            }
        }
    },
    setReadonlyClass: function(fldObj, type) {
        // this.setElementReadonly($("#" + fldObj.id), this.checkReadOnly(fldObj.type, fldObj.editable, app.screenMode) ? 'on' : 'off');
        this.setElementReadonly(fldObj, this.checkReadOnly(fldObj.type, fldObj.editable, app.screenMode) ? 'on' : 'off');
    },
    setFieldClass: function(fldObj, type) {
        if (fldObj.editable == 'hidden') {
            // Hide the field.
            if (app.isBuilder) { // If builder don't hide the field, add builder classes. Fill background with something!
                $("#" + fldObj.id).addClass('builderhidden');
                $("#" + fldObj.id + '_function').addClass('builderhidden');
            } else {
                // $("#" + fldObj.id).parent().hide();
                // $("#" + fldObj.id +'_function').parent().hide();

                // Hide _container instead of parent object
                $("#" + fldObj.id + "_container").hide();
            }
        } else {
            this.setReadonlyClass(fldObj, type);
        }
    },
    changeValueInArray: function(arr, item, valueNr, newValue) {
        if (valueNr == null || valueNr == '') {
            valueNr = 1;
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) {} else if (arr[i][0] === item) {
                arr[i][valueNr] = newValue;
            }
        }
    },
    getValueFromArray: function(arr, item, valueNr) {
        var returnValue = "";
        if (valueNr == null || valueNr == '') {
            valueNr = 1;
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) {} else if (arr[i][0] === item) {
                returnValue = arr[i][valueNr];
            }
        }
        return returnValue;
    },
    removeFromArray: function(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) {
                arr.splice(i, 1);
            } else if (arr[i][0] === item) {
                arr.splice(i, 1);
            }
        }
    },
    addToArray: function(arr, item, value) {
        if (value != null && value != '') {
            arr.push([item, value]);
        } else {
            arr.push(item);
        }
    },
    findInArray: function(arr, item) {
        var returnValue = -1;
        for (var i = 0; i < arr.length; i++) {
            try {
                if (arr[i].toLowerCase() === item.toLowerCase()) {
                    return i;
                }
            } catch (err) {}

            try {
                if (arr[i][0].toLowerCase() === item.toLowerCase()) {
                    return i;
                }
            } catch (err) {}
        }
        return returnValue;
    },
    ArraySortByColumn: function(a, colIndex, asc) {
        a.sort(sortFunction);

        function sortFunction(a, b) {
            if (a[colIndex] === b[colIndex]) {
                return 0;
            } else {
                if (asc) {
                    return (a[colIndex] < b[colIndex]) ? -1 : 1;
                } else {
                    return (a[colIndex] > b[colIndex]) ? -1 : 1;
                }
            }
        }
        return a;
    },
    removeArrayEl: function(array, remIdx) {
        return array.map(function(arr) {
            return arr.filter(function(el, idx) { return idx !== remIdx; });
        });
    },

    // tryFunction: function (funcName, params) {
    // 	try {
    // 		if (typeof eval(funcName) === "function") {
    // 			var doFunc = eval(funcName);
    // 			doFunc(params);
    // 		}
    // 	} catch (err) {}
    // },

    tryFunction: function(funcName, params1, params2) {
        try {
            if (typeof eval(funcName) === "function") {
                var doFunc = eval(funcName);
                doFunc(params1, params2);
            }
        } catch (err) {}
    },

    findElemInArray: function(arr, elem, value) {
        var returnValue = -1;
        if (jQuery.isArray(arr)) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][elem].toLowerCase() == value.toLowerCase()) {
                    returnValue = i;
                    break;
                }
            }
        }
        return returnValue;
    },

    alltrim: function(str) {
        if (this.checkValue(str)) {
            if (typeof str == "string") {
                str = str.replace(/^\s+/, '').replace(/\s+$/, '');
            }
        }
        return str;
    },
    ltrim: function(str) {
        if (this.checkValue(str)) {
            if (typeof str == "string") {
                str = str.replace(/^ */, "");
            }
        }
        return str;
    },
    rtrim: function(str) {
        if (this.checkValue(str)) {
            if (typeof str == "string") {
                str = str.replace(/ *$/, "");
            }
        }
        return str;
    },
    Left: function(str, n) {
        if (n <= 0)
            return "";
        else if (n > String(str).length)
            return str;
        else
            return String(str).substring(0, n);
    },
    Right: function(str, n) {
        if (n <= 0)
            return "";
        else if (n > String(str).length)
            return str;
        else {
            var iLen = String(str).length;
            return String(str).substring(iLen, iLen - n);
        }
    },
    strExtract: function(strInput, strBefore, strAfter) {
        var pos;
        var tempStr;
        var result;
        result = "";

        if (strBefore.length > 0) {
            pos = strInput.indexOf(strBefore);
        } else {
            pos = 0;
        }

        if (pos >= 0) {
            tempStr = strInput.substring(pos + strBefore.length);
            if (strAfter.length > 0) {
                pos = tempStr.indexOf(strAfter);
            } else {
                pos = tempStr.length;
            }

            if (pos >= 0) {
                result = tempStr.substring(0, pos);
            }
        }
        return result;
    },

    replaceAll: function(str, find, replace) {
        if (!this.checkValue(replace)) {
            replace = '';
        }

        if (BRVUtil.checkValue(str)) {
            // if (BRVUtil.checkValue(str) && typeof str == 'string') {
            str = str.replace(new RegExp(find, 'ig'), replace);
        }
        return str;
    },

    convertToPlainText: function(inputStr) {
        var outputStr = inputStr;
        // Convert to HTML
        outputStr = $.parseHTML(outputStr);
        // Convert to text, removes HTML
        outputStr = $(outputStr).text();
        // Remove |-signs
        outputStr = BRVUtil.replaceAll(outputStr, '[|]', '');
        return outputStr;
    },

    replaceVarsWithDataInString: function(inputStr) {
        var outputStr = inputStr;
        var extract = outputStr.match(/[<](.*?)[>]/g);
        if (extract && extract.length) {
            for (var i = 0; i < extract.length; i++) {
                var orgTag = extract[i];
                var TagName = extract[i].replace('<', '').replace('>', '');

                if (TagName.substr(0, 1) == '*') { // Check if we need to find the field value in the localstorage
                    TagName = TagName.substr(1, TagName.length);
                    foundValue = app.GetFromPhoneStorage(TagName);
                } else { // Get field value from paramobj
                    foundValue = (app.paramObject) ? app.paramObject[TagName] : '';
                }
                foundValue = (foundValue) ? foundValue : '';
                outputStr = outputStr.replace('' + orgTag + '', foundValue);
            }
        }
        return outputStr;
    },


    escapeCRLF: function(str) {
        if (this.checkValue(str)) {
            str = str.replace(/\n/g, '\\n');
            str = str.replace(/\r/g, '\\r');
        }
        return str;
    },

    escapeQuotes: function(str) {
        if (this.checkValue(str)) {
            str = str.replace(/"/g, '\\"');
            str = str.replace(/'/g, "\\'");
        }
        return str;
    },

    checkUnicode: function(str) {
        var newStr = "";
        if (this.checkValue(str)) {
            var charCode = 0;
            for (var i = 0; i < str.length; i++) {
                charCode = str.charCodeAt(i);
                if (str.charCodeAt(i) > 255) {
                    newStr += this.getUnicodeEquivalent(charCode);
                } else {
                    newStr += str[i];
                }
            }
        } else {
            newStr = str;
        }
        return newStr;
    },

    getUnicodeEquivalent: function(charCode) {
        var equiv = "";

        switch (charCode) {
            case 8364:
                equiv = '\u0080';
                break;
            case 8217:
                equiv = "'";
                break;
            case 8216:
                equiv = "'";
                break;

            case 8220:
                equiv = '"';
                break;
            case 8221:
                equiv = '"';
                break;
            case 8222:
                equiv = '"';
                break;

                //case 8240: equiv=''; break; //promille
                // 8080 ongelijk aan
                // 8776 ongeveer gelijk aan
                // 8226 stip
                // 8230 3 puntjes

            default:
                //equiv = "'" + charCode + "'";
                equiv = "";
        }

        return equiv;
    },

    illegalSearchChars: function(str) {
        if (this.checkValue(str)) {
            str = str.replace(/[*?^${}|[\]\\]/g, '');
        }
        return str;
    },

    escapeHtmlEntities: function(str) {
        return jQuery('<div/>').text(str).html();
    },

    unescapeHtmlEntities: function(str) {
        var e = document.createElement('textarea');
        e.innerHTML = str;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    },


    addbs: function(inputStr) {
        //Add Backslash to end of path
        if (this.Right(inputStr, 1) != '\\') {
            inputStr = inputStr + '\\';
        }
        return inputStr;
    },
    addfs: function(inputStr) {
        //Add Forwardslash to end of path
        if (this.Right(inputStr, 1) != '/') {
            inputStr = inputStr + '/';
        }
        return inputStr;
    },
    padl: function(inputString, padString, length) {
        var str = inputString;
        while (str.length < length)
            str = padString + str;
        return str;
    },
    padr: function(inputString, padString, length) {
        var str = inputString;
        while (str.length < length)
            str = str + padString;
        return str;
    },

    getSubdomain: function() {
        // Get subDomain, when empty then return www
        var subDomain = '';
        try {
            var hostname = window.location.hostname;
            var regexParse = new RegExp('[a-z\-0-9]{2,63}\.[a-z\.]{2,5}$');
            var urlParts = regexParse.exec(hostname);
            subDomain = hostname.replace(urlParts[0], '').slice(0, -1);
        } catch (e) {}

        return (subDomain) ? subDomain : 'www';
    },


    formatNumber: function(expr, decplaces, ShowThousand) {
        expr = expr.toString();
        expr = expr.replace('.', ',');
        expr = expr.replace(',', '.');
        var p = Number('1e' + decplaces);
        var S = new String(Math.round(expr * p) / p);
        if (decplaces > 0) {
            if (S.indexOf('e') == -1) {
                while ((p = S.indexOf('.')) == -1) {
                    S += '.';
                }
                while (S.length <= p + decplaces) {
                    S += '0';
                }
            }
            S = S.replace(/\./, ',');
            S = S.toString();
            if (ShowThousand) {
                for (var i = S.length - 3; i > 0; i -= 3) {
                    // S = S.substring(0, i) + '.' + S.substring(i);
                    if (S.substring(0, i) != '-') {
                        S = S.substring(0, i) + '.' + S.substring(i);
                    }
                }
                S = S.replace(/\.,/, ',');
            }
        }
        return S;
    },

    number_format: function(number, decimals, dec_point, thousands_sep) {
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            toFixedFix = function(n, prec) {
                // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                var k = Math.pow(10, prec);
                return Math.round(n * k) / k;
            },
            s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },

    linkify: function(inputText) {
        // Check if url is a valid url and add http:// if needed
        var replaceText,
            replacePattern1,
            replacePattern2,
            replacePattern3;

        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        //replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
        replacedText = inputText.replace(replacePattern1, '$1');

        //URLs starting with www. (without // before it, or it'd re-link the ones done above)
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        //replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
        replacedText = replacedText.replace(replacePattern2, 'http://$2');

        // Check if http or https is there!!!!
        replacedText = (replacedText.indexOf('://') === -1) ? 'http://' + replacedText : replacedText;

        replacedText = BRVUtil.replaceAll(replacedText, 'https', 'https');
        replacedText = BRVUtil.replaceAll(replacedText, 'http', 'http');

        return replacedText;
    },

    isDateValid: function(sDate) {
        var RegExPattern = /^((((0?[1-9]|[12]\d|3[01])[\.\-\/](0?[13578]|1[02])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|[12]\d|30)[\.\-\/](0?[13456789]|1[012])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|1\d|2[0-8])[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|(29[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|1\d|2[0-8])02((1[6-9]|[2-9]\d)?\d{2}))|(2902((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$/;
        return (sDate.match(RegExPattern)) && (!sDate.blank());
    },

    curToInt: function(val) {
        val = val.replace(/\./g, '');
        val = val.replace(/\,/g, '.');
        return isNaN(val) ? 0 : val;
    },

    strToDate2: function(sDate) {
        // convert string yyyy-mm-ddThh:mm:ss to dd-mm-yyyy
        sDate = jQuery.trim(sDate);
        var sYear = sDate.substr(0, 4);
        var sMonth = sDate.substr(5, 2);
        var sDay = sDate.substr(8, 2);
        var newDate = sDay + '-' + sMonth + '-' + sYear;
        return newDate;
    },

    strToDate: function(sDate) {
        sDate = sDate.strip();
        oDate = new Date();
        if (this.isDateValid(sDate)) {
            var sDay = sDate.substr(0, 2);
            var sMonth = sDate.substr(2, 2);
            var sYear = sDate.substr(4);
            var aSeparator = new Array("-", " ", "/", ".");
            aSeparator.each(function(sep) {
                if (sDate.indexOf(sep) != -1) {
                    sDateArray = sDate.split(sep);
                    sDay = sDateArray[0];
                    sMonth = sDateArray[1];
                    sYear = sDateArray[2];
                }
            });
            if (sYear.length == 2) {
                sYear = '20' + sYear;
            }
            oDate = new Date(sYear, sMonth - 1, sDay);
        }
        return oDate;
    },

    dateToStr: function(oDate, frm) {
        strDay = oDate.getDate();
        strMonth = (oDate.getMonth() + 1);
        strYear = oDate.getFullYear().toString();
        if (frm == 'ddmmyy') {
            strYear = strYear.substr(2, 4);
        }
        if (frm == 'ddmmyyyy') {
            if (strDay.toString().length == 1) {
                strDay = '0' + strDay;
            }
            if (strMonth.toString().length == 1) {
                strMonth = '0' + strMonth;
            }
        }
        return strDay + "-" + strMonth + "-" + strYear;
    },

    datetimeToStr: function(oDate, frm) {
        strDay = oDate.getDate();
        strMonth = (oDate.getMonth() + 1);
        strYear = oDate.getFullYear().toString();
        if (frm == 'ddmmyy') {
            strYear = strYear.substr(2, 4);
        }
        return BRVUtil.padl(strDay, '0', 2) + "-" + BRVUtil.padl(strMonth, '0', 2) + "-" + strYear + " " + BRVUtil.padl(oDate.getHours().toString(), '0', 2) + ":" + BRVUtil.padl(oDate.getMinutes().toString(), '0', 2);
    },

    strCurrentDate: function() {
        oDate = new Date();
        return this.dateToStr(oDate);
    },

    strCurrentMonth: function() {
        oDate = new Date();
        return oDate.getMonth() + 1; // Set +1 cause getMonth starts with 0
    },

    strCurrentDateTime: function() {
        oDate = new Date();
        return this.datetimeToStr(oDate);
    },

    ISOdateToStr: function(pars, frm) {
        objDate = this.isoTimestamp(pars);
        return (objDate) ? this.dateToStr(objDate, frm) : '';
    },

    ISOdatetimeToStr: function(pars, frm) {
        objDate = this.isoTimestamp(pars);
        return (objDate) ? this.datetimeToStr(objDate, frm) : '';
    },

    strTimeStamp: function() {
        var timeStamp = new Date().getTime();
        return timeStamp.toString();
    },

    validateDateField: function(obj) {
        obj.value = this.dateToStr(this.strToDate(obj.value));
        return this.isDateValid(obj.value);
    },

    isoTimestamp: function(str) {
        _isoRegexp = /(\d{4,})(?:-(\d{1,2})(?:-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?(?:(Z)|([+-])(\d{1,2})(?::(\d{1,2}))?)?)?)?)?/;
        /***
        Convert an ISO 8601 timestamp (or something close to it) to
        a Date object.  Will accept the "de facto" form:
        YYYY-MM-DD hh:mm:ss
        or (the proper form):
        YYYY-MM-DDThh:mm:ss
         ***/
        str = str + "";
        if (typeof(str) != "string" || str.length == 0 || str == '1899-12-30 00:00:00' || str == '1899-12-30') {
            return null;
        }
        var res = str.match(_isoRegexp);
        if (typeof(res) == "undefined" || res == null) {
            return null;
        }
        var year,
            month,
            day,
            hour,
            min,
            sec,
            msec;
        year = parseInt(res[1], 10);
        if (typeof(res[2]) == "undefined" || res[2] == "") {
            return new Date(year);
        }
        month = parseInt(res[2], 10) - 1;
        day = parseInt(res[3], 10);
        if (typeof(res[4]) == "undefined" || res[4] == "") {
            return new Date(year, month, day);
        }
        hour = parseInt(res[4], 10);
        min = parseInt(res[5], 10);
        sec = (typeof(res[6]) != "undefined" && res[6] != "") ? parseInt(res[6], 10) : 0;
        if (typeof(res[7]) != "undefined" && res[7] != "") {
            msec = Math.round(1000.0 * parseFloat("0." + res[7]));
        } else {
            msec = 0;
        }
        if ((typeof(res[8]) == "undefined" || res[8] == "") && (typeof(res[9]) == "undefined" || res[9] == "")) {
            return new Date(year, month, day, hour, min, sec, msec);
        }
        var ofs;
        if (typeof(res[9]) != "undefined" && res[9] != "") {
            ofs = parseInt(res[10], 10) * 3600000;
            if (typeof(res[11]) != "undefined" && res[11] != "") {
                ofs += parseInt(res[11], 10) * 60000;
            }
            if (res[9] == "-") {
                ofs = -ofs;
            }
        } else {
            ofs = 0;
        }
        return new Date(Date.UTC(year, month, day, hour, min, sec, msec) - ofs);
    },

    FoxColorToHex: function(nInColor) {
        nColor = nInColor;
        nBlue = parseInt(nColor / 65536);
        nColor = nColor % 65536;
        nGreen = parseInt(nColor / 256);
        nRed = nColor % 256;
        return this.rgb2hex(nRed, nGreen, nBlue);
    },
    rgb2hex: function(red, green, blue) {
        var rgb = blue | (green << 8) | (red << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1);
    },

    downloadFile: function(link_file, filename, openFileAfterDownload) {
        app.debug('FUNCTION: downloadFile, link_file:' + link_file + ', filename:' + filename + ', openFileAfterDownload:' + openFileAfterDownload);

        // Maybe switch to this because plugin 'cordova-plugin-file-transfer' has been deprecated!!!
        // BRVUtil.openLocalFile(link_file); // Can also open urls

        if (app.isBuilder) {
            // Do nothing!!!!
            app.showMessage('NOT_AVAILABLE_IN_BUILDER', 0, false);
        } else {
            app.startLoading('DOWNLOADFILE');

            // It's App in Browser
            if (BRVUtil.isBrowser()) {
                app.stopLoading();

                // '&isAttachement=False' is for Basecone url's
                window.open(link_file + "&isAttachement=False", "_system", "location=no,hidden=no,closebuttoncaption=Close");
            }

            // It's a real device or  Phonegap emulator on device
            if (BRVUtil.isDevice() || BRVUtil.isDeviceEmulator()) {
                // app.debug("Starting download to " + outputPath);
                // var fileTransfer = new FileTransfer();
                // var inputUri = encodeURI(link_file);
                // var outputPath = FileUtils.localFilePath(filename);
                // fileTransfer.download(
                // 	inputUri,
                // 	outputPath,
                // 	function (entry) {
                // 		app.debug('Download complete:, entry.fullPath:'+entry.fullPath);
                // 		app.stopLoading();
                // 		if (openFileAfterDownload) {
                // 			BRVUtil.openLocalFile(outputPath);
                // 		}
                // 	},
                // 	function (error) {
                // 		app.stopLoading();
                // 		app.debug('Download error: source=' + error.source + ', target=' + error.target + ', error code=' + error.code);
                // 		app.showError('DOWNLOAD_FAILED', error.source);
                // 	});

                // 'cordova-plugin-file-transfer': FileTransferis deprecated, will window.open also work?!?
                // window.open(link_file + "&isAttachement=False", "_system", "location=no,hidden=no,closebuttoncaption=Close");
                cordova.InAppBrowser.open(link_file, '_system', 'location=no');
            }

            // It's Ripple emulator
            if (BRVUtil.isRippleEmulator()) {
                app.stopLoading();

                // '&isAttachement=False' is for Basecone url's
                window.open(link_file + "&isAttachement=False", "_system", "location=no,hidden=no,closebuttoncaption=Close");
            }
        }
    },

    BrowserDownloadFile: function(fileName, b64content) {
        var base64str = b64content;
        var binary = atob(base64str.replace(/\s/g, ''));
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var data = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            data[i] = binary.charCodeAt(i);
        }

        var blob = new Blob([data], { "type": "application/x-msdownload" });
        var link = document.createElement('a');
        link.setAttribute("download", fileName);
        link.href = URL.createObjectURL(blob);

        // IE, Edge, Chrome, FireFox
        if (window.navigator.msSaveBlob) {
            // window.navigator.msSaveBlob(blob, downloadFileName); 
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, true);
            link.dispatchEvent(evt);
        }
    },

    BrowserShowDocumentFile: function(fileName, b64content) {
        // Check param 'docpreview' passed from index.html to appbrowser.html
        docpreview = (BRVUtil.checkValue(docpreview)) ? docpreview : 'embedded';

        if (docpreview == 'external') {
            // - parent right next to appbrowser
            this.BrowserShowDocumentFileParent(fileName, b64content);
        }

        if (docpreview == 'embedded') {
            // - in appbrowser screen
            this.BrowserShowDocumentFileSelf(fileName, b64content);
        }

        if (docpreview == 'download') {
            // - in appbrowser screen
            this.BrowserDownloadFile(fileName, b64content);
        }
    },

    BrowserShowDocumentFileSelf: function(fileName, b64content) {
        var file_ext = BRVUtil.file_get_ext(fileName);
        switch (file_ext) {
            case "pdf":
                //				BRVPDFViewer.successCallBack = BRVPDFViewer.showDocumentPage;
                BRVPDFViewer.init(b64content, fileName);
                break;

            case 'DUMMY': // color
                var dummy = '';
                break;

            default:
                break;
        }
    },

    BrowserShowDocumentFileParent: function(fileName, b64content) {
        var canvas = parent.document.getElementById('pdfview');
        canvas.height = 0;
        canvas.width = 0;

        var otherFiles = parent.document.getElementById('otherFiles');
        otherFiles.height = 0;
        otherFiles.width = 0;
        $(otherFiles).text('');

        var file_ext = BRVUtil.file_get_ext(fileName);
        switch (file_ext) {
            case "pdf":
                // BRVPDFViewer.successCallBack = BRVPDFViewer.showDocumentPage;
                // BRVPDFViewer.init( b64content );
                // parent.BRVPDFViewer.successCallBack = BRVPDFViewer.showDocumentPage;
                // Call BRVPDFViewer which is defined in 'index.html' 
                parent.BRVPDFViewer.init(b64content, fileName);
                break;

                //			case "txt":
                //				var base64str = b64content;
                //				var binary = atob(base64str.replace(/\s/g, ''));
                //
                //				var otherFiles = parent.document.getElementById('otherFiles');
                //				otherFiles.height = '100%';
                //				otherFiles.width = '100%';
                //				
                //
                //				$(otherFiles).html('<textarea id="otherFileTextArea" readonly style="resize:none; width:'+ $(otherFiles).parent().width()+'px; height:100%;">'+binary+'</textarea>');
                //				$(otherFiles).parent().parent().css('visibility', 'visible');
                //				break;
                //
                //			case "png":
                //			case "jpg":
                //				var otherFiles = parent.document.getElementById('otherFiles');
                //				otherFiles.height = '100%';
                //				otherFiles.width = '100%';
                //
                //				var MIMEType = BRVUtil.file_get_MIME_type(fileName); 
                //
                //				$(otherFiles).html('<img src="data:'+MIMEType+';base64,'+b64content+'" style="max-width:100%; max-height:100%">');
                //				$(otherFiles).parent().parent().css('visibility', 'visible');
                //				break;

            default:
                break;
        }


    },


    saveToLocalFileAndOpen: function(fileName, b64content) {
        app.debug('FUNCTION: saveToLocalFileAndOpen, fileName:' + fileName);

        var fileWriter = null;

        // ToDo: Check for fileextension.
        // var file_ext = BRVUtil.file_get_ext(fileName);

        if (app.isBuilder) {
            // Do nothing!!!!
            // app.showMessage('NOT_AVAILABLE_IN_BUILDER', 0, false);
            BRVUtil.BrowserDownloadFile(fileName, b64content);
        } else {
            app.startLoading('SAVEANDOPEN');

            // It's App in Browser
            if (BRVUtil.isBrowser()) {

                var file_ext = BRVUtil.file_get_ext(fileName);
                switch (file_ext) {
                    //					case "png":
                    //					case "jpg":
                    //					case "txt":
                    case "pdf":
                        BRVUtil.BrowserShowDocumentFile(fileName, b64content);
                        break;

                    case 'DUMMY': // color
                        var dummy = '';
                        break;

                    default:
                        BRVUtil.BrowserDownloadFile(fileName, b64content);
                        break;
                }
            }

            // It's a real device
            if (BRVUtil.isDevice()) {
                try {
                    fileWriter = new FileUtils.FileHandler(fileName);
                    fileWriter.saveBase64ToBinary(b64content, function(r) {
                        // file was saved
                        app.debug('FUNCTION: saveToLocalFileAndOpen, response: file was saved');
                        BRVUtil.openLocalFile(FileUtils.localFilePath(fileName));
                    }, function(e) {
                        // error file was not saved
                        app.debug('FUNCTION: saveToLocalFileAndOpen, response: ' + e);
                    });
                } catch (e) {
                    app.showMessage(e.message, 0, false);
                }
            }

            // It's Ripple emulator
            if (BRVUtil.isRippleEmulator()) {
                BRVUtil.BrowserDownloadFile(fileName, b64content);
            }

            // It's Phonegap emulator on device
            if (BRVUtil.isDeviceEmulator()) {
                try {
                    fileWriter = new FileUtils.FileHandler(fileName);
                    fileWriter.saveBase64ToBinary(b64content, function(r) {
                        // file was saved
                        app.debug('FUNCTION: saveToLocalFileAndOpen, response: file was saved');
                        BRVUtil.openLocalFile(FileUtils.localFilePath(fileName));
                    }, function(e) {
                        // error file was not saved
                        app.debug('FUNCTION: saveToLocalFileAndOpen, response: ' + e);
                    });
                } catch (e) {
                    app.showMessage(e.message, 0, false);
                }
            }
        }
    },

    openLocalFile: function(filePath) {
        app.debug('FUNCTION: openLocalFile, fileName:' + filePath);
        // It's a real device
        if (BRVUtil.isDevice()) {
            try {
                // var open = cordova.plugins.disusered.open;
                // open(filePath, success, error);
                var fileName = BRVUtil.get_filename(filePath);
                var MIMEType = BRVUtil.file_get_MIME_type(fileName);
                cordova.plugins.fileOpener2.open(filePath, MIMEType, success, error);
            } catch (e) {
                app.showMessage(e.message, 0, false);
            }
        }

        // It's Ripple emulator
        if (BRVUtil.isRippleEmulator()) {
            //..
        }

        // It's Phonegap emulator on device
        if (BRVUtil.isDeviceEmulator()) {
            // window.open(filePath, "_system", "location=no,hidden=no,closebuttoncaption=Close");
            window.open(filePath, "Share", "location=no,hidden=no,closebuttoncaption=Close");
        }
    },

    file_get_ext: function(filename) {
        return typeof filename != "undefined" ? filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase() : '';
    },

    file_get_MIME_type: function(filename) {
        var fileExtension = BRVUtil.file_get_ext(filename);
        fileExtension = fileExtension.toLowerCase();
        var MIMEType = '';
        switch (fileExtension) {
            case "pdf":
                MIMEType = 'application/pdf';
                break;
            case "txt":
                MIMEType = 'text/plain';
                break;
            case "doc":
                MIMEType = 'application/msword';
                break;
            case "docx":
                MIMEType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case "xls":
                MIMEType = 'application/vnd.ms-excel';
                break;
            case "xlsx":
                MIMEType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case "jpeg":
            case "jpg":
                MIMEType = 'image/jpeg';
                break;
            case "png":
                MIMEType = 'image/png';
                break;
            default:
                MIMEType = 'application/octet-stream';
                break;
        }
        return MIMEType;
    },

    get_filename: function(PathOrUrl) {
        return typeof PathOrUrl != "undefined" ? PathOrUrl.replace(/^.*(\\|\/|\:)/, '').toLowerCase() : '';
    },


    // window.location.pathname
    // Phonegap app emulator:	com.adobe.phonegap.app
    // Ripple emulator:				/PhoneGap/BrancheView_Mobile_App/V1.0.8/www/index.html
    // Android device:				/android_asset/www/index.html
    // iOS device:					/var/containers/Bundle/Application/..../BrancheView.app/www/index.html
    isBrowser: function() {
        var chkValue = window.location.pathname;
        return (chkValue.toLowerCase().indexOf('appbrowser.html') >= 0);
    },
    isDevice: function() {
        // It's real device
        var chkValue = window.location.pathname;
        // return ( chkValue.indexOf( 'com.adobe.phonegap.app' ) == -1 ) && ( chkValue.indexOf( 'phonegapdevapp' ) == -1 ) && !BRVUtil.isRippleEmulator();
        return (chkValue.indexOf('com.adobe.phonegap.app') == -1) && (chkValue.indexOf('phonegapdevapp') == -1) && !BRVUtil.isRippleEmulator() && (chkValue.toLowerCase().indexOf('appbrowser.html') == -1);

    },
    isRippleEmulator: function() {
        // It's Ripple emulator
        return window.tinyHippos != undefined;
    },
    isDeviceEmulator: function() {
        // It's Phonegap emulator on device
        var chkValue = window.location.pathname;
        return !BRVUtil.isRippleEmulator() && (chkValue.indexOf('com.adobe.phonegap.app') >= 0 || chkValue.indexOf('phonegapdevapp') >= 0);
    },


    // File functions
    GetFile: function(callbackfunc) {
        app.cameraCallBackFunc = callbackfunc;
        BRVUtil.getDesktopFile(BRVUtil.desktopGetFileSuccess);
    },

    // Camera functions
    cameraGetPicture: function(callbackfunc, quality) {
        app.cameraCallBackFunc = callbackfunc;

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];
        var hiddenbuttons = '';
        var disabledbuttons = '';

        // Check for hidden or disabled buttons in formobject
        var fieldsObj = JSONObject.content.fields;
        for (var fldi = 0; fldi < fieldsObj.length; fldi++) {
            if (fieldsObj[fldi].id == app.SavePictureFieldId) {
                hiddenbuttons = (BRVUtil.checkValue(fieldsObj[fldi].onclick.hiddenbuttons)) ? fieldsObj[fldi].onclick.hiddenbuttons : '||';
                disabledbuttons = (BRVUtil.checkValue(fieldsObj[fldi].onclick.disabledbuttons)) ? fieldsObj[fldi].onclick.disabledbuttons : '||';
                break;
            }
        }

        // Check for hidden or disabled buttons in buttonobject
        var buttonsObj = JSONObject.content.buttons;
        for (var btni = 0; btni < buttonsObj.length; btni++) {
            if (buttonsObj[btni].id == app.SavePictureButtonId) {
                hiddenbuttons = (BRVUtil.checkValue(buttonsObj[btni].onclick.hiddenbuttons)) ? buttonsObj[btni].onclick.hiddenbuttons : '||';
                disabledbuttons = (BRVUtil.checkValue(buttonsObj[btni].onclick.disabledbuttons)) ? buttonsObj[btni].onclick.disabledbuttons : '||';
                break;
            }
        }

        // navigator.camera.getPicture(BRVUtil.cameraGetPictureSuccess, BRVUtil.cameraGetPictureOnFail, { quality: (quality) ? quality : 90, targetHeight: 2048, targetWidth: 2048, destinationType: Camera.DestinationType.DATA_URL, encodingType: 0 });

        // Todo: let user choose how to get picture!
        // cameraSource = 0; // PHOTOLIBRARY
        // cameraSource = 1; // CAMERA
        // cameraSource = 2; // SAVEDPHOTOALBUM
        var message = 'Toevoegen';
        jQuery.confirm({
            title: '&nbsp;',
            content: message,
            btnClass: 'testing',
            buttons: {
                browserfile: {
                    isDisabled: (disabledbuttons.indexOf('|browserfile|') > -1 || !BRVUtil.isBrowser()) ? true : false,
                    isHidden: (hiddenbuttons.indexOf('|browserfile|') > -1 || !BRVUtil.isBrowser()) ? true : false,
                    text: 'bestand',
                    btnClass: (hiddenbuttons.indexOf('|browserfile|') > -1 || !BRVUtil.isBrowser()) ? 'btn-default btn-brv' : 'btn-default btn-brv btn-block',
                    action: function() {
                        BRVUtil.getDesktopFile(BRVUtil.desktopGetFileSuccess);
                    }
                },
                camera: {
                    isDisabled: (disabledbuttons.indexOf('|camera|') > -1) ? true : false,
                    isHidden: (hiddenbuttons.indexOf('|camera|') > -1 || BRVUtil.isBrowser()) ? true : false,
                    text: 'met camera',
                    // btnClass: 'btn-default btn-block',
                    btnClass: (hiddenbuttons.indexOf('|camera|') > -1 || BRVUtil.isBrowser()) ? 'btn-default btn-brv' : 'btn-default btn-brv btn-block',
                    action: function() {
                        cordova.plugins.backgroundMode.enable();
                        if (app.isBuilder) {
                            // Do nothing!!!!
                            app.showMessage('NOT_AVAILABLE_IN_BUILDER', 0, false);
                            // BRVUtil.getDesktopFile(BRVUtil.desktopGetFileSuccess);
                        } else if (BRVUtil.isRippleEmulator() || BRVUtil.isBrowser()) {
                            // Do nothing!!!!
                            // app.showMessage('NOT_AVAILABLE_IN_BROWSER', 0, false);
                            BRVUtil.getDesktopFile(BRVUtil.desktopGetFileSuccess);
                        } else {
                            cameraSource = 1; // CAMERA
                            //navigator.camera.getPicture(BRVUtil.cameraGetPictureSuccess, BRVUtil.cameraGetPictureOnFail, { quality: (quality)?quality:50, destinationType: Camera.DestinationType.FILE_URI, sourceType: cameraSource, encodingType : 0 });
                           navigator.camera.getPicture(
                               BRVUtil.cameraGetPictureSuccess, 
                               BRVUtil.cameraGetPictureOnFail,
                               {quality : 50, 
                                   allowEdit: false, 
                                   destinationType: Camera.DestinationType.DATA_URL, 
                                   sourceType: cameraSource, 
                                   correctOrientation: true 
                               });
                        }
                    }
                },
                fotoalbum: {
                    isDisabled: (disabledbuttons.indexOf('|fotoalbum|') > -1) ? true : false,
                    isHidden: (hiddenbuttons.indexOf('|fotoalbum|') > -1 || BRVUtil.isBrowser()) ? true : false,
                    text: 'uit fotoalbum',
                    // btnClass: 'btn-default btn-block',
                    btnClass: (hiddenbuttons.indexOf('|fotoalbum|') > -1 || BRVUtil.isBrowser()) ? 'btn-default btn-brv' : 'btn-default btn-brv btn-block',
                    action: function() {
                        if (app.isBuilder) {
                            app.showMessage('NOT_AVAILABLE_IN_BUILDER', 0, false);
                            // BRVUtil.getDesktopFile(BRVUtil.desktopGetFileSuccess);
                        } else if (BRVUtil.isRippleEmulator() || BRVUtil.isBrowser()) {
                            // Do nothing!!!!
                            // app.showMessage('NOT_AVAILABLE_IN_BROWSER', 0, false);
                            BRVUtil.getDesktopFile(BRVUtil.desktopGetFileSuccess);
                        } else {
                            cameraSource = 0; // PHOTOLIBRARY
                            // navigator.camera.getPicture(BRVUtil.cameraGetPictureSuccess, BRVUtil.cameraGetPictureOnFail, { quality: (quality)?quality:50, destinationType: Camera.DestinationType.DATA_URL, sourceType: cameraSource, encodingType : 0 });
                            navigator.camera.getPicture(BRVUtil.cameraGetPictureSuccess, BRVUtil.cameraGetPictureOnFail, { quality: (quality) ? quality : 50, targetHeight: 2048, targetWidth: 2048,allowEdit: true, destinationType: Camera.DestinationType.DATA_URL, sourceType: cameraSource, encodingType: 0, correctOrientation: true });
                        }
                    }
                },
                handtekening: {
                    isDisabled: (disabledbuttons.indexOf('|signature|') > -1) ? true : false,
                    isHidden: (hiddenbuttons.indexOf('|signature|') > -1) ? true : false,
                    text: 'handtekening',
                    // btnClass: 'btn-default btn-block',
                    btnClass: (hiddenbuttons.indexOf('|signature|') > -1) ? 'btn-default btn-brv' : 'btn-default btn-brv btn-block',
                    action: function() {
                        app.SavePictureFileName = 'signature_' + BRVUtil.strTimeStamp() + '.png';
                        BRVUtil.getSignature(BRVUtil.signatureGetPictureSuccess);
                    }
                },
                annuleren: {
                    text: 'annuleren',
                    btnClass: 'btn-default btn-brv btn-block',
                    action: function() {}
                }
            }
        });
    },
    signatureGetPictureSuccess: function() {
        if (jQuery.isFunction(app.cameraCallBackFunc)) { app.cameraCallBackFunc(); }
        app.DeskTopFile = null;
        app.cameraImageData = null;
        app.cameraCallBackFunc = null;
    },
    desktopGetFileSuccess: function() {
        if (jQuery.isFunction(app.cameraCallBackFunc)) { app.cameraCallBackFunc(); }
        app.DeskTopFile = null;
        app.cameraImageData = null;
        app.cameraCallBackFunc = null;
    },
    cameraGetPictureSuccess: function(imageData) {

        BRVUtil.reShowStatusBar();

        app.cameraImageData = imageData;
        if (jQuery.isFunction(app.cameraCallBackFunc)) 
        { 
            app.cameraCallBackFunc(); 
        }
        app.DeskTopFile = null;
        app.cameraImageData = null;
        app.cameraCallBackFunc = null;
    },
    cameraGetPictureOnFail: function(message) {
        BRVUtil.reShowStatusBar();
        app.DeskTopFile = null;
        app.cameraImageData = null;
        app.cameraCallBackFunc = null;
        // ToDo: IOS11 does return something else than IOS10 and Android ??
        // Find other way to handle this!
        // if (message.indexOf('cancelled') == -1) {
        // 	app.showError(message);
        // }
    },

    // Barcode scan
    cameraGetBarcode: function(callbackfunc) {

        if (app.isBuilder) {
            app.showMessage('NOT_AVAILABLE_IN_BUILDER', 0, false);
        } else if (BRVUtil.isRippleEmulator()) {
            // Do nothing!!!!
            app.showMessage('NOT_AVAILABLE_IN_BROWSER', 0, false);
        } else {
            app.cameraCallBackFunc = callbackfunc;
            // cordova.plugins.barcodeScanner.scan(BRVUtil.cameraGetBarcodeSuccess, BRVUtil.cameraGetBarcodeOnFail);

            try {
                cordova.plugins.barcodeScanner.scan(BRVUtil.cameraGetBarcodeSuccess, BRVUtil.cameraGetBarcodeOnFail, {
                    showTorchButton: true, // iOS and Android
                    // formats : "QR_CODE,EAN_13",	// Activate all types: QR_CODE, DATA_MATRIX, UPC_A, UPC_E, EAN_8, EAN_13, CODE_39, CODE_93, CODE_128, CODABAR, ITF, RSS14, PDF_417, RSS_EXPANDED, AZTEC
                    orientation: "portrait",
                    disableAnimations: true // iOS
                });
            } catch (e) {
                // app.showMessage('Camera plugin kan niet worden gestart', 0, false);
                app.showMessage(e.message, 0, false);
            }

        }
        // cordova.plugins.barcodeScanner.scan(
        // function (result) {
        // // alert("We got a barcode\n" +
        // // "Result: " + result.text + "\n" +
        // // "Format: " + result.format + "\n" +
        // // "Cancelled: " + result.cancelled);
        // $('#'+formFieldID).val(result.text);
        // },
        // function (error) {
        // // alert("Scanning failed: " + error);
        // }
        // );
    },
    cameraGetBarcodeSuccess: function(result) {

        BRVUtil.reShowStatusBar();

        app.BarcodeData = result;
        if (!app.BarcodeData.cancelled) { // Check  if user didn't cancel barcode scan
            if (jQuery.isFunction(app.cameraCallBackFunc)) { app.cameraCallBackFunc(); }
        }
        app.BarcodeData = null;
        app.cameraCallBackFunc = null;
    },
    cameraGetBarcodeOnFail: function(message) {

        BRVUtil.reShowStatusBar();

        app.BarcodeData = null;
        app.cameraCallBackFunc = null;
        // ToDo: IOS11 does return something else than IOS10 and Android ??
        // Find other way to handle this!
        // if (message.indexOf('cancelled') == -1) {
        // 	app.showError(message);
        // }
    },

    // Get signature
    getSignature: function(callBackFunc) {
        app.signatureCallBackFunc = callBackFunc;

        if (BRVUtil.isBrowser()) {

            setTimeout(function() {
                var output = '';
                output += '<div data-role="popup" id="SignatureScreen">';
                output += '    <div data-role="header">';
                output += '    	<h2>Handtekening</h2>';
                output += '     <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-left">Close</a>';
                output += '    </div>';
                output += '    <div class="ui-content" role="main">';
                output += '    <form>';
                output += '		<div id="signatureparent" class="ui-shadow ui-shadow-inset ui-body-inherit ui-corner-all">';
                output += '			<div name="usersignature" id="usersignature"></div>';
                output += '		</div>';
                output += '        <div data-role="controlgroup" data-type="horizontal" style="text-align:center">';
                output += '        	<button id="clearUserSignature" type="button" onclick="javascript:BRVUtil.clearSignature()">Opschonen</button>';
                output += '        	<button id="saveUserSignature" type="button" onclick="javascript:BRVUtil.saveSignature()">Opslaan</button>';
                output += '		</div>';
                output += '    </form>';
                output += '    </div>';
                output += '</div>';

                $('#page-home').append(output);

                $('#SignatureScreen').trigger("create"); // Just create of trigger 'maps_popup'! 

                $("[data-role=popup]").on("popupafterclose", function() {
                    $(this).remove();
                }).on("popupafteropen", function() {
                    $('#usersignature').empty();
                    $('#usersignature').jSignature({ color: "#000000", lineWidth: 1, height: '100%', width: '100%' });
                }).popup({
                    beforeposition: function() {
                        $(this).css({
                            width: window.innerWidth - 50,
                            height: '100%'
                        });
                    },
                    // x: 0,
                    // y: 0,
                    positionTo: "window",
                    dismissible: false,
                    history: false,
                    transition: "slide",
                    modal: true
                }).popup("open");

            }, 200);

        } else {

            var SignatureScreen = '';
            SignatureScreen += '<div data-role="page" data-dialog="true" id="SignatureScreen" isPopupScreen="true">';
            SignatureScreen += '    <div data-role="header">';
            SignatureScreen += '    	<h2>Handtekening</h2>';
            SignatureScreen += '    </div>';
            SignatureScreen += '    <div class="ui-content" role="main">';
            SignatureScreen += '    <form>';
            SignatureScreen += '		<div id="signatureparent" class="ui-shadow ui-shadow-inset ui-body-inherit ui-corner-all">';
            SignatureScreen += '			<div name="usersignature" id="usersignature"></div>';
            SignatureScreen += '		</div>';
            SignatureScreen += '        <div data-role="controlgroup" data-type="horizontal" style="text-align:center">';
            SignatureScreen += '        	<button id="clearUserSignature" type="button" onclick="javascript:BRVUtil.clearSignature()">Opschonen</button>';
            SignatureScreen += '        	<button id="saveUserSignature" type="button" onclick="javascript:BRVUtil.saveSignature()">Opslaan</button>';
            SignatureScreen += '		</div>';
            SignatureScreen += '    </form>';
            SignatureScreen += '    </div>';
            SignatureScreen += '</div>';
            ($('#SignatureScreen').length == 0) ? $("body").append(SignatureScreen): '';
            $(":mobile-pagecontainer").pagecontainer("change", "#SignatureScreen");
            //			$('#clearUserSignature').removeClass('ui-corner-all');
            //			$('#saveUserSignature').removeClass('ui-corner-all');

            setTimeout(function() {
                $('#usersignature').empty();
                $('#usersignature').jSignature({ color: "#000000", lineWidth: 1, height: '100%', width: '100%' });
            }, 500);

        }
    },

    // getSignature: function(callBackFunc) {
    // 	app.signatureCallBackFunc = callBackFunc;
    // 	var SignatureScreen = '';
    // 	SignatureScreen += '<div data-role="page" data-dialog="true" id="SignatureScreen" isPopupScreen="true">';
    // 	SignatureScreen += '    <div data-role="header">';
    // 	SignatureScreen += '    	<h2>Handtekening</h2>';
    // 	SignatureScreen += '    </div>';
    // 	SignatureScreen += '    <div class="ui-content" role="main">';
    // 	SignatureScreen += '    <form>';
    // 	SignatureScreen += '		<div id="signatureparent" class="ui-shadow ui-shadow-inset ui-body-inherit ui-corner-all">';
    // 	SignatureScreen += '			<div name="usersignature" id="usersignature"></div>';
    // 	SignatureScreen += '		</div>';
    // 	SignatureScreen += '        <div data-role="controlgroup" data-type="horizontal" style="text-align:center">';
    // 	SignatureScreen += '        	<button id="clearUserSignature" type="button" onclick="javascript:BRVUtil.clearSignature()">Opschonen</button>';
    // 	SignatureScreen += '        	<button id="saveUserSignature" type="button" onclick="javascript:BRVUtil.saveSignature()">Opslaan</button>';
    // 	SignatureScreen += '		</div>';
    // 	SignatureScreen += '    </form>';
    // 	SignatureScreen += '    </div>';
    // 	SignatureScreen += '</div>';
    // 	($('#SignatureScreen').length == 0) ? $("body").append(SignatureScreen) : '';
    // 	$(":mobile-pagecontainer").pagecontainer("change", "#SignatureScreen");
    // 	$('#clearUserSignature').removeClass('ui-corner-all');
    // 	$('#saveUserSignature').removeClass('ui-corner-all');

    // 	setTimeout(function () {
    // 		$('#usersignature').empty();
    // 		$('#usersignature').jSignature({color:"#000000",lineWidth:1,height:'100%',width:'100%'});
    // 	}, 500);
    // },
    clearSignature: function() {
        $('#usersignature').jSignature('clear');
    },
    saveSignature: function() {
        app.cameraImageData = $('#usersignature').jSignature('getData');

        if (jQuery.isFunction(app.signatureCallBackFunc)) { app.signatureCallBackFunc(); }

        app.signatureCallBackFunc = null;
    },

    collapse: function(elementid) {
        var el = $('#' + elementid);
        if (el.collapsible("option", "collapsed")) {
            el.collapsible("expand");
        } else {
            el.collapsible("collapse");
        }
    },

    closeifexpanded: function(elementid) {
        var el = $('#' + elementid);
        if (el.collapsible("option", "collapsed")) {} else {
            el.collapsible("collapse");
        }
    },


    getDesktopFile: function(callBackFunc) {
        app.desktopfileCallBackFunc = callBackFunc;
        setTimeout(function() {
            var output = '';
            output += '<div data-role="popup" id="fileselect_popup">';
            output += '    <div data-role="header">';
            output += '     <h1>Bestand uploaden</h1>';
            output += '     <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-left">Close</a>';
            output += '    </div>';
            output += '    <div class="ui-content" role="main">';
            output += '    <form>';
            output += '		<div id="fileselectcontainer" class="ui-shadow ui-shadow-inset ui-body-inherit ui-corner-all">';
            output += '			<div>';
            output += '				<button id="fileSelectButton" type="button" style="display:block;width:120px; height:30px;" onclick="document.getElementById(\'desktop-file-field\').click();">Kies bestand</button>';
            // output += '				<input type="file" id="desktop-file-field" style="display:none" accept=".ext1,.ext2,.ext3">';
            output += '				<input type="file" id="desktop-file-field" style="display:none">';
            output += '			</div>';
            output += '		</div>';
            output += '		<div style="height:75px;">';
            output += '			<div id="allowedFile"></div>';
            output += '			<div id="fileName"></div>';
            output += '			<div id="fileSize"></div>';
            output += '			<div id="fileType"></div>';
            output += '		</div>';
            output += '     <div data-role="controlgroup" data-type="horizontal" style="text-align:center;">';
            output += '        	<button id="uploadDesktopFile" type="button" onclick="javascript:BRVUtil.uploadDesktopFile()" disabled>Verzenden</button>';
            output += '		</div>';
            output += '    </form>';
            output += '    </div>';
            output += '</div>';

            $('#page-home').append(output);

            $('#fileselect_popup').trigger("create"); // Just create of trigger 'maps_popup'! 

            $("[data-role=popup]").on("popupafterclose", function() {
                $(this).remove();
            }).on("popupafteropen", function() {

                $("#desktop-file-field").change(function() {
                    BRVUtil.renderDesktopFile(this.files[0]);
                });

            }).popup({
                beforeposition: function() {
                    //					$( "#fileSelectButton" ).parent().parent().removeClass('ui-shadow').removeClass('ui-shadow-inset').removeClass('ui-body-inherit').removeClass('ui-corner-all');
                    $("#fileSelectButton").parent().parent().removeClass('ui-shadow').removeClass('ui-shadow-inset').removeClass('ui-body-inherit');
                    //					$( "#fileSelectButton" ).removeClass('ui-corner-all');
                    $("#fileSelectButton").removeClass('ui-shadow');
                    $("#fileSelectButton").removeClass('ui-btn');

                    //					$(this).css({
                    //						width: window.innerWidth - 50,
                    //						// height: window.innerHeight - 50
                    //						height: 250
                    //					});

                    if (app.isBuilder) {
                        $(this).css({
                            width: $("#page-home").innerWidth() - 50,
                            'max-width': 500,
                            height: 250
                        });
                    } else {
                        $(this).css({
                            width: window.innerWidth - 50,
                            // height: window.innerHeight - 50
                            'max-width': 500,
                            height: 250
                        });
                    }
                },
                // x: 0,
                // y: 0,
                positionTo: "window",
                dismissible: false,
                history: false,
                transition: "slide",
                modal: true
            }).popup("open");

        }, 200);
    },

    uploadDesktopFile: function() {
        if (jQuery.isFunction(app.desktopfileCallBackFunc)) { app.desktopfileCallBackFunc(); }
        app.desktopfileCallBackFunc = null;
    },

    renderDesktopFile: function(file) {
        var allowedFileExtensions;
        var fileExt;
        var fileIsAllowed = true;

        // Get app JSON from app vars
        var JSONObject = app.JSONObject['screen'];

        // Check for allowedextensions formobject
        var fieldsObj = JSONObject.content.fields;
        for (var fldi = 0; fldi < fieldsObj.length; fldi++) {
            if (fieldsObj[fldi].id == app.SavePictureFieldId) {
                allowedFileExtensions = (BRVUtil.checkValue(fieldsObj[fldi].onclick.allowedextensions)) ? fieldsObj[fldi].onclick.allowedextensions : '';
                break;
            }
        }

        // Check for allowedextensions in buttonobject
        var buttonsObj = JSONObject.content.buttons;
        for (var btni = 0; btni < buttonsObj.length; btni++) {
            if (buttonsObj[btni].id == app.SavePictureButtonId) {
                allowedFileExtensions = (BRVUtil.checkValue(buttonsObj[btni].onclick.allowedextensions)) ? buttonsObj[btni].onclick.allowedextensions : '';
                break;
            }
        }


        if (file) {
            var reader = new FileReader();
            reader.onload = function(event) {

                // Check for valid fileextensions.
                if (BRVUtil.checkValue(allowedFileExtensions)) {
                    fileExt = '.' + BRVUtil.file_get_ext(file.name);
                    if (allowedFileExtensions.indexOf(fileExt) < 0) {
                        fileIsAllowed = false;
                    }
                }

                the_url = event.target.result;

                app.DeskTopFile = {};
                app.DeskTopFile.content = the_url;
                app.DeskTopFile.filename = file.name;
                app.DeskTopFile.filesize = file.size;
                app.DeskTopFile.filetype = file.type;

                if (!fileIsAllowed) {
                    $('#allowedFile').html('<font color="#FF0000">Ongeldig bestand.<br>Toegestane extensies: ' + allowedFileExtensions + '</font>');
                    $('#fileName').html('');
                    $('#fileSize').html('');
                    $('#fileType').html('');
                    $('#uploadDesktopFile').prop('disabled', true);
                } else {
                    $('#allowedFile').html('');
                    $('#fileName').html('Bestandsnaam: ' + file.name);
                    $('#fileSize').html('Bestandsgrootte: ' + BRVUtil.getFileSize(file.size, "MB"));
                    $('#fileType').html('Bestandstype: ' + file.type);
                    $('#uploadDesktopFile').prop('disabled', false);
                }

                // $('#preview').html("<img id='desktopfile' src='"+the_url+"' width='100px' height='100px'/>")
                // $('#name').html(file.name)
                // $('#size').html( BRVUtil.getFileSize(file.size, "MB"))
                // $('#type').html(file.type)
            };

            //when the file is read it triggers the onload event above.
            reader.readAsDataURL(file);
        }

    },

    getFileSize: function(bytes, si) {
        var thresh = si ? 1000 : 1024;
        if (bytes < thresh) return bytes + ' B';
        var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (bytes >= thresh);
        return bytes.toFixed(1) + ' ' + units[u];
    },


    generateRandomString: function(length) {
        var result = '';
        var chars = 'abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    },

    lowerObjKeys: function(obj) {
        // To convert object keys to lowercase, makes life much easier ;-)
        Object.keys(obj).forEach(function(key) {
            var k = key.toLowerCase();
            if (k != key) {
                var v = obj[key];
                obj[k] = v;
                delete obj[key];

                if (typeof v == 'object') {
                    //   lowerObjKeys(v);
                    BRVUtil.lowerObjKeys(v);
                }
            }
        });
        return obj;
    },

    // iOSKeyChainSetKey: function(key, value) {
    // 	var success = function() {
    // 		console.log(key);
    // 	};
    // 	var fail = function(error) {
    // 		console.log(error);
    // 	};

    // 	try {
    // 		Keychain.set(success, fail, key, value, false);
    // 	} catch (err) {
    // 		console.log(err);
    // 	}
    // },
    // iOSKeyChainGetKey: function(key) {
    // 	var success = function(value) {
    // 		console.log(value);
    // 	};
    // 	var fail = function(error) {
    // 		console.log(error);
    // 	};

    // 	try {
    // 		Keychain.get(success, fail, key, '');
    // 	} catch (err) {
    // 		console.log(err);
    // 	}
    // },
    // iOSKeyChainRemoveKey: function(key) {
    // 	var success = function(value) {
    // 		console.log(value);
    // 	};
    // 	var fail = function(error) {
    // 		console.log(error);
    // 	};

    // 	try {
    // 		Keychain.remove(success, fail, key);
    // 	} catch (err) {
    // 		console.log(err);
    // 	}
    // },

    parseJSON: function(strJSON, GotoErrorScreen) {
        // Errors handled by window.onerror!
        // return JSON.parse(strJSON);
        app.debug('FUNCTION: parseJSON');

        var json = {};
        try {

            // First check if strJSON is maybe an object
            // If so then stringify and try to parse again!
            if (typeof(strJSON) == 'object') {
                strJSON = JSON.stringify(strJSON);
            }

            json = JSON.parse(strJSON);

        } catch (error) {
            app.debug('FUNCTION: parseJSON - ERROR: name: ' + error.name);
            app.debug('FUNCTION: parseJSON - ERROR: line: ' + error.line);
            app.debug('FUNCTION: parseJSON - ERROR: stack: ' + error.stack);
            app.debug('FUNCTION: parseJSON - ERROR: json: ' + strJSON);

            var details =
                "Error name: " + error.name + "\r\n" +
                "Error line: " + error.line + "\r\n" +
                "Error stack: " + error.stack + "\r\n" +
                "JSON: " + strJSON;

            app.addWDSLogging('error', "JSON parse error", str_to_b64(details)); //base64 code the error, other WSD cannot handle it.
            throw ("parseJSON error");
        }

        return json;
    },

    getUrlParam: function(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    },

    reShowStatusBar: function() {
        // iOS 13 issue with plugins 'cordova-plugin-statusbar' and 'cordova-plugin-camera'		
        // Webview Shifted after Camera Closed
        if (device.platform.toLowerCase() == 'ios') {
            try {
                StatusBar.hide();
                setTimeout(function() {
                    StatusBar.show();
                }, 100);
            } catch (e) {}
        }
    },

    delay: function(callback, ms) {
        var timer = 0;
        return function() {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                callback.apply(context, args);
            }, ms || 0);
        };
    },

    nop: function() {}
};
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


var FileUtils = (function() {

    // get the application directory. in this case only checking for Android and iOS
    function localFilePath(filename) {
        if (device.platform.toLowerCase() == 'android') {
            var Directory;
            if (device.version >= '7.0') { // Check for Android 7.0+ cause of changed security policy
                // Android 7+  
                Directory = cordova.file.dataDirectory;
            } else {
                // Android 7-
                Directory = cordova.file.externalDataDirectory;
            }

            return Directory + filename;

        } else if (device.platform.toLowerCase() == 'ios') {
            return cordova.file.dataDirectory + filename;
        }
    }

    // FileHandler class
    function FileHandler(filename) {
        this.fileName = filename;
        this.filePath = localFilePath(filename);
    }

    // decode base64 encoded data and save it to file
    FileHandler.prototype.saveBase64ToBinary = function(data, ok, fail) {
        // var data = BRVUtil.alltrim(data);
        // data = data.replace(/\s/g, '');
        var byteData = window.atob(data);
        // var byteData = b64_to_str(data);
        var byteArray = new Array(byteData.length);
        for (var i = 0; i < byteData.length; i++) {
            byteArray[i] = byteData.charCodeAt(i);
        }
        var binaryData = (new Uint8Array(byteArray)).buffer;
        this.saveFile(binaryData, ok, fail);
    };

    // save file to storage using cordova
    FileHandler.prototype.saveFile = function(data, ok, fail) {
        this.fileData = data;
        var path = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
        var that = this;
        // Write file on local system
        window.resolveLocalFileSystemURL(path, function(directoryEntry) {
            var options = {
                create: true,
                exclusive: false
            };
            directoryEntry.getFile(that.fileName, options, function(file) {
                file.createWriter(function(writer) {
                    writer.onwriteend = function(event) {
                        if (typeof ok === 'function') {
                            ok(event);
                        }
                    };
                    writer.write(that.fileData);
                }, fail);
            }, fail);
        }, fail);
    };

    // open InApp Browser to view file
    function viewFile(filename) {

        console.log('filename',filename);
        var path = localFilePath(filename);

        console.log('path',path);
        window.open(path, "_blank", "location=no,hidden=no,closebuttoncaption=Close");
        //cordova.InAppBrowser.open(path, "_blank", "location=no,hidden=no,closebuttoncaption=Close");
    }

    return {
        FileHandler: FileHandler,
        localFilePath: localFilePath,
        viewFile: viewFile
    };
})();

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    var dayOfYear = ((today - onejan + 1) / 86400000);
    return Math.ceil(dayOfYear / 7);
};


// if (!app.isBuilder) {
// 	jQuery.getScript("js/defaultJSON.js" );
// }

if (typeof builder == 'undefined') {
    if (typeof defaultJSONObject != 'object') {
        jQuery.getScript("js/defaultJSON.js");
    }
}