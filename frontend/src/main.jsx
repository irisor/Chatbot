
import ReactDOM from 'react-dom/client'
import '../src/assets/style/main.css'

import { App } from './root-cmp.jsx'

const elContainer = document.getElementById('root')
const root = ReactDOM.createRoot(elContainer);
root.render(<App />);
