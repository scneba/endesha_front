export function getUnassignedPermissions(permissions, userPermissions) {
  let unassigned = [];
  //add all permissions if user has no permission
  if (userPermissions.length === 0) {
    unassigned = permissions.map((perm) => ({
      value: perm.id,
      label: [perm.verb, "   ", perm.path],
    }));
  } else {
    for (let permission of permissions) {
      //check if any match exists
      let match = userPermissions.filter(
        (userPerm) =>
          userPerm.path === permission.path &&
          userPerm.verb === permission.verb,
      );
      //add to unassigned if a matche does not exist
      if (match.length === 0) {
        unassigned.push({
          value: permission.id,
          label: [permission.verb, "   ", permission.path],
        });
      }
    }
  }

  return unassigned;
}

export function getUnassignedRoles(roles, userRoles) {
  let unassigned = [];
  //add all permissions if user has no permission
  if (userRoles.length === 0) {
    unassigned = roles.map((role) => ({
      value: role.id,
      label: role.name,
    }));
  } else {
    for (let role of roles) {
      //check if any match exists
      let match = userRoles.filter((userRole) => userRole.name === role.name);
      //add to unassigned if a match does not exist
      if (match.length === 0) {
        unassigned.push({
          value: role.id,
          label: role.name,
        });
      }
    }
  }

  return unassigned;
}

//Get all ids as values
export function getPermissionIds(selectedOptions) {
  var permissions_id = [];
  selectedOptions.forEach((permission) => {
    permissions_id.push(permission.value);
  });
  return permissions_id;
}

//Get value/label pair for categories
export function getCategoriesValueLabelPair(categories) {
  let values = [];
  if (categories) {
    categories.forEach((cat) =>
      values.push({
        value: cat.id,
        label: cat.name,
      }),
    );
  }
  return values;
}

//Get get default value of react select for categories
export function getCategoriesDefaultValue(categories, category_id) {
  let value = {};
  console.log(categories);
  console.log(category_id);
  if (categories && category_id) {
    let category = categories.filter((cat) => cat.id === category_id);
    value.value = category[0].id;
    value.label = category[0].name;
  }
  return value;
}

//Get get default value of react select for categories
export function getAnswerDefaultValue(answers, answer_id) {
  let value = {};
  if (answers && answer_id) {
    let answer = answers.filter((ans) => ans.id === answer_id);
    value.value = answer[0].id;
    value.label = answer[0].short_description;
  }
  return value;
}

//Get value/label pair for answers
export function getAnswersValueLabelPair(answers) {
  let values = [];
  if (answers) {
    answers.forEach((ans) =>
      values.push({
        value: ans.id,
        label: ans.short_description,
      }),
    );
  }
  return values;
}
// adds roleId and portfolioId to inital roles -- these come from the API without IDs
export function populateIds(initialRoles, roles, portfolios) {
  if (initialRoles != null) {
    initialRoles.forEach((r) => {
      if (r.name !== "") {
        const role = roles.find((role) => role.name === r.name);
        const portfolio = portfolios.find(
          (portfolio) => portfolio.short_code === r.portfolio,
        );

        if (role) {
          r.roleId = role.id;
        }
        if (portfolio) {
          r.portfolioId = portfolio.id;
        }
      }
    });
    return initialRoles;
  }
}
