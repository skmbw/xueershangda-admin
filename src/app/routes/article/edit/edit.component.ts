import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-article-edit',
  templateUrl: './edit.component.html',
})
export class ArticleEditComponent implements OnInit {
  
  id = this.route.snapshot.params.id;
  i: any;
  schema: SFSchema = {
    properties: {
      no: { type: 'string', title: '编号' },
      owner: { type: 'string', title: '姓名', maxLength: 15 },
      callNo: { type: 'number', title: '调用次数' },
      href: { type: 'string', title: '链接', format: 'uri' },
      description: { type: 'string', title: '描述', maxLength: 140 },
    },
    required: ['owner', 'callNo', 'href', 'description'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $no: {
      widget: 'text'
    },
    $href: {
      widget: 'string',
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    if (this.id > 0)
    this.http.get(`/user/${this.i.id}`).subscribe(res => (this.i = res)); // ${this.record.id}中record不存在的，是i
  }

  save(value: any) {
    this.http.post(`/user/${this.i.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      // this.modal.close(true); // 应该是模板使用错误，不使用modal mode生成代码，但是模板还是modal的。找不到modal
    });
  }
}
