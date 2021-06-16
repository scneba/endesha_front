import React, { useState, useEffect } from "react";
import { usePermissions, Unauthorized } from "../permissions";
import * as endeshaApi from "../../services/endesha";
import { Table, Form, Col, Button, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showPopup, showErrorsPopUp } from "../generics/alerts";
import Skeleton from "react-loading-skeleton";
import { useHistory } from "react-router-dom";

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
        <FontAwesomeIcon icon="user-tag" /> {t("answers")}
      </h1>
      {/* <CreateAnswerForm fetchAnswers={fetchAnswers} /> */}
      <AnswerTable answers={answers} fetchAnswers={fetchAnswers} />
    </React.Fragment>
  );
}

// export function CreateAnswerForm({ fetchAnswers }) {
//   const { t } = useTranslation(["admin", "shared"]);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const canCreate = usePermissions(endeshaApi.ANSWERS_PATH, "POST");
//   const [errors, setErrors] = useState([]);
//   const [saving, setSaving] = useState(false);

//   if (!canCreate) {
//     return <React.Fragment />;
//   }

//   const createAnswer = async (e) => {
//     e.preventDefault();
//     var data = { name, description };
//     try {
//       setErrors([]);
//       setSaving(true);
//       await endeshaApi.createAnswer(data);
//       fetchAnswers();
//       showPopup(t("shared:success"), "success");
//       setName("");
//       setDescription("");
//     } catch (err) {
//       console.log(err);
//       showErrors(err, setErrors);
//     }
//     setSaving(false);
//   };
//   return (
//     <Form className="mb-3" onSubmit={createAnswer}>
//       <Form.Row>
//         <FormErrors errors={errors}></FormErrors>
//       </Form.Row>
//       <Form.Row>
//         <Col sm={3} lg={2}>
//           <Form.Control
//             type="text"
//             name="name"
//             required
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder={t("name")}
//           ></Form.Control>
//         </Col>
//         <Col sm={6} lg={4}>
//           <Form.Control
//             type="text"
//             name="description"
//             required
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder={t("description")}
//           />
//         </Col>
//         <Col>
//           <Button
//             variant="primary"
//             type="submit"
//             disabled={saving}
//             style={{ marginLeft: "auto" }}
//           >
//             {saving ? t("shared:saving") : t("addCat")}
//           </Button>
//         </Col>
//       </Form.Row>
//     </Form>
//   );
// }

export function AnswerTable({ answers, fetchAnswers }) {
  const { t } = useTranslation(["admin"]);
  const [search, setSearch] = useState("");
  const [filteredAnswers, setFilteredAnswers] = useState(answers);
  const canDelete = usePermissions(endeshaApi.ANSWERS_PATH, "DELETE");

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
  function AnswerRow({ answer, fetchAnswers }) {
    const canEdit = usePermissions(endeshaApi.ANSWERS_PATH, "PATCH");
    const history = useHistory();
    const link = "/admin/answers/edit/" + answer.id;
    return (
      <tr>
        <td>{answer.short_description}</td>
        <td>{answer.answer}</td>
        <td>
          <Row>
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
          </Row>
        </td>
      </tr>
    );
  }
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
