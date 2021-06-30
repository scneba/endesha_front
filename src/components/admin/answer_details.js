import React, { useState, useEffect } from "react";
import { usePermissions, Unauthorized } from "../permissions";
import * as endeshaApi from "../../services/endesha";
import { Form, Col, Button, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showPopup, showErrors, showErrorsPopUp } from "../generics/alerts";
import { FormErrors } from "../generics/forms";
import Skeleton from "react-loading-skeleton";
import { useHistory, useParams } from "react-router-dom";
import PreviewTabs from "./preview_tabs";

export default function AnswerDetails() {
  const { t } = useTranslation(["admin"]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const canEdit = usePermissions(endeshaApi.ANSWERS_PATH, "PATCH");
  const canView = usePermissions(endeshaApi.ANSWERS_PATH, "GET");

  const [description, setDescription] = useState("");
  //get id from path
  const { id } = useParams();
  const [convertedContent, setConvertedContent] = useState(null);
  const [rawState, setRawState] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const getAnswer = async () => {
      try {
        setErrors([]);
        setLoading(true);
        const resp = await endeshaApi.getAnswerByID(id);
        let ans = resp.data.data;
        setRawState(JSON.parse(ans.answer));
        setDescription(ans.short_description);
        setConvertedContent(ans.answer_md);
      } catch (err) {
        console.log(err);
        showErrorsPopUp(err);
      }
      setLoading(false);
    };
    if (id) {
      getAnswer();
    }
  }, [id]);

  const submitAnswer = async (e) => {
    e.preventDefault();
    try {
      let answerString = JSON.stringify(rawState);
      if (id) {
        //update answer
        let data = {
          id,
          answer: answerString,
          short_description: description,
          answer_md: convertedContent,
        };
        setErrors([]);
        setSaving(true);
        await endeshaApi.updateAnswer(data);
        history.push("/admin/answers");
      } else {
        //update answer
        let data = {
          answer: answerString,
          short_description: description,
          answer_md: convertedContent,
        };
        setErrors([]);
        setSaving(true);
        await endeshaApi.createAnswer(data);
        history.push("/admin/answers");
      }
    } catch (err) {
      console.log(err);
      showErrors(err, setErrors);
    }
    setSaving(false);
  };

  if (!canView) {
    return <Unauthorized />;
  }
  //show skeleton if permissions are not yet loaded
  if (loading) {
    return <Skeleton height={40} count="4" className="m-3" />;
  }
  return (
    <Form className="mx-3  my-3" onSubmit={submitAnswer}>
      <Form.Group controlId="desc">
        <Form.Row>
          <FormErrors errors={errors}></FormErrors>
        </Form.Row>
        <Col sm={10} lg={10}>
          <Form.Label>{t("description")}</Form.Label>
          <Form.Control
            type="text"
            name="short_description"
            className="my-2"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("shortDescription")}
          ></Form.Control>
        </Col>
      </Form.Group>
      <Form.Group>
        <PreviewTabs
          convertedContent={convertedContent}
          setConvertedContent={setConvertedContent}
          rawState={rawState}
          setRawState={setRawState}
          heading={t("answer")}
          sm={10}
          md={10}
          lg={10}
        ></PreviewTabs>
      </Form.Group>
      <Col sm={10} lg={10}>
        <Button
          variant="primary"
          size="md"
          type="submit pull-right"
          disabled={saving || !canEdit}
          style={{ marginLeft: "auto" }}
        >
          {saving ? t("shared:saving") : t("shared:save")}
        </Button>
      </Col>
    </Form>
  );
}
