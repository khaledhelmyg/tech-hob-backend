const {
  createreviewService,
  getMyReviewsService,
  getParentreviewesService,
} = require("../services/review.services");
const createReview = async (req, res, next) => {
  try {
    const { userId: user } = req.user;
    const { parentType, parent, content } = req.body;
    console.log(user);
    const review = await createreviewService({
      parentType,
      parent,
      user,
      content,
    });
    if (!review) {
      throw new Error.throwPreconditionFailed({
        message: "Server Issued! Failed to add a Review",
      });
    }

    res.status(200).send({
      apiStatus: true,
      msg: "Review Created Successfully",
      result: {
        review,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to parent review", error: err.message });
  }
};

const getMyReviews = async (req, res, next) => {
  try {
    const { userId: user } = req.user;

    const reviews = await getMyReviewsService({ user });
    if (!reviews) {
      throw Error.throwNotFound({ message: "Reviews" });
    }
    res.status(200).send({
      apiStatus: true,
      msg: "get my reviews on events or posts",
      result: {
        reviews,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to get parent review", error: err.message });
  }
};

const getParentReviews = async (req, res, next) => {
  try {
    const { parentId: parent } = req.params;

    const reviews = await getParentreviewesService({ parent });
    if (!reviews) {
      throw error.throwNotFound({ message: "Reviews" });
    }
    res.status(200).json({
      apiStatus: true,
      msg: "get all Reviews",
      result: {
        reviews,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to parent review", error: err.message });
  }
};

module.exports = {
  createReview,
  getMyReviews,
  getParentReviews,
};
