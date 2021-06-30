import React, { useState, useEffect } from "react";
import { usePermissions, Unauthorized } from "../permissions";
import * as endeshaApi from "../../services/endesha";
import { Table, Form, Col, Button, Row, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showPopup, showErrors, showErrorsPopUp } from "../generics/alerts";
import { FormErrors } from "../generics/forms";
import Skeleton from "react-loading-skeleton";
import Select from "react-select";
import * as helpers from "../generics/helpers";

export default function Questions() {
  const { t } = useTranslation(["admin"]);
  const canView = usePermissions(endeshaApi.CATEGORIES_PATH);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  async function fetchQuestions() {
    try {
      setLoadingQuestions(true);
      const resp = await endeshaApi.getQuestions();
      setQuestions(resp.data.data);
    } catch (err) {
      console.log(err);
      showErrorsPopUp(err);
    }
    setLoadingQuestions(false);
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCats(true);
        const resp = await endeshaApi.getCategories();
        setCategories(resp.data.data);
      } catch (err) {
        console.log(err);
        showErrorsPopUp(err);
      }
      setLoadingCats(false);
    }
    async function fetchAnswers() {
      try {
        setLoadingAnswers(true);
        const resp = await endeshaApi.getAnswers();
        setAnswers(resp.data.data);
      } catch (err) {
        console.log(err);
        showErrorsPopUp(err);
      }
      setLoadingAnswers(false);
    }
    fetchAnswers();
    fetchQuestions();
    fetchCategories();
  }, []);

  if (!canView) {
    return <Unauthorized />;
  }
  //show skeleton if permissions are not yet loaded
  if (loadingCats || loadingQuestions || loadingAnswers) {
    return <Skeleton height={40} count="4" className="m-3" />;
  }
  return (
    <React.Fragment>
      <h1 className="mb-3 display-4 text-primary">
        <FontAwesomeIcon icon="question" /> {t("questions")}
      </h1>
      <QuestionTable
        questions={questions}
        fetchQuestions={fetchQuestions}
        categories={categories}
        answers={answers}
      />
    </React.Fragment>
  );
}

export function QuestionTable({
  questions,
  fetchQuestions,
  categories,
  answers,
}) {
  const { t } = useTranslation(["admin"]);
  const [search, setSearch] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const canDelete = usePermissions(endeshaApi.CATEGORIES_PATH, "DELETE");

  useEffect(() => {
    setFilteredQuestions(
      questions.filter((question) =>
        question.question.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, questions]);

  return (
    <>
      <Row>
        <Col lg={7}>
          <Form className="mb-3" onSubmit={(event) => event.preventDefault()}>
            <Form.Control
              className="mr-2"
              type="text"
              name="Search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("shared:search")}
            ></Form.Control>
          </Form>
        </Col>
        <Col>
          <EditQuestion
            icon="plus"
            categories={categories}
            answers={answers}
            fetchQuestions={fetchQuestions}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={12}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("question")}</th>
                <th>{t("category")}</th>
                <th>{t("shared:action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <QuestionRow
                  question={question}
                  key={question.id}
                  fetchQuestions={fetchQuestions}
                  categories={categories}
                  answers={answers}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );

  function QuestionRow({ question, fetchQuestions, categories, answers }) {
    function getQuestionCategoryName() {
      if (categories) {
        let cat = categories.filter((cat) => cat.id === question.category_id);
        return cat[0].name;
      } else {
        return "Unknown";
      }
    }
    return (
      <tr>
        <td width="65%">{question.question}</td>
        <td width="25%">{getQuestionCategoryName()}</td>
        <td width="15%">
          <Row>
            <DeleteQuestion
              id={question.id}
              canDelete={canDelete}
              fetchQuestions={fetchQuestions}
            />
            <EditQuestion
              icon="edit"
              question={question}
              categories={categories}
              answers={answers}
              fetchQuestions={fetchQuestions}
            />
          </Row>
        </td>
      </tr>
    );
  }
}

function DeleteQuestion({ id, canDelete, fetchQuestions }) {
  const { t } = useTranslation(["admin", "shared"]);
  const deleteQuestion = async () => {
    let result = window.confirm(t("confirmDelQuestion"));
    if (result === true) {
      try {
        await endeshaApi.deleteQuestion(id);
        fetchQuestions();
        showPopup(t("shared:success"), "success");
      } catch (err) {
        console.log(err);
        showErrorsPopUp(err);
      }
    }
  };

  return (
    <Button className="mx-1" onClick={deleteQuestion} disabled={!canDelete}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}

function EditQuestion({ icon, question, fetchQuestions, categories, answers }) {
  const canEdit = usePermissions(endeshaApi.CATEGORIES_PATH, "PATCH");
  const [show, setShow] = useState(false);
  const { t } = useTranslation(["admin", "shared"]);

  return (
    <div>
      <Button
        className="mx-1"
        onClick={() => setShow(true)}
        disabled={!canEdit}
      >
        {question ? (
          <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        ) : (
          t("addQuestion")
        )}
      </Button>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-success ml-2">
            {question ? t("editQuestion") : t("addQuestion")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditQuestionForm
            question={question}
            setShow={setShow}
            fetchQuestions={fetchQuestions}
            categories={categories}
            answers={answers}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

function EditQuestionForm({
  question,
  setShow,
  fetchQuestions,
  categories,
  answers,
}) {
  const { t } = useTranslation(["admin"]);
  const [saving, setSaving] = useState(false);
  const [updatedQuestion, setUpdatedQuestion] = useState(
    question ? question.question : "",
  );

  const [errors, setErrors] = useState([]);
  const [category, setCategory] = useState(
    question
      ? helpers.getCategoriesDefaultValue(categories, question.category_id)
      : null,
  );
  const [answer, setAnswer] = useState(
    question
      ? helpers.getAnswerDefaultValue(answers, question.answer_id)
      : null,
  );
  let categoryValues = helpers.getCategoriesValueLabelPair(categories);
  let answerValues = helpers.getAnswersValueLabelPair(answers);
  const editQuestion = async (e) => {
    e.preventDefault();
    try {
      setErrors([]);
      setSaving(true);
      if (question) {
        let data = {
          id: question.id,
          question: updatedQuestion,
          category_id: category.value,
          answer_id: answer.value,
        };
        await endeshaApi.updateQuestion(data);
      } else {
        let data = {
          question: updatedQuestion,
          category_id: category.value,
          answer_id: answer.value,
        };
        await endeshaApi.createQuestion(data);
      }
      fetchQuestions();
      showPopup(t("shared:success"), "success");
      setShow(false);
    } catch (err) {
      console.log(err);
      showErrors(err, setErrors);
    }
    setSaving(false);
  };

  return (
    <Form className="mb-3" onSubmit={editQuestion}>
      <Form.Row>
        <FormErrors errors={errors}></FormErrors>
      </Form.Row>
      <Form.Row>
        <Col sm={10} lg={10}>
          <Form.Control
            type="text"
            name="question"
            as="textarea"
            className="my-2"
            required
            value={updatedQuestion}
            onChange={(e) => setUpdatedQuestion(e.target.value)}
            placeholder={t("question")}
          ></Form.Control>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col sm={10} lg={10}>
          <Select
            placeholder={t("category")}
            isMulti={false}
            className="my-2"
            value={category}
            onChange={(val) => setCategory(val)}
            closeMenuOnSelect={true}
            options={categoryValues}
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col sm={10} lg={10}>
          <Select
            placeholder={t("answer")}
            isMulti={false}
            className="my-2"
            value={answer}
            onChange={(val) => setAnswer(val)}
            closeMenuOnSelect={true}
            options={answerValues}
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ marginLeft: "auto" }}
          >
            {saving ? t("shared:saving") : t("shared:save")}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}
