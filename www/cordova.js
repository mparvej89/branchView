var seconds = new Date().getTime(),
	uuid = window.btoa("" + seconds).replace(/=/g, ""),
	device = {
		uuid : uuid.substr(uuid.length - 10),
		platform : 'EMULATOR'
	},
	appRoot = "App/";