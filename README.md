# JSON data import

Import JSON data to Postgres and get GraphQL APIs

## Workflow

1. Deploy Hasura GraphQL Engine to Heroku free tier.

   [![Deploy to heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/hasura/graphql-engine-heroku)

2. Clone this repo and install the dependencies

  ```
  git clone https://github.com/hasura/json-data-import
  cd json-data-import
  npm install
  ```

2. Create a `db.js` file. Your data file should export an object where the keys are the entity types. The values should be lists of entities, i.e. arrays of value objects with at least an id key. For instance:

  ```js
  module.exports = {
      posts: [
          { id: 1, title: "Lorem Ipsum", views: 254, user_id: 123 },
          { id: 2, title: "Sic Dolor amet", views: 65, user_id: 456 },
      ],
      users: [
          { id: 123, name: "John Doe" },
          { id: 456, name: "Jane Doe" }
      ],
      comments: [
          { id: 987, post_id: 1, body: "Consectetur adipiscing elit" },
          { id: 995, post_id: 1, body: "Nam molestie pellentesque dui" }
      ]
  }
  ```

3. Run the script with the graphql engine URL and the path to your `db.js` as environment variables

  ```js
  GRAPHQL_ENGINE_URL='https://myapp.herokuapp.com' DB_PATH='./db.js' node index.js
  ```

4. You can head to your graphql engine URL and try out the newly imported data and schema :-)

5. Test with [graphqurl](https://github.com/hasura/graphqurl) to check if the GraphQL endpoint works:

  ```
  gq https://myapp.herokuapp.com/v1alpha1/graphql -q 'query { posts { id title views userByUsersId { id name } commentsByPostsId { id body } } }'
  ```

## Notes

1. Only int, float, text and boolean are supported. All fields are nullable.
2. Data types are inferred from the data. Therefore, if null is provided as data for a field, it is assumed to be text.
3. Every table must have an integer primary key called 'id'.
4. If any table has a key `something_id`, it is assumed a foreign key to a the column `id` of table `something` + `s` if it exists . If `somethings` does not exist, something_id is assumed to be a normal column.
5. All foreign keys are converted to relationships.
