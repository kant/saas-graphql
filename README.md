<h1 align="center"><strong>SaaS-GraphQL, a SaaS GraphQL Boilerplate</strong></h1>

<br />

<div align="center"><img src="https://github.com/davodesign84/saas-graphql/blob/master/logos.svg" /></div>

<div align="center"><strong>Start your Saas Project in a matter of seconds</strong></div>
<div align="center">Saas-Graphql allows you to get the basic scaffolding for your Saas Project up and running in seconds</div>

<br />

## Features

- **Serverless**: Using Zeit Now for deployment you can get your GraphQL API deployed in seconds. Zero maintenance and low cost. 🚀
- **Typesafe**: Typescript allows you to write better code faster. On top of that, due to the nature of graphql, all your query types can be generated as easily as `npx apollo client:codegen` for use on your favourite frontend tech stack. 🛡
- **Stateless**: Using the JWT allows for a stateless system, no need to keep track of session ids and the like on Redis, or on your database. Sweeeeeet 🍭
- **Easily extensible**: As a boilerplate Saas-GraphQL, provides the boring, annoying setup to get your saas started. Things like Accounts, Users, Authentication and Authorization. Leaving space for your customisations 👷
- **(Almost) 0 config**: The only things you need to do is provide your JWT token secret and your mongodb URI 🙀

## Quickstart
- Clone the project: `git clone https://github.com/davodesign84/saas-graphql` and `cd aas-graphql`
- Run `yarn` or `npm install` to install dependencies
- Install Zeit now, instructions can be found [here](https://zeit.co/download).
- Generate the token secret [here](https://mkjwk.org/) and add it to Now `now secret add SECRET <your token secret>`
- Add your mongodb URI `now secret add DATABASE_URI <your token secret>`
- Run dev `now dev` and open `localhost:3000`
- the schema can be explored on the right end side of the Graphql playground


Enjoy! You just saved a couple of days of faffing around with boring stuff 🤴

## Contributing

Your feedback is **very helpful**, please share your opinion and thoughts! If you have any questions or want to contribute yourself, please create an issue or feel free to contributes to PR directly, Jest tests would be very welcome! 🙏
