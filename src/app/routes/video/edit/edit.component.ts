import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, UploadChangeParam, UploadFile } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { JsUtils } from '@shared/utils/js-utils';
import { Consts } from '@shared/utils/consts';
import { VideoService } from '@shared/service/video.service';
import { com } from '@shared';
import Video = com.xueershangda.tianxun.video.model.Video;
import VideoReply = com.xueershangda.tianxun.video.model.VideoReply;

@Component({
  selector: 'app-video-edit',
  templateUrl: './edit.component.html',
})
export class VideoEditComponent implements OnInit {
  record: any;
  i: any;
  // undefined: any; // 好像可以使用undefined作为变量名
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: '编号' },
      title: { type: 'string', title: '标题', maxLength: 200 },
      summary: { type: 'string', title: '简介' },
      price: { type: 'number', title: '价格', default: 0 },
      free: { type: 'boolean', title: '是否免费',
        enum: [
          { label: '收费', value: false },
          { label: '免费', value: true }
        ],
        default: true,
      },
      // url: { type: 'string', title: '链接', format: 'uri' },
      coverImage: { type: 'string', title: '封面图片',
        // enum: [ // enum中的静态数据会以a标签展示，后面上传的是span标签
        //   // {
        //   //   // uid: -1,
        //   //   // name: 'xxx.png',
        //   //   // status: 'done',
        //   //   // url:
        //   //   //   'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   //   // response: {
        //   //   //   resourceId: 1,
        //   //   // }
        //   // }
        // ]
      },
      video: { type: 'string', title: '视频文件'},
      category: { type: 'string', title: '分类', maxLength: 12 }
    },
    required: ['title', 'price', 'free', 'coverImage', 'video', 'category'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $id: {
      widget: 'text'
    },
    $title: {
      widget: 'string',
    },
    $summary: {
      widget: 'textarea',
      grid: { span: 24 },
    },
    $price: {
      widget: 'number',
    },
    $free: {
      widget: 'select',
    },
    // $url: {
    //   widget: 'string',
    //   grid: { span: 24 }
    // },
    $coverImage: {
      widget: 'upload',
      action: Consts.URL + 'video/upload',
      name: 'coverImage',
      fileType: 'image/png,image/jpeg,image/gif,image/bmp',
      fileSize: 2048,
      resReName: 'resourceId', // 这个字段的值会赋值给coverImage，当保存时用来关联上传的文件和该记录
      change: (args: UploadChangeParam) => {
        // console.log(JSON.stringify(args));
        if (args.type === 'success') {
          // this.ui.$coverImage.asyncData(args.file);
          // console.log('changed.');
          const reply = args.file;
          const response = reply.response;
          if (response.code !== 1) { // 提示信息
            this.msgSrv.error(response.message);
          } else {
            if (JsUtils.isBlank(this.record.id)) {
              this.record.id = response.resourceId;
            }
            const ext = reply.name.substring(reply.name.lastIndexOf('.'));
            this.record.image = this.record.id + ext;
          }
          // reply.url = response.url;
          // this.schema.properties.coverImage.enum[0] = reply;
        }
      },
      listType: 'picture',
      data: (upload: UploadFile) => {
        const id = JsUtils.isBlank(this.record.id) ? '' : this.record.id;
        return {'videoType': '1', 'id': id};
      }
      // asyncData: (data?: any) => {
      //   if (data !== undefined) {
      //     console.log(JSON.stringify(data));
      //     // const type: SFSchemaEnumType[] = [];
      //     return Observable.create((observer) => {
      //       data.url = 'aaaa';
      //       observer.next(data);
      //     });
      //   } else {
      //     return Observable.create(() => {
      //     });
      //   }
      // }
    },
    $video: {
      widget: 'upload',
      action: Consts.URL + 'video/upload',
      name: 'video',
      fileType: 'video/mp4',
      fileSize: 204800,
      resReName: 'videoId', // 这个字段的值会赋值给video，当保存时用来关联上传的文件和该记录
      data: (upload: UploadFile) => { // 要用回调，静态的话，当更新了数据，里面的数据也不会更新
        const id = JsUtils.isBlank(this.record.id) ? '' : this.record.id;
        return {'videoType': '2', 'id': id};
      },
      change: (args: UploadChangeParam) => {
        if (args.type === 'success') {
          const reply = args.file;
          const response = reply.response;
          if (response.code !== 1) {
            this.msgSrv.error(response.message);
          } else {
            if (JsUtils.isBlank(this.record.id)) {
              this.record.id = response.videoId;
            }
            const ext = reply.name.substring(reply.name.lastIndexOf('.'));
            this.record.url = this.record.id + ext;
          }
        }
      }
    },
    $category: {
      widget: 'string'
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    // alert(this.record.id); // this.undefined就是穿过来的参数，但是table.js._btnClick中的bug，没有设置或取到参数名导致
    // if (this.record.id > 0)
    //   this.http.get(Consts.URL + `/video/detail/${this.record.id}`).subscribe(res => (this.i = res));
    if (JsUtils.isNotBlank(this.record.id)) {
      this.videoService.get(this.record.id).subscribe(res => {
        const uint8Array = new Uint8Array(res, 0, res.byteLength);
        const reply = VideoReply.decode(uint8Array);
        if (reply.code === 1) {
          this.i = reply.video;
        } else {
          this.msgSrv.info(reply.message);
        }
      });
    }
  }

  save(value: any) {
    // this.http.post(`/user/${this.record.id}`, value).subscribe(res => {
    //   this.msgSrv.success('保存成功');
    //   this.modal.close(true);
    // });
    if (value.coverImage !== value.video) {
      this.msgSrv.info('视频文件和封面图片信息不匹配。');
      return;
    }
    if (value.id === 0 || JsUtils.isBlank(value.id)) {
      value.id = this.record.id;
    }
    value.image = this.record.image;
    value.url = this.record.url;
    this.videoService.save(value as Video).subscribe(result => {
      const uint8Array = new Uint8Array(result, 0, result.byteLength);
      const reply = VideoReply.decode(uint8Array);
      if (reply.code === 1) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(reply.message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
