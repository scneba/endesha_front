import React, { useState, useEffect } from "react";
import { usePermissions, Unauthorized } from "../permissions";
import * as endeshaApi from "../../services/endesha";
import { Table, Form, Col, Button, Row, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showPopup, showErrors, showErrorsPopUp } from "../generics/alerts";
import { FormErrors } from "../generics/forms";
import Skeleton from "react-loading-skeleton";
import RImage from "react-bootstrap/Image";
import CopyToClipboard from "react-copy-to-clipboard";
const BASE_URL = process.env.REACT_APP_BACKEND;

export default function Images() {
  const { t } = useTranslation(["admin"]);
  const canView = usePermissions(endeshaApi.IMAGE_PATH);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchImages() {
    try {
      setLoading(true);
      const resp = await endeshaApi.getImages();
      setImages(resp.data.data);
    } catch (err) {
      console.log(err);
      showErrorsPopUp(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchImages();
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
        <FontAwesomeIcon icon="images" /> {t("images")}
      </h1>
      <ImageTable images={images} fetchImages={fetchImages} />
    </React.Fragment>
  );
}

export function ImageTable({ images, fetchImages }) {
  const { t } = useTranslation(["admin"]);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(images);
  const canDelete = usePermissions(endeshaApi.IMAGE_PATH, "DELETE");

  useEffect(() => {
    setFilteredCategories(
      images.filter((img) =>
        img.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, images]);

  return (
    <>
      <Row className="mb-3">
        <Col lg={7}>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Control
              className="mr-2"
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("shared:search")}
            ></Form.Control>
          </Form>
        </Col>
        <EditImage
          fetchImages={fetchImages}
          icon="plus"
          label={t("addImage")}
        />
      </Row>
      <Row>
        <Col md={12} sm={12}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t("name")}</th>
                <th>{t("image")}</th>
                <th>{t("shared:action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((image) => (
                <ImageRow
                  image={image}
                  key={image.id}
                  fetchImages={fetchImages}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
  function ImageRow({ image, fetchImages }) {
    return (
      <tr>
        <td>{image.name}</td>
        <td>
          <RImage
            width={100}
            height={100}
            src={image ? BASE_URL + "/endesha/images?id=" + image.id : ""}
            fluid
          />
        </td>
        <td>
          <Row>
            <DeleteImage
              id={image.id}
              canDelete={canDelete}
              fetchImages={fetchImages}
            />
            <EditImage image={image} fetchImages={fetchImages} icon="edit" />
            <CopyImagePath image={image} />
          </Row>
        </td>
      </tr>
    );
  }
}

function CopyImagePath({ image }) {
  const { t } = useTranslation(["admin"]);
  function showCopyToast() {
    showPopup(t("textCopied"), "success");
  }

  return (
    <CopyToClipboard
      text={BASE_URL + "/endesha/images?id=" + image.id}
      onCopy={showCopyToast}
    >
      <Button className="mx-1">
        <FontAwesomeIcon icon="copy"></FontAwesomeIcon>
      </Button>
    </CopyToClipboard>
  );
}
function DeleteImage({ id, canDelete, fetchImages }) {
  const { t } = useTranslation(["admin", "shared"]);
  const deleteImage = async () => {
    let result = window.confirm(t("confirmDelImage"));
    if (result === true) {
      try {
        await endeshaApi.deleteImage(id);
        fetchImages();
        showPopup(t("shared:success"), "success");
      } catch (err) {
        console.log(err);
        showErrorsPopUp(err);
      }
    }
  };

  return (
    <Button className="mx-1" onClick={deleteImage} disabled={!canDelete}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}

function EditImage({ label, icon, image, fetchImages }) {
  const canEdit = usePermissions(endeshaApi.IMAGE_PATH, "PATCH");
  const [show, setShow] = useState(false);
  const { t } = useTranslation(["admin", "shared"]);

  return (
    <React.Fragment>
      <Button
        className="mx-1"
        onClick={() => setShow(true)}
        disabled={!canEdit}
      >
        <FontAwesomeIcon icon={icon} className="mr-2"></FontAwesomeIcon>
        {label ? label : ""}
      </Button>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-success ml-2">
            {label ? t("addImage") : t("editImage")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditImageForm
            image={image}
            setShow={setShow}
            fetchImages={fetchImages}
          />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

function EditImageForm({ image, setShow, fetchImages }) {
  const { t } = useTranslation(["admin"]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(image ? image.name : "");
  const [errors, setErrors] = useState([]);
  const [fileSrc, setFileSrc] = useState(
    image ? BASE_URL + "/endesha/images?id=" + image.id : "",
  );
  const [file, setFile] = useState(undefined);

  /**
   * Add a new image or edit an existing one
   * @param {*} e
   */
  const submitImage = async (e) => {
    e.preventDefault();
    if (image && image.id) {
      try {
        setErrors([]);
        setSaving(true);
        await endeshaApi.updateImage(image.id, name, file);
        fetchImages();
        showPopup(t("shared:success"), "success");
        setShow(false);
      } catch (err) {
        console.log(err);
        showErrors(err, setErrors);
      }
    } else {
      try {
        setErrors([]);
        setSaving(true);
        await endeshaApi.createImage(name, file);
        fetchImages();
        showPopup(t("shared:success"), "success");
        setShow(false);
      } catch (err) {
        console.log(err);
        showErrors(err, setErrors);
      }
    }
    setSaving(false);
  };
  const handleFileChange = (e) => {
    let f = e.target.files[0];
    setFile(f);
    setFileSrc(URL.createObjectURL(f));
  };

  return (
    <Form className="mb-3" onSubmit={submitImage}>
      <Form.Row>
        <FormErrors errors={errors}></FormErrors>
      </Form.Row>
      <Form.Row>
        <Col sm={10} lg={10}>
          <Form.Control
            type="text"
            name="name"
            className="my-2"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name")}
          ></Form.Control>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col sm={10} lg={10}>
          <Form.Group>
            <Form.File
              id="image_file"
              label={t("selectImage")}
              onChange={handleFileChange}
              accept="image/*"
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row className="my-4">
        {fileSrc ? (
          <RImage width={200} height={200} src={fileSrc} fluid />
        ) : (
          <br />
        )}
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
