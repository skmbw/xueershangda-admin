import { HttpHeaders } from '@angular/common/http';

export class Consts {
  static URL = 'http://localhost:8775/';
  static IMAGE_HOST = 'http://locahost:8300/';
  static IMAGE_URL = 'localhost:8300/';
  static JSON = {
    headers: new HttpHeaders({'Content-Type': 'application/json;charset=utf-8'})
  };

  static FORM_JSON = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}),
    responseType: 'json'
  };
}
