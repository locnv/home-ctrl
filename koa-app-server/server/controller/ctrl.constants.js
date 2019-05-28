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

    // Topic -> going to replace for Card
    CreateTopic: 13,
    GetTopicByName: 14,
    AddWordToTopic: 15,
    RemoveWordFromTopic: 16,
    GetWordsByTopic: 17,
    ExportTopic: 18,
    DeleteTopic: 19,

    // Word
    AddWord: 4,
    UpdateWord: 5,
    RemoveWord: 6,
    GetWordsByCard: 7,
    GetWordByName: 12,

    // Word Builder
    BuildWords: 9,
    GetUnBuilt: 10,
    UpdateImage: 11,

    SetSwitchStatus: 8,
  },

};

module.exports = CtrlConstants;