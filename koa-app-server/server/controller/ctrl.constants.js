/**
 * Created by locnv on 10/15/18.
 */

const CtrlConstants = {

  Method: {
    Get: 'GET',
    Post: 'POST',
  },

  Actions: {
    CreateCard: 1,
    UpdateCard: 2,
    RemoveCard: 3,

    AddWord: 4,
    UpdateWord: 5,
    RemoveWord: 6,
    GetWordsByCard: 7,

    // Word Builder
    BuildWords: 9,
    GetUnBuilt: 10,
    UpdateImage: 11,

    SetSwitchStatus: 8,
  },

};

module.exports = CtrlConstants;