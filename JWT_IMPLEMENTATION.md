# JWT Authentication Implementation

## ✅ Changes Done

### Backend Changes:

1. **Installed Packages:**
   - `jsonwebtoken` - JWT token generation और verification के लिए
   - `bcryptjs` - Password hashing के लिए

2. **Created Files:**
   - `middleware/authMiddleware.js` - JWT token verify करने के लिए middleware

3. **Updated Files:**
   - `.env` - JWT_SECRET key add की
   - `router/route.js` - Login और Registration में JWT implementation

### Key Features:

✅ **Secure Password Storage**
- Passwords अब bcrypt से hash होकर database में store होते हैं
- Plain text passwords store नहीं होते

✅ **JWT Token Based Authentication**
- Login successful होने पर JWT token generate होता है
- Token 24 hours के लिए valid रहता है
- Token को localStorage में store करें frontend में

✅ **Protected Routes**
- `/userinfo` route अब JWT protected है
- Request में `Authorization: Bearer <token>` header भेजना जरूरी है

## 🔧 Frontend Integration Guide

### Login के बाद token save करें:

```javascript
// Login Component में
const handleLogin = async (credentials) => {
  try {
    const response = await loginUser(credentials);
    
    // Save user data with token
    localStorage.setItem('loggedInUser', JSON.stringify({
      user: response.data.user,
      token: response.data.token  // Token save करें
    }));
    
    // Redirect to home or dashboard
    navigate('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Protected API calls के लिए:

```javascript
// Token के साथ API call करें
const token = JSON.parse(localStorage.getItem('loggedInUser'))?.token;

axios.get('http://localhost:8000/userinfo', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Logout करते समय:

```javascript
const handleLogout = () => {
  localStorage.removeItem('loggedInUser');
  navigate('/login');
};
```

## 🔐 API Endpoints

### 1. Register (Public)
```
POST /register
Body: {
  name, mobile, email, addressLine, city, state, pincode, dob, gender, password
}
Response: {
  message: "User Registered Successfully"
}
```

### 2. Login (Public)
```
POST /login
Body: {
  username: "email or mobile",
  password: "password"
}
Response: {
  message: "Login successful",
  token: "jwt-token-here",
  user: { ...user data without password }
}
```

### 3. Get User Info (Protected)
```
GET /userinfo
Headers: {
  Authorization: "Bearer jwt-token-here"
}
Response: {
  name, email, mobile, gender, dob, addressLine, city, state, pincode
}
```

## 🚨 Important Security Notes

1. **JWT_SECRET को change करें production में:**
   - `.env` file में `JWT_SECRET` को strong random string से replace करें
   - Never commit `.env` file to git

2. **Token Expiry:**
   - Current token 24 hours के लिए valid है
   - Expired token के साथ request करने पर 401 error आएगा

3. **Password Security:**
   - Passwords अब bcrypt से hash होते हैं (10 rounds)
   - Old plain text passwords काम नहीं करेंगे - users को re-register करना होगा

## 🧪 Testing

### Test Registration:
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "mobile": "1234567890",
    "password": "password123",
    "city": "Mumbai",
    "state": "Maharashtra"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Route:
```bash
curl -X GET http://localhost:8000/userinfo \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Next Steps

1. Frontend login component में token save करने का code add करें
2. All API calls में `Authorization` header add करें
3. Token expire होने पर user को logout करें
4. `.env` में JWT_SECRET को secure value से replace करें

## ✨ Benefits

- ✅ Secure password storage
- ✅ Token-based authentication
- ✅ Session management
- ✅ Protection against unauthorized access
- ✅ Scalable authentication system
