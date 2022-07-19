import { BASE_URL } from './API';

export class RestClient {

    constructor(baseUrl) {
        this._baseUrl = baseUrl;

        _headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });

    }

    /* Send SMS for OTP varification */
    sendSMS(mobile){
        // var data = null;
			
		// var xhr = new XMLHttpRequest();
		// xhr.withCredentials = true;

		// xhr.addEventListener("readystatechange", function () {
		// 	if (this.readyState === 4) {
		// 		return this.responseText;
		// 	}
		// });
				
		// xhr.open("GET", "https://api.msg91.com/api/sendhttp.php?route=4&sender=TESTIN&message="+smsText+"&country=91&mobiles="+mobile+"&authkey=206167AWz6IEnWpcs5ab9fa1e");
		// xhr.setRequestHeader("cache-control", "no-cache");
		// xhr.setRequestHeader("Postman-Token", "13ef6989-3280-43a3-a6a4-6c470416f1ec");

        // xhr.send(data);
        const otpSMSUrl = "https://api.msg91.com/api/v5/otp?authkey=374811A0HCpKKqbrWM623ab59cP1&template_id=623ac62097330068c5322c72&DLT_TE_ID=1307164792809099529&otp_length=4&mobile=+91" +
    mobile
        return fetch(otpSMSUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
		
		.then((response) => response.json())
		
		.then((responseJson) => {
			return responseJson;
		})
		.catch((error) => {
			console.log(error);
		})
    }

    verifyOTP(mobile, otp) {
	
		// return fetch("https://api.msg91.com/api/v5/otp/verify?mobile=+91" + mobile + "&otp=" + otp + "&authkey=8021AEb8FlH35f115208P123", {
		return fetch("https://api.msg91.com/api/v5/otp/verify?mobile=+91" +
        mobile +
        "&otp=" +
        otp +
        "&authkey=374811A0HCpKKqbrWM623ab59cP1", {
		
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
		
		.then((response) => response.json())
		.then((responseJson) => {
			return responseJson;
		})
		.catch((error) => {
			console.log(error);
		})
		
    }
    
	resendOTP(mobile) {

		return fetch("https://api.msg91.com/api/v5/otp/retry?authkey=374811A0HCpKKqbrWM623ab59cP1&template_id=623ac62097330068c5322c72&DLT_TE_ID=1307164792809099529&mobile=+91" +
        mobile +
        "&otp_length=4&retrytype=text", {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		})
			.then((response) => response.json())

			.then((responseJson) => {
				return responseJson;
			})
			.catch((error) => {
				console.log(error);
			})
	}

    /** POST with body */
    postWithBody(url, data) {
        return this.callRequest('POST', url, data);
    }

    /* POST without body */
    postWithoutBody(url) {
        return this.callRequest('POST', url);
    }

    /** POST with body and check api token */
    postWithBodyToken(url, data, Token) {
        return this.callRequestWithToken('POST', url, data, Token);
    }

    /** POST with form data */
    postWithFormData(url, data, Token) {
        return this.callRequestWithFormToken('POST', url, data, Token)
    }

    /** callRequest for non authenticated method */
    callRequest(method, url, data = null) {
        let API_URL = `${this._baseUrl}/${url}`

        return fetch(API_URL, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isError == false) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /** callRequestWithToken for authentication token */
    callRequestWithToken(method, url, data, token) {
        let API_URL = `${this._baseUrl}/${url}`

        return fetch(API_URL, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isError == false) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                return error;
            })
    }

    /** call request with formdata and api token */
    callRequestWithFormToken(method, url, data, token) {
        let API_URL = `${this._baseUrl}/${url}`

        return fetch(API_URL, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': token
            },
            body: data
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isError == false) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                return error;
            })

    }

    /** send notification */
    sendNotification(data, title, msg) {
        return fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'host': 'exp.host'
            },
            body: JSON.stringify({
                to: data,
                title: title,
                body: msg,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("notification sent ....")
                console.log(responseJson)
            })
            .catch((error) => { console.log(error) });
    }
}

export const defaultRestClient = new RestClient(BASE_URL);