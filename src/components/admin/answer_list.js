import React, { useState, useEffect } from "react";
import { usePermissions, Unauthorized } from "../permissions";
import * as endeshaApi from "../../services/endesha";
import { Table, Form, Col, Button, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showPopup, showErrorsPopUp } from "../generics/alerts";
import Skeleton from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ReactGFM from "remark-gfm";
import RehypeRaw from "rehype-raw";

export default function Answers() {
  const { t } = useTranslation(["admin"]);
  const canView = usePermissions(endeshaApi.ANSWERS_PATH);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchAnswers() {
    try {
      setLoading(true);
      const resp = await endeshaApi.getAnswers();
      setAnswers(resp.data.data);
    } catch (err) {
      console.log(err);
      showErrorsPopUp(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAnswers();
  }, []);

  if (!canView) {
    return <Unauthorized />;
  }
  //show skeleton if permissions are not yet loaded
  if (loading) {
    return <Skeleton height={40} count="4" className="m-3" />;
  }
  return (
    <React.Fragment>
      <h1 className="mb-3 display-4 text-primary">
        <FontAwesomeIcon icon="globe" /> {t("answers")}
      </h1>
      <AnswerTable answers={answers} fetchAnswers={fetchAnswers} />
    </React.Fragment>
  );
}

export function AnswerTable({ answers, fetchAnswers }) {
  const { t } = useTranslation(["admin"]);
  const [search, setSearch] = useState("");
  const [filteredAnswers, setFilteredAnswers] = useState(answers);
  const canAdd = usePermissions(endeshaApi.ANSWERS_PATH, "POST");
  const history = useHistory();

  useEffect(() => {
    setFilteredAnswers(
      answers.filter(
        (ans) =>
          ans.short_description.toLowerCase().includes(search.toLowerCase()) ||
          ans.answer.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, answers]);

  return (
    <>
      <Row className="mb-3">
        <Col lg={7} md={7}>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Control
              className="mr-2"
              type="text"
              name="Search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("shared:search")}
            ></Form.Control>
          </Form>
        </Col>
        <Col lg={5} md={5}>
          <Button
            className="mx-1 pull-right"
            onClick={() => history.push("/admin/answers/edit")}
            disabled={!canAdd}
          >
            <FontAwesomeIcon icon="plus" className="mr-2"></FontAwesomeIcon>
            {t("addAnswer")}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={12} sm={12}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("description")}</th>
                <th>{t("answer")}</th>
                <th>{t("shared:action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnswers.map((cat) => (
                <AnswerRow
                  answer={cat}
                  key={cat.id}
                  fetchAnswers={fetchAnswers}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
function AnswerRow({ answer, fetchAnswers }) {
  const canEdit = usePermissions(endeshaApi.ANSWERS_PATH, "PATCH");
  const history = useHistory();
  const link = "/admin/answers/edit/" + answer.id;
  const canDelete = usePermissions(endeshaApi.ANSWERS_PATH, "DELETE");
  return (
    <tr>
      <td width="30%">{answer.short_description}</td>
      <td width="55%">
        <ReactMarkdown
          remarkPlugins={[ReactGFM]}
          rehypePlugins={[RehypeRaw]}
          children={answer.answer_md.split("\n")[0]}
          skipHtml={false}
        />
        ...
      </td>
      <td width="15%">
        <DeleteAnswer
          id={answer.id}
          canDelete={canDelete}
          fetchAnswers={fetchAnswers}
        />
        <Button
          className="mx-2"
          onClick={() => history.push(link)}
          disabled={!canEdit}
        >
          <FontAwesomeIcon icon="edit"></FontAwesomeIcon>
        </Button>
      </td>
    </tr>
  );
}

function DeleteAnswer({ id, canDelete, fetchAnswers }) {
  const { t } = useTranslation(["admin", "shared"]);
  const deleteAnswer = async () => {
    let result = window.confirm(t("confirmDelAnswer"));
    if (result === true) {
      try {
        await endeshaApi.deleteAnswer(id);
        fetchAnswers();
        showPopup(t("shared:success"), "success");
      } catch (err) {
        console.log(err);
        showErrorsPopUp(err);
      }
    }
  };

  return (
    <Button className="mx-1" onClick={deleteAnswer} disabled={!canDelete}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}
