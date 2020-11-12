import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'delete-button-renderer',
    template: `
    <button type="button" (click)="onClick($event)">{{label}}</button>
    `
})

export class DeleteActionRendererComponent implements ICellRendererAngularComp {
    params;
    label: string;

    agInit(params): void {
        this.params = params;
        this.label = this.params.label || null;
    }

    refresh(params?: any): boolean {
        return true;
    }

    onClick($event) {
        this.params.onClick(this.params);
      }
}