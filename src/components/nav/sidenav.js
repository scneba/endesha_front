import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserContext } from "../login/userContext";
import { usePermissions } from "../permissions";
import { ROLES_PATH } from "../../services/admin";

export default function SideBar() {
  const { t } = useTranslation(["nav"]);
  const user = useContext(UserContext);
  const canView = usePermissions(ROLES_PATH);

  if (!user || !canView) {
    return null;
  }
  return (
    <div className="sidebar">
      <ProSidebar breakPoint="xs">
        <Menu iconShape="square">
          <SubMenu
            title={t("admin")}
            icon={<FontAwesomeIcon icon="user" />}
            defaultOpen
          >
            <MenuItem>
              {t("permissions")}
              <Link to="/admin/permissions" />
            </MenuItem>
            <MenuItem>
              {t("roles")}
              <Link to="/admin/roles" />
            </MenuItem>
            <MenuItem>
              {t("users")}
              <Link to="/admin/users" />
            </MenuItem>
          </SubMenu>
          <SubMenu
            title={t("endesha")}
            icon={<FontAwesomeIcon icon="edit" />}
            defaultOpen
          >
            <MenuItem>
              {t("questions")}
              <Link to="/admin/questions" />
            </MenuItem>
            <MenuItem>
              {t("answers")}
              <Link to="/admin/answers" />
            </MenuItem>
            <MenuItem>
              {t("categories")}
              <Link to="/admin/categories" />
            </MenuItem>
            <MenuItem>
              {t("images")}
              <Link to="/admin/images" />
            </MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>
    </div>
  );
}
