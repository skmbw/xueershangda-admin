import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NzMessageService, UploadChangeParam, UploadFile } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { JsUtils } from '@shared/utils/js-utils';
import { Consts } from '@shared/utils/consts';
import { VideoService } from '@shared/service/video.service';
import { com } from '@shared';
// import * as $ from 'jquery';
import * as plupload from 'plupload';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '@env/environment';
import Video = com.xueershangda.tianxun.video.model.Video;
import VideoReply = com.xueershangda.tianxun.video.model.VideoReply;

declare var $: any; // 这次的导入要使用这种方式声明，否则会报 pluploadQueue is not a function

// 如果类中注入了Modal，那么由Modal模式改为连接跳转，及时路由配置正确，也会报错。所以要去掉modal的注入
// 如果使用modal的方式打开，那么因为没有$(document).ready事件，uploader初始化时会找不到对应的browse_button的id，so无法浏览文件
@Component({
  selector: 'app-video-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class VideoEditComponent implements OnInit, AfterViewInit {
  id = this.route.snapshot.params.id;
  record: any = {}; // 如果不初始化，那么this.record.id会是undefined
  i: any;
  uploader: any;
  fileList: any[] = [];
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
        }
      },
      listType: 'picture',
      data: (upload: UploadFile) => {
        const id = JsUtils.isBlank(this.record.id) ? '' : this.record.id;
        return {'videoType': '1', 'id': id};
      }
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
    private msgSrv: NzMessageService, private renderer: Renderer2,
    public http: _HttpClient, private location: Location,
    private videoService: VideoService, private route: ActivatedRoute,
    private ele: ElementRef
  ) {}

  ngOnInit(): void {
    if (JsUtils.isNotBlank(this.id)) {
      this.videoService.get(this.id).subscribe(res => {
        const uint8Array = new Uint8Array(res, 0, res.byteLength);
        const reply = VideoReply.decode(uint8Array);
        if (reply.code === 1) {
          this.i = reply.video;
          this.record = this.i; // record是modal模式下带过来的数据，和i应该是一样的
        } else {
          this.msgSrv.info(reply.message);
        }
      });
    }
  }

  save(value: any) {
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
      } else {
        this.msgSrv.error(reply.message);
      }
    });
  }

  ngAfterViewInit() {
    const this_ = this;
    this.uploader = new plupload.Uploader({
      browse_button : 'browseBtn',
      // runtimes: 'html5',
      url: environment.URL + "video/plupload",
      // 头信息
      headers: {'userId': '2'}, // 'tokenId': '1', // 没有token暂时不传
      // 上传时的附加参数
      multipart_params: {},
      // Maximum file size
      max_file_size: '1000mb',
      // 分块大小
      chunk_size: '1mb',
      // Resize images on clientside if we can
      // resize: {
      //   width: 200,
      //   height: 200,
      //   quality: 90,
      //   crop: true // crop to exact dimensions
      // },
      // Specify what files to browse for
      filters: [
        {title: "Image files", extensions: "jpg,gif,png,jpeg"},
        {title: "Vedio files", extensions: "mp4,mkv"},
        {title: "Zip files", extensions: "zip,avi"}
      ],
      // Rename files by clicking on their titles
      rename: true,
      // Sort files
      sortable: true,
      // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
      dragdrop: true,
      // Views to activate
      // views: {
      //   list: true,
      //   thumbs: true, // Show thumbs
      //   active: 'thumbs'
      // },
      // Flash settings
      flash_swf_url: 'js/Moxie.swf',
      // Silverlight settings
      silverlight_xap_url: 'js/Moxie.xap'
    });

    // 初始化plupload
    this.uploader.init();

    // 文件添加时，在容器里显示待上传的文件列表
    this.uploader.bind('FilesAdded', (upload, files) => {
      for (const f of files) {
        let data: any[] = [];
        data = this_.fileList.concat({id: f.name.substring(0, f.name.lastIndexOf('.')), name: f.name, type: f.type});
        this_.fileList = [...data]; // 必须要引用变，才会更新？
      }

      // 可实现自动上传
      // uploader.start();
    });
    // 文件上传进度显示
    this.uploader.bind('UploadProgress', (upload, file) => {
      $('#' + file.id + "_progress").html("   " + file.percent + "%");
    });
    // 单个文件上完成后,回调事件
    this.uploader.bind('FileUploaded', (upload, file, result) => {
      const rsp = result.response;
      const videoId = rsp.videoId;
      if (JsUtils.isNotBlank(videoId)) {
        this.record.id = videoId;
      }
      console.log("FileUploaded:");
      console.log(result);
      // $('#id'+file.id).val(result.response);
    });
    // 全部完成后的回调事件
    this.uploader.bind('UploadComplete', (upload, files) => {
      console.log("UploadComplete:");
      alert("您选择的文件已经全部上传，总计共" + files.length + "个文件");
      this.fileList = [];
      this.uploader.files.forEach((value) => {
        this.uploader.removeFile(value);
      });
    });
    // 发生错误时的回调
    this.uploader.bind('Error', (upload, err) => {
      console.log("Error:");
      console.log(err);
    });
  }

  startUpload() {
    this.uploader.start();
  }

  close(item: any) {
    // this.ele.nativeElement.querySelector('');
    // this.renderer.removeChild();
    $('#' + item.id + '_item').remove(); // 是可以删除的，名字里面不能带点，否则可能会被认为是类选择器
    this.fileList.forEach((value, index, array) => {
      const id = value.id;
      if (item.id === id) {
        this.fileList.splice(index, 1); // delete the item
        this.uploader.files.forEach((val, i) => {
          if (val.name === item.name) {
            // 还应该删除uploader.files中的内容
            this.uploader.removeFile(val);
          }
        });
      }
    });
    this.fileList = [...this.fileList];
    if (this.fileList.length === 0) {
      this.fileList = []; // 这个清空，刷新页面上
    }
  }
}
