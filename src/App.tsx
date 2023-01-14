import './App.css';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'
import { Route, Routes } from 'react-router-dom';
import Authentication from './components/authentication/Authentication';
import Layout from './Layout';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
      <Route index element={<Authentication />}/>
      </Route>
    </Routes>
  );
}

export default App;
