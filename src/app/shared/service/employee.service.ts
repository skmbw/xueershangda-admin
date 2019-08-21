import { Injectable } from '@angular/core';
import { CommonService } from '@shared/service/common.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends CommonService {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }
}
