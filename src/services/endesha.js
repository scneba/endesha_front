import axios from "./setup";
export const CATEGORIES_PATH = "/endesha/categories";
export const QUESTIONS_PATH = "/endesha/questions";
export const ANSWERS_PATH = "/endesha/answers";
export const IMAGE_PATH = "/endesha/images";
const BASE_URL = process.env.REACT_APP_BACKEND;

export function getCategories() {
  const url = `${BASE_URL}${CATEGORIES_PATH}`;
  return axios.get(url);
}
export function createCategory(data) {
  const url = `${BASE_URL}${CATEGORIES_PATH}`;
  return axios.post(url, data);
}
export function deleteCategory(id) {
  const url = `${BASE_URL}${CATEGORIES_PATH}`;
  return axios.delete(url, { data: { id } });
}

export function updateCategory(data) {
  const url = `${BASE_URL}${CATEGORIES_PATH}`;
  return axios.patch(url, data);
}

export function getQuestions() {
  const url = `${BASE_URL}${QUESTIONS_PATH}`;
  return axios.get(url);
}
export function createQuestion(data) {
  const url = `${BASE_URL}${QUESTIONS_PATH}`;
  return axios.post(url, data);
}
export function deleteQuestion(id) {
  const url = `${BASE_URL}${QUESTIONS_PATH}`;
  return axios.delete(url, { data: { id } });
}

export function updateQuestion(data) {
  const url = `${BASE_URL}${QUESTIONS_PATH}`;
  return axios.patch(url, data);
}

export function getAnswers() {
  const url = `${BASE_URL}${ANSWERS_PATH}`;
  return axios.get(url);
}
export function getAnswerByID(id) {
  const url = `${BASE_URL}${ANSWERS_PATH}?id=${id}`;
  return axios.get(url);
}
export function createAnswer(data) {
  const url = `${BASE_URL}${ANSWERS_PATH}`;
  return axios.post(url, data);
}
export function deleteAnswer(id) {
  const url = `${BASE_URL}${ANSWERS_PATH}`;
  return axios.delete(url, { data: { id } });
}

export function updateAnswer(data) {
  const url = `${BASE_URL}${ANSWERS_PATH}`;
  return axios.patch(url, data);
}

export function getImages() {
  const url = `${BASE_URL}${IMAGE_PATH}`;
  return axios.get(url);
}
export function getImageById(id) {
  const url = `${BASE_URL}${IMAGE_PATH}?id=${id}`;
  return axios.get(url);
}
export function createImage(name, image) {
  const url = `${BASE_URL}${IMAGE_PATH}`;
  const fData = new FormData();
  fData.append("name", name);
  fData.append("image", image);
  return axios.post(url, fData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export function updateImage(id, name, image) {
  const url = `${BASE_URL}${IMAGE_PATH}`;
  const fData = new FormData();
  fData.append("id", id);
  if (name) {
    fData.append("name", name);
  }
  if (image) {
    fData.append("image", image);
  }
  return axios.patch(url, fData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export function deleteImage(id) {
  const url = `${BASE_URL}${IMAGE_PATH}`;
  return axios.delete(url, { data: { id } });
}
