// Конфигурация Firebase - замените на свои данные из консоли Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqzIbV2Uly03MbjpyNP9RQQx-0uDYnJdY",
  authDomain: "yttg-3b587.firebaseapp.com",
  projectId: "yttg-3b587",
  storageBucket: "yttg-3b587.firebasestorage.app",
  messagingSenderId: "77409665832",
  appId: "1:77409665832:web:b63c780592b3dfc82a061d",
  measurementId: "G-5VHQ23S2PP"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Настройка Persistence (чтобы запоминать пользователя)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.error('Ошибка настройки persistence:', error);
  });

// Проверка состояния аутентификации с задержкой, чтобы избежать конфликтов
let authInitialized = false;

auth.onAuthStateChanged((user) => {
  // Защита от множественных срабатываний
  if (authInitialized) return;
  authInitialized = true;
  
  setTimeout(() => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (user) {
      // Пользователь вошел в систему
      console.log('Пользователь авторизован:', user.email);
      
      // Проверяем, подтвержден ли email
      if (user.emailVerified) {
        // Если email подтвержден и мы не на странице профиля - перенаправляем
        if (currentPage !== 'profile.html') {
          window.location.href = 'profile.html';
        }
      } else {
        // Если email не подтвержден, но мы пытаемся зайти на profile.html - показываем предупреждение
        if (currentPage === 'profile.html') {
          // Оставляем на profile.html, там покажется сообщение о необходимости подтверждения
          console.log('Email не подтвержден');
        } else if (currentPage !== 'index.html') {
          // В других случаях перенаправляем на страницу входа
          window.location.href = 'index.html';
        }
      }
    } else {
      // Пользователь не вошел
      console.log('Пользователь не авторизован');
      if (currentPage === 'profile.html') {
        window.location.href = 'index.html';
      }
    }
  }, 100); // Небольшая задержка для стабильности
});