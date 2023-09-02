const ReviewModel = require("../models/review.model");

const getMyReviewsService = async ({ user }) =>
  ReviewModel.find({ user }).populate({
    path: "parent",
  });

const getParentreviewesService = async ({ parent }) =>
  ReviewModel.find({ parent }).populate({
    path: "user",
    select: "profile",
  });
// const deletereviewById = async ({ id }) =>
//   ReviewModel.deleteOne({ _id: id });
// const checkNameAndVersion = async ({ reviewName, reviewVersion }) => {
//   const review = await ReviewModel.findOne({
//     reviewName,
//     reviewVersion,
//   });
//   return review;
// };

const createreviewService = async ({
  parentType,
  parent,
  user,
  rate,
  content,
}) =>
  ReviewModel.create({
    parentType,
    parent,
    user,
    rate,
    content,
  });

module.exports = {
  getMyReviewsService,
  createreviewService,
  getParentreviewesService,
};
