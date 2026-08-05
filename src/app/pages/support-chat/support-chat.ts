import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, checkmarkDoneOutline, sendOutline } from 'ionicons/icons';

interface Message {
  id: number;
  sender: 'employee' | 'support';
  text: string;
  time: string;
}

@Component({
  selector: 'app-support-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon],
  templateUrl: './support-chat.html',
  styleUrls: ['./support-chat.scss'],
})
export class SupportChatPage implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLElement>;
  @ViewChild('messageInput') messageInput?: ElementRef<HTMLTextAreaElement>;

  messageText = '';
  shouldScroll = true;
  messages: Message[] = [
    {
      id: 1,
      sender: 'support',
      text: 'مرحبًا محمد، كيف يمكننا مساعدتك؟',
      time: 'الآن',
    },
  ];

  constructor(private router: Router) {
    addIcons({ arrowForwardOutline, checkmarkDoneOutline, sendOutline });
  }

  goBack(): void {
    void this.router.navigateByUrl('/tabs/support');
  }

  focusComposer(): void {
    window.setTimeout(() => this.messageInput?.nativeElement.focus(), 0);
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    if (!text) return;

    this.messages.push({
      id: Date.now(),
      sender: 'employee',
      text,
      time: new Intl.DateTimeFormat('ar-SA', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date()),
    });

    this.messageText = '';
    this.shouldScroll = true;
    this.focusComposer();
  }

  ngAfterViewChecked(): void {
    if (!this.shouldScroll) return;
    this.shouldScroll = false;

    requestAnimationFrame(() => {
      const element = this.messagesContainer?.nativeElement;
      if (element) element.scrollTop = element.scrollHeight;
    });
  }
}
