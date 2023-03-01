sap.ui.define([] , function () {
	"use strict";

	return {

        currencyBRL: function(sValue) {
            
            sValue = Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(sValue);
            return sValue ;
        },

		getDateDay: function(sDate){
			let oDay = String(sDate.getDay()).padStart(2, "0");
			return oDay;
		},

		dateToAbap: function(sValue){
			let oDateFormatted = "";
			if(sValue != ""){
				let oDate = sValue.split("/");
				oDateFormatted = `${oDate[2]}${oDate[1]}${oDate[0]}`;
			}
			return oDateFormatted;
		},

		getDateDDMMYYYY: function(sDate){
			return sap.ui.core.format.DateFormat.getDateTimeInstance({ 
				 pattern: "dd/MM/yyyy",
				 UTC: true,
				}).format(sDate);
		},

		formateValue: function(oValueInit, oId, sThis) {
            if(oValueInit != undefined && oValueInit != "") {
                let position = oValueInit.indexOf("-"),
                    oCifrao  = "";

                if(position === -1){
                    //oCifrao = "R$ ";
                }else {
                    oCifrao = "-";
                }

                let oValue = Number(oValueInit.replace("R$ ", "").replace("-","").replaceAll(".","").replace(",","").replaceAll("_","")).toString();
                let one, two, three, oFor, oFive, oSix, oSeven;

                switch (oValue.length) {
                    case 1:
                        one = 0;
                        two = oValue.substring(0, 2);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one},0${two}`);
                        }else {
                            return `${oCifrao}${one},0${two}`
                        }
                        break
                    case 2:
                        one = 0;
                        two = oValue.substring(0, 2);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one},${two}`);
                        }else {
                            return `${oCifrao}${one},${two}`
                        }
                        break
                    case 3:
                        one = oValue.substring(0, 1);
                        two = oValue.substring(1, 3);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one},${two}`);
                        }else {
                            return `${oCifrao}${one},${two}`
                        }
                        break
                    case 4:
                        one = oValue.substring(0, 2);
                        two = oValue.substring(2, 4);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one},${two}`);
                        }else {
                            return `${oCifrao}${one},${two}`
                        }
                        break
                    case 5:
                        one = oValue.substring(0, 3);
                        two = oValue.substring(3, 5);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one},${two}`);
                        }else {
                            return `${oCifrao}${one},${two}`
                        }
                        break
                    case 6:
                        one   = oValue.substring(0, 1);
                        two   = oValue.substring(1, 4);
                        three = oValue.substring(4, 6);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two},${three}`);
                        }else {
                            return `${oCifrao}${one}.${two},${three}`
                        }
                        break
                    case 7:
                        one   = oValue.substring(0, 2);
                        two   = oValue.substring(2, 5);
                        three = oValue.substring(5, 7);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two},${three}`);
                        }else {
                            return `${oCifrao}${one}.${two},${three}`
                        }
                        break
                    case 8:
                        one   = oValue.substring(0, 3);
                        two   = oValue.substring(3, 6);
                        three = oValue.substring(6, 8);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two},${three}`);
                        }else {
                            return `${oCifrao}${one}.${two},${three}`
                        }
                        break
                    case 9:
                        one   = oValue.substring(0, 1);
                        two   = oValue.substring(1, 4);
                        three = oValue.substring(4, 7);
                        oFor  = oValue.substring(7, 9);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three},${oFor}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three},${oFor}`
                        }
                        break;
                    case 10:
                        one   = oValue.substring(0, 2);
                        two   = oValue.substring(2, 5);
                        three = oValue.substring(5, 8);
                        oFor  = oValue.substring(8, 10);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three},${oFor}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three},${oFor}`
                        }
                        break
                    case 11:
                        one   = oValue.substring(0, 3);
                        two   = oValue.substring(3, 6);
                        three = oValue.substring(6, 9);
                        oFor  = oValue.substring(9, 11);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three},${oFor}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three},${oFor}`
                        }
                        break
                    case 12:
                        one   = oValue.substring(0, 1);
                        two   = oValue.substring(1, 4);
                        three = oValue.substring(4, 7);
                        oFor  = oValue.substring(7, 10);
                        oFive = oValue.substring(10, 12);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor},${oFive}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor},${oFive}`
                        }
                        break
                    case 13:
                        one   = oValue.substring(0, 2);
                        two   = oValue.substring(2, 5);
                        three = oValue.substring(5, 8);
                        oFor  = oValue.substring(8, 11);
                        oFive = oValue.substring(11, 13);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor},${oFive}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor},${oFive}`
                        }
                        break
                    case 14:
                        one   = oValue.substring(0, 3);
                        two   = oValue.substring(3, 6);
                        three = oValue.substring(6, 9);
                        oFor  = oValue.substring(9, 12);
                        oFive = oValue.substring(12, 14);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor},${oFive}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor},${oFive}`
                        }
                        break
                    case 15:
                        one   = oValue.substring(0, 1);
                        two   = oValue.substring(1, 4);
                        three = oValue.substring(4, 7);
                        oFor  = oValue.substring(7, 10);
                        oFive = oValue.substring(10, 13),
                        oSix  = oValue.substring(13, 15);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor}.${oFive},${oSix}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor}.${oFive},${oSix}`
                        }
                        break
                    case 16:
                        one   = oValue.substring(0, 2);
                        two   = oValue.substring(2, 5);
                        three = oValue.substring(5, 8);
                        oFor  = oValue.substring(8, 11);
                        oFive = oValue.substring(11, 14),
                        oSix  = oValue.substring(14, 16);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor}.${oFive},${oSix}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor}.${oFive},${oSix}`
                        }
                        break
                    case 17:
                        one   = oValue.substring(0, 3);
                        two   = oValue.substring(3, 6);
                        three = oValue.substring(6, 9);
                        oFor  = oValue.substring(9, 12);
                        oFive = oValue.substring(12, 15),
                        oSix  = oValue.substring(15, 17);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor}.${oFive},${oSix}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor}.${oFive},${oSix}`
                        }
                        break
                    case 18:
                        one   = oValue.substring(0, 1);
                        two   = oValue.substring(1, 4);
                        three = oValue.substring(4, 7);
                        oFor  = oValue.substring(7, 10);
                        oFive = oValue.substring(10, 13),
                        oSix  = oValue.substring(13, 16),
                        oSeven = oValue.substring(16, 18);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor}.${oFive}.${oSix},${oSeven}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor}.${oFive}.${oSix},${oSeven}`
                        }
                        break
                    case 19:
                        one   = oValue.substring(0, 2);
                        two   = oValue.substring(2, 5);
                        three = oValue.substring(5, 8);
                        oFor  = oValue.substring(8, 11);
                        oFive = oValue.substring(11, 14),
                        oSix  = oValue.substring(14, 17),
                        oSeven = oValue.substring(17, 19);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor}.${oFive}.${oSix},${oSeven}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor}.${oFive}.${oSix},${oSeven}`
                        }
                        break
                    case 20:
                        one   = oValue.substring(0, 3);
                        two   = oValue.substring(3, 6);
                        three = oValue.substring(6, 9);
                        oFor  = oValue.substring(9, 12);
                        oFive = oValue.substring(12, 15),
                        oSix  = oValue.substring(15, 18),
                        oSeven = oValue.substring(18, 20);
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one}.${two}.${three}.${oFor}.${oFive}.${oSix},${oSeven}`);
                        }else {
                            return `${oCifrao}${one}.${two}.${three}.${oFor}.${oFive}.${oSix},${oSeven}`
                        }
                        break
                    default:
                        one = "0";
                        two = "00";
                        if(oId){
                            sThis.byId(oId).setValue(`${oCifrao}${one},${two}`);
                        }else {
                            return `${oCifrao}${one},${two}`
                        }
                        break
                }
            }
        }
        
	};

});