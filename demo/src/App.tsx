import { Routes, Route } from 'react-router-dom';
import { AIFormProvider } from '../../src/index';
import Layout from './components/Layout';
import Home from './pages/Home';
import GetStarted from './pages/GetStarted';
import Examples from './pages/Examples';
import BasicExample from './pages/examples/BasicExample';
import MultiProviderExample from './pages/examples/MultiProviderExample';
import FieldSuggestionsExample from './pages/examples/FieldSuggestionsExample';
import ChromeAIExample from './pages/examples/ChromeAIExample';
import ContextAIExample from './pages/examples/ContextAIExample';

function App() {
  return (
    <AIFormProvider
      providers={[
        { type: 'chrome', priority: 10 },
      ]}
      fallbackOnError={true}
    >
      <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/examples" element={<Examples />} />
              <Route path="/examples/basic" element={<BasicExample />} />
              <Route path="/examples/multi-provider" element={<MultiProviderExample />} />
              <Route path="/examples/field-suggestions" element={<FieldSuggestionsExample />} />
              <Route path="/examples/chrome-ai" element={<ChromeAIExample />} />
              <Route path="/examples/context-ai" element={<ContextAIExample />} />
            </Routes>
      </Layout>
    </AIFormProvider>
  );
}

export default App;
