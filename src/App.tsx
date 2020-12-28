
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Main from './pages/Main';

declare const global: {HermesInternal: null | {}};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Main/>
      </SafeAreaView>
    </>
  );
};

export default App;
