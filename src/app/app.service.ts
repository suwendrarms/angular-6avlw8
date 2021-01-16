import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { msg } from './app';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  //constructor() { }
  constructor(public http: HttpClient,public sanitizer: DomSanitizer) { }
  public readonly responses: Subject<string> = new Subject<string>();
  links =[];
  subattachment=[];
  attachfile =[];
  welcome='';
  public submit(question: string): void {
    
    console.log(question);
    const length = question.length;

    this.passmsg(question).toPromise().then((data:any)=>{
     // console.log(data);
    });

    setTimeout(() => {this.getchat().subscribe(res => {

      //console.log(res.message);
      //const answer = `"${question}" contains exactly ${length} symbols.`;
      const answer = res.message;
      const a =res.a;
      const b = res.b;
      const c = res.c;
      const d = res.d;
    if(d =='openUrl'){
      this.subattachment =[{
        title: a,
        value: b,
        type:d,     
        }];
    }
    else if(d=='reply')
    {
      this.subattachment =[{
          title: 'click me',
          value: 'can i get an your help',
          type: d
        }];
    }

      if(res.message==null){
        setTimeout(
          () => this.responses.next('waiting'),
          3000
        );
      }else{
        setTimeout(
          () => {this.responses.next(answer)           
          },1000);
      }  
      // let ld= this.responses.next(answer);
      // console.log(ld);  
    })
    
    },5000);
    
  }

  getchat():Observable<any>{
    return this.http.get('http://localhost:3000/chatbot');
  }

  passmsg(msgbody):Observable<msg>{
   // console.log(msgbody);
    return this.http.post<msg>('http://localhost:3000/chatbot', {message:msgbody});

  }
}
