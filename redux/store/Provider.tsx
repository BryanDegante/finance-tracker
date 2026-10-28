'use client';

import { Provider } from 'react-redux';
import { store } from './store';

type ProviderProps = {
  children: React.ReactNode;
};
export default function ReduxProvider({ children }: ProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}