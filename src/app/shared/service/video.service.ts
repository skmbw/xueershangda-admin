import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { com } from '@shared/protobuf/model';
import { Consts } from '@shared/utils/consts';
import Video = com.xueershangda.tianxun.video.model.Video;

@Injectable({
  providedIn: 'root'
})
export class VideoService extends CommonService {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  encode(video: Video): ArrayBufferLike {
    const body = Video.encode(video).finish();
    const int8Array = new Int8Array(body.byteLength);
    int8Array.set(body);
    return int8Array.buffer;
  }

  save(video: Video): Observable<ArrayBuffer> {
    return this.postProtobuf(Consts.URL + 'video/add', this.encode(video));
  }

  list(video: Video): Observable<ArrayBuffer> {
    return this.postProtobuf(Consts.URL + 'video/list', this.encode(video));
  }

  get(id: string): Observable<ArrayBuffer> {
    return this.getArrayBuffer(Consts.URL + 'video/detail/' + id);
  }
}
