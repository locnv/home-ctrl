/**
 * Created by locnv on 10/14/18.
 */

const CtrlConst = require('../controller/ctrl.constants');
const dsCard = require('../database/ds.card');

const Method = CtrlConst.Method;
const Actions = CtrlConst.Actions;

function CardController() { }

CardController.prototype.handle = async function (req, params) {

  let retObj = {};
  let method = req.method;

  if(method === Method.Get) {
    retObj = await handleGet.call(this, req, params);
  } else if(method === Method.Post) {
    retObj = await handlePost.call(this, req, params);
  }

  return Promise.resolve(retObj);
};

async function handleGet(req, params) {

  let retObj = {
    isSuccess: true,
    controller: 'card',
    method: 'handleGet',
  };

  let cards = await dsCard.findAll();
  retObj.cards = cards;

  return Promise.resolve(retObj);
}

async function handlePost(req, params) {
  let retObj = {
    isSuccess: true
  };

  let body = req.body;
  let action = body.action;
  let Fn = null;
  switch(action) {
    case Actions.CreateCard:
      let card = body.data;
      let isOk = addCard(card);
      break;
    case Actions.RemoveCard:
    case Actions.UpdateCard:
      break;

    default:
      break;
  }

  return Promise.resolve(retObj);
}

async function addCard(card) {

  let result = {
    error: null,
    attach: null,
  };
  let dbObj = await dsCard.create(card);

  if(dbObj instanceof Error) {
    result.error = dbObj;
  } else {
    result.attach = dbObj;
  }

  return result;
}

async function removeCard(cardId) {
  let result = {
    error: null,
    attach: null,
  };

  let dbObj = await dsCard.delete(cardId);

  if(dbObj instanceof Error) {
    result.error = dbObj;
  } else {
    result.attach = dbObj;
  }

  return result;
}

function updateCard(card) {

}

module.exports = new CardController();