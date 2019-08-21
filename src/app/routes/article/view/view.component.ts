import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-view',
  templateUrl: './view.component.html',
})
export class ArticleViewComponent implements OnInit {
  record: any = {};
  i: any;
  id = this.route.snapshot.params.id;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.http.get(`/user/${this.record.id}`).subscribe(res => this.i = res);
    this.i = {'id': this.id};
  }

  close() {
    this.modal.destroy();
  }
}
