import TelegramBot from 'node-telegram-bot-api';

import { updateMaxPrice, checkPrices } from './utils';
import config from './config';

// Создаем бота
const bot = new TelegramBot(config.token, { polling: true });

// Устанавливаем максимальные цены для валют
let data = [
  { id: 'telcoin', max: 0.0046 },
  { id: 'ripple', max: 1.2 },
  { id: 'stellar', max: 0.48 },
  { id: 'ethereum', max: 963 }
];

let chatIds = [];

// Подписываем всех подключенных юзеров к обновлениям
bot.on('message', msg => {
  const cid = msg.chat.id;
  if (chatIds.indexOf(cid) < 0) {
    chatIds.push(cid);
  }
});

// 1. Вызываем callback при получении новых данных
// 2. Обновляем макс. цену, если цена увеличилась
// 3. Бот оповещает нас об этом
const callback = newData => {
  data = updateMaxPrice(data, newData, obj => {
    chatIds.forEach(id => {
      bot.sendMessage(id, `🔺 ${obj.name} поднялся на ${obj.max}`);
    });
  });
};

let arr = [];
setInterval(() => checkPrices(data, arr, callback), config.updateInterval);
