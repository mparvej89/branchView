var defaultJSONObject = {
    app: {
        name: 'BrancheView App',
        buttons: [{
            id: "resetbutton",
            name: "Reset",
            onclick: {
                action: "CallFunction",
                func: "resetApplication"
            },
            icon: "action",
            position: "right"
        }
        ]
    },
    screens: [
		{
			id: "changepincode",
			name: "Toegangscode wijzigen",
			access: "",
			nocopy: true,
			nomodify: true,
			content: {
				type: "fieldsform",
				fields: [
					{
						id: "oldpincode",
						name: "Oude toegangscode",
						type: "pincode",
						length: 10,
						editable: "true"
					},
					{
						id: "newpincode1",
						name: "Nieuwe toegangscode",
						type: "pincode",
						length: 10,
						editable: "true"
					},
					{
						id: "newpincode2",
						name: "Herhaal toegangscode",
						type: "pincode",
						length: 10,
						editable: "true"
					}
				],
				buttons: [
					{
						id: "change",
						name: "Opslaan",
                        onclick: {
                            action: "CallFunction",
                            func: "ChangePincode"
                        },
                        icon: "edit"
					}
				]
			}
		},

        {
            id: 'activateduserlogin',
            name: 'Selecteer gebruiker',
            access: '',
            content: {
                bodytoptext: str_to_b64('<br><br>'),
                type: 'listview',
                fields: [
                ],
                buttons: [
                    {
                        id: "newactivation",
                        name: "Nieuwe gebruiker toevoegen",
                        onclick: {
                            action: "CallFunction",
                            func: "app.newactivation()",
                            id: "activatenew"
                        },
                        icon: "plus"
                    }
                ]
            }
        },


        {
            id: 'activatedevice',
            name: 'Inloggen',
            access: '',
            content: {
                bodytoptext: str_to_b64('<center><br><img src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMzYuNjcgMTYwLjUiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojYjMwODM4O30uY2xzLTJ7ZmlsbDojMDAzNzY3O308L3N0eWxlPjwvZGVmcz48dGl0bGU+QnJhbmNoZVZpZXdfbG9nbzwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTAxLDE5MS4zMlExMDEsMjExLDcxLjY3LDIxMUg1Mi4wN1YxNDkuNzlxMC01LjgyLTEuNDEtNy44OXQtNS40MS0yLjA4YTEuMjEsMS4yMSwwLDAsMS0xLjA3LTEuNDMsMS4xMywxLjEzLDAsMCwxLDEuMDctMS4zSDcyLjkzcTEwLDAsMTYuMzcsMy4zMiw4LjU5LDQuNSw4LjU4LDE0LjQ3LDAsMTEuMTUtMTQuMzMsMTYuODVRMTAxLDE3NS42NiwxMDEsMTkxLjMyWm0tMTYuNDctMzZxMC0xMy4xNy0xMi44Ni0xMy4xN2gtNnYyNy4xN2g1LjE2UTg0LjUzLDE2OS4zNyw4NC41MywxNTUuMzdabTMsMzMuOTNxMC0xNC43MS0xNC42Mi0xNC43MUg2NS42MnYzMC4yNWg3LjhxNy40MSwwLDEwLjc3LTMuNjFUODcuNTUsMTg5LjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDQuMTggLTEzMi43MSkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMzcuOTUsMTY5Ljg0YTQuMzksNC4zOSwwLDAsMC0zLjQyLTJxLTYuMjQsMC04LjY4LDMuOC0xLjk0LDMtMS45NCw5LjYxVjIxMUgxMTAuMzZWMTc0YzAtMy44Ny0uNDctNi41MS0xLjQxLTcuODlTMTA2LjIsMTY0LDEwMy41MywxNjRhMS4yMSwxLjIxLDAsMCwxLTEuMDgtMS40MywxLjE0LDEuMTQsMCwwLDEsMS4wOC0xLjNsMjAuMzgtNC4zOXY4LjlxMi45MS04LjY2LDExLjUtOC42NmE3LjYxLDcuNjEsMCwwLDEsMi41My41OXYxMi4xWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0LjE4IC0xMzIuNzEpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTgxLjUxLDIxMUgxNjh2LTMuNTZhMTEuNTEsMTEuNTEsMCwwLDEtMi43MywzLjU2LDEwLjY3LDEwLjY3LDAsMCwxLTUuNjYsMS4xOXEtOS4xNiwwLTE0LjYyLTguNjYtNS03LjcxLTUtMTguODcsMC0xMC45MSw1LjQxLTE4LjQ1dDEzLjg5LTcuNTRxNi4xNCwwLDguNjcsNS45M3YtNC43NGwxMy41NS0zVjIxMVpNMTY4LDE4OC44M3YtNC4xNnEwLTIwLjA1LTUuNzUtMjAuMDUtOC43OCwwLTguNzgsMjAuMDUsMCwyMS4xMyw4Ljc4LDIxLjEyUTE2OCwyMDUuOCwxNjgsMTg4LjgzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0LjE4IC0xMzIuNzEpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjM3Ljk0LDIxMUgyMjQuMzlWMTc4Ljg2YTQzLjYsNDMuNiwwLDAsMC0uNzgtMTBxLTEuMjctNC44Ni01LjI3LTQuODZhOC4zLDguMywwLDAsMC03LjU2LDQuMzMsMjAuNzEsMjAuNzEsMCwwLDAtMi41OCwxMC43NFYyMTFIMTk0LjY2VjE3NGMwLTMuODctLjQ3LTYuNTEtMS40Mi03Ljg5cy0yLjc0LTIuMDctNS40LTIuMDdhMS4yMSwxLjIxLDAsMCwxLTEuMDgtMS40MywxLjE0LDEuMTQsMCwwLDEsMS4wOC0xLjNsMjAuMzctNC4zOXY3cTQuMzktNS4yMiwxMy43NC01LjIyLDcuNzEsMCwxMi4yOCw3LjM2YTI0Ljc0LDI0Ljc0LDAsMCwxLDMuNzEsMTMuMTdWMjExWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0LjE4IC0xMzIuNzEpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjg0LjQzLDE3My43NmgtOS42NWExOC4xOSwxOC4xOSwwLDAsMC0xLjg2LTguNjZjLTEuNDItMi41My0zLjQxLTMuNzktNS45NS0zLjc5cS04LjM4LDAtOC42NywxOS4xLTAuMSwxMCwzLjMxLDE2Ljg1LDMuNjEsNy40OCw5Ljg1LDcuNDcsNS45NCwwLDExLjQtNi4yOWwwLjA5LDcuNDdxLTUuNjUsNi4zLTE2LDYuMjktMTAsMC0xNi4wOC02Ljk0dC02LTE5Ljc1cTAtMTMuNDEsNi4xNC0yMC44OSw1Ljk1LTcuMTIsMTYtNy4xMmExNy41LDE3LjUsMCwwLDEsMTIuMzMsNC43NEExNS4xNCwxNS4xNCwwLDAsMSwyODQuNDMsMTczLjc2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0LjE4IC0xMzIuNzEpIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMzM0LjgyLDIxMUgzMjEuMjdWMTgxYTQzLjIsNDMuMiwwLDAsMC0uNzgtMTBxLTEuMjctNC44Ny01LjI3LTQuODdhOC4yNyw4LjI3LDAsMCwwLTcuNTUsNC4zMywyMC42LDIwLjYsMCwwLDAtMi41OCwxMC43NFYyMTFIMjkxLjU0VjE0OS43OXEwLTUuODItMS40Mi03Ljg5dC01LjQxLTIuMDhhMS4yLDEuMiwwLDAsMS0xLjA3LTEuNDMsMS4xMywxLjEzLDAsMCwxLDEuMDctMS4zbDIwLjM3LTQuMzl2MzIuNzVxNC4zNy02Ljc3LDEzLjczLTYuNzYsNy43MSwwLDEyLjI5LDcuMzZhMjQuNzYsMjQuNzYsMCwwLDEsMy43LDEzLjE3VjIxMVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NC4xOCAtMTMyLjcxKSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTM4MC41MywxNzguMTVsLTI2LjEzLDYuNzZhMjYuMzUsMjYuMzUsMCwwLDAsMy4zMiwxMy4yOXEzLjgsNi41Miw5Ljg0LDYuNTJUMzc5LDE5OC4zMnY3LjU5cS01LjU3LDYuMy0xNS44OCw2LjI5LTEwLDAtMTYuMDktNi45NHQtNi0xOS43NXEwLTEzLjQxLDYuMTUtMjAuODksNS45NC03LjEyLDE2LTcuMTIsNy42LDAsMTIuNDcsNi42NEEyNi43NiwyNi43NiwwLDAsMSwzODAuNTMsMTc4LjE1Wk0zNzEuNDcsMTc2cS0xLTE0LjcxLTguMzgtMTQuNzEtOC4xLDAtOC42OCwxOS4xWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0LjE4IC0xMzIuNzEpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjI2LjkzLDIxOC4xMUwyMDUsMjkySDE5OWwtMTkuNTgtNjAuMzlhMjguMywyOC4zLDAsMCwwLTIuNjEtNi4xN2MtMS4xOS0xLjg5LTIuNjUtMi44NC00LjM5LTIuODRhOCw4LDAsMCwwLTEuMy4xMiwxLjIsMS4yLDAsMCwxLTEuNTQtMSwxLjM2LDEuMzYsMCwwLDEsLjk1LTEuNjdsMTkuMjItNC43NEwyMDcsMjY4LjI5bDE0LjgzLTUwLjE4aDUuMTFaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDQuMTggLTEzMi43MSkiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yNDcuNTcsMjkySDIzNC40MVYyNTVxMC01LjgyLTEuNDQtNy45VDIyNy43NiwyNDVhMS4yMSwxLjIxLDAsMCwxLTEuMDgtMS40MywxLjEzLDEuMTMsMCwwLDEsMS4wOC0xLjNsMTkuODEtNC4zOVYyOTJabS0wLjM2LTY1LjM3YTkuODIsOS44MiwwLDAsMS0yLjE5LDYuNDYsNi41Miw2LjUyLDAsMCwxLTUuMTYsMi42Nyw2LjIxLDYuMjEsMCwwLDEtNS0yLjY3LDEwLjI2LDEwLjI2LDAsMCwxLTIuMDctNi40Niw5Ljc4LDkuNzgsMCwwLDEsMi4wNy02LjM1LDYuMjksNi4yOSwwLDAsMSw1LTIuNTUsNi41NSw2LjU1LDAsMCwxLDUuMjIsMi41NUE5LjU0LDkuNTQsMCwwLDEsMjQ3LjIxLDIyNi42NVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NC4xOCAtMTMyLjcxKSIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTI5NC40NCwyNTkuMTZMMjY5LDI2NS45MmEyNy4wOSwyNy4wOSwwLDAsMCwzLjIsMTMuMjlxMy42OSw2LjUzLDkuNjEsNi41M1QyOTMsMjc5LjMydjcuNnEtNS40Niw2LjI5LTE1LjU1LDYuMjktOS43MywwLTE1LjYtNi45NFQyNTYsMjY2LjUxcTAtMTMuNCw1LjkzLTIwLjg4LDUuODItNy4xMiwxNS41NS03LjEyLDcuNDYsMCwxMi4yMiw2LjY1QTI2LjkzLDI2LjkzLDAsMCwxLDI5NC40NCwyNTkuMTZaTTI4NS42NSwyNTdxLTAuOTQtMTQuNzItOC4xOC0xNC43MS03Ljg0LDAtOC40MywxOS4xWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0LjE4IC0xMzIuNzEpIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzYwLjE3LDIzOS40NkwzNDQuNjMsMjkyaC0zLjQ0bC0xMS41MS0zNS4zNkwzMTkuMjMsMjkyaC0zLjU1bC0xMi4xMS0zNy4yNmE0NC45LDQ0LjksMCwwLDAtMi44NS03LjEyLDUuOTIsNS45MiwwLDAsMC01LjIyLTIuNjEsMS4yLDEuMiwwLDAsMS0xLjA2LTEuNDMsMS4xMiwxLjEyLDAsMCwxLDEuMDYtMS4zbDE5LjctNC4zOSw3LjQ3LDI3LjI5TDMyNy40MiwyNTBxLTItNS02LjUyLTVhMS4yMSwxLjIxLDAsMCwxLTEuMDctMS40MywxLjEyLDEuMTIsMCwwLDEsMS4wNy0xLjNsMTkuODEtNC4zOSw3LjQ4LDI3LjI5LDgtMjUuNzVoNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NC4xOCAtMTMyLjcxKSIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTI2NCwyMjEuNzlhMS45MiwxLjkyLDAsMSwwLDAsMy44M0gzNzguOTJhMS45MiwxLjkyLDAsMSwwLDAtMy44M0gyNjRaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDQuMTggLTEzMi43MSkiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik01MS44NiwyMjEuNzlhMS45MiwxLjkyLDAsMSwwLDAsMy44M0gxNTUuN2ExLjkyLDEuOTIsMCwxLDAsMC0zLjgzSDUxLjg2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ0LjE4IC0xMzIuNzEpIi8+PC9zdmc+" width="200px"><br><br>Vul uw inloggegevens in.<br>Indien u geen inloggegevens heeft, vraag er dan om bij uw Applicatie beheerder.<br><br></center>'),
                type: 'fieldsform',
                fields: [
                    {
                        id: 'loginmethods',
                        name: '',
                        type: 'methodlist',
                        editable: 'true'
                    },
                    {
                        id: 'activationuser',
                        name: 'Gebruikersnaam',
                        type: 'text',
                        length: 80,
                        editable: 'true'
                    },
                    {
                        id: 'activationcode',
                        name: 'Wachtwoord',
                        type: 'password',
                        length: 30,
                        editable: 'true'
                    },
                    {
                        id: "qrcode",
                        name: "",
                        type: "image",
                        decimals: 0,
                        editable: "false"
                    }
                ],
                buttons: [
                    {
                        id: 'activate',
                        name: 'Inloggen',
                        onclick: {
                            action: 'ActivateDevice',
                            screen: '',
                            screenparam: '',
                            screenmode: '',
                            savesuccess: {
                                action: '',
                                screen: '',
                                screenmode: ''
                            }
                        },
                        icon: 'action'
                    },
                    {
                        id: 'cancellogin',
                        name: 'Annuleren',
                        onclick: {
							action: 'CallFunction',
							func: 'cancelLogin'
                        },
                        icon: 'back'
                    }
                ]
            }
        },


        {
            id: 'errorscreen',
            name: 'Error',
            access: '',
            content: {
                type: 'text',
                body: str_to_b64('Error<br><hr><br>Er heeft zich een probleem voorgedaan.<br><br>Error: <b><errormsg></b><br><br>Probeer het later opnieuw<br>of neem contact op met uw applicatie beheerder.<br>'),
                showlasterror: 'true',
                buttons: [{
                        id: 'restart',
                        name: 'App herstarten',
                        onclick: {
                            action: 'CallFunctionDefault',
                            func: 'app.onDeviceReady'
                        },
                        icon: 'action'
                    },
                    {
                        id: 'reactivate',
                        name: 'Probeer heractivatie',
                        onclick: {
                            action: 'CallFunction',
                            func: 'reactivateApplication'
                        },
                        icon: 'action'
                    }
                ]
            }
        },

        {
            id: 'maintenancescreen',
            name: 'Onderhoud',
            access: '',
            content: {
                type: 'text',
                body: str_to_b64('<maintenancemessage>'),
                buttons: [{
                        id: 'restart',
                        name: 'App herstarten',
                        onclick: {
                            action: 'CallFunctionDefault',
                            func: 'app.onDeviceReady'
                        },
                        icon: 'action'
                    }
                ]
            }
        }

        ,{
            id: "userregistration",
            name: "Registreren",
            nocopy: false,
            nomodify: false,
            nodelete: false,
            content: {
                type: "fieldsform",
                fields: [
                // {
                //     name: "EmailBackoffice",
                //     type: "text",
                //     decimals: 0,
                //     id: "emailbackoffice",
                //     editable: "hidden",
                //     defaultvalue: "<emailbackoffice>"
                // },
                // {
                //     name: "EmailBackofficeBody",
                //     type: "textarea",
                //     decimals: 0,
                //     id: "emailbackofficebody",
                //     editable: "hidden",
                //     defaultvalue: "<emailbackofficebody>"
                // },
                // {
                //     name: "EmailBody",
                //     type: "textarea",
                //     decimals: 0,
                //     id: "EmailBody",
                //     defaultvalue: "<emailbody>",
                //     editable: "hidden"
                // },
                {
                    name: "Voornaam",
                    type: "text",
                    decimals: 0,
                    id: "firstname",
                    mandatory: true
                    // defaultvalue: 'Jan'
                },
                {
                    name: "Achternaam",
                    type: "text",
                    decimals: 0,
                    id: "lastname",
                    mandatory: true
                    // defaultvalue: 'Jansen'
                },
                {
                    name: "E-mailadres",
                    type: "email",
                    decimals: 0,
                    id: "email",
                    mandatory: true
                    // defaultvalue: 'janjanssen123abc@1029384756.eu'
                },
                {
                    name: "Bedrijfsnaam",
                    type: "text",
                    decimals: 0,
                    id: "companyname"
                    // defaultvalue: 'Jansen B.V.'
                },
                {
                    name: "Telefoonnummer",
                    type: "phone",
                    decimals: 0,
                    id: "phonenumber"
                    // defaultvalue: '06-12345678'
                },
                {
                    name: "Opmerking",
                    type: "textarea",
                    decimals: 0,
                    id: "comment"
                    // defaultvalue: 'Ik heb geen opmerkingen'
                }],
                buttons: [
                {
                    icon: "check",
                    name: "Registreer",
                    access: "",
                    // onclick: {
                    //     action: "SaveFormData",
                    //     screenparam: "",
                    //     id: "__id_148",
                    //     checkmandatory: true,
                    //     mandatorymessage: "Niet alle verplichte velden zijn gevuld!",
                    //     savesuccess: {
                    //         action: "GotoScreen",
                    //         screenparam: "",
                    //         id: "__id_264"
                    //     }
                    // },
                    onclick: {
                        action: 'CallFunction',
                        func: 'sendUserRegistration',
                        checkmandatory: true,
                        mandatorymessage: "Niet alle verplichte velden zijn gevuld!",

                    },
                    id: "__id_149",
                    bubblecountquery: {
                        query: str_to_b64('{"Select":{"Where":"<where>"}}'),
                        id: "__id_150"
                    },
                    _img_id: ""
                },
                {
                    icon: "back",
                    name: "Annuleren",
                    access: "",
                    onclick: {
                        action: 'CallFunction',
                        func: 'cancelUserRegistration'
                    },
                    id: "__id_19",
                    bubblecountquery: {
                        query: str_to_b64('{"Select":{"Where":"<where>"}}'),
                        id: "__id_140"
                    },
                    _img_id: ""
                }
                ],
                headerinfo: {
                    id: "headerinfodiv",
                    query: {
                        id: "__id_23"
                    },
                    fields: [{
                        id: "__id_21",
                        name: ""
                    }]
                },
                id: "__id_22",
                query: {
                    query: str_to_b64('{"Select":{"Where":"<where>"}}'),
                    id: "__id_58"
                },
                querysave: {
                    appid: "_MOBILE",
                    id: "__id_156",
                    wepid: "ADDMOD_RECORD",
                    query: str_to_b64('{"SetOption":[{"Name":"firstname","Value":"<firstname>"},{"Name":"lastname","Value":"<lastname>"},{"Name":"email","Value":"<email>"},{"Name":"companyname","Value":"<companyname>"},{"Name":"phonenumber","Value":"<phonenumber>"},{"Name":"comment","Value":"<comment>"}]}')
                }
            }
        }


    ]
};