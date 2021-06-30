import React, { useState } from "react";
import { Col, Tabs, Tab, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DraftEditor from "./draft_editor";
import ReactMarkdown from "react-markdown";
import ReactGFM from "remark-gfm";
import RehypeRaw from "rehype-raw";
export default function PreviewTabs({
  convertedContent,
  setConvertedContent,
  rawState,
  setRawState,
  heading,
  sm,
  md,
  lg,
}) {
  const { t } = useTranslation(["admin"]);
  const [useEditor, setUseEditor] = useState(true);

  const handleEditorChange = (e) => {
    if (e.target.value === "1") {
      setUseEditor(true);
    } else {
      setUseEditor(false);
    }
  };

  return (
    <React.Fragment>
      <Col sm={10} md={5} lg={5}>
        <Form.Label>{t("selectEditor")}</Form.Label>
        <Form.Control
          as="select"
          name="editor_type"
          className="my-2"
          onChange={handleEditorChange}
        >
          <option value="1" key={1}>
            {t("draftEditor")}
          </option>
          <option value="0" key={0}>
            {t("markdownEditor")}
          </option>
        </Form.Control>
      </Col>
      <Col sm={sm} md={md} lg={lg}>
        <Tabs defaultActiveKey="editor" id="table-tabs">
          <Tab eventKey="editor" title={heading}>
            {useEditor ? (
              <DraftEditor
                setConvertedContent={setConvertedContent}
                rawState={rawState}
                setRawState={setRawState}
              ></DraftEditor>
            ) : (
              <MarkdownEditor
                convertedContent={convertedContent}
                setConvertedContent={setConvertedContent}
              ></MarkdownEditor>
            )}
          </Tab>
          <Tab eventKey="preview" title={t("preview")}>
            <ReactMarkdown
              remarkPlugins={[ReactGFM]}
              rehypePlugins={[RehypeRaw]}
              children={convertedContent}
              skipHtml={false}
            />
          </Tab>
        </Tabs>
      </Col>
    </React.Fragment>
  );
}

function MarkdownEditor({ sm, md, lg, convertedContent, setConvertedContent }) {
  const { t } = useTranslation(["admin"]);

  return (
    <Col md={md ? md : 10} sm={sm ? sm : 10} lg={lg ? lg : 10}>
      <Form.Control
        type="text"
        name="short_description"
        className="my-2"
        as="textarea"
        rows={10}
        required
        value={convertedContent}
        onChange={(e) => setConvertedContent(e.target.value)}
        placeholder={t("addMarkdownText")}
      ></Form.Control>
    </Col>
  );
}
