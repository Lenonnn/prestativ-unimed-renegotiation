/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comprestativ.unimed./zfi_renegotiation/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
