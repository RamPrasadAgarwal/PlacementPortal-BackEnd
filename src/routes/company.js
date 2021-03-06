const createCompany = require('../utils/helpers/createCompany');
const VerifyRole = require('../utils/helpers/verifyRole');
const getJWTPayload = require('../utils/helpers/getJWTPayload');
const getEligibleCompaniesWithResponse = require('../utils/helpers/getEligibleCompaniesWithResponse');
const getBranchnCGPA = require('../utils/helpers/getBranch');
const convertBranchIntoCode = require('../utils/helpers/convertBranchIntoCode');

module.exports = [
  {
    method: 'POST',
    path: '/company',
    handler: (request, response) => {
      const userData = JSON.parse(request.payload);
      const usn = getJWTPayload(request);
      VerifyRole(usn)
        .then((allowed) => {
          if (allowed) {
            createCompany(userData)
              .then((result) => {
                if (result === 'Updated' || result === 'Inserted') {
                  response({
                    code: 201,
                    message: `Company Detials ${result} Successfully`,
                  });
                } else {
                  response({
                    code: 500,
                    message: result,
                  });
                }
              });
          } else {
            response({
              code: 409,
              message: 'Invalid Request',
            });
          }
        });
    },
  },
  {
    method: 'GET',
    path: '/company',
    handler: (request, response) => {
      const usn = getJWTPayload(request);
      getBranchnCGPA(usn)
        .then((details) => {
          if (details.branch === null || details.cgpa === null) {
            response({
              message: 'Incomplete Profile',
              code: 400,
            });
          } else if (details.placed !== -1 && details.placed !== null) {
            response({
              message: 'Placed',
              code: 200,
            });
          } else {
            getEligibleCompaniesWithResponse(usn, details.cgpa, convertBranchIntoCode(details.branch))
              .then((result) => {
                response({
                  message: result,
                  code: 200,
                });
              });
          }
        });
    },
  },
];

