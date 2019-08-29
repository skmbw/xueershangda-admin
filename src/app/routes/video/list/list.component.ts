import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STData } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { VideoViewComponent } from '../view/view.component';
import { VideoEditComponent } from '../edit/edit.component';
import { VideoService } from '@shared/service/video.service';
import { com } from '@shared';
import { Consts } from '@shared/utils/consts';
import { ToastrService } from 'ngx-toastr';
import * as plupload from 'plupload';
import Video = com.xueershangda.tianxun.video.model.Video;
import VideoReply = com.xueershangda.tianxun.video.model.VideoReply;

declare var $: any;

@Component({
  selector: 'app-video-list',
  templateUrl: './list.component.html',
})
export class VideoListComponent implements OnInit, AfterViewInit {
  uploader: any;
  url: STData[] = [];
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
    { title: '编号', index: 'id' },
    { title: '标题', index: 'title' },
    { title: '分类', index: 'category' },
    { title: '封面', type: 'img', index: 'image',
      // format: (item: STData, col: STColumn) => {
      //   return Consts.IMAGE_HOST + item.image;
      // }
    },
    { title: '时间', type: 'date', index: 'createDate' },
    {
      title: '',
      buttons: [
        {
          text: '查看',
          // 如果在click中打开modal，那么type是不需要指定的
          // type: 'static', // static（点击蒙层不关闭）和modal（点击蒙层关闭modal）的区别
          // component: VideoListViewComponent,
          // modal: {params: {'id': 322}, paramsName: 'record'},
          click: (item: any) => {
            this.modal
            // static的modal点击蒙层，不会关闭modal
            // 这个参数名有两个一个是i，一个是record
              .createStatic(VideoViewComponent, { record: item })
              .subscribe(() => this.st.reload());
          }
        },
        { // 这种方式打开modal为什么不能正确的传递参数呢？因为bug，没有取modal这个参数，导致参数名是undefined。
          // 默认传递的参数是该行记录。
          text: '编辑',
          click: (item: any) => {
            this.modal.createStatic(VideoEditComponent, { record: item})
              .subscribe(() => this.st.reload());
          }
          // type: 'static',
          // component: VideoEditComponent // 默认将当前行记录record传进去作为参数
          // 这个参数没有使用，是一个bug，在@delon/abc/fesm5/table.js._btnClick（1978行）中，根本没有判断paramsName是否为空
          // @delon/abc/fesm2015/table.js._btnClick（2215行）中也要修改。8.3版本
          // 我对源码做了改动，可以使用了，暂时还是不建议使用这个方式，使用click的方式也是OK的，自己创建modal。
          // modal: {
          //   params: (record: STData) => { // 这个参数是一个函数，会将数据进行处理然后返回，这里直接返回即可。
          //     if (record === null || record === undefined) {
          //       record = {};
          //     }
          //     record.id = 234;
          //     record.name = 'yinlei';
          //     return record;
          //   }, 'paramsName': 'record'}
          // click: (item: any) => item
        }
      ]
    }
  ];

  constructor(private toastr: ToastrService, private modal: ModalHelper, private videoService: VideoService) { }

  ngOnInit() {
    const video = new Video();
    video.page = 1;
    video.pageSize = 20;
    this.videoService.list(video).subscribe(result => {
      const uint8Array = new Uint8Array(result, 0, result.byteLength);
      const reply = VideoReply.decode(uint8Array);
      if (reply.code === 1) {
        for (const v of reply.data) { // 渲染的时候，不能加url前缀，这里处理一下
          v.image = Consts.IMAGE_HOST + v.image;
        }
        this.url = reply.data as STData[];
      } else {
        this.toastr.success(reply.message);
      }
    });
  }

  add() {
    this.modal
      .createStatic(VideoEditComponent, { i: { id: '' } }) // id 初始化为空
      .subscribe(() => this.st.reload());
  }

  ngAfterViewInit() {
    this.uploader = new plupload.Uploader({
      browse_button : 'browseBtn',
      // General settings
      // runtimes: 'html5',
      url: "video/plupload",

      // Maximum file size
      max_file_size: '10000mb',

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
      for (const i in files) {
        if (files.hasOwnProperty(i)) {
          // 在页面迭代显示
          $('#filelist').append('<div><input type="hidden" name="attachmentId" id="id'+files[i].id+'"/>'+files[i].name + ' (' + upload.formatSize(files[i].size) + ')<div id="'+files[i].id+'"></div></div></br>');
        }
      }
      // 可实现自动上传
      // uploader.start();
    });
    // 文件上传进度显示
    this.uploader.bind('UploadProgress', (upload, file) => {
      $('#'+file.id).html("   "+file.percent + "%");
    });
    // 单个文件上完成后,回调事件
    this.uploader.bind('FileUploaded', (upload, file, result) => {
      $('#id'+file.id).val(result.response);
    });
    // 全部完成后的回调事件
    this.uploader.bind('UploadComplete', (upload, files) => {
      alert("您选择的文件已经全部上传，总计共" + files.length + "个文件");
    });
  }
}
