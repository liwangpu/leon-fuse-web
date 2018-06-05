import { Component, OnInit } from '@angular/core';
import { MediaFileService } from '../../../toolkit/server/webapi/media-file.service';

@Component({
  selector: 'app-media-file-detail',
  templateUrl: './media-file-detail.component.html',
  styleUrls: ['./media-file-detail.component.scss']
})
export class MediaFileDetailComponent implements OnInit {

  constructor(public apiSrv: MediaFileService) { }

  ngOnInit() {
  }

}
