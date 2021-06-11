import React, { useState, useEffect } from "react";
import { usePermissions, Unauthorized } from "../permissions";
import * as endeshaApi from "../../services/endesha";
import { Table, Form, Col, Button, Row, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { showPopup, showErrors, showErrorsPopUp } from "../generics/alerts";
import { FormErrors } from "../generics/forms";
import Skeleton from "react-loading-skeleton";

export default function Categories() {
  const { t } = useTranslation(["admin"]);
  const canView = usePermissions(endeshaApi.CATEGORIES_PATH);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchCategories() {
    try {
      setLoading(true);
      const resp = await endeshaApi.getCategories();
      setCategories(resp.data.data);
    } catch (err) {
      console.log(err);
      showErrorsPopUp(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
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
        <FontAwesomeIcon icon="user-tag" /> {t("categories")}
      </h1>
      <CreateCategoryForm fetchCategories={fetchCategories} />
      <CategoryTable
        categories={categories}
        fetchCategories={fetchCategories}
      />
    </React.Fragment>
  );
}

export function CreateCategoryForm({ fetchCategories }) {
  const { t } = useTranslation(["admin", "shared"]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const canCreate = usePermissions(endeshaApi.CATEGORIES_PATH, "POST");
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  if (!canCreate) {
    return <React.Fragment />;
  }

  const createCategory = async (e) => {
    e.preventDefault();
    var data = { name, description };
    try {
      setErrors([]);
      setSaving(true);
      await endeshaApi.createCategory(data);
      fetchCategories();
      showPopup(t("shared:success"), "success");
      setName("");
      setDescription("");
    } catch (err) {
      console.log(err);
      showErrors(err, setErrors);
    }
    setSaving(false);
  };
  return (
    <Form className="mb-3" onSubmit={createCategory}>
      <Form.Row>
        <FormErrors errors={errors}></FormErrors>
      </Form.Row>
      <Form.Row>
        <Col sm={3} lg={2}>
          <Form.Control
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name")}
          ></Form.Control>
        </Col>
        <Col sm={6} lg={4}>
          <Form.Control
            type="text"
            name="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("description")}
          />
        </Col>
        <Col>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ marginLeft: "auto" }}
          >
            {saving ? t("shared:saving") : t("addCat")}
          </Button>
        </Col>
      </Form.Row>
    </Form>
  );
}

export function CategoryTable({ categories, fetchCategories }) {
  const { t } = useTranslation(["admin"]);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const canDelete = usePermissions(endeshaApi.CATEGORIES_PATH, "DELETE");

  useEffect(() => {
    setFilteredCategories(
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, categories]);

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
                <th>{t("name")}</th>
                <th>{t("description")}</th>
                <th>{t("shared:action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <CategoryRow
                  category={cat}
                  key={cat.id}
                  fetchCategories={fetchCategories}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
  function CategoryRow({ category, fetchCategories }) {
    return (
      <tr>
        <td>{category.name}</td>
        <td>{category.description}</td>
        <td>
          <Row>
            <DeleteCategory
              id={category.id}
              canDelete={canDelete}
              fetchCategories={fetchCategories}
            />
            <EditCategory
              category={category}
              fetchCategories={fetchCategories}
            />
          </Row>
        </td>
      </tr>
    );
  }
}

function DeleteCategory({ id, canDelete, fetchCategories }) {
  const { t } = useTranslation(["admin", "shared"]);
  const deleteCategory = async () => {
    let result = window.confirm(t("confirmDelCategory"));
    if (result === true) {
      try {
        await endeshaApi.deleteCategory(id);
        fetchCategories();
        showPopup(t("shared:success"), "success");
      } catch (err) {
        console.log(err);
        showErrorsPopUp(err);
      }
    }
  };

  return (
    <Button className="mx-1" onClick={deleteCategory} disabled={!canDelete}>
      <FontAwesomeIcon icon="trash"></FontAwesomeIcon>
    </Button>
  );
}

function EditCategory({ category, fetchCategories }) {
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
        <FontAwesomeIcon icon="edit"></FontAwesomeIcon>
      </Button>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-success ml-2">
            {t("editCategory")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditCategoryForm
            category={category}
            setShow={setShow}
            fetchCategories={fetchCategories}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

function EditCategoryForm({ category, setShow, fetchCategories }) {
  const { t } = useTranslation(["admin"]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(category.name);
  const [errors, setErrors] = useState([]);
  const [description, setDescription] = useState(category.description);

  const editCategory = async (e) => {
    e.preventDefault();
    var data = { id: category.id, name, description };
    try {
      setErrors([]);
      setSaving(true);
      await endeshaApi.updateCategory(data);
      fetchCategories();
      showPopup(t("shared:success"), "success");
      setShow(false);
    } catch (err) {
      console.log(err);
      showErrors(err, setErrors);
    }
    setSaving(false);
  };

  return (
    <Form className="mb-3" onSubmit={editCategory}>
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
          <Form.Control
            type="text"
            name="description"
            className="my-2"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("description")}
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
