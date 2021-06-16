import axios from "./setup";
export const CATEGORIES_PATH = "/endesha/categories";
export const QUESTIONS_PATH = "/endesha/questions";
export const ANSWERS_PATH = "/endesha/answers";
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
