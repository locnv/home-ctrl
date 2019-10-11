/**
 * Created by locnv on 10/14/18.
 */

const fs = require('fs');
const path = require('path');
const CtrlConst = require('../controller/ctrl.constants');
const dsCard = require('../database/ds.user');

const logger = require('../util/logger');

const Method = CtrlConst.Method;
const Actions = CtrlConst.Actions;

function UserAdminCtrl() { }

UserAdminCtrl.prototype.handle = async function (req, params, query) {

  let retObj = {};
  let method = req.method;

  if(method === Method.Get) {
    retObj = await handleGet.call(this, req, query);
  } else if(method === Method.Post) {
    retObj = await handlePost.call(this, req, params);
  }

  return Promise.resolve(retObj);
};

async function handleGet(req, query) {

  let retObj = {
    isSuccess: true,
    controller: 'user.admin',
    method: 'handleGet',
  };

  let action = parseInt(query.action);
  switch (action) {
    case Actions.GetAllUsers:
      // TODO
      logger.debug('[user.admin][handleGet]Function is not implemented yet.');
      break;
    default:
      retObj.isSuccess = false;
      break;
  }

  return Promise.resolve(retObj);
}

async function handlePost(req, params) {

  logger.info(`User to create -> ${JSON.stringify(userToCreate)}`);

  let retObj = {
    isSuccess: true
  };

  let body = req.body;
  let reqData = body.data;
  let action = body.action;

  switch(action) {

    case Actions.CreateUser:
    case Actions.DeleteUser:
    case Actions.UpdateUser:
      // TODO
      logger.debug('[user.admin][handlePost] Function is not implemented yet.');
      break;

    default:
      retObj.isSuccess = false;
      break;
  }

  return Promise.resolve(retObj);
}

module.exports = new UserAdminCtrl();
