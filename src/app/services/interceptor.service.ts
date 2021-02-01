import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  valid: ValidRequest;
  urlNotToUse: string[] = ['https://test.cashfree.com/','https://api.cashfree.com/api/v2/'];
  constructor(private inj: Injector,
              private storageService: StorageService) { 
                this.valid = new ValidRequest();
              }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.inj.get(AuthService);
    const authToken = this.storageService.getToken();
    if (this.valid.isValidRequestForInterceptor(req.url,this.urlNotToUse)){
      const authReq = req.clone({ headers: req.headers.set('Authorization', 'bearer ' + authToken) });
      return next.handle(authReq);
    }
    else {
      console.log(req.headers.keys(),req.headers)
      return next.handle(req);
    }
    
  }
}

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  valid: ValidRequest;
  urlNotToUse: string[] = ['https://test.cashfree.com','https://api.cashfree.com/'];
  constructor(private inj: Injector,
              private storageService: StorageService) { 
                this.valid = new ValidRequest();
              }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.inj.get(AuthService);
    const authToken = this.storageService.getToken();
    if (this.valid.isValidRequestForInterceptor(req.url,this.urlNotToUse)){
      return next
      .handle(req)
      .pipe(tap((event: HttpEvent<any>) => {
        // do nothing
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 && authToken) {
            authService.checkJWT();
          }
        }
      }));
    }
    else {
      return next.handle(req);
    }
    
  }
}

class ValidRequest {
   isValidRequestForInterceptor(requestUrl: string,urlsToNotUse: string[]): boolean {
    let valid: boolean = true;
     urlsToNotUse.map(url => {
      if (requestUrl.includes(url)){
        valid = false;
      }
    })
    return valid;
  }
}


