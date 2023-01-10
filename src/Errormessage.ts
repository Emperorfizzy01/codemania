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
 
  
    Unmatchpassword: {
      success: false,
      apiErrorCode: '401',
      errorMessage: 'Password does not match',
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
  
  };