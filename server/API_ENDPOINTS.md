# User Authentication API Endpoints

## Signup Endpoint

**POST** `/users/signup`

Creates a new user account with optional profile image upload to S3.

### Request Body (multipart/form-data)
- `name` (string, required): User's full name (2-50 characters)
- `email` (string, required): Valid email address
- `password` (string, required): Password (minimum 6 characters)
- `phone` (string, optional): Phone number
- `roles` (array, optional): User roles (defaults to ['user'])
- `profileImage` (file, optional): Profile image file (JPG, JPEG, PNG, GIF, PDF)

### Response
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "roles": ["user"],
      "profileImageUrl": "https://s3-bucket-url/profiles/timestamp-filename.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

## Login Endpoint

**POST** `/users/login`

Authenticates a user and returns a JWT token.

### Request Body (application/json)
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "roles": ["user"],
      "profileImageUrl": "https://s3-bucket-url/profiles/timestamp-filename.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Environment Variables Required

Make sure these environment variables are set in your `.env` file:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
AWS_REGION=your_aws_region
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

## File Upload Configuration

- **Supported file types**: JPG, JPEG, PNG, GIF, PDF
- **Maximum file size**: 10MB
- **Upload folder**: `profiles/` in S3 bucket
- **File naming**: `timestamp-originalfilename.ext`
