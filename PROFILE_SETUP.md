# Profile Features Setup Guide

This guide explains how to set up the new profile features including profile picture upload and mobile number verification.

## New Features Added

1. **Profile Picture Upload**
   - Users can upload profile pictures (max 5MB)
   - Supports JPEG, PNG, and GIF formats
   - Images are stored in `server/uploads/profile-pictures/`

2. **Profile Information Update**
   - Users can update their username and email
   - Form validation included

3. **Mobile Number Verification**
   - Users can add and verify their mobile number
   - SMS verification using Twilio (production) or console logging (development)
   - 6-digit verification code with 10-minute expiry

## Server Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/the_movie_site
MONGO_DB=the_movie_site

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Twilio Configuration (for SMS verification)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# TMDB API
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

### 3. Twilio Setup (Optional for Development)

For production SMS verification:
1. Sign up for a Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add these to your `.env` file

For development, verification codes will be logged to the console.

## Database Changes

The user model has been updated to include:
- `profilePicture`: String path to uploaded image
- `mobileNumber`: Object with:
  - `number`: Mobile number string
  - `verified`: Boolean verification status
  - `verificationCode`: Temporary verification code
  - `verificationExpiry`: Code expiration timestamp

## API Endpoints Added

### Profile Management
- `PUT /api/user/profile` - Update username and email
- `POST /api/user/profile-picture` - Upload profile picture
- `GET /api/user/me` - Get user profile

### Mobile Verification
- `POST /api/user/send-mobile-verification` - Send verification code
- `POST /api/user/verify-mobile` - Verify mobile number with code

## Client Features

### ProfilePage Component
- Interactive profile picture upload with preview
- Inline editing for username and email
- Mobile number verification flow
- Real-time status updates
- Error handling and success messages

### User Service
- `updateProfile(profileData)` - Update user profile
- `uploadProfilePicture(file)` - Upload profile picture
- `sendMobileVerification(mobileNumber)` - Send verification code
- `verifyMobileNumber(code)` - Verify mobile number
- `getUserProfile()` - Get user profile data

## File Structure

```
server/
├── uploads/
│   └── profile-pictures/     # Uploaded profile pictures
├── models/
│   └── user.js              # Updated user model
├── routes/
│   └── user.js              # New user routes
└── server.js                # Updated with static file serving

client/
├── src/
│   ├── pages/
│   │   └── ProfilePage.js   # Enhanced profile page
│   └── services/
│       └── userService.js   # New user service functions
```

## Usage

1. Start the server: `npm run dev` (in server directory)
2. Start the client: `npm start` (in client directory)
3. Navigate to `/profile` to access the new features
4. Upload a profile picture by clicking the camera icon
5. Edit profile information by clicking "Edit Profile"
6. Add and verify mobile number using the verification flow

## Development Notes

- In development mode, verification codes are logged to the server console
- Profile pictures are served from `http://localhost:5000/uploads/`
- File uploads are limited to 5MB and image formats only
- Mobile verification codes expire after 10 minutes
