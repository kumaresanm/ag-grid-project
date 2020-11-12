import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DeleteActionRendererComponent } from 'src/renderer/delete-action-renderer.component';
import { AgGridAngular } from 'ag-grid-angular';

var rowFilter = 'all';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  columnDefs;
  defaultColDef;
  frameworkComponents: any;
  gridApi;
  gridColumnApi;
  rowData: any;
  filter = 'all';
  title = 'ag-grid-project';

  @ViewChild('agGrid') agGrid: AgGridAngular;

  constructor(private httpClient: HttpClient) {
    this.frameworkComponents = {
      deleteRenderer: DeleteActionRendererComponent,
    }
  }

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: "Serial No.",
        valueGetter: this.serialNoGetter,
        width: 120
      },
      {
        headerName: 'Athlete',
        field: 'athlete',
        width: 180,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Age',
        field: 'age',
        width: 90,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Country',
        field: 'country',
        width: 140,
      },
      {
        headerName: 'Sports Results',
        children: [
          {
            headerName: 'Sport',
            field: 'sport',
            width: 140,
          },
          {
            headerName: 'Total',
            columnGroupShow: 'closed',
            field: 'total',
            width: 100,
            filter: 'agNumberColumnFilter',
          },
          {
            headerName: 'Gold',
            columnGroupShow: 'open',
            field: 'gold',
            width: 100,
            filter: 'agNumberColumnFilter',
          },
          {
            headerName: 'Silver',
            columnGroupShow: 'open',
            field: 'silver',
            width: 100,
            filter: 'agNumberColumnFilter',
          },
          {
            headerName: 'Bronze',
            columnGroupShow: 'open',
            field: 'bronze',
            width: 100,
            filter: 'agNumberColumnFilter',
          }
        ]
      },
      {
        headerName: 'Action',
        cellRenderer: 'deleteRenderer',
        pinned: 'right',
        suppressMovable: true,
        filter: false,
        resizable: false,
        cellStyle: { 'text-align': 'center' },
        cellRendererParams: {
          onClick: this.deleteRow.bind(this),
          label: 'Delete'
        }
      }
    ];
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true,
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.httpClient.get("assets/gridData.json").subscribe(data => {
      this.rowData = Object.values(data);
    });
  }

  deleteRow(field) {
    const rowIndex = field.rowIndex;
    this.rowData.splice(rowIndex, 1);
    this.gridApi.setRowData(this.rowData);
  }

  externalFilterChanged(newValue) {
    if (newValue !== rowFilter) {
      rowFilter = newValue;
      this.filter = rowFilter;
      this.gridApi.onFilterChanged();
    }
  }

  isExternalFilterPresent() {
    return rowFilter !== 'all';
  }

  doesExternalFilterPass(node) {
    switch (rowFilter) {
      case 'rows-510':
        return (node.rowIndex + 1).toString().startsWith('5') || (node.rowIndex + 1).toString().startsWith('10');
      default:
        return true;
    }
  }

  serialNoGetter(params) {
    return parseInt(params.node.id) + 1;
  }
}
