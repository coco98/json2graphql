const db = {
  post: [
    { id: 1, title: "Lorem Ipsum", views: 254, user_id: 123 },
    { id: 2, title: "Sic Dolor amet", views: 65, user_id: 456 },
  ],
  user: [
    { id: 123, name: "John Doe" },
    { id: 456, name: "Jane Doe" }
  ],
  comment: [
    { id: 987, post_id: 1, body: "Consectetur adipiscing elit" },
    { id: 995, post_id: 1, body: "Nam molestie pellentesque dui"}
  ]
};

module.exports = db;
