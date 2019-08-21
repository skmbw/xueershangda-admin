import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ArticleEditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-article-list',
  templateUrl: './list.component.html',
})
export class ArticleListComponent implements OnInit {
  url = `/user`;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '调用次数', type: 'number', index: 'callNo' },
    { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '时间', type: 'date', index: 'updatedAt' },
    {
      title: '',
      // 这里是进行页面跳转的 配置
      buttons: [
        { text: '查看', type: 'link', click: (item: any) => `article/view/${item.id}` }, // 返回的url，可以不以/开头
        {
          text: '编辑',
          type: 'link',
          click: (item: any) => `/article/edit/${item.id}` // 这里要返回全url，否则404
        },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() { }

  add() {
    this.modal
      .createStatic(ArticleEditComponent, { i: { id: '' } })
      .subscribe(() => this.st.reload());
  }

}
