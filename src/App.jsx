import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import ThemeWidget from './components/ThemeWidget';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRoutes />
        <ThemeWidget />
      </PersistGate>
    </Provider>
  );
}

export default App;