import "styles/globals.css"
import "bootstrap/dist/css/bootstrap.css"
import { GameProvider } from "contexts/GameContext"
import { OpenAiProvider } from "contexts/OpenAiContext"
import { Layout } from "layouts/Layout"
import Game from "components/Game"

const App = () => {
  return (
    <GameProvider>
      <OpenAiProvider>
        <Layout>
          <Game></Game>
        </Layout>
      </OpenAiProvider>
    </GameProvider>
  )
}

export default App
