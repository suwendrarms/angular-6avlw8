import { Component,PipeTransform } from '@angular/core';

import { Subject, from, merge, Observable } from 'rxjs';
import { switchMap, map, windowCount, scan, take, tap } from 'rxjs/operators';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser'
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent,Attachment } from '@progress/kendo-angular-conversational-ui';
//import { ChatService } from './app.service';
import {ChatService} from './chat.service';
import { AppService } from './app.service';


@Component({
  providers: [ AppService ],
  selector: 'my-app',
  templateUrl: './app.component.html',
})

export class AppComponent {
  welcome='';
  saywelcome='';
  title = 'chatbot';
  public feed: Observable<Message[]>;


  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0,
    name: 'Bobby Bot',
    avatarUrl: 'https://demos.telerik.com/kendo-ui/content/chat/avatar.png'
  };

  private local: Subject<Message> = new Subject<Message>();
  constructor(private svc: AppService,public sanitizer: DomSanitizer) {

    var today = new Date();
    var curHr = today.getHours();
    if(curHr >= 6 && curHr < 12){
      this.welcome ='Good Morning how are you.how can i help you. සුබ උදෑසනක් ඔබට කොහොමද. මම ඔබට උදව් කරන්නේ කෙසේද?.காலை வணக்கம் நீங்கள் எப்படி இருக்கிறீர்கள். எப்படி உங்களுக்கு உதவ முடியும் 🤖';
      this.saywelcome='Good Morning who are you';
    }
    else if(curHr >= 12 && curHr < 17){
      this.welcome ='Good Afternoon how are you.how can i help you.සුබ දහවලක් ඔබට කොහොමද? මම ඔබට උදව් කරන්නේ කෙසේද?.வணக்கம். மதிய வணக்கம் . நீங்கள் எப்படி இருக்கிறீர்கள். நான் உங்களுக்கு எப்படி உதவ முடியும்.🤖';
      this.saywelcome='Good Afternoon who are you';
    }
    else{
      this.welcome='Good Evening how are you.how can i help you.සුබ සැන්දෑවක්. ඔබට කොහොමද? මම ඔබට උදව් කළ හැක්කේ කෙසේද?.மாலை வணக்கம். நீங்கள் எப்படி இருக்கிறீர்கள். நான் உங்களுக்கு எப்படி உதவ முடியும்.🤖';
      this.saywelcome='Good Evening who are you';
    }

    const attachments: Attachment[] = [{
      content: this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.youtube.com/embed/gEbVqo_fWhI'
      ),
      contentType:'video'
        
    },{
      contentType:'text',
      content:this.welcome
    },{
      content: {
        title: "Ninja Title",
        subtitle: "The Telerik Ninja",
        text: "This is an example.",
        images: [{
            url: "https://docs.telerik.com/kendo-ui/images/ninja-icon.png",
            alt: "Ninja"
        }]
      },
      contentType:'image/png'
    }];
    
    const hello: Message = {
      author: this.bot,
      suggestedActions: [{
        type: 'reply',
        value: this.saywelcome
      }, {
        type: 'reply',
        value: 'Thanks, but this is boring.'
      }],
      timestamp: new Date(),
      text: this.welcome
    };

  
    // Merge local and remote messages into a single stream
    let ls = this.feed = merge(
      from([ hello ]),
      this.local,
      this.svc.responses.pipe(
        map((response): Message => ({
          author: this.bot,
          text: response,
          attachments: attachments,
          suggestedActions: this.svc.subattachment
          
        })
      ))
    ).pipe(
      // ... and emit an array of all messages
      scan((acc: Message[], x: Message) => [...acc, x], [])
    )
    console.log(ls);
   
  }

  public heroAction(button: any) {
    if (button.type === 'postBack') {
      const message = {
        author: this.user,
        text: button.value
      };

      this.local.next(message);
    }
  }

  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);

    this.local.next({
      author: this.bot,
      typing: true
    });

    this.svc.submit(e.message.text);
  }
}
