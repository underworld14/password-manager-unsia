import CryptoJS from "react-native-crypto-js";

export const encryptPassword = (password: string, key: string) => {
  return CryptoJS.AES.encrypt(password, key).toString();
};

export const decryptPassword = (ciphertext: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
