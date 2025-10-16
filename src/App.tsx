import { AppRouter } from './app/router'
import { Suspense } from "react";

function App() {

  return (
    <Suspense fallback="loading">
      <AppRouter />
    </Suspense>
  )
}

export default App
