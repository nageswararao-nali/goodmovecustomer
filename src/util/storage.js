import { AsyncStorage } from "react-native";

export const storage = {

    storeUserDetail: async (userData) => {

        await AsyncStorage.setItem('userid', JSON.stringify(userData.id));
        await AsyncStorage.setItem('name', userData.name);
        await AsyncStorage.setItem('company_name', userData.company_name);
        await AsyncStorage.setItem('company_type', userData.company_type);
        await AsyncStorage.setItem('mobile', userData.mobile);
        await AsyncStorage.setItem('token', userData.token);

    },

    getUserDetail: async () => {
        let Token = await AsyncStorage.getItem('token');
    }
}
