export default function Home() {
  return (
    <>
      <div className="flex flex-col mx-auto w-full max-w-[1280px] gap-y-10 mb-24">
        <h1 className="text-3xl font-bold">Tic Tac Toe &mdash; Challenge</h1>

        <section className="flex flex-col">
          <h2 className="text-2xl font-bold">Frontend</h2>
          <p>
            The core game logic is being handled on the server side. For simplicity sake 
            I&apos;ve used <code className="bg-black p-1">Next.js 13</code>, Tailwind, CSS Modules 
            and Typescript. This took me about a day to complete.
          </p>
          <p className="font-bold mt-4">Tech Stack:</p>
          <ul className="list-disc ml-8">
            <li>TypeScript</li>
            <li>Tailwind</li>
            <li>Socket.io-client</li>
            <li>Next.js +13 (app directory)</li>
            <li>React</li>
          </ul>
          <h3 className="font-bold mt-4">Player vs Player</h3>
          <p>
            Alternatively, we&apos;ve could used <code className="bg-black p-1">window.localStorage</code> in
            order to store the game board state. And require the players to play on the same machine.
          </p>
          <p>
            However we decided to use Socket.io to allow users to play on different machines. The cons,
            it requires us to use backend and add complexity to business logic.
          </p>

          <h3 className="font-bold mt-4">Player vs Computer</h3>
          <p>
            For Player vs Computer, we&apos;ve decided to use <code className="bg-black p-1">minimax</code> algorithm, 
            which will calculate the maximum points, for winning condition.
          </p>

          <p className="mt-4">
            <code className="bg-black p-1">src/app/api folder</code> contains all API endpoints from Express.js. This allows to
            encapsulate
          </p>

          <p className="font-bold mt-4">Improvements:</p>
          <ul className="list-disc ml-8">
            <li>
              Use <code className="bg-black p-1">tailwind.config.js</code> file to configure custom theme. Instead of hardcoding 
              vlaues directly to <code className="bg-black p-1">global.css</code>
            </li>
            <li>
              Add <code className="bg-black p-1">Husky</code> pre-hook, to rewrite files when running <code className="bg-black p-1">eslint</code>
            </li>
            <li>Improve API naming conventions for Next.js and properly use Routing segments</li>
          </ul>
        </section>

        <hr />

        <section className="flex flex-col">
          <h2 className="text-2xl font-bold">Backend</h2>
          <p>
            For bonus challenge, to keep in track of Match History and PvP, decided
            to use Express, Postgress and Socket.io as the tech stack. This took me about 3 days
            to complete.
          </p>

          <p className="font-bold mt-4">Tech Stack:</p>
          <ul className="list-disc ml-8">
            <li>TypeScript</li>
            <li>Express</li>
            <li>Socket.io</li>
            <li>Postgres</li>
            <li>Docker</li>
          </ul>

          <p className="font-bold mt-4">Features:</p>
          <ul className="list-disc ml-8">
            <li>
              <span className="font-bold">Auth:</span> For simplicity sake, we utilize 
              express-session and stores <code className="bg-black p-1">req.session[&quot;isAuth&quot;]</code> and
              check if the user has the cookie <code className="bg-black p-1">connect.sid</code>
            </li>
            <li>
              <span className="font-bold">Socket.io:</span> this is the core logic that allow users to play against each other
            </li>
            <li>
              <span className="font-bold">RESTFul API Endpoint:</span> Gets match history, user stats and authentication
            </li>
          </ul>

          <p className="font-bold mt-4">Improvements:</p>
          <ul className="list-disc ml-8">
            <li>
              Add graceful shutdown, in order to close all live connections, before sending <code className="bg-black p-1">SIGINT</code>. 
              This ensures during the cleanup, no unexpected error occurs.
            </li>
            <li>
              Add ORM such as <code className="bg-black p-1">Sequelize.js</code>, in order to have a well defined schema types, allowing to collaborate
              with other people.
            </li>
            <li>
              Add database migration. In case working with different environment, databases may go out of sync,
              when working multiple features 
            </li>
            <li>
              Add validation. We&apos;ve. Since the assignment mainly focused Frontend, we didn&apos;t validate 
              the body properly. We could use <code className="bg-black p-1">zod</code> library, to setup validation and schemas. And return
              400 Bad Request status.
            </li>
            <li>
              Add CSRF token to prevent XSS exploit attack. 
            </li>
            <li>
              Add API throttling (API limit), so people don&apos;t abuse the API endpoints.
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
