import { AxiosError } from "axios";
import { useStore } from "../store/store";
import jwt_decode from 'jwt-decode';

export const getImage = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href;
};

export const formatDate = (date) => {
  if (date) {
    const data = date.split("-");
    const day = data[2];
    const month = data[1];
    const year = data[0];
    return new Date(`${year}-${month}-${day}`);
  }
};

export const Rules = {
  password: [(v) => /^[0-9]+$/.test(v) || "Только цифры"],
  numbers: [(v) => /^[0-9]+$/.test(v) || "Только цифры"],
  numbersSymbols: [
    (v) => /^([0-9])|(\W|_)+$/.test(v) || "Только цифры и символы",
  ],
  required: [(v) => !!v || "Поле обязательно"],
  birthDate: [
    (v) => {
      if (new Date(formatDate(v)) > new Date(Date.now()))
        return "Дата не может прешывать сегодняшнюю дату";
      if (
        /^(19[0-9]{2}|20[0-9][0-9])(-|\.)(0[1-9]|1[0-2])(-|\.)(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/.test(
          v
        )
      ) {
        return true;
      } else {
        return "Неправильный формат даты";
      }
    },
  ],
  password: [
    (v) =>
      (!!v && /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(v)) ||
      "Пароль должен быть как минимум из 8 символом и содержать буквы и цифры",
  ],
  age: [
    (v) => {
      if (!!v) {
        const date = formatDate(v);
        const age = Math.abs(
          new Date(Date.now() - new Date(date).getTime()).getUTCFullYear() -
            1970
        );
        if (age >= 16) {
          return true;
        } else {
          return "Вам должно быть старше 16 лет";
        }
      } else {
        return "Поле обязательно";
      }
    },
  ],
  email: [
    (v) => {
      if (v === "" || v === null) {
        return true;
      } else {
        if (
          String(v)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;=\s@"]+(\.[^<>()[\]\\.,;=\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        ) {
          return true;
        } else {
          return "Неправильный формат почты";
        }
      }
    },
  ],
};

export class Maskas {
  // '#': { pattern: /[0-9]/ },
  // 'X': { pattern: /[0-9a-zA-Z]/ },
  // 'S': { pattern: /[a-zA-Z]/ },
  // 'A': { pattern: /[a-zA-Z]/, uppercase: true },
  // 'a': { pattern: /[a-zA-Z]/, lowercase: true },
  // '!': { escape: true },
  // '*': { repeat: true }

  date = "####-##-##";
  numbers = "#*";
  text = "S*";
}

export const ErrorHandler = (err, errorText = null) => {
  console.log(err);
  if (err instanceof AxiosError) {
    if ("response" in err && err.response && err.response.data) {
      const error = err.response.data;
      const errorMessage =
        "detail" in error ? error.detail : JSON.stringify(error);
      useStore().showToaster(
        "error",
        errorText ? errorText : errorMessage,
        5000
      );
    }
  }
  return false;
};

export const jwtDecode = token => {
  return jwt_decode(token);
};

export const isValidToken = token => {
  return (new Date(jwtDecode(token).exp * 1000).getTime() - Date.now()) / 1000 > 0;
};
