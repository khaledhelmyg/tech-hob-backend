class SearchHelper {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  //![1]to make pagination
  paginate() {
    this.pageSize = 5;
    let page = this.queryString.page * 1 || 1;
    if (this.queryString.page <= 0) page = 1;
    let skip = (page - 1) * this.pageSize;
    this.page = page;
    //? to get count of document
    this.mongooseQuery.model.countDocuments().then((data) => {
      this.totalCount = data;
    });
    this.mongooseQuery.skip(skip).limit(this.pageSize);
    return this;
  }

  //![2] to make filter
  filter() {
    let filterObj = { ...this.queryString };
    let excludedQuery = ["page", "sort", "fields", "keyword"];
    excludedQuery.forEach((q) => {
      delete filterObj[q];
    });
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    filterObj = JSON.parse(filterObj);
    this.mongooseQuery.find(filterObj);
    return this;
  }

  //! [3] to make sort
  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.replace(/,/g, " ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  //![3] to make search
  search() {
    if (this.queryString.keyword) {
      this.mongooseQuery.find({
        $or: [
          {
            title: { $regex: new RegExp(this.queryString.keyword, "i") },
          },
          {
            content: { $regex: new RegExp(this.queryString.keyword, "i") },
          },
        ],
      });
    }
    return this;
  }

  //![4] to make select
  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.replace(/,/g, " ");
      console.log(fields);
      this.mongooseQuery.select(fields);
    }
    return this;
  }
  //! [5] to filter by status
  filterByStatus() {
    if (this.queryString.status) {
      let filterObj = {
        status: this.queryString.status,
      };
      this.mongooseQuery.find(filterObj);
      return this;
    }
  }
}

// queryString === request.query;
module.exports = SearchHelper;
