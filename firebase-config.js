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


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Запоминаем пользователя
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Создаем коллекцию пользователей в Firestore при первом входе
auth.onAuthStateChanged(async (user) => {
  if (user && user.emailVerified) {
    // Проверяем, есть ли пользователь в Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists) {
      // Парсим ник и тег из displayName (формат: "никнейм|@тег")
      let nickname = 'Пользователь';
      let tag = '';
      
      if (user.displayName) {
        const parts = user.displayName.split('|');
        nickname = parts[0] || 'Пользователь';
        tag = parts[1] || '';
      }
      
      // Создаем документ пользователя
      await db.collection('users').doc(user.uid).set({
        nickname: nickname,
        tag: tag,
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }
});