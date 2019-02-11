sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/table/Table",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/ComboBox",
	"sap/ui/commons/Label"
], function (Controller, Table, JSONModel, Button, ComboBox, Label) {
	"use strict";

	return Controller.extend("detayDynamicTable.detayDynamicTable.controller.View1", {
		onInit: function () {
			this.oMainModel = this.getOwnerComponent().getModel("mainModel");
			var myColumns = [{
				parent: "Pername",
				name: "Personel Ad Soyad"
			}, {
				parent: "Pernr",
				name: "Personel Numarası "
			}, {
				parent: "Seqnr",
				name: "Kimlik Numarası"
			}, {
				parent: "Begda",
				name: "İşe Giriş Tarihi"
			}, {
				parent: "Endda",
				name: "İşten Çıkış Tarihi"
			}];
			var myData = [{
					Pername: "Eyüp Bayçöl",
					Pernr: "1485",
					Seqnr: "364559955",
					Begda: "09-02-1997",
					Endda: "01-12-2022"
				}, {
					Pername: "Mehmet Sıddık",
					Pernr: "484",
					Seqnr: "3645227788",
					Begda: "09-02-1994",
					Endda: "01-12-20222"
				}, {
					Pername: "Talat Tekkalem",
					Pernr: "999",
					Seqnr: "221415124",
					Begda: "07-05-1985",
					Endda: "02-10-2000"
				}, {
					Pername: "Yaşar Candan",
					Pernr: "895",
					Seqnr: "03155478988",
					Begda: "09-02-1997",
					Endda: "01-12-2022"
				}, {
					Pername: "Ahmet Sela",
					Pernr: "1485",
					Seqnr: "9999558445",
					Begda: "07-03-1994",
					Endda: "02-11-2012"
				}

			];
			this.oMainModel.setProperty("/perData", myData);
			this.dynamicTable(myColumns, "perData", "bindTable");
		},
		dynamicTable: function (myColumns, modelPath, id) {
			var myDynamicTable = new sap.ui.table.Table("myTable", {
				enableGrouping: true,
				enableColumnFreeze: true,
				showColumnVisibilityMenu: true,
			});
			var first = true;
			this.dynamicTableSetColumns(myDynamicTable, myColumns, id);
			myDynamicTable.bindRows({
				path: "mainModel>/" + modelPath
			});
			var that = this;
			this.getView().byId(id).addItem(myDynamicTable);
			myDynamicTable.addEventDelegate({
				onAfterRendering: function () {
					if (first) {
						first = false;
						that.dynamicTableSetFooter(myDynamicTable);
					}
				}
			}, this);
			this.dynamicTableGetFixedColumn(myDynamicTable, myColumns);
			this.dynamicTableGetFilter(myDynamicTable, myColumns);
			this.myDynamicTableColumnMove(myDynamicTable, myColumns);
			for (var i = 0; i < localStorage.length; i++) {
				sap.ui.getCore().byId("myDataComboBox").addItem(new sap.ui.core.Item({
					key: localStorage.key(i),
					text: localStorage.key(i)
				}));
			}
		},
		dynamicTableSetColumns: function (myDynamicTable, myColumns, id) {
			myColumns.forEach(function (columnsValue, index) {
				var column = new sap.ui.table.Column({
					label: columnsValue.name,
					template: new sap.m.Text({
						text: "{mainModel>" + columnsValue.parent + "}"
					}),
					filterType: new sap.ui.model.type.String(),
					sortProperty: columnsValue.parent,
					filterProperty: columnsValue.parent
				});
				myDynamicTable.addColumn(column);
			});
			this.dynamicTableSaveButton(myDynamicTable, myColumns, id);
		},
		dynamicTableAttachSelectCombo: function (myDynamicTable, myColumns) {
			this.dynamicTableSetFilter(myDynamicTable, myColumns);
			this.dynamicTableSetGroup(myDynamicTable, myColumns);
			this.dynamicTableSetSort(myDynamicTable, myColumns);
			this.dynamicTableSetColumnFixed(myDynamicTable, myColumns);
			this.dynamicTableGetColumnMove(myDynamicTable, myColumns);
		},
		dynamicTableGetColumnMove: function (myDynamicTable, myColumns) {
			myDynamicTable.getColumns().forEach(function (columns, index) {
				if (myColumns[index].pos !== undefined) {
					 var temp = myDynamicTable.getColumns()[index];
					 myDynamicTable.removeColumn(index);
					 myDynamicTable.insertColumn(temp,myColumns[index].pos);
				}
			});
		},
		dynamicTableAttachFunction: function (myDynamicTable, myColumns) {
			this.dynamicTableGetGroup(myDynamicTable, myColumns);
			this.dynamicTableGetSort(myDynamicTable, myColumns);
		},
		dynamicTableSetFilter: function (myDynamicTable, myColumns) {
			myDynamicTable.getColumns().forEach(function (columns, index) {
				if (myColumns[index].filtre !== "") {
					columns.filter(myColumns[index].filtre);
				}
			});

		},
		dynamicTableGetFilter: function (myDynamicTable, myColumns) {
			var that = this;
			myDynamicTable.attachFilter(function (oEvent) {
				var index = myDynamicTable.getColumns().indexOf(oEvent.getParameter("column"));
				myColumns[index].filtre = oEvent.getParameter("value");
				setTimeout(function () {
					that.dynamicTableSetFooter(myDynamicTable);
				}, 1);
			});
		},
		dynamicTableSetGroup: function (myDynamicTable, myColumns) {
			myDynamicTable.getColumns().forEach(function (columns, index) {
				if (myColumns[index].grup === true) {
					myDynamicTable.setGroupBy(columns);
				} else {
					columns.setGrouped(false);
				}
			});
		},
		dynamicTableGetGroup: function (myDynamicTable, myColumns) {
			myDynamicTable.getColumns().forEach(function (columns, index) {
				if (columns.getGrouped() === true) {
					myColumns[index].grup = true;
				} else {
					myColumns[index].grup = "";
				}
			});

		},
		dynamicTableSetSort: function (myDynamicTable, myColumns) {
			myDynamicTable.getColumns().forEach(function (columns, index) {
				if (myColumns[index].sortTipi === "Ascending") {
					columns.sort();
				} else if (myColumns[index].sortTipi === "Descending") {
					columns.sort("Descending");
				} else {
					columns.setSorted(false);
				}
			});
		},
		dynamicTableGetSort: function (myDynamicTable, myColumns) {
			myDynamicTable.getColumns().forEach(function (columns, index) {
				if (columns.getSorted() === true) {
					myColumns[index].sortTipi = columns.getSortOrder();
				} else {
					myColumns[index].sortTipi = "";
				}
			});
		},
		dynamicTableSaveButton: function (myDynamicTable, myColumns, id) {
			var that = this;
			var saveButton = new sap.m.Button({
				text: "Kaydet",
				press: function () {
					that.dynamicTableOpenDialog(myDynamicTable, myColumns);
				}
			});
			var dynamicTableComboBox = new sap.m.ComboBox("myDataComboBox", {
				selectionChange: function () {
					var mySelectLocalData = JSON.parse(localStorage.getItem(sap.ui.getCore().byId("myDataComboBox").getSelectedItem().getKey()));
					that.dynamicTableAttachSelectCombo(myDynamicTable, mySelectLocalData);
				}
			});
			var removeButton = new sap.m.Button({
				text: "Tüm Grupları Kaldır",
				press: function () {
					that.dynamicTableRemoveGroup(myDynamicTable, myColumns);
				}
			});
			var deleteButton = new sap.m.Button({
				text: "Sil",
				press: function () {
					that.dynamicTableDeleteLocalStorage();
				}
			});
			this.getView().byId(id).addItem(saveButton);
			this.getView().byId(id).addItem(dynamicTableComboBox);
			this.getView().byId(id).addItem(deleteButton);
			this.getView().byId(id).addItem(removeButton);
		},
		dynamicTableDeleteLocalStorage: function () {
			if (sap.ui.getCore().byId("myDataComboBox").getSelectedItem().getKey() !== null) {
				var SelectedItem = sap.ui.getCore().byId("myDataComboBox").getSelectedItem().getKey();
				localStorage.removeItem(SelectedItem);
				sap.ui.getCore().byId("myDataComboBox").removeItem(SelectedItem);
			}
		},
		dynamicTableRemoveGroup: function (myDynamicTable, myColumns) {
			myDynamicTable.setGroupBy();
		},
		dynamicTableSetColumnFixed: function (myDynamicTable, myColumns) {
			myDynamicTable.getColumns().forEach(function (columns, index) {
				if (myColumns[index].fix === true) {
					if (index === myColumns.length - 1) index--;
					myDynamicTable.setFixedColumnCount(index + 1);
				}
			});
		},
		dynamicTableGetFixedColumn: function (myDynamicTable, myColumns) {
			myDynamicTable.attachColumnFreeze(function (oEvent) {
				var index = myDynamicTable.getColumns().indexOf(oEvent.getParameter("column"));
				myColumns[index].fix = myColumns[index].fix === true ? "" : true;
			});
		},
		dynamicTableOpenDialog: function (myDynamicTable, myColumns) {
			var that = this;
			var dialog = null;
			var input = new sap.m.Input({});
			if (!dialog) {
				dialog = new sap.m.Dialog({
					title: "Tablo Kayıt",
					contentHeight: "250px",
					verticalScrolling: false,
					content: [
						input
					],
					beginButton: new sap.m.Button({
						text: "Kaydet",
						press: function () {
							that.dynamicTableAttachFunction(myDynamicTable, myColumns);
							var inputValue = input.getValue();
							localStorage.setItem(inputValue, JSON.stringify(myColumns));
							sap.ui.getCore().byId("myDataComboBox").addItem(new sap.ui.core.Item({
								key: inputValue,
								text: inputValue
							}));
							dialog.close();
						}
					}),
					endButton: new sap.m.Button({
						text: "Kapat",
						press: function () {
							dialog.close();
						}
					})
				}).addStyleClass("sapUiContentPadding");
			}
			dialog.open();
		},
		myDynamicTableColumnMove: function (myDynamicTable, myColumns) {
			myDynamicTable.attachColumnMove(function (oEvent) {
				var prevPos = myDynamicTable.getColumns().indexOf(oEvent.getParameter("column"));
				var nextPos = oEvent.getParameter("newPos");
				// var temp = myColumns[prevPos];
				myColumns[prevPos].pos = nextPos;
				// myColumns.splice(prevPos, 1);
				// myColumns.splice(nextPos, 0, temp);
			});
		},
		dynamicTableSetFooter: function (myDynamicTable) {
			var toplam = 0;
			myDynamicTable.getRows().forEach(function (rows, index) {
				if (rows.getCells()[1].mProperties.text !== "") {
					toplam = toplam + parseInt(rows.getCells()[1].mProperties.text);
				}
			});
			myDynamicTable.setFooter("Toplam Değer :" + toplam);
		}
	});
});