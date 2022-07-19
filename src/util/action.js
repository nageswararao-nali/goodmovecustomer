import { defaultRestClient } from './restClient';
import { LOGIN,SIGNUP,VERIFTYOTP,FORGETPASSWORD,SETPASSWORD,CATEGORY,BOOKVEHICLE,ADDADDRESS, 
    EDITADDRESS, ADDRESSLIST , GETUSERDETAIL, EDITPROFILEDATA, PAYMENTOPTIONDATA , GETBOOKINGLIST , 
    PAYMENTUPLOAD , CUSTOMERBOOKINGDETAILS, GETCUSTOMERADDRESSFROMID, DELETECUSTOMERADDRESSFROMID, CANCELBOOKING , 
    GETMANAGERDEVICETOKEN, ACCEPTBOOKING} from './API';

//login action
export const loginAction = (data) => {
    return defaultRestClient.postWithBody(LOGIN, data);
}

//send sms action
export const sendOTPAction = (mobile,sms) => {
    return defaultRestClient.sendSMS(mobile,sms);
} 

/* verify otp and register action */
export const verifyMSGOTPAction = (mobile, otp) => {
   return defaultRestClient.verifyOTP(mobile,otp);
}

/* verify otp and register action */
export const verifyOTPAction = (mobile, otp) => {
   return defaultRestClient.verifyOTP(mobile,otp);
} 

//move otp screen and then sigup action
export const storeOTPAction = (data) => {
    return defaultRestClient.postWithBody(SIGNUP, data);
}

//verify otp and register action
export const VerityOTPAction = (data) => {
    return defaultRestClient.postWithBody(VERIFTYOTP,data);
}

//forgot password action 
export const ForgotPassAction = (data) => {
    return defaultRestClient.postWithBody(FORGETPASSWORD, data)
}

// resend otp ation
export const resendOTPAction = (mobile) => {
    return defaultRestClient.resendOTP(mobile);
}

//set password during forgot password 
export const setPasswordAction = (data) => {
    return defaultRestClient.postWithBody(SETPASSWORD , data)
}

//get category in add booking action
export const CategoryAction = () => {
    return defaultRestClient.postWithoutBody(CATEGORY)
}

//add booking action
export const AddBookingAction = (data,Token) => {
   return defaultRestClient.postWithFormData(BOOKVEHICLE , data , Token)
}

//add address action
export const addressAction = (data, Token) => {
    if(data.id) {
        return defaultRestClient.postWithBodyToken(EDITADDRESS , data , Token)
    } else {
        return defaultRestClient.postWithBodyToken(ADDADDRESS , data , Token)
    }
}

//get address action
export const getAddressAction = (data , Token) => {
    return defaultRestClient.postWithBodyToken(ADDRESSLIST ,  data, Token)
}

//get profile detail action
export const getProfileAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(GETUSERDETAIL ,  data, Token)
}

//edit user profile action
export const editProfileAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(EDITPROFILEDATA ,  data, Token)
}

//manager payment option action
export const managerPaymentOptionAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(PAYMENTOPTIONDATA , data , Token )
}

//manager payment option action
export const acceptBookingAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(ACCEPTBOOKING , data , Token )
}

//mybooking list action
export const bookingListAction = (data ,Token ) => {
    return defaultRestClient.postWithBodyToken(GETBOOKINGLIST , data , Token )
}

//payment upload action
export const paymentUploadAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(PAYMENTUPLOAD , data , Token )
}

//get booking detail from booking id
export const getBookingDetailAction = (data , Token) => {
    return defaultRestClient.postWithBodyToken(CUSTOMERBOOKINGDETAILS , data , Token )
}

// Get Address of customer form id action
export const getCustomerAddressFromId = (data , Token) => {
    return defaultRestClient.postWithBodyToken(GETCUSTOMERADDRESSFROMID , data , Token )
}

// delete Address of customer form id action
export const deleteCustomerAddressFromId = (data , Token) => {
    return defaultRestClient.postWithBodyToken(DELETECUSTOMERADDRESSFROMID , data , Token )
}

//cancel booking action
export const paymentcancelAction = (data , Token )=>{
    return defaultRestClient.postWithBodyToken(CANCELBOOKING , data , Token )
}

//get manager device token action 
export const GetManagerDeviceTokenAction = (data , Token ) => {
    return defaultRestClient.postWithBodyToken(GETMANAGERDEVICETOKEN , data , Token )
}

//send notification action
export const sendNotificationAction = (data,title,msg) => {
     return defaultRestClient.sendNotification(data,title,msg)
}