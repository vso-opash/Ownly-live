import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncrDecrService } from './EncrDecrService.service';
@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private EncrDecr: EncrDecrService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = localStorage.getItem('user');
    if (currentUser && request.url.indexOf('domain.com.au') === -1) {
      const token = this.EncrDecr.getEncrypt(currentUser);
      request = request.clone({
        setHeaders: {
          Authorization: `${token.token}`
        }
      });
    }
    return next.handle(request);
  }
}
