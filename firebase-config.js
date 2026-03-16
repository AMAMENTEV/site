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

// Включаем постоянное сохранение сессии
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('✅ Сессия будет сохраняться');
  })
  .catch((error) => {
    console.log('❌ Ошибка настройки сессии:', error);
  });

// Проверка авторизации (ИСПРАВЛЕННАЯ ВЕРСИЯ)
auth.onAuthStateChanged((user) => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Список страниц, на которых НЕ нужно перенаправлять
  const allowedPages = ['index.html', 'register.html', 'user.html'];
  
  // Если мы на разрешенной странице - ничего не делаем
  if (allowedPages.includes(currentPage)) {
    console.log(`📄 Страница ${currentPage} - не перенаправляем`);
    return;
  }
  
  // Для всех остальных страниц проверяем авторизацию
  if (user && user.emailVerified) {
    console.log('✅ Пользователь авторизован:', user.email);
    // Если пользователь на защищенной странице - оставляем, если нет - перенаправляем
    if (currentPage !== 'messenger.html' && currentPage !== 'profile.html') {
      window.location.href = 'messenger.html';
    }
  } else if (user && !user.emailVerified) {
    console.log('⏳ Email не подтвержден');
    // Если пользователь на защищенной странице с неподтвержденным email - отправляем на вход
    if (currentPage === 'messenger.html' || currentPage === 'profile.html') {
      window.location.href = 'index.html';
    }
  } else {
    console.log('❌ Пользователь не авторизован');
    // Если пользователь не авторизован на защищенной странице - отправляем на вход
    if (currentPage === 'messenger.html' || currentPage === 'profile.html') {
      window.location.href = 'index.html';
    }
  }
});