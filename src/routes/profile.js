const getJWTPayload = require('../utils/helpers/getJWTPayload');
const calculateCGPA = require('../utils/helpers/calculateCGPA');
const Models = require('../../models');

module.exports = [
  {
    method: 'GET',
    path: '/profile',
    handler: (req, res) => {
      const usn = getJWTPayload(req);
      const promiseArray = [Models.users.findAll({
        where: { usn },
        raw: true,
      }),
      Models.academics.findAll({
        where: { usn },
        raw: true,
      })];
      Promise.all(promiseArray)
        .then(result => ([result[0][0], result[1][0]]))
        .then((result) => {
          const profile = {
            usn,
            fullname: result[0].fullname,
            dob: result[0].dob,
            sex: result[0].sex,
            email: result[0].email,
            phone: result[0].phone,
            address: result[0].address,
            branch: result[0].branch,
            historybacklog: Number(result[0].historybacklog),
            xstd: result[0].xmarks,
            xiistd: result[0].xiimarks,
            xinstitute: result[1].xinstitute,
            xboard: result[1].xboard,
            xmarks: result[1].xmarks,
            xyear: result[1].xyear,
            xiiinstitute: result[1].xiiinstitute,
            xiiboard: result[1].xiiboard,
            xiimarks: result[1].xiimarks,
            xiiyear: result[1].xiiyear,
            cetrank: result[1].cetrank,
            cgpa1: result[1].cgpa1,
            credit1: result[1].credit1,
            cgpa2: result[1].cgpa2,
            credit2: result[1].credit2,
            cgpa3: result[1].cgpa3,
            credit3: result[1].credit3,
            cgpa4: result[1].cgpa4,
            credit4: result[1].credit4,
            cgpa5: result[1].cgpa5,
            credit5: result[1].credit5,
            cgpa6: result[1].cgpa6,
            credit6: result[1].credit6,
            cgpa7: result[1].cgpa7,
            credit7: result[1].credit7,
            cgpa8: result[1].cgpa8,
            credit8: result[1].credit8,
            cgpa: result[0].cgpa,
            totalcredit: result[1].totalcredit,
            mutebacklog: Number(result[1].mutebacklog),
            clearbacklog: Number(result[1].clearbacklog),
            currentbacklog: Number(result[1].currentbacklog),
          };
          res({
            profile,
            code: 200,
          });
        });
    },
  },

  {
    method: 'POST',
    path: '/profile',
    handler: (req, res) => {
      const userData = JSON.parse(req.payload);
      const usn = getJWTPayload(req);
      const academicDetails = {
        usn,
        xinstitute: userData.xinstitute,
        xboard: userData.xboard,
        xmarks: userData.xmarks,
        xyear: userData.xyear,
        xiiinstitute: userData.xiiinstitute,
        xiiboard: userData.xiiboard,
        xiimarks: userData.xiimarks,
        xiiyear: userData.xiiyear,
        cetrank: userData.cetrank,
        cgpa1: userData.cgpa1,
        credit1: userData.credit1,
        cgpa2: userData.cgpa2,
        credit2: userData.credit2,
        cgpa3: userData.cgpa3,
        credit3: userData.credit3,
        cgpa4: userData.cgpa4,
        credit4: userData.credit4,
        cgpa5: userData.cgpa5,
        credit5: userData.credit5,
        cgpa6: userData.cgpa6,
        credit6: userData.credit6,
        cgpa7: userData.cgpa7,
        credit7: userData.credit7,
        cgpa8: userData.cgpa8,
        credit8: userData.credit8,
        totalcredit: Number(userData.totalcredit),
        mutebacklog: Number(userData.mutebacklog),
        clearbacklog: Number(userData.clearbacklog),
        currentbacklog: Number(userData.currentbacklog),
      };
      const profileDetails = {
        fullname: userData.fullname,
        dob: userData.dob,
        sex: userData.sex,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        branch: userData.branch,
        xmarks: userData.xmarks,
        xiimarks: userData.xiimarks,
        historybacklog: Number(userData.mutebacklog) + Number(userData.clearbacklog) >= 1,
        currentbacklog: Number(userData.currentbacklog),
        cgpa: calculateCGPA(academicDetails).toFixed(2),
      };
      Models.users.update(
        profileDetails,
        { where: { usn } },
      )
        .then(() => Models.academics.update(
          academicDetails,
          { where: { usn } },
        ))
        .then(() => {
          res({
            code: 204,
            message: 'Updated Success',
          });
        })
        .catch(() => {
          res({
            code: 500,
            message: 'Sorry, could not complete your request!',
          });
        });
    },
  }];

