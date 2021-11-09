import LoginWindow from '../models/loginWindow';
import MainWindow from '../models/mainWindow';
import UserName from '../view/userName';
import UserList from '../view/userList';
import MessageList from '../view/messageList';
import MessageSender from '../models/messageSender';
import WSClient from '../ws/wsClient';
import UserPhoto from '../models/userPhoto';

export default class Chat {
  constructor() {
    this.wsClient = new WSClient(
      // 'ws://localhost:8000',
      `ws://${location.host}/vp2/ws`, //см. settings.json
      this.onMessage.bind(this)
    );

    this.loginWindow = new LoginWindow(
      document.querySelector('#login'),
      this.onLogin.bind(this)
    );
    this.mainWindow = new MainWindow(document.querySelector('#main'));
    this.userName = new UserName(document.querySelector('[data-role=user-name]'));
    this.userList = new UserList(document.querySelector('[data-role=user-list]'));
    this.messageList = new MessageList(
      document.querySelector('[data-role=messages-list]')
    );
    this.messageSender = new MessageSender(
      document.querySelector('[data-role=message-sender]'),
      this.onSend.bind(this)
    );
    this.userPhoto = new UserPhoto(
      document.querySelector('[data-role=user-photo]'),
      this.onUpload.bind(this)
    );

    this.loginWindow.show();
  }

  // передается в UserPhoto. Срабатывает, когда FileReader прочитал файл
  onUpload(data) {
    this.userPhoto.set(data);

    fetch('/vp2/upload-photo', {
      method: 'post',
      body: JSON.stringify({
        name: this.userName.get(),
        image: data,
      }),
    });
  }

  onSend(message) {
    this.wsClient.sendTextMessage(message);
    this.messageSender.clear();
  }

  async onLogin(name) {
    await this.wsClient.connect();
    this.wsClient.sendHello(name);

    this.loginWindow.hide();
    this.mainWindow.show();
    this.userName.set(name);

    this.userPhoto.set(`../vp2/photos/${name}.png?t=${Date.now()}`);
  }

  onMessage({ type, from, data }) {
    console.log(type, from, data);

    if (type === 'hello') {
      this.userList.add(from);
      this.messageList.addSystemMessage(`${from} вошел в чат`);
    } else if (type === 'user-list') {
      for (const item of data) {
        this.userList.add(item);
      }
    } else if (type === 'bye-bye') {
      this.userList.remove(from);
      this.messageList.addSystemMessage(`${from} вышел из чата`);
    } else if (type === 'text-message') {
      this.messageList.add(from, data.message);
    } else if (type === 'photo-changed') {
      const avatars = document.querySelectorAll(
        `[data-role=user-avatar][data-user=${data.name}]`
      );

      for (const avatar of avatars) {
        avatar.style.backgroundImage = `url(../vp2/photos/${
          data.name
        }.png?t=${Date.now()})`;
      }
    }
  }
}
