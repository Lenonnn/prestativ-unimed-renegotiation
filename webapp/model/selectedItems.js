sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {
		initSelectionModel: function(sHeaderTitleTable) {
			return {
				// vanquishedDate: null,
				// Customer: "",
				// CompanyCode: "",
				// DocumentNumber: "",
				// State: {
				// 	vanquishedDate: {
				// 		Enabled: true,
				// 		ValueState: sap.ui.core.ValueState.None,
				// 		ValueStateText: ""
				// 	},
				// 	Customer: {
				// 		Enabled: true,
				// 		ValueState: sap.ui.core.ValueState.None,
				// 		ValueStateText: ""
				// 	},
				// 	CompanyCode: {
				// 		Enabled: true,
				// 		ValueState: sap.ui.core.ValueState.None,
				// 		ValueStateText: ""
				// 	},
				// 	DocumentNumber: {
				// 		Enabled: true,
				// 		ValueState: sap.ui.core.ValueState.None,
				// 		ValueStateText: ""
				// 	}
				// },
				// headerTitleTable: sHeaderTitleTable,
				items: []
			}
		}
	};
});