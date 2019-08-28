import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, UploadChangeParam, UploadFile } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { JsUtils } from '@shared/utils/js-utils';
import { Consts } from '@shared/utils/consts';
import { VideoService } from '@shared/service/video.service';
import { com } from '@shared';
// import * as $ from 'jquery';
// import * as plupload from 'plupload';
import Video = com.xueershangda.tianxun.video.model.Video;
import VideoReply = com.xueershangda.tianxun.video.model.VideoReply;

declare var $: any; // 这次的导入要使用这种方式声明，否则会说 pluploadQueue is not a function

@Component({
  selector: 'app-video-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class VideoEditComponent implements OnInit, AfterViewInit {
  record: any = {}; // 如果不初始化，那么this.record.id会是undefined
  i: any;
  uploader: any;
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
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.uploader = $("#uploader").pluploadQueue({
        browse_button : 'browse_btn',
        // General settings
        // runtimes: 'html5',
        url: "video/plupload",

        // Maximum file size
        max_file_size: '10000mb',

        chunk_size: '1mb',

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
      });
    }, 500);
    // 新引入，需要重启动，否则无法检测到插件 https://blog.csdn.net/yhc0322/article/details/78796009
    // Initialize the widget when the DOM is ready
    // this.uploader = $("#uploader").pluploadQueue({
    //   this_: $("#uploader"),
    //   url: 'video/plupload',
    //   max_file_size: '10000mb',
    //   chunk_size: '1mb'
    // });

    // 这样new才可以，jquery加载不行
    // const plu = new plupload.Uploader({
    //   url: 'video/plupload',
    //   max_file_size: '10000mb',
    //   chunk_size: '1mb'
    // });

    // this.uploader = new plupload.Uploader({
    //   browse_button : 'browse_btn',
    //   // General settings
    //   // runtimes: 'html5',
    //   url: "video/plupload",
    //
    //   // Maximum file size
    //   max_file_size: '10000mb',
    //
    //   chunk_size: '1mb',
    //
    //   // Resize images on clientside if we can
    //   // resize: {
    //   //   width: 200,
    //   //   height: 200,
    //   //   quality: 90,
    //   //   crop: true // crop to exact dimensions
    //   // },
    //
    //   // Specify what files to browse for
    //   filters: [
    //     {title: "Image files", extensions: "jpg,gif,png,jpeg"},
    //     {title: "Vedio files", extensions: "mp4,mkv"},
    //     {title: "Zip files", extensions: "zip,avi"}
    //   ],
    //
    //   // Rename files by clicking on their titles
    //   rename: true,
    //
    //   // Sort files
    //   sortable: true,
    //
    //   // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
    //   dragdrop: true,
    //
    //   // Views to activate
    //   // views: {
    //   //   list: true,
    //   //   thumbs: true, // Show thumbs
    //   //   active: 'thumbs'
    //   // },
    //
    //   // Flash settings
    //   // flash_swf_url: 'js/Moxie.swf',
    //
    //   // Silverlight settings
    //   // silverlight_xap_url: 'js/Moxie.xap'
    // });
    //
    // // 初始化plupload
    // this.uploader.init();
    //
    // // 文件添加时，在容器里显示待上传的文件列表
    // this.uploader.bind('FilesAdded', (upload, files) => {
    //   for (const i in files) {
    //     if (files.hasOwnProperty(i)) {
    //       // 在页面迭代显示
    //       $('#filelist').append('<div><input type="hidden" name="attachmentId" id="id'+files[i].id+'"/>'+files[i].name + ' (' + upload.formatSize(files[i].size) + ')<div id="'+files[i].id+'"></div></div></br>');
    //     }
    //   }
    // });
    // // 文件上传进度显示
    // this.uploader.bind('UploadProgress', (upload, file) => {
    //   $('#'+file.id).html("   "+file.percent + "%");
    // });
    // // 单个文件上完成后,回调事件
    // this.uploader.bind('FileUploaded', (upload, file, result) => {
    //   $('#id'+file.id).val(result.response);
    // });
    // // 全部完成后的回调事件
    // this.uploader.bind('UploadComplete', (upload, files) => {
    //   alert("您选择的文件已经全部上传，总计共" + files.length + "个文件");
    // });
    // $("#toStop").on('click', function () {
    //   uploader.stop();
    // });

    // $("#startUpload").on('click', () => {
    //   alert('start upload.');
    //   this.uploader.start();
    // });

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

  ngAfterViewInit() {
    // angular中没有$(document).ready(function(){});的等价物，使用这种方法
    // setTimeout(() => {
    //   $("#uploader").pluploadQueue({
    //     browse_button : 'browse_btn',
    //     // General settings
    //     // runtimes: 'html5',
    //     url: "video/plupload",
    //
    //     // Maximum file size
    //     max_file_size: '10000mb',
    //
    //     chunk_size: '1mb',
    //
    //     // Resize images on clientside if we can
    //     // resize: {
    //     //   width: 200,
    //     //   height: 200,
    //     //   quality: 90,
    //     //   crop: true // crop to exact dimensions
    //     // },
    //
    //     // Specify what files to browse for
    //     filters: [
    //       {title: "Image files", extensions: "jpg,gif,png,jpeg"},
    //       {title: "Vedio files", extensions: "mp4,mkv"},
    //       {title: "Zip files", extensions: "zip,avi"}
    //     ],
    //
    //     // Rename files by clicking on their titles
    //     rename: true,
    //
    //     // Sort files
    //     sortable: true,
    //
    //     // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
    //     dragdrop: true,
    //
    //     // Views to activate
    //     // views: {
    //     //   list: true,
    //     //   thumbs: true, // Show thumbs
    //     //   active: 'thumbs'
    //     // },
    //
    //     // Flash settings
    //     // flash_swf_url: 'js/Moxie.swf',
    //
    //     // Silverlight settings
    //     // silverlight_xap_url: 'js/Moxie.xap'
    //   });
    //   // 已经初始化，不需要了
    //   // this.uploader.init();
    //
    //   // // 文件添加时，在容器里显示待上传的文件列表
    //   // this.uploader.bind('FilesAdded', (upload, files) => {
    //   //   for (const i in files) {
    //   //     if (files.hasOwnProperty(i)) {
    //   //       // 在页面迭代显示
    //   //       $('#filelist').append('<div><input type="hidden" name="attachmentId" id="id'+files[i].id+'"/>'+files[i].name + ' (' + upload.formatSize(files[i].size) + ')<div id="'+files[i].id+'"></div></div></br>');
    //   //     }
    //   //   }
    //   // });
    //   // // 文件上传进度显示
    //   // this.uploader.bind('UploadProgress', (upload, file) => {
    //   //   $('#'+file.id).html("   "+file.percent + "%");
    //   // });
    //   // // 单个文件上完成后,回调事件
    //   // this.uploader.bind('FileUploaded', (upload, file, result) => {
    //   //   $('#id'+file.id).val(result.response);
    //   // });
    //   // // 全部完成后的回调事件
    //   // this.uploader.bind('UploadComplete', (upload, files) => {
    //   //   alert("您选择的文件已经全部上传，总计共" + files.length + "个文件");
    //   // });
    // }, 500);
  }

  close() {
    this.modal.destroy();
  }

  startUpload() {
    this.uploader.start();
  }

  select() {
    $('#fileInput').trigger('click');
    // 在这里触发是OK的，这个时候页面早已经ready
    // this.uploader = $("#uploader").pluploadQueue({
    //   this_: $("#uploader"),
    //   url: 'video/plupload',
    //   max_file_size: '10000mb',
    //   chunk_size: '1mb'
    // });
    // this.uploader.init();
  }

  change() {
    this.uploader.addFile($('#fileInput')[0]);
  }
}
