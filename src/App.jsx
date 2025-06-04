import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import ThemeWidget from './components/ThemeWidget';

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
      <ThemeWidget />
    </Provider>
  );
}

export default App;