import { ChatProps, UserProps } from './types';

export const users: UserProps[] = [
  {
    name: 'Steve E.',
    username: '@steveEberger',
    avatar: '/static/images/avatar/2.jpg',
    online: true,
  },
];

export const chats: ChatProps[] = [
  {
    id: '1',
    sender: users[0],
    messages: [
      {
        id: '1',
        content: 'Здравствуйте Акбрахон, чем занимаетесь в данный момент времени?',
        timestamp: 'Wednesday 9:00am',
        sender: users[0],
      },
      {
        id: '2',
        content: 'Здарствуйте Ислом, в настоящее время я работаю над проектом.',
        timestamp: 'Wednesday 9:10am',
        sender: 'Вы',
      },
    ],
  }
];
