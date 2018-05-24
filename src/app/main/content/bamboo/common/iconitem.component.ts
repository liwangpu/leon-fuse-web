import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'icon-item',
    templateUrl: './iconitem.component.html',
    styleUrls: ['./iconitem.component.scss']
})
export class IconItemComponent implements OnInit {

    @Input() Id: string;
    @Input() Name: string;
    @Input() Description: string;
    @Input() Icon: string;
    @Input() SelectMode: boolean;
    @Input() Selected: boolean;
    @Input() LinkPath: string;
    @Output() OnCheckChange: EventEmitter<boolean> = new EventEmitter();
    constructor(private router: Router) {

    }

    ngOnInit(): void {

    }//ngOnInit

    onClick() {
        if (this.SelectMode) {
            this.Selected = !this.Selected;
            this.OnCheckChange.next(this.Selected);
        }
        else {
            this.router.navigate([this.LinkPath, this.Id]);
        }
    }//onClick

    selectedChange(checked: boolean) {
        this.Selected = checked;
        this.OnCheckChange.next(checked);
    }//selectedChange
}
