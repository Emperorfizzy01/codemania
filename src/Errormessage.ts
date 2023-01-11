export const Errormessage = {
    UserExist: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'User already exist',
    },
  
  
    Userexist: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'User with such id does not exist',
    },

    Post: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'Post with such id does not exist',
    },
 
  
    Unmatchpassword: {
      success: false,
      apiErrorCode: '401',
      errorMessage: 'Password does not match',
    },

    Passwordlength: {
      success: false,
      apiErrorCode: '401',
      errorMessage: 'Password length must not be less than 9',
    },
  
    IncorrectData: {
      success: false,
      apiErrorCode: '401',
      errorMessage: 'Phone number or password incorrect',
    },
  
    IncorrectPassword: {
      success: false,
      apiErrorCode: '401',
      errorMessage:
        'Old password incorrect, you can click on forgot password instead',
    },
  
    InvalidOTP: {
      success: false,
      apiErrorCode: '401',
      errorMessage: 'OTP has either expired or not provided',
    },
  
  
    UnauthorisedOperation: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'You are not authorised to perform this operation',
    },
  
    InvalidToken: {
      success: false,
      apiErrorCode: '401',
      errorMessage: 'Token has either expired or not provided',
    },

    AlreadyFollowing: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'You are already following that user',
    },

    InvalidOperation: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'You cant follow yourself',
    },

    NotFollowing: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'You cant unfollow who you are not following',
    },

    AlreadyLiked: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'You arlready liked that post',
    },

    NotLike: {
      success: false,
      apiErrorCode: '403',
      errorMessage: 'You cant unlike a post you didnt like',
    }
  };