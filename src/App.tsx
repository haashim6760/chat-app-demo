import './App.css';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';
import 'firebase/compat/auth'
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { Route, Routes } from 'react-router-dom';
import Authentication from './components/Authentication';

function App() {
  return (
    <Routes>
      <Route index element={<Authentication />}/>
    </Routes>
  );
}

export default App;
