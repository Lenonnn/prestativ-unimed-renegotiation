sap.ui.define(
  [
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../model/selectedItems",
    "../model/Formatter",
    "sap/ui/model/Binding",
    "../model/RadioButton",
    "sap/m/PDFViewer",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    MessageToast,
    Fragment,
    JSONModel,
    MessageBox,
    selectedItems,
    Formatter,
    Binding,
    RadioButton,
    PDFViewer
  ) {
    "use strict";

    return BaseController.extend(
      "com.prestativ.unimed.zfirenegotiation.controller.Main",
      {
        formatter: Formatter,

        onInit: function () {
          this.oFileModel = this.getOwnerComponent().getModel();
        },

        onAfterRendering: function (oEvent) {
          // RsponsiveTable in MultiSelect
          this.getView().byId("smartTable").getTable().setMode("MultiSelect");
          this.getView().byId("smartTable").getTable().setGrowing(true);
          this.getView().byId("smartTable").getTable().setGrowingThreshold(10);
          this.byId("btnRen").setEnabled(true);
          // this.byId("btnTCD").setEnabled(true);
        },

        onGetDebtConfession: async function () {
          //MessageToast.show("Clicou em obter documentos");

          //this.getModel("rbButtons").setData(RadioButton.initSelectionRB() );
          //this.getModel("rbButtons").refresh(true);

          // Load Fragment to choose contracts to print
          await this.loadFragmentPrintDocuments();
        },

        onGetDebtConfessionReprint: async function () {
          //MessageToast.show("Clicou em obter documentos");

          //this.getModel("rbButtons").setData(RadioButton.initSelectionRB() );
          //this.getModel("rbButtons").refresh(true);

          // Load Fragment to choose contracts to print
          await this.loadFragmentRePrintDocuments();
        },

        onRenegotiate: async function (oEvent) {
          // MessageToast.show("Clicou em renegociar");
          this.setAppBusy(true);

          let oModel = this.getView().byId("smartTable").getTable().getSelectedItems();

          if (oModel.length != 0) {
            let SelectedContracts = [];

            // for (let i = 0; i < oModel.length; i++) {
            //   oModel[i].getBindingContext().getObject().TermsOfPayment = "".
            //   SelectedContracts.push(oModel[i].getBindingContext().getObject());
            // }
            let txInterest = 4.0;
            let txFine = 2.0;
            let txAccurate = 0.0;

            let J = parseFloat(txInterest).toFixed(2);
            let M = parseFloat(txFine).toFixed(2);
            let A = parseFloat(txAccurate).toFixed(2);

            for (let line of oModel) {
              let oLine = line.getBindingContext().getObject();
              oLine.TermsOfPayment = "";
              oLine.VHDay = "";
              oLine.BaseDay = "";
              oLine.InterestRate = J;
              oLine.FineRate = M;
              oLine.AccrualRate = A;
              oLine.NewValue = Formatter.formateValue(oLine.Amount);
              SelectedContracts.push(oLine);
            }

            this.getView().getModel("selectedItems").getData().items = SelectedContracts;
            this.getView().getModel("selectedItems").refresh(true);
            // onReviewContracts( oModel );

            // Call Dialog Fragment
            await this.loadFragmentTableSelectd();
          } else {
            MessageBox.warning(
              "Selecione pelo menos 1 contrato para renegociar"
            );
          }

          this.setAppBusy(false);
        },

        onConfirmRenegotiation: function () {
          let isJustOneCustomer = true;
          let oModelCheckCustomer = this.getModel("selectedItems").getData().items;
          let oCustomer = oModelCheckCustomer[0].Customer;

          for (let oLineCheck of oModelCheckCustomer) {
            if (oLineCheck.Customer !== oCustomer) {
              isJustOneCustomer = false;
            }
          }

          if (isJustOneCustomer === true) {
            MessageBox.confirm("Deseja realmente enviar renegociação ?", {
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              emphasizedAction: MessageBox.Action.OK,

              onClose: function (sAction) {
                if (sAction == MessageBox.Action.OK) {
                  // MessageToast.show("Renegociando...");

                  // Pegar dados de renegociação
                  let oModelCreate = this.getModel("selectedItems").getData().items;
                  let oValidateData = true;
                  let OSendLine = "";

                  // let oDate = new Date();
                  let oDate = sap.ui.core.format.DateFormat.getDateTimeInstance(
                    {
                      pattern: "dd/MM/yyyy",
                      UTC: false,
                    }
                  ).format(new Date());

                  // Validar Dados
                  for (let line of oModelCreate) {
                    let oLine = line;
                    if (
                      oLine.TermsOfPayment === null ||
                      oLine.TermsOfPayment === undefined ||
                      oLine.TermsOfPayment === ""
                    ) {
                      oValidateData = false;
                    }
                    
                    // data for first payment
                    let oProppertyDate = oLine.FirstDueDate;
                    let cProppertyDate;
                    let cDate;
                    
                    // If has first payment date
                    if (oProppertyDate !== undefined) {
                      // format first date
                      cProppertyDate = this.onDateStatement(oProppertyDate); 
                      // format current day
                      cDate = this.onDateStatement(oDate); 
                    }

                    if (cProppertyDate === undefined) {
                      oValidateData = false;
                    }

                    // Verify if firts date is on past
                    if (cProppertyDate === "" || cProppertyDate < cDate) {
                      oValidateData = false;
                    }

                    if (oLine.TermsOfPayment > 99) {
                      oValidateData = false;
                    }

                    let convDate = this.onExtentendDateStatement(
                      line.NetDueDate
                    );

                    let oCustomer = ("0000000000" + line.Customer).slice(-10);
                    let oDocument = ("0000000000" + line.Document).slice(-10);

                    let replacedAmount = line.NewValue.replaceAll('.','').replace(',','.')

                    OSendLine += oCustomer + "," +
                                line.Company + "," +
                                line.FiscalYear + "," +
                                oDocument + "," +
                                line.DocumentType + "," +
                                replacedAmount + "," +
                                line.TermsOfPayment + "," +
                                cProppertyDate + ";";
                  }

                  if (oValidateData === false) {
                    MessageBox.warning("Favor revalidar os campos preenchidos");
                    this.getView().getModel("selectedItems").refresh(true);
                  } else {
                    // MessageBox.warning("Dados validados");
                    // Fazer Post SAP
                    this.setAppBusy(true);

                    this.getModel().callFunction("/DoRenegotiation", {
                      urlParameters: {
                        ContractsLines: OSendLine,
                      },
                      success: function (oData) {
                        console.log(oData.results);
                        // Pegar resposta e atualizar pop-up e exibir em tela
                        this.byId("btnSendRenegotiation").setEnabled(false);
                        this.byId("btnSimulate").setEnabled(false);
                        this.byId("btnClear").setEnabled(false);

                        oData.results.map((sItem) => {
                          sItem.InterestRate = "";
                          sItem.FineRate = "";
                          sItem.AccrualRate = "";
                          sItem.NewValue = "";
                          sItem.editableFirstDueDate = false;
                          sItem.FirstDueDate = Formatter.getDateDDMMYYYY(
                            sItem.FirstDueDate
                          );
                          sItem.editableTermsOfPayment = false;
                          sItem.InputJuros = false;
                          sItem.InputMultas = false;
                          sItem.InputAcres = false;
                        });

                        this.getView().getModel("selectedItems").getData().items = oData.results;
                        this.byId("btnTCD").setEnabled(true);
                        this.getView().getModel("selectedItems").refresh(true);

                        // pop-up avisando de erro
                        if ( oData.results.length === 0 ) {

                            MessageBox.error("Renegociação sem êxito");
                            this._oDialog.close();
                            this.byId("btnSendRenegotiation").setEnabled(true);
                            this.byId("btnSimulate").setEnabled(true);
                            this.byId("btnClear").setEnabled(true);
                            this.byId("btnTCD").setEnabled(false);
                        }

                      }.bind(this),

                      error: function (oError) {
                        console.log(oError);
                        MessageBox.error("Erro ao renegociar")
                      }.bind(this),
                    });

                    this.setAppBusy(false);
                  }
                }
              }.bind(this),
            });
          } else {
            MessageBox.warning(
              "Por favor, selecione documentos do mesmo Cliente"
            );
          }
        },

        onCancelRenegotiation: function (oEvent) {
          this._oDialog.close();
          this.byId("btnSendRenegotiation").setEnabled(true);
          this.byId("btnSimulate").setEnabled(true);
          this.byId("btnClear").setEnabled(true);
          this.byId("btnTCD").setEnabled(false);
        },

        onExit: function (oEvent) {
          this._oDialogP.close();
        },
        onExitReprint: function (oEvent) {
          this._oDialogR.close();
        },

        // onLiveChangePayment: function (oEvent) {
        //   // console.log("Teste", oEvent);
        //   let oValue = Number(oEvent.getParameter("newValue"));
        //   if (oValue > 99) {
        //     MessageBox.warning("Número máximo de parcelas: 99");
        //   }
        // },

        onDateStatement: function (oDate) {
          let [day, month, year] = oDate.split("/");
          let formatedDate = year + month + day;
          return formatedDate;
        },

        onExtentendDateStatement: function (oParam) {
          let day = String(oParam.getDay()).padStart(2, "0");
          let month = String(oParam.getMonth()).padStart(2, "0");
          let year = oParam.getFullYear();
          let fomatedDate = year + month + day;
          return fomatedDate;
        },
        onDateTimeStatement: function (oParam) {
          return sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: "dd/MM/yyyy",
            UTC: true,
          }).format(oParam);
        },

        onGetPDF: function () {
          let oTpCtText = "";
          let oPDFLineText = "";
          let sMimeType = "pdf";

          // let oRBData = this.getModel("rbButtons").getData();
          let oCB1 = this.getView().byId("checkb1").getProperty("selected"); // Termo Padrão
          let oCB2 = this.getView().byId("checkb2").getProperty("selected"); // Nota Promissária Plano Padrão
          let oCB3 = this.getView().byId("checkb3").getProperty("selected"); // Plano Médico
          let oCB4 = this.getView().byId("checkb4").getProperty("selected"); // NP Cooperados
          let oCB5 = this.getView().byId("checkb5").getProperty("selected"); // Termo COtas

          if (oCB1 === true) {
            oTpCtText = "NormalCT";
          }
          if (oCB2 === true) {
            oTpCtText = "NormalNP";
          }
          if (oCB1 === true && oCB2 === true) {
            oTpCtText = "NormalFull";
          }
          if (oCB3 === true) {
            oTpCtText = "CooperadosCT";
          }
          if (oCB4 === true) {
            oTpCtText = "CooperadosNP";
          }
          if (oCB3 === true && oCB4 === true) {
            oTpCtText = "CooperadosFull";
          }
          if (oCB5 === true) {
            oTpCtText = "CotasCT";
          }

          oPDFLineText += oTpCtText + "/";

          let oModelPDF = this.getModel("selectedItems").getData().items;

          for (let oLine of oModelPDF) {
            let sNetDueDate = this.onExtentendDateStatement(oLine.NetDueDate);
            let sFirstDate = this.onDateStatement(oLine.FirstDueDate);

            let oCustomer = ("0000000000" + oLine.Customer).slice(-10);
            let oDocument = ("0000000000" + oLine.Document).slice(-10);

            //let replacedAmount = oLine.Amount.replaceAll('.','').replace(',','.') ;

            oPDFLineText +=  oCustomer +  "," +
                            oLine.Company + "," +
                            oLine.FiscalYear + "," +
                            oDocument + "," +
                            oLine.Amount + "," +
                            sNetDueDate + "," +
                            sFirstDate + ";";
          }

          let sPath = this.getModel().createKey("/FileSet", {
            DocumentsToPrint: oPDFLineText,
          });

          sPath += "/$value";

          let sURL = this.getModel().sServiceUrl + sPath;

          // Download File
          let w = window.open(sURL);

          // this._pdfViewer = new PDFViewer();
          // this.getView().addDependent(this._pdfViewer);
          // this._pdfViewer.setSource(sURL);
          // //jQuery.sap.addUrlWhitelist("blob");
          // this._pdfViewer.setTitle(`Renegociação_`);
          // this._pdfViewer.open();

          // this.getModel().read(sUrl, {
          //   success: function( oData ){
          //     //let w = window.open(sUrl);
          //   }.bind(this),
          //   error: function(oError){
          //     console.log(oError);
          //   }.bind(this)
          // });
        },

        onReprintPDF: function () {
          let oTpCtText = "";
          let oPDFLineText = "";

          // let oRBData = this.getModel("rbButtons").getData();
          let oCB1 = this.getView().byId("recheckb1").getProperty("selected"); // Termo Padrão
          let oCB2 = this.getView().byId("recheckb2").getProperty("selected"); // Nota Promissária Plano Padrão
          let oCB3 = this.getView().byId("recheckb3").getProperty("selected"); // Plano Médico
          let oCB4 = this.getView().byId("recheckb4").getProperty("selected"); // NP Cooperados
          let oCB5 = this.getView().byId("recheckb5").getProperty("selected"); // Termo COtas

          if (oCB1 === true) {
            oTpCtText = "Reprint-NormalCT";
          }
          if (oCB2 === true) {
            oTpCtText = "Reprint-NormalNP";
          }
          if (oCB1 === true && oCB2 === true) {
            oTpCtText = "Reprint-NormalFull";
          }
          if (oCB3 === true) {
            oTpCtText = "Reprint-CooperadosCT";
          }
          if (oCB4 === true) {
            oTpCtText = "Reprint-CooperadosNP";
          }
          if (oCB3 === true && oCB4 === true) {
            oTpCtText = "Reprint-CooperadosFull";
          }
          if (oCB5 === true) {
            oTpCtText = "Reprint-CotasCT";
          }

          oPDFLineText += oTpCtText + "/";

          let SelectedContracts = [];

          let oModel = this.getView()
            .byId("smartTable")
            .getTable()
            .getSelectedItems();

          for (let line of oModel) {
            let oLine = line.getBindingContext().getObject();
            SelectedContracts.push(oLine);
          }

          let oDataReprint = SelectedContracts[0];
          console.log("Imprimiu: ", oDataReprint);

          let oCustomer = ("0000000000" + oDataReprint.Customer).slice(-10);
          let oDocument = ("0000000000" + oDataReprint.Document).slice(-10);

          oPDFLineText += oCustomer + "," +
                          oDataReprint.Company + "," +
                          oDataReprint.FiscalYear + "," +
                          oDocument ;

          let sPath = this.getModel().createKey("/FileSet", {
            DocumentsToPrint: oPDFLineText,
          });

          sPath += "/$value";

          let sURL = this.getModel().sServiceUrl + sPath;

          // Download File
          let w = window.open(sURL);
        },

        onRePrintContracts: function (oEvent) {
          this.setAppBusy(true);

          let oModel = this.getView()
            .byId("smartTable")
            .getTable()
            .getSelectedItems();

          if (oModel.length != 0) {
            let SelectedContracts = [];
            let isRenegotiated = true;
            let isTheSameCustomer = true;

            for (let line of oModel) {
              let oLine = line.getBindingContext().getObject();
              SelectedContracts.push(oLine);
            }

            for (let oLineModel of SelectedContracts) {
              if (oLineModel.DocStatus === "Nunca Renegociado") {
                isRenegotiated = false;
              }
            }

            if (isRenegotiated === true) {
              let oCustomer = SelectedContracts[0].Customer;

              for (let oLineModel of SelectedContracts) {
                if (oLineModel.Customer !== oCustomer) {
                  isTheSameCustomer = false;
                }

                if (isTheSameCustomer === true) {
                  // Busca PDF code block
                  this.onGetDebtConfessionReprint();
                } else {
                  MessageBox.warning(
                    "Selecione apenas contratos renegociados do mesmo cliente!"
                  );
                }
              }
            } else {
              MessageBox.warning(
                "Não é possível imprimir documentos que não foram renegociados!"
              );
            }
          } else {
            MessageBox.warning(
              "Selecione pelo menos 1 contrato para impressão"
            );
          }

          this.setAppBusy(false);
        },

        onClearValues: async function () {
          this.setAppBusy(true);

          let oModel = this.getView().getModel("selectedItems").getData().items;
          //let oModel = this.getView().byId("smartTable").getTable().getSelectedItems();

          let clearData = [];

          for (let oLine of oModel) {
            let txInterest = 4.0;
            let txFine = 2.0;
            let txAccurate = 0.0;

            let M = parseFloat(txFine).toFixed(2);
            let J = parseFloat(txInterest).toFixed(2);
            let A = parseFloat(txAccurate).toFixed(2);

            oLine.TermsOfPayment = "";
            oLine.VHDay = "";
            oLine.BaseDay = "";
            oLine.InterestRate = J;
            oLine.FineRate = M;
            oLine.AccrualRate = A;
            //oLine.NewValue = oLine.Amount;
            oLine.NewValue = Formatter.formateValue(oLine.Amount);
            oLine.FirstDueDate = "";
            clearData.push(oLine);
          }

          this.getView().getModel("selectedItems").getData().items = clearData;
          this.getView().getModel("selectedItems").refresh(true);
          this.setAppBusy(false);
        },

        onSimulateValues: function () {
          this.setAppBusy(true);

          let oModel = this.getView().getModel("selectedItems").getData().items;

          let hasToInputFirstDate = true;
          for (let line of oModel) {
            if (
              line.FirstDueDate === null ||
              line.FirstDueDate === undefined ||
              line.FirstDueDate === ""
            ) {
              hasToInputFirstDate = false;
            }
          }

          let clearData = [];

          if (hasToInputFirstDate === true) {
            for (let oLine of oModel) {
              let M = parseFloat(oLine.FineRate).toFixed(2);
              let J = parseFloat(oLine.InterestRate).toFixed(2);
              let A = parseFloat(oLine.AccrualRate).toFixed(2);

              let Amount = +oLine.Amount;
              let Multa = +M;
              let Juros = +J;
              let Acres = +A;

              let FirstDueDate = moment(oLine.FirstDueDate, "DD/MM/YYYY");
              let oNetDueDate = moment(
                this.onDateTimeStatement(oLine.NetDueDate),
                "DD/MM/YYYY"
              );
              let oDiffInDays = FirstDueDate.diff(oNetDueDate, "days");
              let DiasAtraso = parseInt(oDiffInDays, 10);

              let newJuros;
              if (Juros > 0) {
                newJuros = ((Juros / 30) * DiasAtraso * Amount) / 100;
              } else {
                newJuros = +0;
              }

              let newMulta;
              if (Multa > 0) {
                newMulta = Amount * (Multa / 100);
              } else {
                newMulta = +0;
              }

              let newAcres;
              if (Acres > 0) {
                newAcres = Amount * (Acres / 100);
              } else {
                newAcres = +0;
              }

              let oSimulateValue = Amount + newJuros + newMulta + newAcres;

              oLine.InterestRate = J;
              oLine.FineRate = M;
              oLine.AccrualRate = A;
              //oLine.NewValue = oSimulateValue;
              let strValue = String(parseFloat(oSimulateValue).toFixed(2));
              oLine.NewValue = Formatter.formateValue(strValue);
              clearData.push(oLine);
            }

            this.getView().getModel("selectedItems").getData().items = clearData;
            this.getView().getModel("selectedItems").refresh(true);
            this.setAppBusy(false);
          } else {
            MessageBox.warning("Preencher todas as colunas com a data do primeiro vencimento para seguir com simulação!");
            this.setAppBusy(false);
          }
        },
        loadFragmentTableSelectd: async function () {
          if (!this._oDialog) {
            this._oDialog = new Fragment.load({
              id: this.getView().getId(),
              name: "com.prestativ.unimed.zfirenegotiation.view.fragments.ReviewContracts",
              controller: this,
            });

            await this._oDialog
              .then(
                function (oFragment) {
                  this.getView().addDependent(oFragment);
                  this._oDialog = oFragment;
                }.bind(this)
              )
              .catch(function (oError) {
                console.log(oError);
              });
          }
          this._oDialog.open();
        },
        loadFragmentPrintDocuments: async function () {
          if (!this._oDialogP) {
            this._oDialogP = new Fragment.load({
              id: this.getView().getId(),
              name: "com.prestativ.unimed.zfirenegotiation.view.fragments.PrintContracts",
              controller: this,
            });

            await this._oDialogP
              .then(
                function (oFragment) {
                  this.getView().addDependent(oFragment);
                  this._oDialogP = oFragment;
                }.bind(this)
              )
              .catch(function (oError) {
                console.log(oError);
              });
          }
          this._oDialogP.open();
        },

        loadFragmentRePrintDocuments: async function () {
          if (!this._oDialogR) {
            this._oDialogR = new Fragment.load({
              id: this.getView().getId(),
              name: "com.prestativ.unimed.zfirenegotiation.view.fragments.RePrintContracts",
              controller: this,
            });

            await this._oDialogR
              .then(
                function (oFragment) {
                  this.getView().addDependent(oFragment);
                  this._oDialogR = oFragment;
                }.bind(this)
              )
              .catch(function (oError) {
                console.log(oError);
              });
          }
          this._oDialogR.open();
        },

        onChange: function(oEvent) {

          let oModel = this.getView().getModel("selectedItems").getData();
          
          oModel.items.map((sItem) => {
            //sItem.NewValue = sItem.NewValue ;
            sItem.NewValue = Formatter.formateValue(sItem.NewValue );
          } );



            this.getView().getModel("selectedItems").refresh(true);
          
        },

      }
    );
  }
);
