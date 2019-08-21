import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ArticleEditComponent } from '../edit/edit.component';
import { ArticleService } from '@shared/service/article.service';
import { com } from '@shared';
import { NzMessageService } from 'ng-zorro-antd';
import Article = com.xueershangda.tianxun.article.model.Article;
import ArticleReply = com.xueershangda.tianxun.article.model.ArticleReply;

@Component({
  selector: 'app-article-list',
  templateUrl: './list.component.html',
})
export class ArticleListComponent implements OnInit {
  // url = `/user`;
  url: STData[] = [];
  // 搜索属性
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  // 表格显示的属性，与后端数据要能对的上
  columns: STColumn[] = [
    { title: '编号', index: 'no' },
    { title: '标题', index: 'title' },
    // { title: '头像', type: 'img', width: '50px', index: 'avatar' },
    { title: '作者', index: 'authorName' },
    { title: '时间', type: 'date', index: 'createDate' },
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

  constructor(private http: _HttpClient, private modal: ModalHelper,
              private articleService: ArticleService, private msgSrv: NzMessageService) { }

  ngOnInit() {
    const article = new Article();
    article.page = 1;
    article.pageSize = 20;
    this.articleService.list(article).subscribe(result => {
      const uint8Array = new Uint8Array(result, 0, result.byteLength);
      const reply = ArticleReply.decode(uint8Array);
      if (reply.code === 1) {
        this.url = reply.data as STData[];
      } else {
        this.msgSrv.warning(reply.message);
      }
    });
  }

  add() {
    this.modal
      .createStatic(ArticleEditComponent, { i: { id: '' } })
      .subscribe(() => this.st.reload());
  }

}
